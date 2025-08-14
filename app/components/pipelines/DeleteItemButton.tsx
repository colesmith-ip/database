'use client'

import { useState } from 'react'
import { deletePipelineItem } from '../../actions/pipelines'

interface DeleteItemButtonProps {
  itemId: string
}

export function DeleteItemButton({ itemId }: DeleteItemButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering drag
    
    if (!confirm('Are you sure you want to delete this item?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deletePipelineItem(itemId)
    } catch (error) {
      alert('Failed to delete item')
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-500 disabled:text-gray-300 p-1"
      title="Delete item"
    >
      {isDeleting ? (
        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  )
}
