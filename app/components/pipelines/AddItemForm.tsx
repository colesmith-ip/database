'use client'

import { useState } from 'react'
import { createPipelineItem, getAllPeopleAndOrganizations } from '../../actions/pipelines'

interface AddItemFormProps {
  stageId: string
  pipelineId: string
}

export function AddItemForm({ stageId, pipelineId }: AddItemFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [peopleAndOrgs, setPeopleAndOrgs] = useState<{
    people: Array<{ id: string; name: string; email: string | null }>
    organizations: Array<{ id: string; name: string }>
  } | null>(null)

  const handleToggle = async () => {
    if (!isOpen && !peopleAndOrgs) {
      // Load people and organizations when opening form for first time
      try {
        const data = await getAllPeopleAndOrganizations()
        setPeopleAndOrgs(data)
      } catch (error) {
        console.error('Failed to load people and organizations:', error)
      }
    }
    setIsOpen(!isOpen)
    setError(null)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      await createPipelineItem(formData)
      setIsOpen(false)
      // Form will be reset by page revalidation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleToggle}
        className="w-full mb-4 px-3 py-2 text-sm text-gray-600 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Add Item
      </button>
    )
  }

  return (
    <div className="mb-4 bg-white rounded-lg border border-gray-200 p-3">
      <h4 className="font-medium text-gray-900 mb-3 text-sm">Add New Item</h4>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-3">
        <input type="hidden" name="stageId" value={stageId} />
        
        <div>
          <input
            type="text"
            name="title"
            placeholder="Item title..."
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            name="personId"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select person (optional)</option>
            {peopleAndOrgs?.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} {person.email && `(${person.email})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            name="organizationId"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select organization (optional)</option>
            {peopleAndOrgs?.organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
          <button
            type="button"
            onClick={handleToggle}
            className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

