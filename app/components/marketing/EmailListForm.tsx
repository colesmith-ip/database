import { EmailList } from '@prisma/client'
import { createEmailList, updateEmailList } from '../../actions/marketing'

interface EmailListFormProps {
  emailList?: EmailList
  userRole?: string
}

export function EmailListForm({ emailList, userRole }: EmailListFormProps) {
  const isEditing = !!emailList
  const action = isEditing 
    ? updateEmailList.bind(null, emailList.id)
    : createEmailList

  return (
    <form action={action} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          List Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={emailList?.name || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Monthly Newsletter, Prayer Partners, Support Team"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={emailList?.description || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe what this list is for and who should be on it..."
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          List Type
        </label>
        <div className="text-sm text-gray-600 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p>This will be a manual list where you can add subscribers individually.</p>
          <p className="text-xs text-gray-500 mt-1">
            Perfect for targeted groups like prayer partners or support teams.
          </p>
        </div>
      </div>

      {/* Organization-wide option for admins */}
      {userRole === 'admin' && !isEditing && (
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isOrganizationWide"
              value="true"
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Make this an organization-wide list
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Organization-wide lists can be used by all missionaries and admins for organization communications.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 List Ideas for Mission Organizations</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Prayer Partners</strong> - People committed to praying for your mission</li>
          <li>• <strong>Monthly Newsletter</strong> - Regular updates about your ministry</li>
          <li>• <strong>Support Team</strong> - Financial supporters and donors</li>
          <li>• <strong>Short-term Missionaries</strong> - People interested in short-term trips</li>
          <li>• <strong>Church Partners</strong> - Partnering churches and leaders</li>
          <li>• <strong>Volunteers</strong> - People who help with local events</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          {isEditing ? 'Update Email List' : 'Create Email List'}
        </button>
        
        {isEditing && (
          <a
            href="/marketing/lists"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium inline-block text-center"
          >
            Cancel
          </a>
        )}
      </div>
    </form>
  )
}
