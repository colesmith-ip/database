'use client'

import { useState } from 'react'
import { deleteCustomFieldSection } from '../../actions/custom-fields'

interface DeleteSectionButtonProps {
  sectionId: string
  sectionName: string
}

export function DeleteSectionButton({ sectionId, sectionName }: DeleteSectionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete the section "${sectionName}"? This will also delete all custom fields in this section.`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteCustomFieldSection(sectionId)
    } catch (error) {
      console.error('Failed to delete section:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete section')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm text-red-600 hover:text-red-800 disabled:text-red-400"
      title="Delete section"
    >
      {isDeleting ? '🗑️...' : '🗑️'}
    </button>
  )
}
