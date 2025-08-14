import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCreatePipeline() {
  console.log('🔄 Testing pipeline creation...')

  try {
    // Test creating a new pipeline
    const result = await prisma.$transaction(async (tx) => {
      // Create the pipeline
      const pipeline = await tx.pipeline.create({
        data: {
          name: 'Test Recruitment Pipeline'
        }
      })

      // Create stages
      const stages = await Promise.all([
        'Application',
        'Phone Screen',
        'Interview',
        'Reference Check',
        'Offer'
      ].map((stageName, index) =>
        tx.stage.create({
          data: {
            pipelineId: pipeline.id,
            name: stageName,
            order: index
          }
        })
      ))

      return { pipeline, stages }
    })

    console.log(`✅ Created pipeline: "${result.pipeline.name}"`)
    console.log(`✅ Created ${result.stages.length} stages:`)
    result.stages.forEach((stage, index) => {
      console.log(`   ${index + 1}. ${stage.name}`)
    })

    // Test updating a stage name
    const updatedStage = await prisma.stage.update({
      where: { id: result.stages[0].id },
      data: { name: 'Application Received' }
    })

    console.log(`✅ Updated stage name to: "${updatedStage.name}"`)

    // Clean up - delete the test pipeline
    await prisma.pipeline.delete({
      where: { id: result.pipeline.id }
    })

    console.log('✅ Test pipeline cleaned up')
    console.log('🎉 Pipeline creation and stage editing functionality works!')

  } catch (error) {
    console.error('❌ Error testing pipeline creation:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCreatePipeline()
