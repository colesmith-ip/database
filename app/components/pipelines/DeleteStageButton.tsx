'use client'

import { useState } from 'react'
import { deleteStage } from '../../actions/pipelines'

interface DeleteStageButtonProps {
  stageId: string
  stageName: string
  itemCount: number
}

export function DeleteStageButton({ stageId, stageName, itemCount }: DeleteStageButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (itemCount > 0) {
      alert(`Cannot delete stage "${stageName}" because it contains ${itemCount} items. Please move or delete the items first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete the stage "${stageName}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteStage(stageId)
    } catch (error) {
      console.error('Failed to delete stage:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete stage')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || itemCount > 0}
      className={`text-xs px-2 py-1 rounded ${
        itemCount > 0
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-red-600 hover:text-red-800 hover:bg-red-50'
      }`}
      title={
        itemCount > 0
          ? `Cannot delete stage with ${itemCount} items`
          : 'Delete this stage'
      }
    >
      {isDeleting ? 'Deleting...' : '🗑️'}
    </button>
  )
}

