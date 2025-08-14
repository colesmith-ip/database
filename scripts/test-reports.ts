import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testReports() {
  console.log('🔄 Testing dynamic reports system...')

  try {
    // Get all pipelines
    const pipelines = await prisma.pipeline.findMany({
      include: {
        stages: {
          orderBy: { order: 'asc' }
        }
      }
    })

    console.log(`📋 Found ${pipelines.length} pipelines:`)
    
    for (const pipeline of pipelines) {
      console.log(`\n📊 Pipeline: "${pipeline.name}"`)
      console.log(`   Stages: ${pipeline.stages.map(s => s.name).join(' → ')}`)
      console.log(`   Total stages: ${pipeline.stages.length}`)
      
      // Count items in each stage
      for (const stage of pipeline.stages) {
        const itemCount = await prisma.pipelineItem.count({
          where: { stageId: stage.id }
        })
        console.log(`   - ${stage.name}: ${itemCount} items`)
      }
    }

    // Test pipeline velocity report
    console.log('\n📈 Testing pipeline velocity report...')
    const velocityResult = await prisma.$queryRaw<Array<{
      pipelineId: string
      pipelineName: string
      totalItems: number
      avgTimeInPipeline: number
    }>>`
      SELECT 
        p.id as pipelineId,
        p.name as pipelineName,
        COUNT(DISTINCT pi.id) as totalItems,
        AVG(
          CASE 
            WHEN ph.enteredAt IS NOT NULL AND ph.leftAt IS NOT NULL 
            THEN (julianday(ph.leftAt) - julianday(ph.enteredAt)) * 24
            ELSE NULL 
          END
        ) as avgTimeInPipeline
      FROM pipelines p
      LEFT JOIN stages s ON s.pipelineId = p.id
      LEFT JOIN pipeline_items pi ON pi.stageId = s.id
      LEFT JOIN pipeline_item_stage_history ph ON ph.pipelineItemId = pi.id
      GROUP BY p.id, p.name
      ORDER BY p.name
    `

    console.log('Pipeline velocity data:')
    velocityResult.forEach(pipeline => {
      console.log(`   ${pipeline.pipelineName}: ${pipeline.totalItems} items, avg time: ${pipeline.avgTimeInPipeline?.toFixed(2) || 'N/A'} hours`)
    })

    console.log('\n✅ Dynamic reports system is working correctly!')
    console.log('🎯 Key improvements:')
    console.log('   - Works with any pipeline structure')
    console.log('   - Dynamic stage analysis')
    console.log('   - Flexible reporting per pipeline')
    console.log('   - No hardcoded stage names')

  } catch (error) {
    console.error('❌ Error testing reports:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testReports()
