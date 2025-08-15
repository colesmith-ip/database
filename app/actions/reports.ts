'use server'

import { prisma } from '../lib/prisma'

// Helper function to safely execute database queries
async function safeDbQuery<T>(queryFn: () => Promise<T>): Promise<T | null> {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query error:', error)
    
    // During build time, database connection might not be available
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
      console.warn('Database connection not available during build, returning null')
      return null
    }
    
    // In production runtime, return null instead of throwing to prevent crashes
    if (process.env.NODE_ENV === 'production') {
      console.warn('Database connection failed in production, returning null')
      return null
    }
    
    // In development, throw the error for debugging
    throw new Error(`Failed to execute database query: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export interface StageAnalytics {
  stageId: string
  stageName: string
  stageOrder: number
  currentItemCount: number
  averageTimeInStage: number | null // in hours
  items: Array<{
    id: string
    title: string
    timeInStage: number // in hours
    enteredAt: Date
    person?: { name: string; email: string | null } | null
    organization?: { name: string } | null
  }>
}

export interface PipelineReport {
  pipelineId: string
  pipelineName: string
  totalItems: number
  stages: StageAnalytics[]
  createdAt: Date
  updatedAt: Date
}

export async function getPipelinesForReports() {
  const result = await safeDbQuery(async () => {
    return await prisma.pipeline.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            stages: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  })
  
  // Return empty array if database is not available
  return result || []
}

export async function getPipelineReport(pipelineId: string): Promise<PipelineReport | null> {
  const pipeline = await prisma.pipeline.findUnique({
    where: { id: pipelineId },
    include: {
      stages: {
        orderBy: { order: 'asc' },
        include: {
          items: {
            include: {
              person: { select: { name: true, email: true } },
              organization: { select: { name: true } }
            }
          }
        }
      }
    }
  })

  if (!pipeline) {
    return null
  }

  const stageAnalytics: StageAnalytics[] = []

  for (const stage of pipeline.stages) {
    // Get current stage history for each item
    const currentItems = await Promise.all(
      stage.items.map(async (item) => {
        const currentHistory = await prisma.pipelineItemStageHistory.findFirst({
          where: {
            pipelineItemId: item.id,
            leftAt: null // Current stage only
          },
          orderBy: { enteredAt: 'desc' }
        })

        const enteredAt = currentHistory ? new Date(currentHistory.enteredAt) : new Date()
        const timeInStage = currentHistory 
          ? (new Date().getTime() - enteredAt.getTime()) / (1000 * 60 * 60) // Convert to hours
          : 0

        return {
          id: item.id,
          title: item.title,
          timeInStage,
          enteredAt,
          person: item.person,
          organization: item.organization
        }
      })
    )

    // Calculate average time for completed entries in this stage
    const completedHistories = await prisma.pipelineItemStageHistory.findMany({
      where: {
        stageId: stage.id,
        leftAt: { not: null } // Only completed stage entries
      }
    })

    let averageTimeInStage: number | null = null
    
    if (completedHistories.length > 0) {
      const completedTimes = completedHistories.map(history => {
        const enteredAt = new Date(history.enteredAt)
        const leftAt = new Date(history.leftAt!)
        return (leftAt.getTime() - enteredAt.getTime()) / (1000 * 60 * 60) // Convert to hours
      })

      averageTimeInStage = completedTimes.reduce((sum, time) => sum + time, 0) / completedTimes.length
    }

    stageAnalytics.push({
      stageId: stage.id,
      stageName: stage.name,
      stageOrder: stage.order,
      currentItemCount: currentItems.length,
      averageTimeInStage,
      items: currentItems
    })
  }

  return {
    pipelineId: pipeline.id,
    pipelineName: pipeline.name,
    totalItems: stageAnalytics.reduce((sum, stage) => sum + stage.currentItemCount, 0),
    stages: stageAnalytics,
    createdAt: pipeline.createdAt,
    updatedAt: pipeline.updatedAt
  }
}

export async function getPipelineVelocityReport() {
  // Get overall pipeline velocity metrics
  const result = await prisma.$queryRaw<Array<{
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

  return result
}

// Legacy function for backward compatibility
export async function getMobilizationReport() {
  const pipelines = await getPipelinesForReports()
  if (pipelines.length === 0) {
    return null
  }
  
  // Return report for the first pipeline
  return await getPipelineReport(pipelines[0].id)
}
