import Link from 'next/link'
import { getPipelines } from '../actions/pipelines'
import { CreatePipelineForm } from '../components/pipelines/CreatePipelineForm'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

export default async function PipelinesPage() {
  const pipelines = await getPipelines()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pipelines</h1>
        <CreatePipelineForm />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pipelines.map((pipeline) => (
          <Link
            key={pipeline.id}
            href={`/pipelines/${pipeline.id}`}
            className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{pipeline.name}</h2>
            <p className="text-gray-600 text-sm">
              Created {new Date(pipeline.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>

      {pipelines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No pipelines found.</p>
        </div>
      )}
    </div>
  )
}
