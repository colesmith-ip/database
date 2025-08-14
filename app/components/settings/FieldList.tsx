'use client'

import { EditFieldForm } from './EditFieldForm'
import { DeleteFieldButton } from './DeleteFieldButton'

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

interface FieldListProps {
  fields: Field[]
  sectionId: string
}

export function FieldList({ fields, sectionId }: FieldListProps) {
  if (fields.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No custom fields in this section yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{field.label}</span>
              {field.required && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  Required
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-mono">{field.name}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{field.type}</span>
              {field.defaultValue && (
                <>
                  <span className="mx-2">•</span>
                  <span>Default: {field.defaultValue}</span>
                </>
              )}
            </div>
            {field.options && (
              <div className="text-xs text-gray-500 mt-1">
                Options: {Array.isArray(field.options) ? field.options.join(', ') : JSON.stringify(field.options)}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <EditFieldForm field={field} />
            <DeleteFieldButton fieldId={field.id} fieldName={field.label} />
          </div>
        </div>
      ))}
    </div>
  )
}
