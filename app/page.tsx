import DiscussionBoard from './components/discussion/DiscussionBoard'
import AnnouncementsSection from './components/homepage/AnnouncementsSection'
import EventsSection from './components/homepage/EventsSection'
import { getAnnouncements, getEvents } from './actions/homepage'

export default async function Home() {
  const [announcements, events] = await Promise.all([
    getAnnouncements(),
    getEvents()
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Title Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-6xl font-bold text-blue-600 text-center">International Project</h1>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            
            {/* Announcements Section */}
            <AnnouncementsSection announcements={announcements} />

            {/* Organization Links Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Important Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a href="#" className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <span className="text-blue-600 mr-3">📊</span>
                  <div>
                    <p className="font-medium text-gray-900">Project Dashboard</p>
                    <p className="text-xs text-gray-600">View all active projects</p>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <span className="text-green-600 mr-3">📅</span>
                  <div>
                    <p className="font-medium text-gray-900">Team Calendar</p>
                    <p className="text-xs text-gray-600">Schedule & meetings</p>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <span className="text-purple-600 mr-3">📋</span>
                  <div>
                    <p className="font-medium text-gray-900">Resources</p>
                    <p className="text-xs text-gray-600">Documents & tools</p>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <span className="text-orange-600 mr-3">👥</span>
                  <div>
                    <p className="font-medium text-gray-900">Team Directory</p>
                    <p className="text-xs text-gray-600">Contact information</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Calendar Section */}
            <EventsSection events={events} />

            {/* Discussion Board Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">💬 Team Discussion</h2>
              <DiscussionBoard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
