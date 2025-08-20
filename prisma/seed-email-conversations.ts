import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedEmailConversations() {
  console.log('🌱 Seeding email conversations...')

  // Get some existing people to add conversations to
  const people = await prisma.person.findMany({
    take: 5,
    where: {
      email: {
        not: null
      }
    }
  })

  if (people.length === 0) {
    console.log('No people found with email addresses. Please run the main seed script first.')
    return
  }

  const sampleConversations = [
    {
      subject: 'Prayer Request Update',
      messages: [
        {
          direction: 'inbound',
          fromEmail: people[0].email!,
          fromName: people[0].name,
          toEmail: 'missionary@yourmission.org',
          subject: 'Prayer Request Update',
          body: `Hi there,

I wanted to update you on the prayer request I shared last week. The situation has improved significantly, and I'm grateful for your prayers.

The family is doing much better now, and we've seen some real breakthroughs in the community. Thank you for your continued support and prayers.

Blessings,
${people[0].name}`,
          receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          direction: 'outbound',
          fromEmail: 'missionary@yourmission.org',
          fromName: 'Missionary Team',
          toEmail: people[0].email!,
          subject: 'Re: Prayer Request Update',
          body: `Dear ${people[0].name},

That's wonderful news! We're so glad to hear that the situation has improved. Our team has been praying daily for this family and the community.

It's amazing to see how God is working in their lives. We'll continue to lift them up in prayer.

Keep us updated on any further developments.

Blessings,
Missionary Team`,
          receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        }
      ]
    },
    {
      subject: 'Monthly Support Update',
      messages: [
        {
          direction: 'inbound',
          fromEmail: people[1]?.email!,
          fromName: people[1]?.name,
          toEmail: 'missionary@yourmission.org',
          subject: 'Monthly Support Update',
          body: `Hello,

I hope this email finds you well. I wanted to let you know that I've updated my monthly support amount as we discussed.

The new amount should be reflected in your next payment cycle. I'm excited to continue supporting your ministry and the work you're doing in the community.

Please let me know if you need anything else from me.

Best regards,
${people[1]?.name}`,
          receivedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          direction: 'outbound',
          fromEmail: 'missionary@yourmission.org',
          fromName: 'Missionary Team',
          toEmail: people[1]?.email!,
          subject: 'Re: Monthly Support Update',
          body: `Dear ${people[1]?.name},

Thank you so much for your generous support! We're incredibly grateful for your partnership in this ministry.

Your updated support will help us continue serving the community and sharing God's love. We'll make sure to keep you updated on how your support is being used.

If you have any questions or would like to hear more about specific projects, please don't hesitate to reach out.

Blessings,
Missionary Team`,
          receivedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
        },
        {
          direction: 'inbound',
          fromEmail: people[1]?.email!,
          fromName: people[1]?.name,
          toEmail: 'missionary@yourmission.org',
          subject: 'Re: Monthly Support Update',
          body: `Thank you for the quick response! I would love to hear more about the specific projects you're working on.

Are there any particular areas where you could use additional prayer or support?

Looking forward to staying connected.

${people[1]?.name}`,
          receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
      ]
    },
    {
      subject: 'Short-term Mission Trip Interest',
      messages: [
        {
          direction: 'inbound',
          fromEmail: people[2]?.email!,
          fromName: people[2]?.name,
          toEmail: 'missionary@yourmission.org',
          subject: 'Short-term Mission Trip Interest',
          body: `Hi there,

I'm interested in joining a short-term mission trip with your organization. I saw the information on your website and would love to learn more about upcoming opportunities.

I have some experience with construction and would be happy to help with any building projects. I'm also flexible with dates and can work around your schedule.

Could you send me more details about upcoming trips and the application process?

Thanks,
${people[2]?.name}`,
          receivedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          direction: 'outbound',
          fromEmail: 'missionary@yourmission.org',
          fromName: 'Missionary Team',
          toEmail: people[2]?.email!,
          subject: 'Re: Short-term Mission Trip Interest',
          body: `Dear ${people[2]?.name},

Thank you for your interest in joining us on a short-term mission trip! We're excited about your enthusiasm and construction experience would be very valuable.

We have several upcoming trips planned:
- March 15-22: Community center construction
- April 10-17: Medical clinic outreach
- May 5-12: Youth ministry and construction

I've attached our application form and trip details. Please fill out the application and let me know which trip interests you most.

We'll also need to schedule a brief phone call to discuss logistics and answer any questions you might have.

Looking forward to hearing from you!

Blessings,
Missionary Team`,
          receivedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
        }
      ]
    }
  ]

  for (let i = 0; i < Math.min(people.length, sampleConversations.length); i++) {
    const person = people[i]
    const conversationData = sampleConversations[i]

    // Create conversation
    const conversation = await prisma.emailConversation.create({
      data: {
        personId: person.id,
        subject: conversationData.subject,
        status: 'open',
        lastMessageAt: conversationData.messages[conversationData.messages.length - 1].receivedAt
      }
    })

    // Create messages
    for (const messageData of conversationData.messages) {
      await prisma.emailMessage.create({
        data: {
          conversationId: conversation.id,
          messageId: `sample-message-${Date.now()}-${Math.random()}`,
          fromEmail: messageData.fromEmail,
          toEmail: messageData.toEmail,
          subject: messageData.subject,
          content: messageData.body,
          isInbound: messageData.direction === 'inbound',
          receivedAt: messageData.receivedAt
        }
      })
    }

    console.log(`✅ Added conversation "${conversationData.subject}" for ${person.name}`)
  }

  console.log('🎉 Email conversations seeded successfully!')
}

async function main() {
  try {
    await seedEmailConversations()
  } catch (error) {
    console.error('Error seeding email conversations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
