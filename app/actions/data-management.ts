'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../lib/prisma'

export interface ExportOptions {
  entities: string[]
  includeCustomFields: boolean
  includeRelatedData: boolean
  format: 'csv' | 'json'
  customFields?: string[]
}

export interface ImportMapping {
  columnName: string
  fieldName: string
  fieldType: string
  isCustom: boolean
  createNewField?: boolean
  newFieldLabel?: string
}

export interface DuplicateRecord {
  existingId: string
  existingData: any
  newData: any
  confidence: number
  conflicts: string[]
}

// Get available fields for export/import
export async function getAvailableFields(entityType: 'person' | 'organization') {
  const baseFields = entityType === 'person' 
    ? ['id', 'name', 'email', 'phone', 'tags', 'customFields', 'ownerUserId', 'createdAt', 'updatedAt']
    : ['id', 'name', 'type', 'region', 'createdAt', 'updatedAt']

  const customFields = await prisma.customField.findMany({
    where: {
      section: {
        entityType
      },
      isActive: true
    },
    include: {
      section: true
    },
    orderBy: [
      { section: { order: 'asc' } },
      { order: 'asc' }
    ]
  })

  return {
    baseFields,
    customFields: customFields.map((field: any) => ({
      id: field.id,
      name: field.name,
      label: field.label,
      type: field.type,
      sectionName: field.section.name
    }))
  }
}

// Export data with custom fields
export async function exportData(options: ExportOptions) {
  const { entities, includeCustomFields, includeRelatedData, format } = options
  
  const exportData: any = {}

  for (const entity of entities) {
    if (entity === 'people') {
      const people = await prisma.person.findMany({
        include: includeRelatedData ? {
          organizations: {
            include: {
              organization: true
            }
          }
        } : undefined
      })
      exportData.people = people
    }

    if (entity === 'organizations') {
      const organizations = await prisma.organization.findMany({
        include: includeRelatedData ? {
          people: {
            include: {
              person: true
            }
          }
        } : undefined
      })
      exportData.organizations = organizations
    }
  }

  if (format === 'csv') {
    return convertToCSV(exportData)
  } else {
    return JSON.stringify(exportData, null, 2)
  }
}

// Convert data to CSV format
function convertToCSV(data: any) {
  // Simple CSV conversion
  const csvRows: string[] = []
  
  for (const [entityType, records] of Object.entries(data)) {
    if (Array.isArray(records) && records.length > 0) {
      const headers = Object.keys(records[0])
      csvRows.push(`${entityType.toUpperCase()}`)
      csvRows.push(headers.join(','))
      
      for (const record of records) {
        const values = headers.map(header => {
          const value = record[header]
          return typeof value === 'string' ? `"${value}"` : value
        })
        csvRows.push(values.join(','))
      }
      csvRows.push('') // Empty line between entities
    }
  }
  
  return csvRows.join('\n')
}

// Parse uploaded file
export async function parseUploadedFile(file: File) {
  const text = await file.text()
  
  if (file.name.endsWith('.csv')) {
    return parseCSV(text)
  } else if (file.name.endsWith('.json')) {
    return JSON.parse(text)
  } else {
    throw new Error('Unsupported file format. Please upload CSV or JSON files.')
  }
}

// Parse CSV content
function parseCSV(csvText: string) {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const rows = lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    return row
  })
  
  return { headers, rows }
}

// Detect potential duplicates
export async function detectDuplicates(
  entityType: 'person' | 'organization', 
  data: any[], 
  duplicateFields: string[]
) {
  const duplicates: DuplicateRecord[] = []

  for (const newRecord of data) {
    const whereClause: any = {}
    
    for (const field of duplicateFields) {
      if (newRecord[field]) {
        whereClause[field] = newRecord[field]
      }
    }

    if (Object.keys(whereClause).length > 0) {
      let existing: any = null
      if (entityType === 'person') {
        existing = await prisma.person.findFirst({
          where: whereClause
        })
      } else if (entityType === 'organization') {
        existing = await prisma.organization.findFirst({
          where: whereClause
        })
      }

      if (existing) {
        const conflicts = findConflicts(existing, newRecord, duplicateFields)
        const confidence = calculateConfidence(existing, newRecord, duplicateFields)
        
        duplicates.push({
          existingId: existing.id,
          existingData: existing,
          newData: newRecord,
          confidence,
          conflicts
        })
      }
    }
  }

  return duplicates
}

// Find conflicts between existing and new data
function findConflicts(existing: any, newData: any, fields: string[]) {
  const conflicts: string[] = []
  
  for (const field of fields) {
    if (existing[field] && newData[field] && existing[field] !== newData[field]) {
      conflicts.push(field)
    }
  }
  
  return conflicts
}

// Calculate confidence score for duplicate detection
function calculateConfidence(existing: any, newData: any, fields: string[]) {
  let matches = 0
  let total = 0
  
  for (const field of fields) {
    if (existing[field] && newData[field]) {
      total++
      if (existing[field] === newData[field]) {
        matches++
      }
    }
  }
  
  return total > 0 ? matches / total : 0
}

// Import data with field mapping
export async function importData(
  entityType: 'person' | 'organization',
  data: any[],
  mappings: ImportMapping[],
  duplicateHandling: 'skip' | 'update' | 'merge',
  duplicateRecords: DuplicateRecord[]
) {
  const results = {
    imported: 0,
    skipped: 0,
    updated: 0,
    errors: [] as Array<{ record: any; error: string }>
  }

  for (const record of data) {
    try {
      // Check if this record has a duplicate
      const duplicate = duplicateRecords.find(d => 
        d.newData === record || 
        (d.newData.email === record.email && d.newData.name === record.name)
      )

      if (duplicate && duplicateHandling === 'skip') {
        results.skipped++
        continue
      }

      // Map data according to mappings
      const mappedData: any = {}
      for (const mapping of mappings) {
        if (record[mapping.columnName]) {
          if (mapping.isCustom) {
            // Handle custom field
            if (mapping.createNewField) {
              // Create new custom field
              const newField = await prisma.customField.create({
                data: {
                  sectionId: '', // Would need to determine section
                  name: mapping.fieldName,
                  label: mapping.newFieldLabel || mapping.fieldName,
                  type: mapping.fieldType,
                  order: 0
                }
              })
              mappedData[`custom_${newField.id}`] = record[mapping.columnName]
            } else {
              mappedData[`custom_${mapping.fieldName}`] = record[mapping.columnName]
            }
          } else {
            mappedData[mapping.fieldName] = record[mapping.columnName]
          }
        }
      }

      if (duplicate && duplicateHandling === 'update') {
        // Update existing record
        if (entityType === 'person') {
          await prisma.person.update({
            where: { id: duplicate.existingId },
            data: mappedData
          })
        } else if (entityType === 'organization') {
          await prisma.organization.update({
            where: { id: duplicate.existingId },
            data: mappedData
          })
        }
        results.updated++
      } else if (duplicate && duplicateHandling === 'merge') {
        // Merge data (keep existing for conflicts, add new data)
        const mergedData = { ...duplicate.existingData, ...mappedData }
        if (entityType === 'person') {
          await prisma.person.update({
            where: { id: duplicate.existingId },
            data: mergedData
          })
        } else if (entityType === 'organization') {
          await prisma.organization.update({
            where: { id: duplicate.existingId },
            data: mergedData
          })
        }
        results.updated++
      } else {
        // Create new record
        if (entityType === 'person') {
          await prisma.person.create({
            data: mappedData
          })
        } else if (entityType === 'organization') {
          await prisma.organization.create({
            data: mappedData
          })
        }
        results.imported++
      }
    } catch (error) {
      results.errors.push({
        record,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  revalidatePath('/settings/data')
  return results
}

// Get import preview data
export async function getImportPreview(fileData: any, entityType: 'person' | 'organization') {
  const { headers, rows } = fileData
  const availableFields = await getAvailableFields(entityType)
  
  // Suggest field mappings
  const suggestedMappings: ImportMapping[] = headers.map((header: string) => {
    const baseField = availableFields.baseFields.find((field: string) => 
      field.toLowerCase() === header.toLowerCase()
    )

    const customField = availableFields.customFields.find((field: any) =>
      field.label.toLowerCase() === header.toLowerCase()
    )

    if (baseField) {
      return {
        columnName: header,
        fieldName: baseField,
        fieldType: 'text',
        isCustom: false
      }
    } else if (customField) {
      return {
        columnName: header,
        fieldName: customField.name,
        fieldType: customField.type,
        isCustom: true
      }
    } else {
      return {
        columnName: header,
        fieldName: header.toLowerCase().replace(/\s+/g, '_'),
        fieldType: 'text',
        isCustom: false,
        createNewField: true,
        newFieldLabel: header
      }
    }
  })

  return {
    headers,
    previewRows: rows.slice(0, 5),
    suggestedMappings,
    availableFields
  }
}
