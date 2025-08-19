import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Parse the email data (this would come from your email service)
    const {
      from,
      to,
      subject,
      body: emailBody,
      messageId,
      threadId,
      timestamp
    } = body

    // Extract the actual recipient (remove the BCC tracking address)
    const actualRecipients = to.filter((email: string) => 
      !email.includes('track@yourmission.org')
    )

    if (actualRecipients.length === 0) {
      return NextResponse.json({ error: 'No valid recipients found' }, { status: 400 })
    }

    // Find or create the contact based on the recipient email
    const recipientEmail = actualRecipients[0]
    let person = await prisma.person.findUnique({
      where: { email: recipientEmail }
    })

    if (!person) {
      // Create a new person if they don't exist
      person = await prisma.person.create({
        data: {
          name: from.name || from.email.split('@')[0],
          email: recipientEmail,
          tags: ['imported-from-email']
        }
      })
    }

    // Create or find the conversation thread
    let conversation = await prisma.emailConversation.findFirst({
      where: {
        threadId: threadId || messageId,
        personId: person.id
      }
    })

    if (!conversation) {
      conversation = await prisma.emailConversation.create({
        data: {
          threadId: threadId || messageId,
          personId: person.id,
          subject: subject,
          status: 'active'
        }
      })
    }

    // Add the email message to the conversation
    await prisma.emailMessage.create({
      data: {
        conversationId: conversation.id,
        messageId: messageId,
        fromEmail: from.email,
        fromName: from.name,
        toEmail: recipientEmail,
        subject: subject,
        body: emailBody,
        direction: 'inbound',
        receivedAt: new Date(timestamp || Date.now())
      }
    })

    // Update conversation last activity
    await prisma.emailConversation.update({
      where: { id: conversation.id },
      data: { 
        lastActivityAt: new Date(),
        messageCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      conversationId: conversation.id,
      personId: person.id 
    })

  } catch (error) {
    console.error('Email tracking error:', error)
    return NextResponse.json({ error: 'Failed to track email' }, { status: 500 })
  }
}
