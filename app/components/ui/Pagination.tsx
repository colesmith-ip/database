'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  const pages = []
  
  // Always show first page
  if (currentPage > 3) {
    pages.push(1)
    if (currentPage > 4) {
      pages.push('...')
    }
  }
  
  // Show pages around current page
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pages.push(i)
  }
  
  // Always show last page
  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) {
      pages.push('...')
    }
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Previous
          </Link>
        ) : (
          <span className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-400 cursor-not-allowed">
            Previous
          </span>
        )}

        {/* Page numbers */}
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={index} className="px-3 py-2 text-gray-500">
                ...
              </span>
            )
          }
          
          const pageNum = page as number
          const isCurrentPage = pageNum === currentPage
          
          return (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              className={`px-3 py-2 border rounded-md text-sm ${
                isCurrentPage
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </Link>
          )
        })}

        {/* Next button */}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Next
          </Link>
        ) : (
          <span className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-400 cursor-not-allowed">
            Next
          </span>
        )}
      </div>
    </div>
  )
}
