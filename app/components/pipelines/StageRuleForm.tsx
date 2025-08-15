'use client'

import { useState } from 'react'
import { createStageRule, updateStageRule, deleteStageRule, getStageRule } from '../../actions/stage-rules'

interface StageRuleFormProps {
  stageId: string
  stageName: string
  pipelineId: string
}

export function StageRuleForm({ stageId, stageName, pipelineId }: StageRuleFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingRule, setExistingRule] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function loadExistingRule() {
    setIsLoading(true)
    try {
      const rule = await getStageRule(stageId)
      setExistingRule(rule)
    } catch (error) {
      console.error('Failed to load stage rule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      if (existingRule) {
        await updateStageRule(stageId, formData)
      } else {
        await createStageRule(formData)
      }
      setIsOpen(false)
      setExistingRule(null)
    } catch (error) {
      console.error('Failed to save stage rule:', error)
      alert(error instanceof Error ? error.message : 'Failed to save stage rule')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!existingRule) return

    if (!confirm('Are you sure you want to delete this stage rule?')) {
      return
    }

    setIsSubmitting(true)
    try {
      await deleteStageRule(stageId)
      setIsOpen(false)
      setExistingRule(null)
    } catch (error) {
      console.error('Failed to delete stage rule:', error)
      alert('Failed to delete stage rule')
    } finally {
      setIsSubmitting(false)
    }
  }

  function openForm() {
    setIsOpen(true)
    loadExistingRule()
  }

  if (!isOpen) {
    return (
      <button
        onClick={openForm}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        {existingRule ? 'Edit Rule' : 'Add Rule'}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {existingRule ? 'Edit Stage Rule' : 'Add Stage Rule'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="stageId" value={stageId} />

            <div>
              <label htmlFor="templateTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Task Template Title *
              </label>
              <input
                type="text"
                id="templateTitle"
                name="templateTitle"
                defaultValue={existingRule?.templateTitle || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Follow up on proposal"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be the title of the auto-created task
              </p>
            </div>

            <div>
              <label htmlFor="offsetDays" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date Offset (days) *
              </label>
              <input
                type="number"
                id="offsetDays"
                name="offsetDays"
                defaultValue={existingRule?.offsetDays || 3}
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Task will be due this many days after entering the stage
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>Rule for:</strong> {stageName}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                When an item enters this stage, a task will be automatically created with the specified title and due date.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {existingRule && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              )}
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
                {isSubmitting ? 'Saving...' : (existingRule ? 'Update Rule' : 'Create Rule')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

