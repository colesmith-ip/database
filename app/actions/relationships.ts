'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../lib/prisma'

export async function getPersonRelationships(personId: string) {
  const [fromRelationships, toRelationships] = await Promise.all([
    prisma.relationship.findMany({
      where: { fromPersonId: personId },
      include: {
        toPerson: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.relationship.findMany({
      where: { toPersonId: personId },
      include: {
        fromPerson: true
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return { fromRelationships, toRelationships }
}

export async function createRelationship(formData: FormData) {
  const fromPersonId = formData.get('fromPersonId') as string
  const toPersonId = formData.get('toPersonId') as string
  const type = formData.get('type') as string

  // Validate required fields
  if (!fromPersonId || !toPersonId || !type) {
    throw new Error('All fields are required')
  }

  if (fromPersonId === toPersonId) {
    throw new Error('Cannot create relationship with self')
  }

  try {
    await prisma.relationship.create({
      data: {
        fromPersonId: fromPersonId.trim(),
        toPersonId: toPersonId.trim(),
        type: type.trim(),
      },
    })

    revalidatePath(`/people/${fromPersonId}`)
    revalidatePath(`/people/${toPersonId}`)
  } catch (error) {
    console.error('Failed to create relationship:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('This relationship already exists')
    }
    throw new Error(`Failed to create relationship: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteRelationship(relationshipId: string, personId: string) {
  try {
    await prisma.relationship.delete({
      where: { id: relationshipId },
    })

    revalidatePath(`/people/${personId}`)
  } catch (error) {
    console.error('Failed to delete relationship:', error)
    throw new Error('Failed to delete relationship')
  }
}

export async function getAllPeople() {
  return await prisma.person.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      tags: true,
      customFields: true,
      ownerUserId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { name: 'asc' }
  })
}

export async function getRelationshipTypes() {
  return [
    'Donor → Missionary',
    'Pastor → Church Contact',
    'Mentor → Mentee',
    'Team Leader → Team Member',
    'Spouse',
    'Parent → Child',
    'Friend',
    'Business Partner',
    'Supervisor → Employee',
    'Client → Service Provider',
  ]
}
