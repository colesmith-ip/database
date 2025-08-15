'use client'

import { useState } from 'react'
import { createPipeline } from '../../actions/pipelines'

export function CreatePipelineForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stageNames, setStageNames] = useState(['Initial Contact', 'Application Process', 'Training & Preparation', 'Support Raising', 'Field Deployment'])

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      // Add stage names to form data
      stageNames.forEach((name, index) => {
        formData.append('stageNames', name)
      })

      await createPipeline(formData)
      setIsOpen(false)
      setStageNames(['Initial Contact', 'Application Process', 'Training & Preparation', 'Support Raising', 'Field Deployment']) // Reset to default
    } catch (error) {
      console.error('Failed to create pipeline:', error)
      alert(error instanceof Error ? error.message : 'Failed to create pipeline')
    } finally {
      setIsSubmitting(false)
    }
  }

  function addStage() {
    setStageNames([...stageNames, ''])
  }

  function removeStage(index: number) {
    if (stageNames.length > 1) {
      setStageNames(stageNames.filter((_, i) => i !== index))
    }
  }

  function updateStageName(index: number, name: string) {
    const newStageNames = [...stageNames]
    newStageNames[index] = name
    setStageNames(newStageNames)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
      >
        + Create Pipeline
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New Pipeline</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Pipeline Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Missionary Support Pipeline, Short-term Missions Pipeline"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Stages *
              </label>
              <button
                type="button"
                onClick={addStage}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Stage
              </button>
            </div>
            
            <div className="space-y-3">
              {stageNames.map((name, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateStageName(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Stage ${index + 1}`}
                      required
                    />
                  </div>
                  {stageNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStage(index)}
                      className="text-red-600 hover:text-red-800 px-2 py-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Stages will appear as columns in your Kanban board. You can reorder them later.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-900 mb-2">Pipeline Preview</h4>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {stageNames.map((name, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white border border-blue-300 rounded-md px-3 py-2 min-w-[120px]"
                >
                  <div className="font-medium text-blue-900 text-sm">{name || `Stage ${index + 1}`}</div>
                  <div className="text-xs text-blue-600">0 items</div>
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
              {isSubmitting ? 'Creating...' : 'Create Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

