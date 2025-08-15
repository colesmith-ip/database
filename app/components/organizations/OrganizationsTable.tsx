import Link from 'next/link'
import { Organization, PersonOrganization, Person } from '@prisma/client'

type OrganizationWithPeople = Organization & {
  people: (PersonOrganization & {
    person: Person
  })[]
}

interface OrganizationsTableProps {
  organizations: OrganizationWithPeople[]
}

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
  if (organizations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No organizations found. Create your first organization to get started.
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
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Region
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              People
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {organizations.map((organization) => (
            <tr key={organization.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/organizations/${organization.id}`}
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  {organization.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {organization.type || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {organization.region || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {organization.people.length > 0 ? (
                  <div className="space-y-1">
                    {organization.people.slice(0, 2).map((rel) => (
                      <div key={rel.id}>
                        <Link
                          href={`/people/${rel.person.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {rel.person.name}
                        </Link>
                        {rel.role && (
                          <span className="text-gray-500"> ({rel.role})</span>
                        )}
                      </div>
                    ))}
                    {organization.people.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{organization.people.length - 2} more
                      </span>
                    )}
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(organization.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/organizations/${organization.id}`}
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

