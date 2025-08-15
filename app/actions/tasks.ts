'use server'

import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'

export interface TaskFilters {
  ownerUserId?: string
  status?: string
  dueBefore?: Date
  dueAfter?: Date
  personId?: string
  pipelineItemId?: string
}

export async function getTasks(filters: TaskFilters = {}, page = 1, limit = 20) {
  const skip = (page - 1) * limit
  
  const where: any = {}
  
  if (filters.ownerUserId) {
    where.ownerUserId = filters.ownerUserId
  }
  
  if (filters.status) {
    where.status = filters.status
  }
  
  if (filters.personId) {
    where.personId = filters.personId
  }
  
  if (filters.pipelineItemId) {
    where.pipelineItemId = filters.pipelineItemId
  }
  
  if (filters.dueBefore || filters.dueAfter) {
    where.dueAt = {}
    if (filters.dueBefore) {
      where.dueAt.lte = filters.dueBefore
    }
    if (filters.dueAfter) {
      where.dueAt.gte = filters.dueAfter
    }
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        person: { select: { id: true, name: true, email: true } },
        pipelineItem: { select: { id: true, title: true } }
      },
      orderBy: [
        { status: 'asc' },
        { dueAt: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    }),
    prisma.task.count({ where })
  ])

  return {
    tasks,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  }
}

export async function getTask(id: string) {
  return await prisma.task.findUnique({
    where: { id },
    include: {
      person: { select: { id: true, name: true, email: true } },
      pipelineItem: { select: { id: true, title: true } }
    }
  })
}

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const ownerUserId = formData.get('ownerUserId') as string || null
  const dueAt = formData.get('dueAt') as string || null
  const status = formData.get('status') as string || 'pending'
  const personId = formData.get('personId') as string || null
  const pipelineItemId = formData.get('pipelineItemId') as string || null
  const notes = formData.get('notes') as string || null

  if (!title?.trim()) {
    throw new Error('Title is required')
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        ownerUserId,
        dueAt: dueAt ? new Date(dueAt) : null,
        status,
        personId,
        pipelineItemId,
        notes: notes?.trim() || null
      },
      include: {
        person: { select: { id: true, name: true, email: true } },
        pipelineItem: { select: { id: true, title: true } }
      }
    })

    revalidatePath('/tasks')
    if (personId) revalidatePath(`/people/${personId}`)
    if (pipelineItemId) {
      const item = await prisma.pipelineItem.findUnique({
        where: { id: pipelineItemId },
        include: { stage: { include: { pipeline: true } } }
      })
      if (item) revalidatePath(`/pipelines/${item.stage.pipeline.id}`)
    }
    
    return task
  } catch (error) {
    console.error('Failed to create task:', error)
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateTask(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const ownerUserId = formData.get('ownerUserId') as string || null
  const dueAt = formData.get('dueAt') as string || null
  const status = formData.get('status') as string
  const personId = formData.get('personId') as string || null
  const pipelineItemId = formData.get('pipelineItemId') as string || null
  const notes = formData.get('notes') as string || null

  if (!title?.trim()) {
    throw new Error('Title is required')
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title.trim(),
        ownerUserId,
        dueAt: dueAt ? new Date(dueAt) : null,
        status,
        personId,
        pipelineItemId,
        notes: notes?.trim() || null
      },
      include: {
        person: { select: { id: true, name: true, email: true } },
        pipelineItem: { select: { id: true, title: true } }
      }
    })

    revalidatePath('/tasks')
    if (personId) revalidatePath(`/people/${personId}`)
    if (pipelineItemId) {
      const item = await prisma.pipelineItem.findUnique({
        where: { id: pipelineItemId },
        include: { stage: { include: { pipeline: true } } }
      })
      if (item) revalidatePath(`/pipelines/${item.stage.pipeline.id}`)
    }
    
    return task
  } catch (error) {
    console.error('Failed to update task:', error)
    throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateTaskStatus(id: string, status: string) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        person: { select: { id: true, name: true, email: true } },
        pipelineItem: { select: { id: true, title: true } }
      }
    })

    revalidatePath('/tasks')
    if (task.personId) revalidatePath(`/people/${task.personId}`)
    if (task.pipelineItemId) {
      const item = await prisma.pipelineItem.findUnique({
        where: { id: task.pipelineItemId },
        include: { stage: { include: { pipeline: true } } }
      })
      if (item) revalidatePath(`/pipelines/${item.stage.pipeline.id}`)
    }
    
    return task
  } catch (error) {
    console.error('Failed to update task status:', error)
    throw new Error('Failed to update task status')
  }
}

export async function deleteTask(id: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { personId: true, pipelineItemId: true }
    })

    await prisma.task.delete({ where: { id } })

    revalidatePath('/tasks')
    if (task?.personId) revalidatePath(`/people/${task.personId}`)
    if (task?.pipelineItemId) {
      const item = await prisma.pipelineItem.findUnique({
        where: { id: task.pipelineItemId },
        include: { stage: { include: { pipeline: true } } }
      })
      if (item) revalidatePath(`/pipelines/${item.stage.pipeline.id}`)
    }
  } catch (error) {
    console.error('Failed to delete task:', error)
    throw new Error('Failed to delete task')
  }
}

export async function getPersonTasks(personId: string) {
  return await prisma.task.findMany({
    where: { personId },
    include: {
      pipelineItem: { select: { id: true, title: true } }
    },
    orderBy: [
      { status: 'asc' },
      { dueAt: 'asc' },
      { createdAt: 'desc' }
    ]
  })
}

export async function getPipelineItemTasks(pipelineItemId: string) {
  return await prisma.task.findMany({
    where: { pipelineItemId },
    include: {
      person: { select: { id: true, name: true, email: true } }
    },
    orderBy: [
      { status: 'asc' },
      { dueAt: 'asc' },
      { createdAt: 'desc' }
    ]
  })
}

export async function getTaskStatuses() {
  return ['pending', 'completed', 'deferred']
}

