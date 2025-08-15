'use client'

import { useState } from 'react'
import { deleteCustomField } from '../../actions/custom-fields'

interface DeleteFieldButtonProps {
  fieldId: string
  fieldName: string
}

export function DeleteFieldButton({ fieldId, fieldName }: DeleteFieldButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete the field "${fieldName}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteCustomField(fieldId)
    } catch (error) {
      console.error('Failed to delete field:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete field')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm text-red-600 hover:text-red-800 disabled:text-red-400"
      title="Delete field"
    >
      {isDeleting ? '🗑️...' : '🗑️'}
    </button>
  )
}

