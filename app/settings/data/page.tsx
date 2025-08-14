import Link from 'next/link'
import { ExportDataForm } from '../../components/settings/data/ExportDataForm'
import { ImportDataForm } from '../../components/settings/data/ImportDataForm'

export default function DataManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/settings" 
          className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
        >
          ← Back to Settings
        </Link>
        <h1 className="text-3xl font-bold">Data Management</h1>
        <p className="text-gray-600 mt-2">
          Import, export, and manage your CRM data with custom field support
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Data */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 text-xl">📤</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
              <p className="text-sm text-gray-600">Export your data with custom field support</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Choose which entities to export (People, Organizations, etc.)
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Select custom fields to include as columns
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Export in CSV or JSON format
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Include related data (organizations, relationships, etc.)
            </div>
          </div>

          <ExportDataForm />
        </div>

        {/* Import Data */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 text-xl">📥</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Import Data</h2>
              <p className="text-sm text-gray-600">Import data with smart field mapping</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Upload CSV or JSON files
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Map columns to existing or new custom fields
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Detect and handle potential duplicates
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Preview data before importing
            </div>
          </div>

          <ImportDataForm />
        </div>
      </div>

      {/* Data Management Tools */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/settings/data/backup"
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="text-purple-600 text-lg mr-2">💾</span>
              <h4 className="font-medium text-gray-900">Backup & Restore</h4>
            </div>
            <p className="text-sm text-gray-600">Create and restore database backups</p>
          </Link>

          <Link
            href="/settings/data/cleanup"
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="text-orange-600 text-lg mr-2">🧹</span>
              <h4 className="font-medium text-gray-900">Data Cleanup</h4>
            </div>
            <p className="text-sm text-gray-600">Find and merge duplicate records</p>
          </Link>

          <Link
            href="/settings/data/analytics"
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="text-indigo-600 text-lg mr-2">📊</span>
              <h4 className="font-medium text-gray-900">Data Analytics</h4>
            </div>
            <p className="text-sm text-gray-600">Analyze data quality and completeness</p>
          </Link>
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Data Management Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Before Importing</h4>
            <ul className="space-y-1">
              <li>• Clean your source data</li>
              <li>• Ensure consistent formatting</li>
              <li>• Map fields carefully</li>
              <li>• Review duplicates before importing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Export Tips</h4>
            <ul className="space-y-1">
              <li>• Include custom fields for complete data</li>
              <li>• Export related data for context</li>
              <li>• Use CSV for spreadsheet compatibility</li>
              <li>• Use JSON for complex data structures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
