'use client'

import { useState } from 'react'
import { deleteOrganization } from '../../actions/organizations'

interface DeleteOrganizationButtonProps {
  organizationId: string
}

export function DeleteOrganizationButton({ organizationId }: DeleteOrganizationButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteOrganization(organizationId)
    } catch (error) {
      alert('Failed to delete organization')
    }
  }

  if (showConfirm) {
    return (
      <div className="space-x-2">
        <span className="text-sm text-gray-600">Are you sure?</span>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
    >
      Delete Organization
    </button>
  )
}
