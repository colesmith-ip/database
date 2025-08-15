'use client'

import { useState } from 'react'
import { deleteRelationship } from '../../actions/relationships'

interface DeleteRelationshipButtonProps {
  relationshipId: string
  personId: string
}

export function DeleteRelationshipButton({ 
  relationshipId, 
  personId 
}: DeleteRelationshipButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this relationship?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteRelationship(relationshipId, personId)
    } catch (error) {
      alert('Failed to delete relationship')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 disabled:text-red-300 text-sm"
      title="Remove relationship"
    >
      {isDeleting ? 'Removing...' : '✕'}
    </button>
  )
}

