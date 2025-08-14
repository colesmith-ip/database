import Link from 'next/link'
import { getOrganizations } from '../actions/organizations'
import { OrganizationSearchAndFilters } from '../components/organizations/OrganizationSearchAndFilters'
import { OrganizationsTable } from '../components/organizations/OrganizationsTable'
import { Pagination } from '../components/ui/Pagination'

type SearchParams = {
  page?: string
  search?: string
  type?: string
  region?: string
}

export default async function OrganizationsPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  const page = parseInt(searchParams.page || '1')
  const filters = {
    search: searchParams.search,
    type: searchParams.type,
    region: searchParams.region,
  }

  const { organizations, pagination } = await getOrganizations(page, 10, filters)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Link
          href="/organizations/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add Organization
        </Link>
      </div>

      <OrganizationSearchAndFilters />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <OrganizationsTable organizations={organizations} />
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          baseUrl="/organizations"
        />
      </div>
    </div>
  )
}
