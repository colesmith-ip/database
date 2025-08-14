import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getOrganization } from '../../actions/organizations'
import { OrganizationForm } from '../../components/organizations/OrganizationForm'
import { DeleteOrganizationButton } from '../../components/organizations/DeleteOrganizationButton'

export default async function OrganizationDetailPage({
  params
}: {
  params: { id: string }
}) {
  const organization = await getOrganization(params.id)

  if (!organization) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/organizations"
            className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
          >
            ← Back to Organizations
          </Link>
          <h1 className="text-3xl font-bold">{organization.name}</h1>
        </div>
        <DeleteOrganizationButton organizationId={organization.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Organization Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
            <OrganizationForm organization={organization} />
          </div>
        </div>

        {/* People */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">People</h2>
            {organization.people.length > 0 ? (
              <div className="space-y-3">
                {organization.people.map((rel) => (
                  <div key={rel.id} className="border rounded-lg p-3">
                    <Link
                      href={`/people/${rel.person.id}`}
                      className="font-medium text-blue-500 hover:text-blue-600"
                    >
                      {rel.person.name}
                    </Link>
                    {rel.role && (
                      <p className="text-sm text-gray-600 mt-1">{rel.role}</p>
                    )}
                    {rel.person.email && (
                      <p className="text-xs text-gray-500">{rel.person.email}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No people associated</p>
            )}
          </div>

          {/* Organization Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Metadata</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(organization.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {new Date(organization.updatedAt).toLocaleDateString()}
              </div>
              {organization.type && (
                <div>
                  <span className="font-medium">Type:</span> {organization.type}
                </div>
              )}
              {organization.region && (
                <div>
                  <span className="font-medium">Region:</span> {organization.region}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
