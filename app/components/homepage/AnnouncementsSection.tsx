'use client'

import { useState } from 'react'
import { getAnnouncements, deleteAnnouncement } from '../../actions/homepage'
import AnnouncementForm from './AnnouncementForm'

interface Announcement {
  id: string
  title: string
  content: string
  authorName: string
  priority: string
  createdAt: Date
}

interface AnnouncementsSectionProps {
  announcements: Announcement[]
}

export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id)
      } catch (error) {
        console.error('Error deleting announcement:', error)
      }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500'
      case 'high': return 'border-orange-500'
      case 'normal': return 'border-blue-500'
      case 'low': return 'border-green-500'
      default: return 'border-blue-500'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">📢 Announcements</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Add Announcement
        </button>
      </div>
      
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No announcements yet.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className={`border-l-4 ${getPriorityColor(announcement.priority)} pl-4 py-2 relative group`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{formatDate(announcement.createdAt)}</p>
                  <p className="font-medium text-gray-900">{announcement.title}</p>
                  <p className="text-gray-700 text-sm">{announcement.content}</p>
                  <p className="text-xs text-gray-500 mt-1">By {announcement.authorName}</p>
                </div>
                <div className="hidden group-hover:flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <AnnouncementForm
          announcement={editingAnnouncement || undefined}
          onClose={() => {
            setShowForm(false)
            setEditingAnnouncement(null)
          }}
        />
      )}
    </div>
  )
}

