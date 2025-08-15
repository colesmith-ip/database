import Link from 'next/link'
import { Person, PersonOrganization, Organization } from '@prisma/client'

type PersonWithOrganizations = Person & {
  organizations: (PersonOrganization & {
    organization: Organization
  })[]
}

interface PeopleTableProps {
  people: PersonWithOrganizations[]
}

export function PeopleTable({ people }: PeopleTableProps) {
  if (people.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No people found. Create your first person to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Organizations
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {people.map((person) => (
            <tr key={person.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/people/${person.id}`}
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  {person.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {person.email || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {person.phone || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {person.organizations.length > 0 ? (
                  <div className="space-y-1">
                    {person.organizations.slice(0, 2).map((rel) => (
                      <div key={rel.id}>
                        <Link
                          href={`/organizations/${rel.organization.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {rel.organization.name}
                        </Link>
                        {rel.role && (
                          <span className="text-gray-500"> ({rel.role})</span>
                        )}
                      </div>
                    ))}
                    {person.organizations.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{person.organizations.length - 2} more
                      </span>
                    )}
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {person.tags && Array.isArray(person.tags) && person.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {(person.tags as string[]).slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {(person.tags as string[]).length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{(person.tags as string[]).length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {person.ownerUserId || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/people/${person.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

