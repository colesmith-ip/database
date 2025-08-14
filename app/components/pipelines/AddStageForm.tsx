'use client'

import { useState } from 'react'
import { addStage } from '../../actions/pipelines'

interface AddStageFormProps {
  pipelineId: string
  currentStages: Array<{ id: string; name: string; order: number }>
}

export function AddStageForm({ pipelineId, currentStages }: AddStageFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await addStage(pipelineId, formData)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to add stage:', error)
      alert(error instanceof Error ? error.message : 'Failed to add stage')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        + Add Stage
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Stage</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Stage Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Review, Approval, Closed"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <select
              id="position"
              name="position"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="start">At the beginning</option>
              {currentStages.map((stage, index) => (
                <option key={stage.id} value={index + 1}>
                  After "{stage.name}"
                </option>
              ))}
              <option value="end">At the end</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="font-medium text-blue-900 mb-2">Current Pipeline</h4>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {currentStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="flex-shrink-0 bg-white border border-blue-300 rounded-md px-3 py-2 min-w-[100px]"
                >
                  <div className="font-medium text-blue-900 text-sm">{stage.name}</div>
                  <div className="text-xs text-blue-600">{stage.items?.length || 0} items</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
            >
              {isSubmitting ? 'Adding...' : 'Add Stage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
