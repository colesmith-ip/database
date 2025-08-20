'use server'

import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

export async function getEmailConversations(personId: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailConversation.findMany({
      where: { personId },
      include: {
        messages: {
          orderBy: { receivedAt: 'asc' }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    })
  })
  
  return result || []
}

export async function getEmailConversation(id: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailConversation.findUnique({
      where: { id },
      include: {
        person: true,
        messages: {
          orderBy: { receivedAt: 'asc' }
        }
      }
    })
  })
  
  return result
}

export async function sendEmailReply(conversationId: string, formData: FormData) {
  const content = formData.get('content') as string
  const subject = formData.get('subject') as string

  if (!content || content.trim() === '') {
    throw new Error('Email content is required')
  }

  const result = await safeDbQuery(async () => {
    // Get the conversation and person details
    const conversation = await prisma.emailConversation.findUnique({
      where: { id: conversationId },
      include: { person: true }
    })

    if (!conversation) {
      throw new Error('Conversation not found')
    }

    // Create the email message in the database
    const message = await prisma.emailMessage.create({
      data: {
        conversationId,
        messageId: `reply-${Date.now()}`, // Generate a unique message ID
        fromEmail: 'your-email@yourmission.org', // This should come from the user's Gmail integration
        toEmail: conversation.person.email || '',
        subject: subject || conversation.subject,
        content: content.trim(),
        isInbound: false
      }
    })

    // Update conversation last message time
    await prisma.emailConversation.update({
      where: { id: conversationId },
      data: { 
        lastMessageAt: new Date()
      }
    })

    return message
  })

  if (!result) {
    throw new Error('Failed to send email reply: Database connection error')
  }

  revalidatePath(`/people/${result.conversationId}/conversations`)
  revalidatePath(`/conversations/${conversationId}`)
  
  // TODO: Actually send the email via Gmail API
  // This would integrate with the Gmail API to send the actual email
  
  return result
}

export async function closeEmailConversation(id: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailConversation.update({
      where: { id },
      data: { status: 'closed' }
    })
  })

  if (!result) {
    throw new Error('Failed to close conversation: Database connection error')
  }

  revalidatePath(`/people/${result.personId}/conversations`)
  revalidatePath(`/conversations/${id}`)
  
  return result
}

export async function archiveEmailConversation(id: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailConversation.update({
      where: { id },
      data: { status: 'archived' }
    })
  })

  if (!result) {
    throw new Error('Failed to archive conversation: Database connection error')
  }

  revalidatePath(`/people/${result.personId}/conversations`)
  revalidatePath(`/conversations/${id}`)
  
  return result
}
