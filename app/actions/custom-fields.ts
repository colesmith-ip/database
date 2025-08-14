'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../lib/prisma'

export interface CustomFieldSectionWithFields {
  id: string
  name: string
  description: string | null
  entityType: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  customFields: Array<{
    id: string
    name: string
    label: string
    type: string
    required: boolean
    options: any
    defaultValue: string | null
    order: number
    isActive: boolean
  }>
}

// Get all sections for an entity type
export async function getCustomFieldSections(entityType: 'person' | 'organization'): Promise<CustomFieldSectionWithFields[]> {
  return await prisma.customFieldSection.findMany({
    where: { entityType },
    include: {
      customFields: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  })
}

// Create a new section
export async function createCustomFieldSection(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const entityType = formData.get('entityType') as 'person' | 'organization'

  if (!name || !entityType) {
    throw new Error('Name and entity type are required')
  }

  try {
    const section = await prisma.customFieldSection.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        entityType,
        order: 0 // Will be updated if needed
      }
    })

    revalidatePath('/settings')
    revalidatePath(`/settings/${entityType}-fields`)
    return section
  } catch (error) {
    console.error('Failed to create custom field section:', error)
    throw new Error(`Failed to create section: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Update a section
export async function updateCustomFieldSection(sectionId: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name) {
    throw new Error('Name is required')
  }

  try {
    const section = await prisma.customFieldSection.update({
      where: { id: sectionId },
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    })

    revalidatePath('/settings')
    revalidatePath(`/settings/${section.entityType}-fields`)
    return section
  } catch (error) {
    console.error('Failed to update custom field section:', error)
    throw new Error(`Failed to update section: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Delete a section
export async function deleteCustomFieldSection(sectionId: string) {
  try {
    const section = await prisma.customFieldSection.delete({
      where: { id: sectionId }
    })

    revalidatePath('/settings')
    revalidatePath(`/settings/${section.entityType}-fields`)
    return section
  } catch (error) {
    console.error('Failed to delete custom field section:', error)
    throw new Error(`Failed to delete section: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Create a new custom field
export async function createCustomField(formData: FormData) {
  const sectionId = formData.get('sectionId') as string
  const name = formData.get('name') as string
  const label = formData.get('label') as string
  const type = formData.get('type') as string
  const required = formData.get('required') === 'true'
  const defaultValue = formData.get('defaultValue') as string
  const options = formData.get('options') as string

  if (!sectionId || !name || !label || !type) {
    throw new Error('Section ID, name, label, and type are required')
  }

  try {
    let parsedOptions = null
    if (options && (type === 'select' || type === 'multiselect')) {
      try {
        parsedOptions = JSON.parse(options)
      } catch {
        throw new Error('Invalid options format for select field')
      }
    }

    const field = await prisma.customField.create({
      data: {
        sectionId,
        name: name.trim(),
        label: label.trim(),
        type,
        required,
        defaultValue: defaultValue?.trim() || null,
        options: parsedOptions,
        order: 0 // Will be updated if needed
      }
    })

    revalidatePath('/settings')
    revalidatePath(`/settings/people-fields`)
    revalidatePath(`/settings/organizations-fields`)
    return field
  } catch (error) {
    console.error('Failed to create custom field:', error)
    throw new Error(`Failed to create field: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Update a custom field
export async function updateCustomField(fieldId: string, formData: FormData) {
  const name = formData.get('name') as string
  const label = formData.get('label') as string
  const type = formData.get('type') as string
  const required = formData.get('required') === 'true'
  const defaultValue = formData.get('defaultValue') as string
  const options = formData.get('options') as string

  if (!name || !label || !type) {
    throw new Error('Name, label, and type are required')
  }

  try {
    let parsedOptions = null
    if (options && (type === 'select' || type === 'multiselect')) {
      try {
        parsedOptions = JSON.parse(options)
      } catch {
        throw new Error('Invalid options format for select field')
      }
    }

    const field = await prisma.customField.update({
      where: { id: fieldId },
      data: {
        name: name.trim(),
        label: label.trim(),
        type,
        required,
        defaultValue: defaultValue?.trim() || null,
        options: parsedOptions
      }
    })

    revalidatePath('/settings')
    revalidatePath(`/settings/people-fields`)
    revalidatePath(`/settings/organizations-fields`)
    return field
  } catch (error) {
    console.error('Failed to update custom field:', error)
    throw new Error(`Failed to update field: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Delete a custom field
export async function deleteCustomField(fieldId: string) {
  try {
    const field = await prisma.customField.delete({
      where: { id: fieldId }
    })

    revalidatePath('/settings')
    revalidatePath(`/settings/people-fields`)
    revalidatePath(`/settings/organizations-fields`)
    return field
  } catch (error) {
    console.error('Failed to delete custom field:', error)
    throw new Error(`Failed to delete field: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Reorder sections
export async function reorderSections(sectionIds: string[]) {
  try {
    await prisma.$transaction(
      sectionIds.map((id, index) =>
        prisma.customFieldSection.update({
          where: { id },
          data: { order: index }
        })
      )
    )

    revalidatePath('/settings')
    revalidatePath(`/settings/people-fields`)
    revalidatePath(`/settings/organizations-fields`)
  } catch (error) {
    console.error('Failed to reorder sections:', error)
    throw new Error(`Failed to reorder sections: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Reorder fields within a section
export async function reorderFields(fieldIds: string[]) {
  try {
    await prisma.$transaction(
      fieldIds.map((id, index) =>
        prisma.customField.update({
          where: { id },
          data: { order: index }
        })
      )
    )

    revalidatePath('/settings')
    revalidatePath(`/settings/people-fields`)
    revalidatePath(`/settings/organizations-fields`)
  } catch (error) {
    console.error('Failed to reorder fields:', error)
    throw new Error(`Failed to reorder fields: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}


