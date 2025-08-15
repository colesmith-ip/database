import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPerson } from '../../actions/people'
import { getAllPeople, getRelationshipTypes } from '../../actions/relationships'
import { getPersonTasks } from '../../actions/tasks'
import { PersonForm } from '../../components/people/PersonForm'
import { DeletePersonButton } from '../../components/people/DeletePersonButton'
import { RelationshipsList } from '../../components/relationships/RelationshipsList'
import { AddRelationshipForm } from '../../components/relationships/AddRelationshipForm'
import { TasksList } from '../../components/tasks/TasksList'

export default async function PersonDetailPage({
  params
}: {
  params: { id: string }
}) {
  const [person, allPeople, relationshipTypes, tasks] = await Promise.all([
    getPerson(params.id),
    getAllPeople(),
    getRelationshipTypes(),
    getPersonTasks(params.id)
  ])

  if (!person) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/people"
            className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
          >
            ← Back to People
          </Link>
          <h1 className="text-3xl font-bold">{person.name}</h1>
        </div>
        <DeletePersonButton personId={person.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Person Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Person Details</h2>
            <PersonForm person={person} />
          </div>
        </div>

        {/* Organizations */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Organizations</h2>
            {person.organizations.length > 0 ? (
              <div className="space-y-3">
                {person.organizations.map((rel) => (
                  <div key={rel.id} className="border rounded-lg p-3">
                    <Link
                      href={`/organizations/${rel.organization.id}`}
                      className="font-medium text-blue-500 hover:text-blue-600"
                    >
                      {rel.organization.name}
                    </Link>
                    {rel.role && (
                      <p className="text-sm text-gray-600 mt-1">{rel.role}</p>
                    )}
                    {rel.organization.type && (
                      <p className="text-xs text-gray-500">
                        {rel.organization.type} • {rel.organization.region}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No organizations associated</p>
            )}
          </div>

          {/* Relationships */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Relationships</h2>
              <AddRelationshipForm 
                currentPersonId={person.id}
                allPeople={allPeople}
                relationshipTypes={relationshipTypes}
              />
            </div>
            <RelationshipsList
              fromRelationships={person.fromRelationships || []}
              toRelationships={person.toRelationships || []}
              currentPersonId={person.id}
            />
          </div>

          {/* Tasks */}
          <TasksList 
            tasks={tasks} 
            title="Tasks" 
            initialData={{ personId: person.id }}
          />

          {/* Person Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Metadata</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(person.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {new Date(person.updatedAt).toLocaleDateString()}
              </div>
              {person.ownerUserId && (
                <div>
                  <span className="font-medium">Owner:</span> {person.ownerUserId}
                </div>
              )}
              {person.tags && Array.isArray(person.tags) && person.tags.length > 0 && (
                <div>
                  <span className="font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {person.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {String(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
