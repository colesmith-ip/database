'use client'

import { useState } from 'react'
import { deleteTask } from '../../actions/tasks'

interface DeleteTaskButtonProps {
  taskId: string
}

export function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
      alert('Failed to delete task')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
