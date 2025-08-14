import Link from 'next/link'
import { OrganizationForm } from '../../components/organizations/OrganizationForm'

export default function NewOrganizationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/organizations"
          className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block"
        >
          ← Back to Organizations
        </Link>
        <h1 className="text-3xl font-bold">Add New Organization</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <OrganizationForm />
      </div>
    </div>
  )
}
