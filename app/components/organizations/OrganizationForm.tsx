import { Organization } from '@prisma/client'
import { createOrganization, updateOrganization } from '../../actions/organizations'

interface OrganizationFormProps {
  organization?: Organization
}

export function OrganizationForm({ organization }: OrganizationFormProps) {
  const isEditing = !!organization
  const action = isEditing 
    ? updateOrganization.bind(null, organization.id)
    : createOrganization

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={organization?.name || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={organization?.type || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select type</option>
          <option value="Missions Agency">Missions Agency</option>
          <option value="Local Church">Local Church</option>
          <option value="Denomination">Denomination</option>
          <option value="Ministry Partner">Ministry Partner</option>
          <option value="Support Organization">Support Organization</option>
          <option value="Training Institution">Training Institution</option>
          <option value="Medical Missions">Medical Missions</option>
          <option value="Education Ministry">Education Ministry</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
          Region
        </label>
        <select
          id="region"
          name="region"
          defaultValue={organization?.region || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select region</option>
          <option value="North America">North America</option>
          <option value="Europe">Europe</option>
          <option value="Asia Pacific">Asia Pacific</option>
          <option value="Latin America">Latin America</option>
          <option value="Africa">Africa</option>
          <option value="Middle East">Middle East</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          {isEditing ? 'Update Organization' : 'Create Organization'}
        </button>
        
        {isEditing && (
          <a
            href="/organizations"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium inline-block text-center"
          >
            Cancel
          </a>
        )}
      </div>
    </form>
  )
}
