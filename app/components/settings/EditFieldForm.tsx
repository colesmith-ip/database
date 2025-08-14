'use client'

import { useState } from 'react'
import { updateCustomField } from '../../actions/custom-fields'
import { FIELD_TYPES } from '../../lib/constants'

interface Field {
  id: string
  name: string
  label: string
  type: string
  required: boolean
  options: any
  defaultValue: string | null
  order: number
  isActive: boolean
}

interface EditFieldFormProps {
  field: Field
}

export function EditFieldForm({ field }: EditFieldFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldType, setFieldType] = useState(field.type)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await updateCustomField(field.id, formData)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update field:', error)
      alert(error instanceof Error ? error.message : 'Failed to update field')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-600 hover:text-gray-800"
        title="Edit field"
      >
        ✏️
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Field</h2>
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
              Field Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={field.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Used internally (no spaces, lowercase)</p>
          </div>

          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
              Display Label *
            </label>
            <input
              type="text"
              id="label"
              name="label"
              required
              defaultValue={field.label}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Shown to users</p>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Field Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FIELD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {(fieldType === 'select' || fieldType === 'multiselect') && (
            <div>
              <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-1">
                Options *
              </label>
              <textarea
                id="options"
                name="options"
                required
                rows={4}
                defaultValue={field.options ? JSON.stringify(field.options, null, 2) : ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='["Option 1", "Option 2", "Option 3"]'
              />
              <p className="text-xs text-gray-500 mt-1">JSON array of options</p>
            </div>
          )}

          <div>
            <label htmlFor="defaultValue" className="block text-sm font-medium text-gray-700 mb-1">
              Default Value
            </label>
            <input
              type="text"
              id="defaultValue"
              name="defaultValue"
              defaultValue={field.defaultValue || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional default value"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              name="required"
              value="true"
              defaultChecked={field.required}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
              Required field
            </label>
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
              {isSubmitting ? 'Updating...' : 'Update Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
