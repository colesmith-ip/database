import Link from 'next/link'
import { getTasks, getTaskStatuses, updateTaskStatus, deleteTask } from '../actions/tasks'
import { TaskFilters } from '../actions/tasks'
import { TaskForm } from '../components/tasks/TaskForm'
import { TaskFiltersForm } from '../components/tasks/TaskFiltersForm'
import { TaskStatusButton } from '../components/tasks/TaskStatusButton'
import { DeleteTaskButton } from '../components/tasks/DeleteTaskButton'
import { Pagination } from '../components/ui/Pagination'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'

interface TasksPageProps {
  searchParams: {
    page?: string
    status?: string
    ownerUserId?: string
    dueBefore?: string
    dueAfter?: string
    personId?: string
    pipelineItemId?: string
  }
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const page = parseInt(searchParams.page || '1')
  
  const filters: TaskFilters = {
    status: searchParams.status,
    ownerUserId: searchParams.ownerUserId,
    dueBefore: searchParams.dueBefore ? new Date(searchParams.dueBefore) : undefined,
    dueAfter: searchParams.dueAfter ? new Date(searchParams.dueAfter) : undefined,
    personId: searchParams.personId,
    pipelineItemId: searchParams.pipelineItemId
  }

  const { tasks, total, pages, currentPage } = await getTasks(filters, page)
  const statuses = await getTaskStatuses()

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-600">
            {total} total tasks
          </p>
        </div>
        <TaskForm />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <TaskFiltersForm currentFilters={filters} statuses={statuses} />
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Related To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        <Link 
                          href={`/tasks/${task.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {task.title}
                        </Link>
                      </div>
                      {task.notes && (
                        <div className="text-sm text-gray-500 mt-1">{task.notes}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDueDate(task.dueAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      {task.person && (
                        <div>
                          <Link 
                            href={`/people/${task.person.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            👤 {task.person.name}
                          </Link>
                        </div>
                      )}
                      {task.pipelineItem && (
                        <div>
                          <Link 
                            href={`/pipelines/${task.pipelineItem.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            📋 {task.pipelineItem.title}
                          </Link>
                        </div>
                      )}
                      {!task.person && !task.pipelineItem && (
                        <span className="text-gray-400">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.ownerUserId || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <TaskStatusButton taskId={task.id} currentStatus={task.status} />
                      <Link
                        href={`/tasks/${task.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <DeleteTaskButton taskId={task.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tasks.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No tasks found. Create your first task above.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-6">
          <Pagination 
            currentPage={currentPage} 
            totalPages={pages} 
            baseUrl="/tasks"
          />
        </div>
      )}
    </div>
  )
}
