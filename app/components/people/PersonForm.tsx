import { Person } from '@prisma/client'
import { createPerson, updatePerson } from '../../actions/people'

interface PersonFormProps {
  person?: Person
}

export function PersonForm({ person }: PersonFormProps) {
  const isEditing = !!person
  const action = isEditing 
    ? updatePerson.bind(null, person.id)
    : createPerson

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
          defaultValue={person?.name || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={person?.email || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={person?.phone || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="ownerUserId" className="block text-sm font-medium text-gray-700 mb-1">
          Owner User ID
        </label>
        <input
          type="text"
          id="ownerUserId"
          name="ownerUserId"
          defaultValue={person?.ownerUserId || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          placeholder="Enter tags separated by commas"
          defaultValue={
            person?.tags && Array.isArray(person.tags) 
              ? (person.tags as string[]).join(', ')
              : ''
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple tags with commas
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          {isEditing ? 'Update Person' : 'Create Person'}
        </button>
        
        {isEditing && (
          <a
            href="/people"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium inline-block text-center"
          >
            Cancel
          </a>
        )}
      </div>
    </form>
  )
}
