'use client'

import { useState } from 'react'
import { updateTaskStatus } from '../../actions/tasks'

interface TaskStatusButtonProps {
  taskId: string
  currentStatus: string
}

export function TaskStatusButton({ taskId, currentStatus }: TaskStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'deferred', label: 'Deferred', color: 'bg-yellow-100 text-yellow-800' }
  ]

  const currentOption = statusOptions.find(option => option.value === currentStatus)

  async function handleStatusUpdate(newStatus: string) {
    if (newStatus === currentStatus) {
      setIsOpen(false)
      return
    }

    setIsUpdating(true)
    try {
      await updateTaskStatus(taskId, newStatus)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update task status:', error)
      alert('Failed to update task status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${currentOption?.color} hover:opacity-80 disabled:opacity-50`}
      >
        {isUpdating ? 'Updating...' : currentOption?.label || currentStatus}
        <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusUpdate(option.value)}
                disabled={isUpdating}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 ${
                  option.value === currentStatus ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
