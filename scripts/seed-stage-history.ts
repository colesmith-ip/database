import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedStageHistory() {
  console.log('🔄 Seeding stage history for existing pipeline items...')

  // Get all pipeline items
  const pipelineItems = await prisma.pipelineItem.findMany({
    include: {
      stage: true
    }
  })

  console.log(`Found ${pipelineItems.length} pipeline items`)

  for (const item of pipelineItems) {
    // Check if this item already has history
    const existingHistory = await prisma.pipelineItemStageHistory.findFirst({
      where: {
        pipelineItemId: item.id,
        stageId: item.stageId
      }
    })

    if (!existingHistory) {
      // Create initial history entry for current stage
      await prisma.pipelineItemStageHistory.create({
        data: {
          pipelineItemId: item.id,
          stageId: item.stageId,
          enteredAt: item.createdAt, // Use item creation date as entry time
          leftAt: null // Still in this stage
        }
      })
      console.log(`✅ Created history for item "${item.title}" in stage "${item.stage.name}"`)
    } else {
      console.log(`⏭️  History already exists for item "${item.title}"`)
    }
  }

  console.log('🎉 Stage history seeding completed!')
  await prisma.$disconnect()
}

seedStageHistory().catch((error) => {
  console.error('❌ Error seeding stage history:', error)
  process.exit(1)
})
