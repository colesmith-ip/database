import Link from 'next/link'
import { Relationship, Person } from '@prisma/client'
import { DeleteRelationshipButton } from './DeleteRelationshipButton'

type RelationshipWithPerson = Relationship & {
  toPerson?: Person
  fromPerson?: Person
}

interface RelationshipsListProps {
  fromRelationships: RelationshipWithPerson[]
  toRelationships: RelationshipWithPerson[]
  currentPersonId: string
}

export function RelationshipsList({ 
  fromRelationships, 
  toRelationships, 
  currentPersonId 
}: RelationshipsListProps) {
  const hasRelationships = fromRelationships.length > 0 || toRelationships.length > 0

  if (!hasRelationships) {
    return (
      <p className="text-gray-500 text-sm">No relationships added yet</p>
    )
  }

  return (
    <div className="space-y-3">
      {/* Outgoing relationships (current person → others) */}
      {fromRelationships.map((relationship) => (
        <div key={relationship.id} className="border rounded-lg p-3 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-800">
                {relationship.type}
              </div>
              <Link
                href={`/people/${relationship.toPerson?.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                → {relationship.toPerson?.name}
              </Link>
              {relationship.toPerson?.email && (
                <div className="text-xs text-gray-600">
                  {relationship.toPerson.email}
                </div>
              )}
            </div>
            <DeleteRelationshipButton 
              relationshipId={relationship.id}
              personId={currentPersonId}
            />
          </div>
        </div>
      ))}

      {/* Incoming relationships (others → current person) */}
      {toRelationships.map((relationship) => (
        <div key={relationship.id} className="border rounded-lg p-3 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-800">
                {relationship.type}
              </div>
              <Link
                href={`/people/${relationship.fromPerson?.id}`}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                {relationship.fromPerson?.name} →
              </Link>
              {relationship.fromPerson?.email && (
                <div className="text-xs text-gray-600">
                  {relationship.fromPerson.email}
                </div>
              )}
            </div>
            <DeleteRelationshipButton 
              relationshipId={relationship.id}
              personId={currentPersonId}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

