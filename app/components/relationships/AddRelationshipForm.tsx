'use client'

import { useState } from 'react'
import { Person } from '@prisma/client'
import { createRelationship } from '../../actions/relationships'

interface AddRelationshipFormProps {
  currentPersonId: string
  allPeople: Person[]
  relationshipTypes: string[]
}

export function AddRelationshipForm({ currentPersonId, allPeople, relationshipTypes }: AddRelationshipFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter out the current person from the list
  const otherPeople = allPeople.filter(person => person.id !== currentPersonId)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      await createRelationship(formData)
      setIsOpen(false)
      // Form will be reset by the page revalidation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create relationship')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        + Add Relationship
      </button>
    )
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium mb-3">Add New Relationship</h4>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-3">
        <input type="hidden" name="fromPersonId" value={currentPersonId} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship Type
          </label>
          <select
            name="type"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select relationship type...</option>
            {relationshipTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Connect To
          </label>
          <select
            name="toPersonId"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select person...</option>
            {otherPeople.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} {person.email && `(${person.email})`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {isSubmitting ? 'Adding...' : 'Add Relationship'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setError(null)
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
