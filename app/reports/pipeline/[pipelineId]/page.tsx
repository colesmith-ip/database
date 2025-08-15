import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPipelineReport } from '../../../actions/reports'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

function formatHours(hours: number): string {
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

function getTimeInStageColor(hours: number): string {
  if (hours < 24) {
    return 'text-green-600'
  } else if (hours < 72) {
    return 'text-yellow-600'
  } else {
    return 'text-red-600'
  }
}

export default async function PipelineReportPage({
  params
}: {
  params: { pipelineId: string }
}) {
  const report = await getPipelineReport(params.pipelineId)

  if (!report) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link 
            href="/reports" 
            className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
          >
            ← Back to Reports
          </Link>
          <h1 className="text-3xl font-bold">{report.pipelineName} Report</h1>
          <p className="text-gray-600">
            {report.totalItems} total items • {report.stages.length} stages
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(report.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <Link
          href={`/pipelines/${report.pipelineId}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
        >
          View Pipeline
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {report.stages.map((stage) => (
          <div key={stage.stageId} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{stage.stageName}</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                #{stage.stageOrder + 1}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">
                {stage.currentItemCount}
              </div>
              <div className="text-sm text-gray-500">
                items currently
              </div>
              {stage.averageTimeInStage !== null && (
                <div className="text-sm text-gray-600 mt-2">
                  Avg: {formatHours(stage.averageTimeInStage)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Stage Breakdown */}
      <div className="space-y-8">
        {report.stages.map((stage) => (
          <div key={stage.stageId} className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{stage.stageName}</h2>
                  <p className="text-gray-600">
                    {stage.currentItemCount} items
                    {stage.averageTimeInStage !== null && (
                      <span> • Average time: {formatHours(stage.averageTimeInStage)}</span>
                    )}
                  </p>
                </div>
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  Stage {stage.stageOrder + 1}
                </span>
              </div>
            </div>
            
            {stage.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Related To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time in Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entered At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stage.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.person && (
                              <div>
                                <span className="font-medium">{item.person.name}</span>
                                <div className="text-xs text-gray-500">{item.person.email}</div>
                              </div>
                            )}
                            {item.organization && (
                              <div>
                                <span className="font-medium">{item.organization.name}</span>
                              </div>
                            )}
                            {!item.person && !item.organization && (
                              <span className="text-gray-400">No related entity</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getTimeInStageColor(item.timeInStage)}`}>
                            {formatHours(item.timeInStage)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.enteredAt.toLocaleDateString()} at {item.enteredAt.toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No items currently in this stage
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pipeline Insights */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Pipeline Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-900">Total Items:</span>
            <span className="ml-2 text-blue-700">{report.totalItems}</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Active Stages:</span>
            <span className="ml-2 text-blue-700">
              {report.stages.filter(s => s.currentItemCount > 0).length} of {report.stages.length}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Average Time Data:</span>
            <span className="ml-2 text-blue-700">
              {report.stages.filter(s => s.averageTimeInStage !== null).length} stages
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

