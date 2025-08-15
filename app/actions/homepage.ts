'use server'

import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'

// Announcement actions
export async function getAnnouncements() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    return announcements
  } catch (error) {
    console.error('Error fetching announcements:', error)
    throw new Error('Failed to fetch announcements')
  }
}

export async function createAnnouncement(data: {
  title: string
  content: string
  authorName: string
  authorEmail?: string
  priority: string
}) {
  try {
    const announcement = await prisma.announcement.create({
      data
    })
    revalidatePath('/')
    return announcement
  } catch (error) {
    console.error('Error creating announcement:', error)
    throw new Error('Failed to create announcement')
  }
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
  try {
    const events = await prisma.event.findMany({
      where: { 
        isActive: true,
        startDate: {
          gte: new Date()
        }
      },
      orderBy: { startDate: 'asc' },
      take: 5
    })
    return events
  } catch (error) {
    console.error('Error fetching events:', error)
    throw new Error('Failed to fetch events')
  }
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
  try {
    const event = await prisma.event.create({
      data
    })
    revalidatePath('/')
    return event
  } catch (error) {
    console.error('Error creating event:', error)
    throw new Error('Failed to create event')
  }
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

