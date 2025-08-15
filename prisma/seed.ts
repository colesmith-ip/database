import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Mission Organizations
  const worldMissions = await prisma.organization.create({
    data: {
      name: 'World Missions International',
      type: 'Missions Agency',
      region: 'North America',
    },
  })

  const africaPartners = await prisma.organization.create({
    data: {
      name: 'Africa Partners Network',
      type: 'Missions Agency',
      region: 'Africa',
    },
  })

  const asiaOutreach = await prisma.organization.create({
    data: {
      name: 'Asia Outreach Ministries',
      type: 'Missions Agency',
      region: 'Asia Pacific',
    },
  })

  const localChurch = await prisma.organization.create({
    data: {
      name: 'Grace Community Church',
      type: 'Local Church',
      region: 'North America',
    },
  })

  console.log('✅ Created mission organizations')

  // Create Missionaries and Supporters
  const david = await prisma.person.create({
    data: {
      name: 'David Thompson',
      email: 'david.thompson@worldmissions.org',
      phone: '+1-555-0123',
      tags: ['missionary', 'africa', 'church-planting'],
      customFields: {
        ministry: 'Church Planting',
        location: 'Kenya',
        supportLevel: 85,
        yearsOfService: 8,
        language: 'Swahili, English'
      },
      ownerUserId: 'user_1',
    },
  })

  const maria = await prisma.person.create({
    data: {
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@africapartners.org',
      phone: '+44-20-7946-0958',
      tags: ['missionary', 'medical', 'healthcare'],
      customFields: {
        ministry: 'Medical Missions',
        location: 'Uganda',
        supportLevel: 92,
        yearsOfService: 5,
        specialty: 'Pediatric Care'
      },
      ownerUserId: 'user_1',
    },
  })

  const james = await prisma.person.create({
    data: {
      name: 'James Chen',
      email: 'james.chen@asiaoutreach.org',
      phone: '+65-6123-4567',
      tags: ['missionary', 'asia', 'education'],
      customFields: {
        ministry: 'Education & Training',
        location: 'Cambodia',
        supportLevel: 78,
        yearsOfService: 3,
        focus: 'Bible Training'
      },
      ownerUserId: 'user_2',
    },
  })

  const sarah = await prisma.person.create({
    data: {
      name: 'Sarah Williams',
      email: 'sarah.williams@gracechurch.org',
      phone: '+1-555-0456',
      tags: ['supporter', 'prayer-partner', 'financial'],
      customFields: {
        role: 'Prayer Partner',
        monthlySupport: 150,
        prayerFocus: 'Unreached People Groups',
        commitmentLevel: 'High'
      },
      ownerUserId: 'user_1',
    },
  })

  const michael = await prisma.person.create({
    data: {
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      phone: '+1-555-0789',
      tags: ['missionary', 'latin-america', 'evangelism'],
      customFields: {
        ministry: 'Evangelism & Discipleship',
        location: 'Guatemala',
        supportLevel: 65,
        yearsOfService: 2,
        language: 'Spanish, English'
      },
      ownerUserId: 'user_1',
    },
  })

  const lisa = await prisma.person.create({
    data: {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@worldmissions.org',
      phone: '+1-555-0321',
      tags: ['missionary', 'europe', 'youth'],
      customFields: {
        ministry: 'Youth Ministry',
        location: 'Germany',
        supportLevel: 88,
        yearsOfService: 6,
        focus: 'Campus Ministry'
      },
      ownerUserId: 'user_2',
    },
  })

  console.log('✅ Created missionaries and supporters')

  // Create Person-Organization relationships
  await prisma.personOrganization.create({
    data: {
      personId: david.id,
      orgId: worldMissions.id,
      role: 'Field Missionary',
    },
  })

  await prisma.personOrganization.create({
    data: {
      personId: maria.id,
      orgId: africaPartners.id,
      role: 'Medical Missionary',
    },
  })

  await prisma.personOrganization.create({
    data: {
      personId: james.id,
      orgId: asiaOutreach.id,
      role: 'Training Coordinator',
    },
  })

  await prisma.personOrganization.create({
    data: {
      personId: sarah.id,
      orgId: localChurch.id,
      role: 'Prayer Partner',
    },
  })

  await prisma.personOrganization.create({
    data: {
      personId: michael.id,
      orgId: worldMissions.id,
      role: 'Field Missionary',
    },
  })

  await prisma.personOrganization.create({
    data: {
      personId: lisa.id,
      orgId: worldMissions.id,
      role: 'Field Missionary',
    },
  })

  console.log('✅ Created person-organization relationships')

  // Create Relationships
  await prisma.relationship.create({
    data: {
      fromPersonId: david.id,
      toPersonId: sarah.id,
      type: 'Prayer Partner',
    },
  })

  await prisma.relationship.create({
    data: {
      fromPersonId: maria.id,
      toPersonId: sarah.id,
      type: 'Prayer Partner',
    },
  })

  await prisma.relationship.create({
    data: {
      fromPersonId: david.id,
      toPersonId: maria.id,
      type: 'Ministry Partner',
    },
  })

  console.log('✅ Created relationships')

  // Create Mission Pipeline
  const missionPipeline = await prisma.pipeline.create({
    data: {
      name: 'Missionary Support Pipeline',
    },
  })

  // Create Pipeline Stages
  const stages = await Promise.all([
    prisma.stage.create({
      data: {
        pipelineId: missionPipeline.id,
        name: 'Initial Contact',
        order: 0,
      },
    }),
    prisma.stage.create({
      data: {
        pipelineId: missionPipeline.id,
        name: 'Application Process',
        order: 1,
      },
    }),
    prisma.stage.create({
      data: {
        pipelineId: missionPipeline.id,
        name: 'Training & Preparation',
        order: 2,
      },
    }),
    prisma.stage.create({
      data: {
        pipelineId: missionPipeline.id,
        name: 'Support Raising',
        order: 3,
      },
    }),
    prisma.stage.create({
      data: {
        pipelineId: missionPipeline.id,
        name: 'Field Deployment',
        order: 4,
      },
    }),
    prisma.stage.create({
      data: {
        pipelineId: missionPipeline.id,
        name: 'Active Ministry',
        order: 5,
      },
    }),
  ])

  console.log('✅ Created mission pipeline and stages')

  // Create Pipeline Items (Missionary Candidates)
  const pipelineItems = await Promise.all([
    prisma.pipelineItem.create({
      data: {
        title: 'Rachel Martinez - Medical Missions',
        stageId: stages[3].id, // Support Raising
        personId: null,
        organizationId: worldMissions.id,
      },
    }),
    prisma.pipelineItem.create({
      data: {
        title: 'Thomas Kim - Church Planting',
        stageId: stages[2].id, // Training & Preparation
        personId: null,
        organizationId: asiaOutreach.id,
      },
    }),
    prisma.pipelineItem.create({
      data: {
        title: 'Amanda Foster - Youth Ministry',
        stageId: stages[1].id, // Application Process
        personId: null,
        organizationId: worldMissions.id,
      },
    }),
  ])

  console.log('✅ Created pipeline items')

  // Create Tasks
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Follow up with Rachel on support raising progress',
        status: 'pending',
        personId: null,
        pipelineItemId: pipelineItems[0].id,
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: 'Check on monthly support commitments and prayer partner connections',
        ownerUserId: 'user_1',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Schedule Thomas for cultural training',
        status: 'in_progress',
        personId: null,
        pipelineItemId: pipelineItems[1].id,
        dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        notes: 'Arrange training session with experienced missionaries in Myanmar',
        ownerUserId: 'user_2',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Review Amanda\'s application materials',
        status: 'completed',
        personId: null,
        pipelineItemId: pipelineItems[2].id,
        dueAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        notes: 'Application approved, moving to training phase',
        ownerUserId: 'user_1',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Prayer meeting for David in Kenya',
        status: 'pending',
        personId: david.id,
        pipelineItemId: null,
        dueAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        notes: 'Monthly prayer gathering for David\'s ministry in Nairobi',
        ownerUserId: 'user_1',
      },
    }),
  ])

  console.log('✅ Created tasks')

  // Create Events
  await Promise.all([
    prisma.event.create({
      data: {
        title: 'Missionary Prayer Night',
        description: 'Monthly prayer gathering for all our missionaries',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        location: 'Grace Community Church',
        eventType: 'Prayer',
        color: 'blue',
        isActive: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Support Raising Workshop',
        description: 'Training session for new missionaries on support raising',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
        location: 'World Missions Office',
        eventType: 'Training',
        color: 'green',
        isActive: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Missionary Commissioning Service',
        description: 'Commissioning service for Rachel Martinez',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        location: 'Grace Community Church',
        eventType: 'Commissioning',
        color: 'purple',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created events')

  // Create Announcements
  await Promise.all([
    prisma.announcement.create({
      data: {
        title: 'New Missionary Family Joining Our Team',
        content: 'We are excited to welcome the Martinez family who will be serving in South Sudan through medical missions. Please pray for their support raising process.',
        authorName: 'Mission Director',
        authorEmail: 'director@worldmissions.org',
        priority: 'high',
        isActive: true,
      },
    }),
    prisma.announcement.create({
      data: {
        title: 'Prayer Request: David in Kenya',
        content: 'David Thompson reports that the church planting work in Nairobi is growing rapidly. Please pray for wisdom in leadership development and continued open doors.',
        authorName: 'Prayer Coordinator',
        authorEmail: 'prayer@worldmissions.org',
        priority: 'normal',
        isActive: true,
      },
    }),
    prisma.announcement.create({
      data: {
        title: 'Mission Trip Opportunity: Guatemala',
        content: 'Join Michael Johnson for a 2-week mission trip to Guatemala this summer. Applications are now open for team members.',
        authorName: 'Short-term Missions',
        authorEmail: 'shortterm@worldmissions.org',
        priority: 'normal',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created announcements')

  // Create Discussion Posts
  await Promise.all([
    prisma.post.create({
      data: {
        content: 'Praise God! We just received word that our medical clinic in Uganda treated over 500 patients this month. Maria and her team are doing amazing work!',
        authorName: 'Mission Director',
        authorEmail: 'director@worldmissions.org',
      },
    }),
    prisma.post.create({
      data: {
        content: 'Please pray for James as he begins his Bible training program in Cambodia. The students are eager to learn and grow in their faith.',
        authorName: 'Asia Coordinator',
        authorEmail: 'asia@worldmissions.org',
      },
    }),
    prisma.post.create({
      data: {
        content: 'Thank you to all our prayer partners! Your faithful prayers are making a difference in the lives of our missionaries and the people they serve.',
        authorName: 'Prayer Coordinator',
        authorEmail: 'prayer@worldmissions.org',
      },
    }),
  ])

  console.log('✅ Created discussion posts')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
