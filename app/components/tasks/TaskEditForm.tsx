'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateTask } from '../../actions/tasks'
import { Task } from '@prisma/client'
import Link from 'next/link'

type TaskWithRelations = Task & {
  person?: { id: string; name: string; email: string } | null
  pipelineItem?: { id: string; title: string } | null
}

interface TaskEditFormProps {
  task: TaskWithRelations
}

export function TaskEditForm({ task }: TaskEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await updateTask(task.id, formData)
      router.push('/tasks')
      router.refresh()
    } catch (error) {
      console.error('Failed to update task:', error)
      alert(error instanceof Error ? error.message : 'Failed to update task')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date for datetime-local input
  function formatDateForInput(date: Date | null) {
    if (!date) return ''
    return new Date(date).toISOString().slice(0, 16)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={task.title}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={task.notes || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any additional notes..."
        />
      </div>

      <div>
        <label htmlFor="ownerUserId" className="block text-sm font-medium text-gray-700 mb-1">
          Owner
        </label>
        <input
          type="text"
          id="ownerUserId"
          name="ownerUserId"
          defaultValue={task.ownerUserId || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter owner ID"
        />
      </div>

      <div>
        <label htmlFor="dueAt" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueAt"
          name="dueAt"
          defaultValue={formatDateForInput(task.dueAt)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={task.status}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="deferred">Deferred</option>
        </select>
      </div>

      <div>
        <label htmlFor="personId" className="block text-sm font-medium text-gray-700 mb-1">
          Related Person ID
        </label>
        <input
          type="text"
          id="personId"
          name="personId"
          defaultValue={task.personId || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter person ID (optional)"
        />
        {task.person && (
          <p className="text-sm text-gray-500 mt-1">
            Currently linked to: {task.person.name} ({task.person.email})
          </p>
        )}
      </div>

      <div>
        <label htmlFor="pipelineItemId" className="block text-sm font-medium text-gray-700 mb-1">
          Related Pipeline Item ID
        </label>
        <input
          type="text"
          id="pipelineItemId"
          name="pipelineItemId"
          defaultValue={task.pipelineItemId || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter pipeline item ID (optional)"
        />
        {task.pipelineItem && (
          <p className="text-sm text-gray-500 mt-1">
            Currently linked to: {task.pipelineItem.title}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Link
          href="/tasks"
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
        >
          {isSubmitting ? 'Updating...' : 'Update Task'}
        </button>
      </div>
    </form>
  )
}
