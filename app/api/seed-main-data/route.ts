import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
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
        },
        {
          name: "Robert Martinez",
          email: "robert.martinez@email.com",
          phone: "+1-555-0128",
          tags: ["donor", "prayer_warrior"],
          customFields: {
            "church": "St. Mary's Catholic Church",
            "giving_frequency": "annual",
            "prayer_commitment": "weekly"
          }
        },
        {
          name: "Jennifer Adams",
          email: "jennifer.adams@email.com",
          phone: "+1-555-0129",
          tags: ["missionary_care", "volunteer"],
          customFields: {
            "church": "Evangelical Free Church",
            "care_ministry": "missionary_families",
            "experience": "former_missionary"
          }
        },
        {
          name: "James Wilson",
          email: "james.wilson@email.com",
          phone: "+1-555-0130",
          tags: ["donor", "board_member"],
          customFields: {
            "church": "Presbyterian Church",
            "giving_frequency": "monthly",
            "board_role": "treasurer"
          }
        },
        {
          name: "Maria Garcia",
          email: "maria.garcia@email.com",
          phone: "+1-555-0131",
          tags: ["prayer_warrior", "volunteer"],
          customFields: {
            "church": "Hispanic Community Church",
            "prayer_commitment": "daily",
            "volunteer_areas": "children's_ministry"
          }
        },
        {
          name: "Thomas Brown",
          email: "thomas.brown@email.com",
          phone: "+1-555-0132",
          tags: ["donor", "monthly_supporter"],
          customFields: {
            "church": "Methodist Church",
            "giving_frequency": "monthly",
            "mission_focus": "education"
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
          name: "St. Mary's Catholic Church",
          type: "church",
          region: "Northeast"
        },
        {
          name: "Evangelical Free Church",
          type: "church",
          region: "Midwest"
        },
        {
          name: "Presbyterian Church",
          type: "church",
          region: "Northeast"
        },
        {
          name: "Methodist Church",
          type: "church",
          region: "Southeast"
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
        data: peopleData.slice(0, 5).map((person, index) => ({
          title: `Follow up with ${person.name}`,
          personId: person.id,
          stageId: stage.id,
          ownerUserId: null
        }))
      });
    }

    return NextResponse.json({
      success: true,
      message: "Main data seeded successfully",
      data: {
        peopleCreated: people.count,
        organizationsCreated: organizations.count,
        relationshipsCreated: relationships.length
      }
    });

  } catch (error) {
    console.error('Error seeding main data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed main data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
