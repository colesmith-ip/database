import Link from 'next/link'
import { getPeople } from '../actions/people'
import { getOrganizations } from '../actions/organizations'
import { unstable_noStore as noStore } from 'next/cache'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
  noStore()
  
  const people = await getPeople()
  const organizations = await getOrganizations()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Contacts</h1>
        <p className="text-gray-600 mt-2">Manage your people and organizations in one place</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* People Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">People</h2>
              <Link
                href="/people/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Person
              </Link>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              {people.length} people in your database
            </p>
          </div>
          
          <div className="p-6">
            {people.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No people added yet</p>
                <Link
                  href="/people/new"
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  Add your first person
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {people.slice(0, 5).map((person) => (
                  <Link
                    key={person.id}
                    href={`/people/${person.id}`}
                    className="block p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{person.name}</h3>
                        {person.email && (
                          <p className="text-sm text-gray-600">{person.email}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
                {people.length > 5 && (
                  <Link
                    href="/people"
                    className="block text-center text-blue-600 hover:text-blue-700 text-sm py-2"
                  >
                    View all {people.length} people →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Organizations Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Organizations</h2>
              <Link
                href="/organizations/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Organization
              </Link>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              {organizations.length} organizations in your database
            </p>
          </div>
          
          <div className="p-6">
            {organizations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No organizations added yet</p>
                <Link
                  href="/organizations/new"
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  Add your first organization
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {organizations.slice(0, 5).map((org) => (
                  <Link
                    key={org.id}
                    href={`/organizations/${org.id}`}
                    className="block p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{org.name}</h3>
                        {org.type && (
                          <p className="text-sm text-gray-600">{org.type}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
                {organizations.length > 5 && (
                  <Link
                    href="/organizations"
                    className="block text-center text-blue-600 hover:text-blue-700 text-sm py-2"
                  >
                    View all {organizations.length} organizations →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/people/new"
            className="flex items-center p-4 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Add Person</h3>
              <p className="text-sm text-gray-600">Add a new individual contact</p>
            </div>
          </Link>

          <Link
            href="/organizations/new"
            className="flex items-center p-4 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Add Organization</h3>
              <p className="text-sm text-gray-600">Add a new organization</p>
            </div>
          </Link>

          <Link
            href="/marketing/lists/new"
            className="flex items-center p-4 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Create Email List</h3>
              <p className="text-sm text-gray-600">Create a list for email campaigns</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
