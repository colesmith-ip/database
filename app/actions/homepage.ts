'use server'

import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'

// Helper function to safely execute database queries
async function safeDbQuery<T>(queryFn: () => Promise<T>): Promise<T | null> {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query error:', error)
    
    // During build time, database connection might not be available
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
      console.warn('Database connection not available during build, returning null')
      return null
    }
    
    // In production runtime, return null instead of throwing to prevent crashes
    if (process.env.NODE_ENV === 'production') {
      console.warn('Database connection failed in production, returning null')
      return null
    }
    
    // In development, throw the error for debugging
    throw new Error(`Failed to execute database query: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Announcement actions
export async function getAnnouncements() {
  const result = await safeDbQuery(async () => {
    return await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  })
  
  // Return empty array if database is not available during build
  return result || []
}

export async function createAnnouncement(data: {
  title: string
  content: string
  authorName: string
  authorEmail?: string
  priority: string
}) {
  const result = await safeDbQuery(async () => {
    return await prisma.announcement.create({
      data
    })
  })

  if (!result) {
    throw new Error('Failed to create announcement: Database connection error')
  }

  revalidatePath('/')
  return result
}

export async function updateAnnouncement(id: string, data: {
  title: string
  content: string
  priority: string
}) {
  try {
    const announcement = await prisma.announcement.update({
      where: { id },
      data
    })
    revalidatePath('/')
    return announcement
  } catch (error) {
    console.error('Error updating announcement:', error)
    throw new Error('Failed to update announcement')
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await prisma.announcement.update({
      where: { id },
      data: { isActive: false }
    })
    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting announcement:', error)
    throw new Error('Failed to delete announcement')
  }
}

// Event actions
export async function getEvents() {
  const result = await safeDbQuery(async () => {
    return await prisma.event.findMany({
      where: { 
        isActive: true,
        startDate: {
          gte: new Date()
        }
      },
      orderBy: { startDate: 'asc' },
      take: 5
    })
  })
  
  // Return empty array if database is not available during build
  return result || []
}

export async function createEvent(data: {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  location?: string
  eventType: string
  color: string
}) {
  const result = await safeDbQuery(async () => {
    return await prisma.event.create({
      data
    })
  })

  if (!result) {
    throw new Error('Failed to create event: Database connection error')
  }

  revalidatePath('/')
  return result
}

export async function updateEvent(id: string, data: {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  location?: string
  eventType: string
  color: string
}) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data
    })
    revalidatePath('/')
    return event
  } catch (error) {
    console.error('Error updating event:', error)
    throw new Error('Failed to update event')
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.update({
      where: { id },
      data: { isActive: false }
    })
    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting event:', error)
    throw new Error('Failed to delete event')
  }
}

