'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { TaskFilters } from '../../actions/tasks'

interface TaskFiltersFormProps {
  currentFilters: TaskFilters
  statuses: string[]
}

export function TaskFiltersForm({ currentFilters, statuses }: TaskFiltersFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    status: currentFilters.status || '',
    ownerUserId: currentFilters.ownerUserId || '',
    dueBefore: currentFilters.dueBefore ? new Date(currentFilters.dueBefore).toISOString().slice(0, 16) : '',
    dueAfter: currentFilters.dueAfter ? new Date(currentFilters.dueAfter).toISOString().slice(0, 16) : '',
    personId: currentFilters.personId || '',
    pipelineItemId: currentFilters.pipelineItemId || ''
  })

  function applyFilters() {
    const params = new URLSearchParams(searchParams)
    
    // Clear existing filter params
    params.delete('status')
    params.delete('ownerUserId')
    params.delete('dueBefore')
    params.delete('dueAfter')
    params.delete('personId')
    params.delete('pipelineItemId')
    params.delete('page') // Reset to first page when filtering
    
    // Add new filter params
    if (filters.status) params.set('status', filters.status)
    if (filters.ownerUserId) params.set('ownerUserId', filters.ownerUserId)
    if (filters.dueBefore) params.set('dueBefore', filters.dueBefore)
    if (filters.dueAfter) params.set('dueAfter', filters.dueAfter)
    if (filters.personId) params.set('personId', filters.personId)
    if (filters.pipelineItemId) params.set('pipelineItemId', filters.pipelineItemId)
    
    router.push(`/tasks?${params.toString()}`)
  }

  function clearFilters() {
    setFilters({
      status: '',
      ownerUserId: '',
      dueBefore: '',
      dueAfter: '',
      personId: '',
      pipelineItemId: ''
    })
    
    const params = new URLSearchParams(searchParams)
    params.delete('status')
    params.delete('ownerUserId')
    params.delete('dueBefore')
    params.delete('dueAfter')
    params.delete('personId')
    params.delete('pipelineItemId')
    params.delete('page')
    
    router.push(`/tasks?${params.toString()}`)
  }

  const hasActiveFilters = Object.values(currentFilters).some(value => value !== undefined && value !== '')

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Tasks</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ownerUserId" className="block text-sm font-medium text-gray-700 mb-1">
            Owner
          </label>
          <input
            type="text"
            id="ownerUserId"
            value={filters.ownerUserId}
            onChange={(e) => setFilters(prev => ({ ...prev, ownerUserId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter owner ID"
          />
        </div>

        <div>
          <label htmlFor="dueAfter" className="block text-sm font-medium text-gray-700 mb-1">
            Due After
          </label>
          <input
            type="datetime-local"
            id="dueAfter"
            value={filters.dueAfter}
            onChange={(e) => setFilters(prev => ({ ...prev, dueAfter: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dueBefore" className="block text-sm font-medium text-gray-700 mb-1">
            Due Before
          </label>
          <input
            type="datetime-local"
            id="dueBefore"
            value={filters.dueBefore}
            onChange={(e) => setFilters(prev => ({ ...prev, dueBefore: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="personId" className="block text-sm font-medium text-gray-700 mb-1">
            Person ID
          </label>
          <input
            type="text"
            id="personId"
            value={filters.personId}
            onChange={(e) => setFilters(prev => ({ ...prev, personId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter person ID"
          />
        </div>

        <div>
          <label htmlFor="pipelineItemId" className="block text-sm font-medium text-gray-700 mb-1">
            Pipeline Item ID
          </label>
          <input
            type="text"
            id="pipelineItemId"
            value={filters.pipelineItemId}
            onChange={(e) => setFilters(prev => ({ ...prev, pipelineItemId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pipeline item ID"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
        >
          Clear Filters
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Apply Filters
        </button>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-sm text-blue-800">
            <strong>Active Filters:</strong>
            <div className="mt-1 space-y-1">
              {currentFilters.status && <div>Status: {currentFilters.status}</div>}
              {currentFilters.ownerUserId && <div>Owner: {currentFilters.ownerUserId}</div>}
              {currentFilters.dueBefore && <div>Due Before: {new Date(currentFilters.dueBefore).toLocaleDateString()}</div>}
              {currentFilters.dueAfter && <div>Due After: {new Date(currentFilters.dueAfter).toLocaleDateString()}</div>}
              {currentFilters.personId && <div>Person ID: {currentFilters.personId}</div>}
              {currentFilters.pipelineItemId && <div>Pipeline Item ID: {currentFilters.pipelineItemId}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
