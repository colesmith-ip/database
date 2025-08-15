import Link from 'next/link'
import { Task } from '@prisma/client'
import { TaskForm } from './TaskForm'
import { TaskStatusButton } from './TaskStatusButton'
import { DeleteTaskButton } from './DeleteTaskButton'

type TaskWithRelations = Task & {
  person?: { id: string; name: string; email: string } | null
  pipelineItem?: { id: string; title: string } | null
}

interface TasksListProps {
  tasks: TaskWithRelations[]
  title: string
  initialData?: {
    personId?: string
    pipelineItemId?: string
  }
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

export function TasksList({ tasks, title, initialData }: TasksListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <TaskForm initialData={initialData} />
        </div>
      </div>
      
      {tasks.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div key={task.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <TaskStatusButton taskId={task.id} currentStatus={task.status} />
                  </div>
                  
                  {task.notes && (
                    <p className="text-sm text-gray-600 mb-2">{task.notes}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Due: {formatDueDate(task.dueAt)}</span>
                    {task.ownerUserId && (
                      <span>Owner: {task.ownerUserId}</span>
                    )}
                    {task.person && !initialData?.personId && (
                      <Link 
                        href={`/people/${task.person.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        👤 {task.person.name}
                      </Link>
                    )}
                    {task.pipelineItem && !initialData?.pipelineItemId && (
                      <Link 
                        href={`/pipelines/${task.pipelineItem.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        📋 {task.pipelineItem.title}
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </Link>
                  <DeleteTaskButton taskId={task.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-8 text-center text-gray-500">
          No tasks yet. Create your first task above.
        </div>
      )}
    </div>
  )
}

