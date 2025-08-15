import Link from 'next/link'
import { getPipelinesForReports, getPipelineVelocityReport } from '../actions/reports'

function formatHours(hours: number | null): string {
  if (hours === null || hours === undefined) {
    return 'N/A'
  }
  
  if (hours < 1) {
    return '<1h'
  } else if (hours < 24) {
    return `${Math.round(hours)}h`
  } else {
    const days = Math.floor(hours / 24)
    const remainingHours = Math.round(hours % 24)
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
  }
}

export default async function ReportsPage() {
  const [pipelines, velocityReport] = await Promise.all([
    getPipelinesForReports(),
    getPipelineVelocityReport()
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Analyze pipeline performance and item movement across all your workflows
        </p>
      </div>

      {/* Pipeline Velocity Overview */}
      {velocityReport.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pipeline Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {velocityReport.map((pipeline) => (
              <div key={pipeline.pipelineId} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{pipeline.pipelineName}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Items:</span>
                    <span className="font-medium">{pipeline.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Time:</span>
                    <span className="font-medium">{formatHours(pipeline.avgTimeInPipeline)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline Reports */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Detailed Pipeline Reports</h2>
        {pipelines.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">No pipelines found.</p>
            <Link
              href="/pipelines"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Create Your First Pipeline
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelines.map((pipeline) => (
              <Link
                key={pipeline.id}
                href={`/reports/pipeline/${pipeline.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-900">{pipeline.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {pipeline._count.stages} stages
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Created: {new Date(pipeline.createdAt).toLocaleDateString()}</div>
                  <div>Last updated: {new Date(pipeline.updatedAt).toLocaleDateString()}</div>
                </div>
                <div className="mt-4 text-blue-600 font-medium text-sm">
                  View detailed report →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/pipelines"
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium"
          >
            Manage Pipelines
          </Link>
          <Link
            href="/tasks"
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium"
          >
            View Tasks
          </Link>
          <Link
            href="/people"
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium"
          >
            People Overview
          </Link>
        </div>
      </div>
    </div>
  )
}

