import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedStageRules() {
  console.log('🔄 Seeding sample stage rules...')

  try {
    // Get the first pipeline and its stages
    const pipeline = await prisma.pipeline.findFirst({
      include: {
        stages: {
          orderBy: { order: 'asc' },
          take: 3 // Only add rules to first 3 stages
        }
      }
    })

    if (!pipeline || pipeline.stages.length === 0) {
      console.log('❌ No pipeline with stages found. Run the main seed script first.')
      return
    }

    const sampleRules = [
      {
        stageId: pipeline.stages[0].id,
        templateTitle: 'Follow up on initial contact',
        offsetDays: 2
      },
      {
        stageId: pipeline.stages[1].id,
        templateTitle: 'Schedule demo meeting',
        offsetDays: 3
      },
      {
        stageId: pipeline.stages[2].id,
        templateTitle: 'Send proposal',
        offsetDays: 5
      }
    ]

    for (const ruleData of sampleRules) {
      try {
        await prisma.stageRule.create({
          data: ruleData
        })
        console.log(`✅ Created rule for stage: "${ruleData.templateTitle}" (${ruleData.offsetDays} days)`)
      } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
          console.log(`⏭️ Rule already exists for stage ${ruleData.stageId}`)
        } else {
          console.log(`❌ Failed to create rule:`, error)
        }
      }
    }

    console.log('🎉 Stage rules seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding stage rules:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedStageRules()
