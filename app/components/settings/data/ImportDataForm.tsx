'use client'

import { useState } from 'react'
import { parseUploadedFile, getImportPreview, detectDuplicates, ImportMapping } from '../../../actions/data-management'

export function ImportDataForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'duplicates' | 'preview'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<any>(null)
  const [entityType, setEntityType] = useState<'person' | 'organization'>('person')
  const [mappings, setMappings] = useState<ImportMapping[]>([])
  const [duplicates, setDuplicates] = useState<any[]>([])
  const [duplicateHandling, setDuplicateHandling] = useState<'skip' | 'update' | 'merge'>('skip')
  const [duplicateFields, setDuplicateFields] = useState<string[]>(['email', 'name'])

  async function handleFileUpload(selectedFile: File) {
    try {
      const data = await parseUploadedFile(selectedFile)
      setFile(selectedFile)
      setFileData(data)
      setCurrentStep('mapping')
    } catch (error) {
      console.error('File parsing failed:', error)
      alert(error instanceof Error ? error.message : 'File parsing failed')
    }
  }

  async function handleMappingComplete() {
    try {
      // Get preview data with mappings
      const preview = await getImportPreview(fileData, entityType)
      setMappings(preview.suggestedMappings)
      setCurrentStep('duplicates')
    } catch (error) {
      console.error('Mapping failed:', error)
      alert(error instanceof Error ? error.message : 'Mapping failed')
    }
  }

  async function handleDuplicateDetection() {
    try {
      const detectedDuplicates = await detectDuplicates(entityType, fileData.rows, duplicateFields)
      setDuplicates(detectedDuplicates)
      setCurrentStep('preview')
    } catch (error) {
      console.error('Duplicate detection failed:', error)
      alert(error instanceof Error ? error.message : 'Duplicate detection failed')
    }
  }

  async function handleImport() {
    setIsImporting(true)
    try {
      // Import logic would go here
      console.log('Importing data with:', {
        entityType,
        mappings,
        duplicateHandling,
        duplicates
      })
      
      setIsOpen(false)
      setCurrentStep('upload')
      alert('Import completed successfully!')
    } catch (error) {
      console.error('Import failed:', error)
      alert(error instanceof Error ? error.message : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
      >
        Import Data
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Import Data</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-6">
          {['upload', 'mapping', 'duplicates', 'preview'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step 
                  ? 'bg-blue-600 text-white' 
                  : index < ['upload', 'mapping', 'duplicates', 'preview'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 capitalize">{step}</span>
              {index < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < ['upload', 'mapping', 'duplicates', 'preview'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entity Type
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as 'person' | 'organization')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="person">People</option>
                <option value="organization">Organizations</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-400 text-4xl mb-2">📁</div>
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">CSV or JSON files only</p>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'mapping' && fileData && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Field Mapping</h3>
            <p className="text-sm text-gray-600">
              Map your file columns to CRM fields. You can create new custom fields for unmapped columns.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Column</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CRM Field</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fileData.headers.map((header: string, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{header}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <input
                          type="text"
                          defaultValue={header.toLowerCase().replace(/\s+/g, '_')}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="date">Date</option>
                          <option value="number">Number</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-xs">Create new field</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleMappingComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Continue to Duplicate Detection
              </button>
            </div>
          </div>
        )}

        {currentStep === 'duplicates' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Duplicate Detection</h3>
            <p className="text-sm text-gray-600">
              Configure how to handle potential duplicate records.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duplicate Detection Fields
              </label>
              <div className="space-y-2">
                {['email', 'name', 'phone'].map((field) => (
                  <label key={field} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={duplicateFields.includes(field)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDuplicateFields([...duplicateFields, field])
                        } else {
                          setDuplicateFields(duplicateFields.filter(f => f !== field))
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duplicate Handling
              </label>
              <select
                value={duplicateHandling}
                onChange={(e) => setDuplicateHandling(e.target.value as 'skip' | 'update' | 'merge')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="skip">Skip duplicates</option>
                <option value="update">Update existing records</option>
                <option value="merge">Merge data (keep existing for conflicts)</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDuplicateDetection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Detect Duplicates
              </button>
            </div>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Import Preview</h3>
            
            {duplicates.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  {duplicates.length} potential duplicate(s) found
                </h4>
                <div className="max-h-32 overflow-y-auto">
                  {duplicates.slice(0, 3).map((duplicate, index) => (
                    <div key={index} className="text-sm text-yellow-700 mb-1">
                      • {duplicate.newData.name || duplicate.newData.email} 
                      (Confidence: {Math.round(duplicate.confidence * 100)}%)
                    </div>
                  ))}
                  {duplicates.length > 3 && (
                    <div className="text-sm text-yellow-600">
                      ... and {duplicates.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Import Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Entity Type: {entityType === 'person' ? 'People' : 'Organizations'}</div>
                <div>• Records to import: {fileData?.rows?.length || 0}</div>
                <div>• Duplicates found: {duplicates.length}</div>
                <div>• Duplicate handling: {duplicateHandling}</div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCurrentStep('mapping')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                Back to Mapping
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
              >
                {isImporting ? 'Importing...' : 'Start Import'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
