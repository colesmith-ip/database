import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting public seed...');

    // Seed people
    const people = await prisma.person.createMany({
      data: [
        {
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1-555-0123",
          tags: ["donor", "prayer_warrior", "monthly_supporter"],
          customFields: {
            "church": "Grace Community Church",
            "giving_frequency": "monthly",
            "mission_trip_interest": "yes"
          }
        },
        {
          name: "Michael Chen",
          email: "michael.chen@email.com",
          phone: "+1-555-0124",
          tags: ["donor", "volunteer", "board_member"],
          customFields: {
            "church": "First Baptist Church",
            "giving_frequency": "quarterly",
            "skills": "accounting, leadership"
          }
        },
        {
          name: "Emily Rodriguez",
          email: "emily.rodriguez@email.com",
          phone: "+1-555-0125",
          tags: ["prayer_warrior", "missionary_care"],
          customFields: {
            "church": "Hispanic Community Church",
            "prayer_commitment": "daily",
            "language_skills": "Spanish, English"
          }
        },
        {
          name: "David Thompson",
          email: "david.thompson@email.com",
          phone: "+1-555-0126",
          tags: ["donor", "monthly_supporter"],
          customFields: {
            "church": "Calvary Chapel",
            "giving_frequency": "monthly",
            "mission_focus": "orphan_care"
          }
        },
        {
          name: "Lisa Wang",
          email: "lisa.wang@email.com",
          phone: "+1-555-0127",
          tags: ["volunteer", "event_organizer"],
          customFields: {
            "church": "Community Church",
            "volunteer_areas": "events, hospitality",
            "availability": "weekends"
          }
        }
      ],
      skipDuplicates: true
    });

    // Seed organizations
    const organizations = await prisma.organization.createMany({
      data: [
        {
          name: "Grace Community Church",
          type: "church",
          region: "West Coast"
        },
        {
          name: "First Baptist Church",
          type: "church",
          region: "Southeast"
        },
        {
          name: "Hispanic Community Church",
          type: "church",
          region: "Southwest"
        },
        {
          name: "Calvary Chapel",
          type: "church",
          region: "West Coast"
        },
        {
          name: "Community Church",
          type: "church",
          region: "Midwest"
        },
        {
          name: "Mission Partners International",
          type: "mission_agency",
          region: "Global"
        },
        {
          name: "Christian Education Foundation",
          type: "foundation",
          region: "National"
        },
        {
          name: "Orphan Care Network",
          type: "nonprofit",
          region: "Global"
        }
      ],
      skipDuplicates: true
    });

    // Create some person-organization relationships
    const peopleData = await prisma.person.findMany();
    const orgData = await prisma.organization.findMany();

    const relationships = [];
    for (let i = 0; i < Math.min(peopleData.length, orgData.length); i++) {
      relationships.push({
        personId: peopleData[i].id,
        orgId: orgData[i].id,
        role: i % 3 === 0 ? "member" : i % 3 === 1 ? "leader" : "volunteer"
      });
    }

    await prisma.personOrganization.createMany({
      data: relationships,
      skipDuplicates: true
    });

    // Seed pipelines and stages
    const pipeline = await prisma.pipeline.create({
      data: {
        name: "Donor Engagement Pipeline",
        stages: {
          create: [
            { name: "New Contact", order: 1 },
            { name: "Initial Contact", order: 2 },
            { name: "Relationship Building", order: 3 },
            { name: "Commitment", order: 4 },
            { name: "Active Supporter", order: 5 }
          ]
        }
      }
    });

    // Seed some pipeline items
    const stage = await prisma.stage.findFirst({
      where: { pipelineId: pipeline.id, order: 1 }
    });

    if (stage) {
      await prisma.pipelineItem.createMany({
        data: peopleData.slice(0, 3).map((person, index) => ({
          title: `Follow up with ${person.name}`,
          personId: person.id,
          stageId: stage.id,
          ownerUserId: null
        }))
      });
    }

    // Seed email conversations
    const sampleConversations = [
      {
        subject: 'Prayer Request Update',
        messages: [
          {
            fromEmail: peopleData[0]?.email!,
            toEmail: 'missionary@yourmission.org',
            subject: 'Prayer Request Update',
            content: `Hi there,

Thank you for your prayers for our ministry in Kenya. I wanted to share an update - we've seen some amazing breakthroughs this month!

We've been able to start a new Bible study group in the village, and 5 people have committed their lives to Christ. The community has been very receptive to our work.

Please continue to pray for:
- The new believers as they grow in their faith
- Our upcoming medical clinic outreach
- Safety for our team

Blessings,
${peopleData[0]?.name}`,
            isInbound: true,
            receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            fromEmail: 'missionary@yourmission.org',
            toEmail: peopleData[0]?.email!,
            subject: 'Re: Prayer Request Update',
            content: `Dear ${peopleData[0]?.name},

Praise God for these amazing breakthroughs! We're rejoicing with you over the 5 new believers. This is exactly what we've been praying for.

I've shared your update with our prayer team here, and we're all committed to continuing to lift up your ministry in prayer.

We'll be praying specifically for:
- The new Bible study group
- The upcoming medical clinic
- Protection and wisdom for your team

Keep us updated on how things continue to develop!

Blessings,
Missionary Team`,
            isInbound: false,
            receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          }
        ]
      }
    ];

    for (let i = 0; i < Math.min(peopleData.length, sampleConversations.length); i++) {
      const person = peopleData[i];
      const conversationData = sampleConversations[i];

      // Create conversation
      const conversation = await prisma.emailConversation.create({
        data: {
          personId: person.id,
          subject: conversationData.subject,
          status: 'open',
          lastMessageAt: conversationData.messages[conversationData.messages.length - 1].receivedAt
        }
      });

      // Create messages
      for (const messageData of conversationData.messages) {
        await prisma.emailMessage.create({
          data: {
            conversationId: conversation.id,
            messageId: `sample-message-${Date.now()}-${Math.random()}`,
            fromEmail: messageData.fromEmail,
            toEmail: messageData.toEmail,
            subject: messageData.subject,
            content: messageData.content,
            isInbound: messageData.isInbound,
            receivedAt: messageData.receivedAt
          }
        });
      }
    }

    console.log('✅ Public seed completed successfully!');

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        peopleCreated: people.count,
        organizationsCreated: organizations.count,
        relationshipsCreated: relationships.length,
        conversationsCreated: sampleConversations.length
      }
    });

  } catch (error) {
    console.error('Error in public seed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
