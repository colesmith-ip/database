import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTasks() {
  console.log('🔄 Seeding sample tasks...')

  // Get some existing people and pipeline items
  const people = await prisma.person.findMany({ take: 3 })
  const pipelineItems = await prisma.pipelineItem.findMany({ take: 3 })

  if (people.length === 0 || pipelineItems.length === 0) {
    console.log('❌ Need people and pipeline items first. Run the main seed script.')
    return
  }

  const sampleTasks = [
    {
      title: 'Follow up on proposal',
      notes: 'Call client to discuss proposal details and next steps',
      ownerUserId: 'user1',
      dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: 'pending',
      personId: people[0]?.id,
      pipelineItemId: pipelineItems[0]?.id
    },
    {
      title: 'Schedule demo meeting',
      notes: 'Set up technical demo for the healthcare system project',
      ownerUserId: 'user2',
      dueAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      status: 'pending',
      personId: people[1]?.id,
      pipelineItemId: pipelineItems[1]?.id
    },
    {
      title: 'Review contract terms',
      notes: 'Legal review of the enterprise software contract',
      ownerUserId: 'user1',
      dueAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (overdue)
      status: 'pending',
      personId: people[2]?.id,
      pipelineItemId: pipelineItems[2]?.id
    },
    {
      title: 'Prepare presentation slides',
      notes: 'Create slides for the quarterly business review',
      ownerUserId: 'user3',
      dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: 'deferred',
      personId: people[0]?.id
    },
    {
      title: 'Update CRM records',
      notes: 'Sync latest contact information and interactions',
      ownerUserId: 'user2',
      dueAt: null, // No due date
      status: 'completed',
      personId: people[1]?.id
    },
    {
      title: 'Research competitor pricing',
      notes: 'Analyze competitor pricing for the fintech platform',
      ownerUserId: 'user1',
      dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: 'pending',
      pipelineItemId: pipelineItems[0]?.id
    }
  ]

  for (const taskData of sampleTasks) {
    try {
      await prisma.task.create({
        data: taskData
      })
      console.log(`✅ Created task: "${taskData.title}"`)
    } catch (error) {
      console.log(`❌ Failed to create task "${taskData.title}":`, error)
    }
  }

  console.log('🎉 Task seeding completed!')
  await prisma.$disconnect()
}

seedTasks().catch((error) => {
  console.error('❌ Error seeding tasks:', error)
  process.exit(1)
})

