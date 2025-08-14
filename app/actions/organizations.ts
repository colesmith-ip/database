'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'

export type OrganizationFilters = {
  search?: string
  type?: string
  region?: string
}

export async function getOrganizations(
  page: number = 1,
  limit: number = 10,
  filters: OrganizationFilters = {}
) {
  const skip = (page - 1) * limit
  
  const where = {
    AND: [
      filters.search ? {
        name: { contains: filters.search, mode: 'insensitive' as const }
      } : {},
      filters.type ? {
        type: filters.type
      } : {},
      filters.region ? {
        region: filters.region
      } : {},
    ]
  }

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      include: {
        people: {
          include: {
            person: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.organization.count({ where }),
  ])

  return {
    organizations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  }
}

export async function getOrganization(id: string) {
  return await prisma.organization.findUnique({
    where: { id },
    include: {
      people: {
        include: {
          person: true
        }
      }
    }
  })
}

export async function createOrganization(formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const region = formData.get('region') as string

  // Validate required fields
  if (!name || name.trim() === '') {
    throw new Error('Organization name is required')
  }

  try {
    await prisma.organization.create({
      data: {
        name: name.trim(),
        type: type && type.trim() !== '' ? type.trim() : null,
        region: region && region.trim() !== '' ? region.trim() : null,
      },
    })

    revalidatePath('/organizations')
    redirect('/organizations')
  } catch (error) {
    console.error('Failed to create organization:', error)
    throw new Error(`Failed to create organization: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateOrganization(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const region = formData.get('region') as string

  try {
    await prisma.organization.update({
      where: { id },
      data: {
        name,
        type: type || null,
        region: region || null,
      },
    })

    revalidatePath('/organizations')
    revalidatePath(`/organizations/${id}`)
  } catch (error) {
    throw new Error('Failed to update organization')
  }
}

export async function deleteOrganization(id: string) {
  try {
    await prisma.organization.delete({
      where: { id },
    })

    revalidatePath('/organizations')
    redirect('/organizations')
  } catch (error) {
    throw new Error('Failed to delete organization')
  }
}
