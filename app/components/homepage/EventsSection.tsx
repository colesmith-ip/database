'use client';

import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  location?: string | null;
  eventType: string;
  color: string;
}

interface EventsSectionProps {
  events: Event[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Event form coming soon...</p>
        </div>
      )}
      
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border-l-4 border-green-500 pl-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                )}
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>📅 {event.startDate.toLocaleDateString()} at {event.startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  {event.location && <p>📍 {event.location}</p>}
                </div>
              </div>
              <span className={`bg-${event.color}-100 text-${event.color}-800 text-xs px-2 py-1 rounded-full capitalize`}>
                {event.eventType}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
