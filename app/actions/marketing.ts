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

// Email Lists
export async function getEmailLists() {
  const result = await safeDbQuery(async () => {
    return await prisma.emailList.findMany({
      include: {
        _count: {
          select: {
            subscribers: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  })
  
  return result || []
}

export async function getEmailList(id: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailList.findUnique({
      where: { id },
      include: {
        subscribers: {
          include: {
            person: true
          }
        },
        _count: {
          select: {
            subscribers: true
          }
        }
      }
    })
  })
  
  return result
}

export async function createEmailList(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as string || 'manual'

  if (!name || name.trim() === '') {
    throw new Error('Email list name is required')
  }

  const result = await safeDbQuery(async () => {
    return await prisma.emailList.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        type
      }
    })
  })

  if (!result) {
    throw new Error('Failed to create email list: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath('/marketing/lists')
  redirect('/marketing/lists')
}

export async function updateEmailList(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as string

  if (!name || name.trim() === '') {
    throw new Error('Email list name is required')
  }

  const result = await safeDbQuery(async () => {
    return await prisma.emailList.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        type
      }
    })
  })

  if (!result) {
    throw new Error('Failed to update email list: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath('/marketing/lists')
  revalidatePath(`/marketing/lists/${id}`)
}

export async function deleteEmailList(id: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailList.delete({
      where: { id }
    })
  })

  if (!result) {
    throw new Error('Failed to delete email list: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath('/marketing/lists')
  redirect('/marketing/lists')
}

// Email List Subscribers
export async function addSubscriberToEmailList(emailListId: string, personId: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailListSubscriber.create({
      data: {
        emailListId,
        personId,
        status: 'subscribed'
      }
    })
  })

  if (!result) {
    throw new Error('Failed to add subscriber: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath(`/marketing/lists/${emailListId}`)
  return result
}

export async function removeSubscriberFromEmailList(emailListId: string, personId: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailListSubscriber.delete({
      where: {
        emailListId_personId: {
          emailListId,
          personId
        }
      }
    })
  })

  if (!result) {
    throw new Error('Failed to remove subscriber: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath(`/marketing/lists/${emailListId}`)
  return result
}

// Email Campaigns
export async function getEmailCampaigns() {
  const result = await safeDbQuery(async () => {
    return await prisma.emailCampaign.findMany({
      include: {
        emailList: true,
        _count: {
          select: {
            recipients: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  })
  
  return result || []
}

export async function getEmailCampaign(id: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailCampaign.findUnique({
      where: { id },
      include: {
        emailList: true,
        recipients: {
          include: {
            person: true
          }
        },
        _count: {
          select: {
            recipients: true
          }
        }
      }
    })
  })
  
  return result
}

export async function createEmailCampaign(formData: FormData) {
  const name = formData.get('name') as string
  const subject = formData.get('subject') as string
  const content = formData.get('content') as string
  const emailListId = formData.get('emailListId') as string
  const senderEmail = formData.get('senderEmail') as string
  const senderName = formData.get('senderName') as string
  const scheduledAt = formData.get('scheduledAt') as string

  if (!name || name.trim() === '') {
    throw new Error('Campaign name is required')
  }

  if (!subject || subject.trim() === '') {
    throw new Error('Email subject is required')
  }

  if (!content || content.trim() === '') {
    throw new Error('Email content is required')
  }

  const result = await safeDbQuery(async () => {
    return await prisma.emailCampaign.create({
      data: {
        name: name.trim(),
        subject: subject.trim(),
        content: content.trim(),
        emailListId: emailListId || null,
        senderEmail: senderEmail.trim(),
        senderName: senderName.trim(),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'scheduled' : 'draft'
      }
    })
  })

  if (!result) {
    throw new Error('Failed to create email campaign: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath('/marketing/campaigns')
  redirect('/marketing/campaigns')
}

export async function updateEmailCampaign(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const subject = formData.get('subject') as string
  const content = formData.get('content') as string
  const emailListId = formData.get('emailListId') as string
  const senderEmail = formData.get('senderEmail') as string
  const senderName = formData.get('senderName') as string
  const scheduledAt = formData.get('scheduledAt') as string

  if (!name || name.trim() === '') {
    throw new Error('Campaign name is required')
  }

  const result = await safeDbQuery(async () => {
    return await prisma.emailCampaign.update({
      where: { id },
      data: {
        name: name.trim(),
        subject: subject?.trim() || '',
        content: content?.trim() || '',
        emailListId: emailListId || null,
        senderEmail: senderEmail?.trim() || '',
        senderName: senderName?.trim() || '',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    })
  })

  if (!result) {
    throw new Error('Failed to update email campaign: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath('/marketing/campaigns')
  revalidatePath(`/marketing/campaigns/${id}`)
}

export async function sendEmailCampaign(id: string) {
  // This would integrate with Gmail API to actually send emails
  const result = await safeDbQuery(async () => {
    return await prisma.emailCampaign.update({
      where: { id },
      data: {
        status: 'sending',
        sentAt: new Date()
      }
    })
  })

  if (!result) {
    throw new Error('Failed to send email campaign: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath('/marketing/campaigns')
  revalidatePath(`/marketing/campaigns/${id}`)
}

// Email Templates
export async function getEmailTemplates() {
  const result = await safeDbQuery(async () => {
    return await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    })
  })
  
  return result || []
}

export async function getEmailTemplate(id: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.emailTemplate.findUnique({
      where: { id }
    })
  })
  
  return result
}

export async function createEmailTemplate(formData: FormData) {
  const name = formData.get('name') as string
  const subject = formData.get('subject') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string || 'general'

  if (!name || name.trim() === '') {
    throw new Error('Template name is required')
  }

  const result = await safeDbQuery(async () => {
    return await prisma.emailTemplate.create({
      data: {
        name: name.trim(),
        subject: subject?.trim() || '',
        content: content?.trim() || '',
        category
      }
    })
  })

  if (!result) {
    throw new Error('Failed to create email template: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath('/marketing/templates')
  redirect('/marketing/templates')
}

// Gmail Integration
export async function getGmailIntegrationStatus() {
  const result = await safeDbQuery(async () => {
    const integration = await prisma.gmailIntegration.findFirst({
      where: { isActive: true }
    })
    
    return {
      isConnected: !!integration,
      email: integration?.email || null,
      expiresAt: integration?.expiresAt || null
    }
  })
  
  return result || { isConnected: false, email: null, expiresAt: null }
}

export async function saveGmailIntegration(userId: string, accessToken: string, refreshToken: string, email: string, expiresAt: Date) {
  const result = await safeDbQuery(async () => {
    return await prisma.gmailIntegration.upsert({
      where: { userId },
      update: {
        accessToken,
        refreshToken,
        email,
        expiresAt,
        isActive: true
      },
      create: {
        userId,
        accessToken,
        refreshToken,
        email,
        expiresAt,
        isActive: true
      }
    })
  })

  if (!result) {
    throw new Error('Failed to save Gmail integration: Database connection error')
  }

  revalidatePath('/marketing')
  revalidatePath('/marketing/integrations/gmail')
  return result
}

// People for email lists
export async function getPeopleForEmailLists() {
  const result = await safeDbQuery(async () => {
    return await prisma.person.findMany({
      where: {
        email: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        tags: true
      },
      orderBy: { name: 'asc' }
    })
  })
  
  return result || []
}
