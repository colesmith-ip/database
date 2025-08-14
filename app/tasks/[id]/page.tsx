import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTask } from '../../actions/tasks'
import { DeleteTaskButton } from '../../components/tasks/DeleteTaskButton'
import { TaskStatusButton } from '../../components/tasks/TaskStatusButton'

export default async function TaskDetailPage({
  params
}: {
  params: { id: string }
}) {
  const task = await getTask(params.id)

  if (!task) {
    notFound()
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'deferred':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  function formatDueDate(dueAt: Date | null) {
    if (!dueAt) return 'No due date'
    
    const now = new Date()
    const due = new Date(dueAt)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return <span className="text-red-600 font-medium">Overdue ({Math.abs(diffDays)} days)</span>
    } else if (diffDays === 0) {
      return <span className="text-orange-600 font-medium">Due today</span>
    } else if (diffDays === 1) {
      return <span className="text-orange-600 font-medium">Due tomorrow</span>
    } else if (diffDays <= 7) {
      return <span className="text-yellow-600 font-medium">Due in {diffDays} days</span>
    } else {
      return due.toLocaleDateString()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/tasks"
            className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
          >
            ← Back to Tasks
          </Link>
          <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <TaskStatusButton taskId={task.id} currentStatus={task.status} />
          <Link
            href={`/tasks/${task.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Edit
          </Link>
          <DeleteTaskButton taskId={task.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Task Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <div className="mt-1 text-gray-900">
                  {formatDueDate(task.dueAt)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Owner</label>
                <div className="mt-1 text-gray-900">
                  {task.ownerUserId || 'Unassigned'}
                </div>
              </div>

              {task.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <div className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {task.notes}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <div className="mt-1 text-gray-900">
                  {new Date(task.createdAt).toLocaleDateString()} at {new Date(task.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <div className="mt-1 text-gray-900">
                  {new Date(task.updatedAt).toLocaleDateString()} at {new Date(task.updatedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Entities */}
        <div className="space-y-6">
          {task.person && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Related Person</h3>
              <div className="space-y-2">
                <Link
                  href={`/people/${task.person.id}`}
                  className="block text-blue-600 hover:text-blue-800 font-medium"
                >
                  {task.person.name}
                </Link>
                <p className="text-sm text-gray-600">{task.person.email}</p>
              </div>
            </div>
          )}

          {task.pipelineItem && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Related Pipeline Item</h3>
              <div>
                <Link
                  href={`/pipelines/${task.pipelineItem.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {task.pipelineItem.title}
                </Link>
              </div>
            </div>
          )}

          {!task.person && !task.pipelineItem && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Related Entities</h3>
              <p className="text-gray-500 text-sm">No related entities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
