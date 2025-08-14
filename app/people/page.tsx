import Link from 'next/link'
import { getPeople } from '../actions/people'
import { SearchAndFilters } from '../components/people/SearchAndFilters'
import { PeopleTable } from '../components/people/PeopleTable'
import { Pagination } from '../components/ui/Pagination'

type SearchParams = {
  page?: string
  search?: string
  tag?: string
  ownerUserId?: string
}

export default async function PeoplePage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  const page = parseInt(searchParams.page || '1')
  const filters = {
    search: searchParams.search,
    tag: searchParams.tag,
    ownerUserId: searchParams.ownerUserId,
  }

  const { people, pagination } = await getPeople(page, 10, filters)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">People</h1>
        <Link
          href="/people/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add Person
        </Link>
      </div>

      <SearchAndFilters />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <PeopleTable people={people} />
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          baseUrl="/people"
        />
      </div>
    </div>
  )
}
