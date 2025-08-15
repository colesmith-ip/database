'use client'

import { useState } from 'react'
import { getEvents, deleteEvent } from '../../actions/homepage'
import EventForm from './EventForm'

interface Event {
  id: string
  title: string
  description?: string | null
  startDate: Date
  endDate?: Date | null
  location?: string | null
  eventType: string
  color: string
}

interface EventsSectionProps {
  events: Event[]
}

export default function EventsSection({ events }: EventsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id)
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600'
      case 'green': return 'bg-green-600'
      case 'purple': return 'bg-purple-600'
      case 'orange': return 'bg-orange-600'
      case 'red': return 'bg-red-600'
      default: return 'bg-blue-600'
    }
  }

  const getBgColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50'
      case 'green': return 'bg-green-50'
      case 'purple': return 'bg-purple-50'
      case 'orange': return 'bg-orange-50'
      case 'red': return 'bg-red-50'
      default: return 'bg-blue-50'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">📅 Upcoming Events</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Add Event
        </button>
      </div>
      
      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming events.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className={`flex items-center p-3 ${getBgColor(event.color)} rounded-lg relative group`}>
              <div className={`w-12 h-12 ${getColorClasses(event.color)} rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3`}>
                <div className="text-center">
                  <div className="text-xs">
                    {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div>{new Date(event.startDate).getDate()}</div>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-600">
                  {formatTime(event.startDate)}
                  {event.location && ` - ${event.location}`}
                </p>
                {event.description && (
                  <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                )}
              </div>
              <div className="hidden group-hover:flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <EventForm
          event={editingEvent || undefined}
          onClose={() => {
            setShowForm(false)
            setEditingEvent(null)
          }}
        />
      )}
    </div>
  )
}
