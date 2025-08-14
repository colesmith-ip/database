'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function OrganizationSearchAndFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [region, setRegion] = useState(searchParams.get('region') || '')

  const updateFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (type) params.set('type', type)
    if (region) params.set('region', region)
    
    router.push(`/organizations?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setType('')
    setRegion('')
    router.push('/organizations')
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, type, region])

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Organization name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All types</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Consulting">Consulting</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All regions</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
            <option value="Latin America">Latin America</option>
            <option value="Africa">Africa</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}
