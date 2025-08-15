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

export type PersonFilters = {
  search?: string
  tag?: string
  ownerUserId?: string
}

export async function getPeople(
  page: number = 1,
  limit: number = 10,
  filters: PersonFilters = {}
) {
  const result = await safeDbQuery(async () => {
    const skip = (page - 1) * limit
    
    const where = {
      AND: [
        filters.search ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' as const } },
            { email: { contains: filters.search, mode: 'insensitive' as const } },
            { phone: { contains: filters.search, mode: 'insensitive' as const } },
          ]
        } : {},
        // TODO: Fix tags filter for JSON array
        // filters.tag ? {
        //   tags: {
        //     path: ['$'],
        //     array_contains: filters.tag
        //   }
        // } : {},
        filters.ownerUserId ? {
          ownerUserId: filters.ownerUserId
        } : {},
      ]
    }

    const [people, total] = await Promise.all([
      prisma.person.findMany({
        where,
        include: {
          organizations: {
            include: {
              organization: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.person.count({ where }),
    ])

    return {
      people,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    }
  })
  
  // Return empty result if database is not available
  return result || {
    people: [],
    pagination: {
      page,
      limit,
      total: 0,
      pages: 0,
    }
  }
}

export async function getPerson(id: string) {
  const result = await safeDbQuery(async () => {
    return await prisma.person.findUnique({
      where: { id },
      include: {
        organizations: {
          include: {
            organization: true
          }
        },
        fromRelationships: {
          include: {
            toPerson: true
          }
        },
        toRelationships: {
          include: {
            fromPerson: true
          }
        }
      }
    })
  })
  
  // Return null if database is not available
  return result
}

export async function createPerson(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const ownerUserId = formData.get('ownerUserId') as string
  const tagsString = formData.get('tags') as string
  
  // Validate required fields
  if (!name || name.trim() === '') {
    throw new Error('Person name is required')
  }
  
  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : []

  try {
    await prisma.person.create({
      data: {
        name: name.trim(),
        email: email && email.trim() !== '' ? email.trim() : null,
        phone: phone && phone.trim() !== '' ? phone.trim() : null,
        ownerUserId: ownerUserId && ownerUserId.trim() !== '' ? ownerUserId.trim() : null,
        tags: tags.length > 0 ? tags : undefined,
      },
    })

    revalidatePath('/people')
    redirect('/people')
  } catch (error) {
    console.error('Failed to create person:', error)
    throw new Error(`Failed to create person: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updatePerson(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const ownerUserId = formData.get('ownerUserId') as string
  const tagsString = formData.get('tags') as string
  
  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : []

  try {
    await prisma.person.update({
      where: { id },
      data: {
        name,
        email: email || null,
        phone: phone || null,
        ownerUserId: ownerUserId || null,
        tags: tags.length > 0 ? tags : undefined,
      },
    })

    revalidatePath('/people')
    revalidatePath(`/people/${id}`)
  } catch (error) {
    throw new Error('Failed to update person')
  }
}

export async function deletePerson(id: string) {
  try {
    await prisma.person.delete({
      where: { id },
    })

    revalidatePath('/people')
    redirect('/people')
  } catch (error) {
    throw new Error('Failed to delete person')
  }
}
