'use server'

import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getStageRule(stageId: string) {
  return await prisma.stageRule.findUnique({
    where: { stageId },
    include: {
      stage: { select: { id: true, name: true, pipeline: { select: { id: true, name: true } } } }
    }
  })
}

export async function createStageRule(formData: FormData) {
  const stageId = formData.get('stageId') as string
  const templateTitle = formData.get('templateTitle') as string
  const offsetDays = parseInt(formData.get('offsetDays') as string)

  if (!stageId || !templateTitle || isNaN(offsetDays)) {
    throw new Error('All fields are required')
  }

  try {
    const stageRule = await prisma.stageRule.create({
      data: {
        stageId,
        templateTitle: templateTitle.trim(),
        offsetDays
      },
      include: {
        stage: { select: { id: true, name: true, pipeline: { select: { id: true, name: true } } } }
      }
    })

    revalidatePath('/pipelines')
    revalidatePath(`/pipelines/${stageRule.stage.pipeline.id}`)
    return stageRule
  } catch (error) {
    console.error('Failed to create stage rule:', error)
    throw new Error(`Failed to create stage rule: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateStageRule(stageId: string, formData: FormData) {
  const templateTitle = formData.get('templateTitle') as string
  const offsetDays = parseInt(formData.get('offsetDays') as string)

  if (!templateTitle || isNaN(offsetDays)) {
    throw new Error('All fields are required')
  }

  try {
    const stageRule = await prisma.stageRule.update({
      where: { stageId },
      data: {
        templateTitle: templateTitle.trim(),
        offsetDays
      },
      include: {
        stage: { select: { id: true, name: true, pipeline: { select: { id: true, name: true } } } }
      }
    })

    revalidatePath('/pipelines')
    revalidatePath(`/pipelines/${stageRule.stage.pipeline.id}`)
    return stageRule
  } catch (error) {
    console.error('Failed to update stage rule:', error)
    throw new Error(`Failed to update stage rule: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteStageRule(stageId: string) {
  try {
    const stageRule = await prisma.stageRule.findUnique({
      where: { stageId },
      include: {
        stage: { select: { pipeline: { select: { id: true } } } }
      }
    })

    if (!stageRule) {
      throw new Error('Stage rule not found')
    }

    await prisma.stageRule.delete({
      where: { stageId }
    })

    revalidatePath('/pipelines')
    revalidatePath(`/pipelines/${stageRule.stage.pipeline.id}`)
  } catch (error) {
    console.error('Failed to delete stage rule:', error)
    throw new Error('Failed to delete stage rule')
  }
}

export async function createTaskForStageRule(pipelineItemId: string, stageId: string) {
  try {
    // Get the stage rule for this stage
    const stageRule = await prisma.stageRule.findUnique({
      where: { stageId }
    })

    if (!stageRule) {
      return null // No rule for this stage
    }

    // Get the pipeline item to get the owner
    const pipelineItem = await prisma.pipelineItem.findUnique({
      where: { id: pipelineItemId },
      select: { ownerUserId: true, personId: true }
    })

    if (!pipelineItem) {
      throw new Error('Pipeline item not found')
    }

    // Calculate due date
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + stageRule.offsetDays)

    // Create the task
    const task = await prisma.task.create({
      data: {
        title: stageRule.templateTitle,
        ownerUserId: pipelineItem.ownerUserId,
        dueAt: dueDate,
        status: 'pending',
        personId: pipelineItem.personId,
        pipelineItemId: pipelineItemId
      }
    })

    return task
  } catch (error) {
    console.error('Failed to create task for stage rule:', error)
    // Don't throw error - we don't want to break the pipeline item movement
    return null
  }
}

