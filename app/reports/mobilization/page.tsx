import Link from 'next/link'
import { getMobilizationReport } from '../../actions/reports'

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

export default async function MobilizationReportPage() {
  const report = await getMobilizationReport()

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mobilization Report</h1>
        <p className="text-gray-500">No pipeline data available.</p>
      </div>
    )
  }

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
          <h1 className="text-3xl font-bold">Mobilization Report</h1>
          <p className="text-gray-600">
            {report.pipelineName} • {report.totalItems} total items
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {report.stages.map((stage) => (
          <div key={stage.stageId} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{stage.stageName}</h3>
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
              <h2 className="text-xl font-semibold">{stage.stageName}</h2>
              <p className="text-gray-600">
                {stage.currentItemCount} items
                {stage.averageTimeInStage !== null && (
                  <span> • Average time: {formatHours(stage.averageTimeInStage)}</span>
                )}
              </p>
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
                          <div className="font-medium text-gray-900">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.timeInStage > 72 // More than 3 days
                              ? 'bg-red-100 text-red-800'
                              : item.timeInStage > 24 // More than 1 day
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {formatHours(item.timeInStage)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.enteredAt).toLocaleDateString()} {new Date(item.enteredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No items in this stage
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link 
          href="/pipelines" 
          className="text-blue-500 hover:text-blue-600"
        >
          Back to Pipelines
        </Link>
      </div>
    </div>
  )
}

