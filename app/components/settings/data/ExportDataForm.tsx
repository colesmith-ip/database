'use client'

import { useState } from 'react'
import { exportData, getAvailableFields } from '../../../actions/data-management'

export function ExportDataForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedEntities, setSelectedEntities] = useState<string[]>(['people'])
  const [includeCustomFields, setIncludeCustomFields] = useState(true)
  const [includeRelatedData, setIncludeRelatedData] = useState(false)
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [customFields, setCustomFields] = useState<string[]>([])

  const entities = [
    { value: 'people', label: 'People' },
    { value: 'organizations', label: 'Organizations' },
    { value: 'pipelines', label: 'Pipelines' },
    { value: 'tasks', label: 'Tasks' }
  ]

  async function handleExport() {
    setIsExporting(true)
    try {
      const data = await exportData({
        entities: selectedEntities,
        includeCustomFields,
        includeRelatedData,
        format,
        customFields
      })

      // Create and download file
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `crm-export-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
      >
        Export Data
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Export Data</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Entity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Entities to Export
            </label>
            <div className="space-y-2">
              {entities.map((entity) => (
                <label key={entity.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedEntities.includes(entity.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEntities([...selectedEntities, entity.value])
                      } else {
                        setSelectedEntities(selectedEntities.filter(e => e !== entity.value))
                      }
                    }}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{entity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'csv' | 'json')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="csv">CSV (Spreadsheet compatible)</option>
              <option value="json">JSON (Structured data)</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCustomFields}
                onChange={(e) => setIncludeCustomFields(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include custom fields</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeRelatedData}
                onChange={(e) => setIncludeRelatedData(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include related data (organizations, relationships, etc.)</span>
            </label>
          </div>

          {/* Custom Fields Selection (if enabled) */}
          {includeCustomFields && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Custom Fields
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Leave empty to include all custom fields
              </p>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                {/* This would be populated with actual custom fields */}
                <p className="text-sm text-gray-500">Custom fields will be loaded here...</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || selectedEntities.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md font-medium"
            >
              {isExporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

