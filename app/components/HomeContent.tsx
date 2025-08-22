'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  priority: string;
  createdAt: Date;
}

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

// Static sample data instead of server actions
const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to Hello CRM!',
    content: 'We\'re excited to have you on board. This CRM will help you manage your contacts, track deals, and stay organized.',
    authorName: 'System Admin',
    priority: 'normal',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'New Features Available',
    content: 'Check out the latest updates including improved contact management and enhanced reporting capabilities.',
    authorName: 'System Admin',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  }
];

const SAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync to discuss progress and upcoming tasks',
    startDate: new Date(Date.now() + 86400000), // Tomorrow
    endDate: new Date(Date.now() + 86400000 + 3600000), // 1 hour later
    location: 'Conference Room A',
    eventType: 'meeting',
    color: 'blue'
  },
  {
    id: '2',
    title: 'Client Presentation',
    description: 'Present quarterly results to key client',
    startDate: new Date(Date.now() + 172800000), // 2 days from now
    endDate: new Date(Date.now() + 172800000 + 5400000), // 1.5 hours later
    location: 'Virtual Meeting',
    eventType: 'presentation',
    color: 'green'
  }
];

export default function HomeContent() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setAnnouncements(SAMPLE_ANNOUNCEMENTS);
      setEvents(SAMPLE_EVENTS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your CRM today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Announcements Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
            <Link 
              href="/settings/announcements" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      By {announcement.authorName} • {announcement.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  {announcement.priority === 'high' && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      High Priority
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <Link 
              href="/events" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/people/new" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-blue-600 text-lg">👤</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Add Person</span>
          </Link>
          
          <Link 
            href="/organizations/new" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-green-600 text-lg">🏢</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Add Organization</span>
          </Link>
          
          <Link 
            href="/tasks" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-yellow-600 text-lg">📋</span>
            </div>
            <span className="text-sm font-medium text-gray-900">View Tasks</span>
          </Link>
          
          <Link 
            href="/pipelines" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-purple-600 text-lg">📊</span>
            </div>
            <span className="text-sm font-medium text-gray-900">View Pipelines</span>
          </Link>
        </div>
      </div>

      {/* Discussion Board */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Discussion Board</h2>
        <p className="text-gray-600 mb-4">
          Share prayers, notes, and encouragement with your team.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-500">Discussion board coming soon...</p>
          <p className="text-sm text-gray-400 mt-1">Team collaboration and prayer requests</p>
        </div>
      </div>
    </div>
  );
}
