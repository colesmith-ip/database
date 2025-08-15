'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'

// Helper function to safely execute database queries
async function safeDbQuery<T>(queryFn: () => Promise<T>): Promise<T | null> {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query error:', error)
    
    // During build time, database connection might not be available
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
      console.warn('Database connection not available during build, returning null')
      return null
    }
    
    // In production runtime, return null instead of throwing to prevent crashes
    if (process.env.NODE_ENV === 'production') {
      console.warn('Database connection failed in production, returning null')
      return null
    }
    
    // In development, throw the error for debugging
    throw new Error(`Failed to execute database query: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

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
  const result = await safeDbQuery(async () => {
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
  })
  
  // Return empty result if database is not available during build
  return result || {
    organizations: [],
    pagination: {
      page,
      limit,
      total: 0,
      pages: 0,
    }
  }
}

export async function getOrganization(id: string) {
  const result = await safeDbQuery(async () => {
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
  })
  
  // Return null if database is not available during build
  return result
}

export async function createOrganization(formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const region = formData.get('region') as string

  // Validate required fields
  if (!name || name.trim() === '') {
    throw new Error('Organization name is required')
  }

  const result = await safeDbQuery(async () => {
    return await prisma.organization.create({
      data: {
        name: name.trim(),
        type: type && type.trim() !== '' ? type.trim() : null,
        region: region && region.trim() !== '' ? region.trim() : null,
      },
    })
  })

  if (!result) {
    throw new Error('Failed to create organization: Database connection error')
  }

  revalidatePath('/organizations')
  redirect('/organizations')
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
