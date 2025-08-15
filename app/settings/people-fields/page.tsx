import Link from 'next/link'
import { getCustomFieldSections } from '../../actions/custom-fields'
import { AddSectionForm } from '../../components/settings/AddSectionForm'
import { SectionList } from '../../components/settings/SectionList'

export default async function PeopleFieldsPage() {
  const sections = await getCustomFieldSections('person')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link 
            href="/settings" 
            className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
          >
            ← Back to Settings
          </Link>
          <h1 className="text-3xl font-bold">People Custom Fields</h1>
          <p className="text-gray-600">
            Manage sections and custom fields for people profiles
          </p>
        </div>
        <AddSectionForm entityType="person" />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Custom Sections Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first custom section to start adding custom fields to people profiles.
            </p>
            <AddSectionForm entityType="person" />
          </div>
        ) : (
          <SectionList sections={sections} entityType="person" />
        )}
      </div>

      {/* Info Panel */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">About Custom Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Sections</h4>
            <ul className="space-y-1">
              <li>• Group related fields together</li>
              <li>• Organize information logically</li>
              <li>• Control field visibility and order</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Field Types</h4>
            <ul className="space-y-1">
              <li>• Text, Email, Phone, Number</li>
              <li>• Date, URL, Text Area</li>
              <li>• Single/Multi Select dropdowns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

