import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTask } from '../../../actions/tasks'
import { TaskEditForm } from '../../../components/tasks/TaskEditForm'

export default async function TaskEditPage({
  params
}: {
  params: { id: string }
}) {
  const task = await getTask(params.id)

  if (!task) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/tasks"
          className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
        >
          ← Back to Tasks
        </Link>
        <h1 className="text-3xl font-bold">Edit Task</h1>
        <p className="text-gray-600">Update task details</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <TaskEditForm task={task} />
        </div>
      </div>
    </div>
  )
}
