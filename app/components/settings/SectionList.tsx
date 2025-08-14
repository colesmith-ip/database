'use client'

import { useState } from 'react'
import { CustomFieldSectionWithFields } from '../../actions/custom-fields'
import { AddFieldForm } from './AddFieldForm'
import { EditSectionForm } from './EditSectionForm'
import { DeleteSectionButton } from './DeleteSectionButton'
import { FieldList } from './FieldList'

interface SectionListProps {
  sections: CustomFieldSectionWithFields[]
  entityType: 'person' | 'organization'
}

export function SectionList({ sections, entityType }: SectionListProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-lg border border-gray-200">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedSections.has(section.id) ? '▼' : '▶'}
                </button>
                <div>
                  <h3 className="font-semibold text-gray-900">{section.name}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-600">{section.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {section.customFields.length} fields
                </span>
                <AddFieldForm sectionId={section.id} />
                <EditSectionForm section={section} />
                <DeleteSectionButton sectionId={section.id} sectionName={section.name} />
              </div>
            </div>
          </div>

          {/* Section Content */}
          {expandedSections.has(section.id) && (
            <div className="px-6 py-4">
              <FieldList fields={section.customFields} sectionId={section.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
