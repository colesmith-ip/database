import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPipelineWithItems } from '../../actions/pipelines'
import { KanbanBoard } from '../../components/pipelines/KanbanBoard'
import { StageRulesSection } from '../../components/pipelines/StageRulesSection'
import { AddStageForm } from '../../components/pipelines/AddStageForm'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

// Prevent static generation of dynamic routes
export async function generateStaticParams() {
  return []
}

export default async function PipelinePage({
  params
}: {
  params: { pipelineId: string }
}) {
  const pipeline = await getPipelineWithItems(params.pipelineId)

  if (!pipeline) {
    notFound()
  }

  const totalItems = pipeline.stages.reduce((total, stage) => total + stage.items.length, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href="/pipelines" 
            className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
          >
            ← Back to Pipelines
          </Link>
          <h1 className="text-3xl font-bold">{pipeline.name}</h1>
          <p className="text-gray-600">
            {pipeline.stages.length} stages • {totalItems} items
          </p>
        </div>
                  <div className="flex items-center space-x-3">
            <AddStageForm 
              pipelineId={pipeline.id} 
              currentStages={pipeline.stages.map(s => ({ id: s.id, name: s.name, order: s.order }))} 
            />
                             <Link
                   href={`/reports/pipeline/${pipeline.id}`}
                   className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm"
                 >
                   📊 View Report
                 </Link>
          </div>
      </div>

      {/* Stage Rules */}
      <div className="mb-6">
        <StageRulesSection stages={pipeline.stages} pipelineId={pipeline.id} />
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <KanbanBoard stages={pipeline.stages} pipelineId={pipeline.id} />
      </div>
    </div>
  )
}
