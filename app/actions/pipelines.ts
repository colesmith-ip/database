'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../lib/prisma'
import { createTaskForStageRule } from './stage-rules'
import { PrismaClient } from '@prisma/client'

export async function getPipelines() {
  return await prisma.pipeline.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function createPipeline(formData: FormData) {
  const name = formData.get('name') as string
  const stageNames = formData.getAll('stageNames') as string[]

  if (!name || name.trim() === '') {
    throw new Error('Pipeline name is required')
  }

  if (stageNames.length === 0 || stageNames.some(name => !name.trim())) {
    throw new Error('At least one stage is required')
  }

  try {
    // @ts-ignore - Prisma transaction typing issue
    const result = await prisma.$transaction(async (tx) => {
      // Create the pipeline
      const pipeline = await tx.pipeline.create({
        data: {
          name: name.trim()
        }
      })

      // Create stages
      const stages = await Promise.all(
        stageNames.map((stageName, index) =>
          tx.stage.create({
            data: {
              pipelineId: pipeline.id,
              name: stageName.trim(),
              order: index
            }
          })
        )
      )

      return { pipeline, stages }
    })

    revalidatePath('/pipelines')
    return result
  } catch (error) {
    console.error('Failed to create pipeline:', error)
    throw new Error(`Failed to create pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function addStage(pipelineId: string, formData: FormData) {
  const name = formData.get('name') as string
  const position = formData.get('position') as string

  if (!name || name.trim() === '') {
    throw new Error('Stage name is required')
  }

  try {
    // @ts-ignore - Prisma transaction typing issue
    const result = await prisma.$transaction(async (tx) => {
      // Get current stages to determine order
      const currentStages = await tx.stage.findMany({
        where: { pipelineId },
        orderBy: { order: 'asc' }
      })

      let newOrder: number
      if (position === 'start') {
        newOrder = 0
        // Shift all existing stages up
        await Promise.all(
          currentStages.map((stage: any) =>
            tx.stage.update({
              where: { id: stage.id },
              data: { order: stage.order + 1 }
            })
          )
        )
      } else if (position === 'end') {
        newOrder = currentStages.length
      } else {
        // Insert at specific position
        const targetIndex = parseInt(position)
        if (isNaN(targetIndex) || targetIndex < 0 || targetIndex > currentStages.length) {
          throw new Error('Invalid position')
        }
        newOrder = targetIndex
        // Shift stages after this position up
        await Promise.all(
          currentStages.slice(targetIndex).map((stage: any) =>
            tx.stage.update({
              where: { id: stage.id },
              data: { order: stage.order + 1 }
            })
          )
        )
      }

      // Create the new stage
      const newStage = await tx.stage.create({
        data: {
          pipelineId,
          name: name.trim(),
          order: newOrder
        }
      })

      return newStage
    })

    revalidatePath('/pipelines')
    revalidatePath(`/pipelines/${pipelineId}`)
    return result
  } catch (error) {
    console.error('Failed to add stage:', error)
    throw new Error(`Failed to add stage: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteStage(stageId: string) {
  try {
    // @ts-ignore - Prisma transaction typing issue
    const result = await prisma.$transaction(async (tx) => {
      // Get the stage to know its pipeline and order
      const stage = await tx.stage.findUnique({
        where: { id: stageId },
        include: { pipeline: true }
      })

      if (!stage) {
        throw new Error('Stage not found')
      }

      // Check if stage has items
      const itemCount = await tx.pipelineItem.count({
        where: { stageId }
      })

      if (itemCount > 0) {
        throw new Error(`Cannot delete stage with ${itemCount} items. Move or delete the items first.`)
      }

      // Delete the stage
      await tx.stage.delete({
        where: { id: stageId }
      })

      // Reorder remaining stages
      const remainingStages = await tx.stage.findMany({
        where: { pipelineId: stage.pipelineId },
        orderBy: { order: 'asc' }
      })

      await Promise.all(
        remainingStages.map((remainingStage: any, index: number) =>
          tx.stage.update({
            where: { id: remainingStage.id },
            data: { order: index }
          })
        )
      )

      return stage
    })

    revalidatePath('/pipelines')
    revalidatePath(`/pipelines/${result.pipeline.id}`)
    return result
  } catch (error) {
    console.error('Failed to delete stage:', error)
    throw new Error(`Failed to delete stage: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateStageName(stageId: string, formData: FormData) {
  const name = formData.get('name') as string

  if (!name || name.trim() === '') {
    throw new Error('Stage name is required')
  }

  try {
    const stage = await prisma.stage.update({
      where: { id: stageId },
      data: { name: name.trim() },
      include: {
        pipeline: { select: { id: true } }
      }
    })

    revalidatePath('/pipelines')
    revalidatePath(`/pipelines/${stage.pipeline.id}`)
    return stage
  } catch (error) {
    console.error('Failed to update stage name:', error)
    throw new Error('Failed to update stage name')
  }
}

export async function getPipelineWithItems(pipelineId: string) {
  return await prisma.pipeline.findUnique({
    where: { id: pipelineId },
    include: {
      stages: {
        orderBy: { order: 'asc' },
        include: {
          items: {
            include: {
              person: { select: { id: true, name: true, email: true } },
              organization: { select: { id: true, name: true } },
              stageHistory: {
                where: { leftAt: null }, // Only current stage entry
                take: 1,
                orderBy: { enteredAt: 'desc' }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          stageRule: true
        }
      }
    }
  })
}

export async function createPipelineItem(formData: FormData) {
  const title = formData.get('title') as string
  const stageId = formData.get('stageId') as string
  const personId = formData.get('personId') as string || null
  const organizationId = formData.get('organizationId') as string || null
  const ownerUserId = formData.get('ownerUserId') as string || 'user_1'

  // Validate required fields
  if (!title || title.trim() === '') {
    throw new Error('Item title is required')
  }
  if (!stageId) {
    throw new Error('Stage is required')
  }

  try {
    // Use a transaction to create item and initial stage history
    // @ts-ignore - Prisma transaction typing issue
    const result = await prisma.$transaction(async (tx) => {
      // Create the pipeline item
      const item = await tx.pipelineItem.create({
        data: {
          title: title.trim(),
          stageId,
          personId: personId || null,
          organizationId: organizationId || null,
          ownerUserId
        },
        include: {
          stage: { include: { pipeline: true } }
        }
      })

      // Create initial stage history entry
      await tx.pipelineItemStageHistory.create({
        data: {
          pipelineItemId: item.id,
          stageId: item.stageId,
          enteredAt: new Date(),
          leftAt: null // Still in this stage
        }
      })

      return item
    })

    // Create task if stage has a rule
    await createTaskForStageRule(result.id, result.stageId)

    revalidatePath(`/pipelines/${result.stage.pipeline.id}`)
    return result
  } catch (error) {
    console.error('Failed to create pipeline item:', error)
    throw new Error(`Failed to create pipeline item: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updatePipelineItemStage(itemId: string, newStageId: string) {
  try {
    // Use a transaction to ensure consistency
    // @ts-ignore - Prisma transaction typing issue
    const result = await prisma.$transaction(async (tx) => {
      // Get the current item to know the old stage
      const currentItem = await tx.pipelineItem.findUnique({
        where: { id: itemId },
        include: { stage: { include: { pipeline: true } } }
      })

      if (!currentItem) {
        throw new Error('Pipeline item not found')
      }

      const oldStageId = currentItem.stageId

      // Only proceed if stage is actually changing
      if (oldStageId === newStageId) {
        return currentItem
      }

      // Close the current stage history entry (set leftAt)
      await tx.pipelineItemStageHistory.updateMany({
        where: {
          pipelineItemId: itemId,
          stageId: oldStageId,
          leftAt: null // Only update the open entry
        },
        data: {
          leftAt: new Date()
        }
      })

      // Create new stage history entry
      await tx.pipelineItemStageHistory.create({
        data: {
          pipelineItemId: itemId,
          stageId: newStageId,
          enteredAt: new Date(),
          leftAt: null // Still in this stage
        }
      })

      // Update the pipeline item stage
      const updatedItem = await tx.pipelineItem.update({
        where: { id: itemId },
        data: { stageId: newStageId },
        include: {
          stage: { include: { pipeline: true } }
        }
      })

      return updatedItem
    })

    // Create task if new stage has a rule
    await createTaskForStageRule(result.id, result.stageId)

    revalidatePath(`/pipelines/${result.stage.pipeline.id}`)
    return result
  } catch (error) {
    console.error('Failed to update pipeline item stage:', error)
    throw new Error('Failed to move item')
  }
}

export async function deletePipelineItem(itemId: string) {
  try {
    const item = await prisma.pipelineItem.findUnique({
      where: { id: itemId },
      include: {
        stage: { include: { pipeline: true } }
      }
    })

    if (!item) {
      throw new Error('Pipeline item not found')
    }

    await prisma.pipelineItem.delete({
      where: { id: itemId }
    })

    revalidatePath(`/pipelines/${item.stage.pipeline.id}`)
  } catch (error) {
    console.error('Failed to delete pipeline item:', error)
    throw new Error('Failed to delete item')
  }
}

export async function getAllPeopleAndOrganizations() {
  const [people, organizations] = await Promise.all([
    prisma.person.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' }
    }),
    prisma.organization.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  ])

  return { people, organizations }
}
