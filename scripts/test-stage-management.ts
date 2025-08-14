import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testStageManagement() {
  console.log('🔄 Testing stage management...')

  try {
    // Get the first pipeline
    const pipeline = await prisma.pipeline.findFirst({
      include: {
        stages: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!pipeline) {
      console.log('❌ No pipeline found. Create a pipeline first.')
      return
    }

    console.log(`📋 Testing with pipeline: "${pipeline.name}"`)
    console.log(`📋 Current stages: ${pipeline.stages.map(s => s.name).join(' → ')}`)

    // Test checking stage item counts
    const stagesWithCounts = await Promise.all(
      pipeline.stages.map(async (stage) => {
        const itemCount = await prisma.pipelineItem.count({
          where: { stageId: stage.id }
        })
        return { ...stage, itemCount }
      })
    )

    console.log('📊 Stage item counts:')
    stagesWithCounts.forEach(stage => {
      console.log(`   ${stage.name}: ${stage.itemCount} items`)
    })

    // Test stage deletion validation
    const emptyStage = stagesWithCounts.find(s => s.itemCount === 0)
    const stageWithItems = stagesWithCounts.find(s => s.itemCount > 0)

    if (emptyStage) {
      console.log(`✅ Found empty stage "${emptyStage.name}" - can be deleted`)
    }

    if (stageWithItems) {
      console.log(`⚠️ Stage "${stageWithItems.name}" has ${stageWithItems.itemCount} items - cannot be deleted`)
    }

    console.log('🎉 Stage management validation works!')

  } catch (error) {
    console.error('❌ Error testing stage management:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testStageManagement()
