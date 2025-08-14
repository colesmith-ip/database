'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PipelineItem, Person, Organization, PipelineItemStageHistory } from '@prisma/client'
import Link from 'next/link'
import { DeleteItemButton } from './DeleteItemButton'

type ItemWithRelations = PipelineItem & {
  person?: Pick<Person, 'id' | 'name' | 'email'> | null
  organization?: Pick<Organization, 'id' | 'name'> | null
  stageHistory?: PipelineItemStageHistory[]
}

interface KanbanCardProps {
  item: ItemWithRelations
  isDragging?: boolean
}

function getTimeInCurrentStage(stageHistory?: PipelineItemStageHistory[]) {
  if (!stageHistory || stageHistory.length === 0) {
    return null
  }

  const currentEntry = stageHistory[0] // Should be the current stage entry
  if (!currentEntry) {
    return null
  }

  const enteredAt = new Date(currentEntry.enteredAt)
  const now = new Date()
  const diffMs = now.getTime() - enteredAt.getTime()
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `${days}d`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return '<1h'
  }
}

export function KanbanCard({ item, isDragging = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const timeInStage = getTimeInCurrentStage(item.stageHistory)

  const cardContent = (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 mr-2">
          <h4 className="font-medium text-gray-900 text-sm leading-5 mb-1">
            {item.title}
          </h4>
          {timeInStage && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {timeInStage}
            </span>
          )}
        </div>
        <DeleteItemButton itemId={item.id} />
      </div>

      {/* Person/Organization Info */}
      <div className="space-y-2 mb-3">
        {item.person && (
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <Link 
              href={`/people/${item.person.id}`}
              className="hover:text-blue-600 truncate"
              onClick={e => e.stopPropagation()}
            >
              {item.person.name}
            </Link>
          </div>
        )}
        
        {item.organization && (
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
            </svg>
            <Link 
              href={`/organizations/${item.organization.id}`}
              className="hover:text-blue-600 truncate"
              onClick={e => e.stopPropagation()}
            >
              {item.organization.name}
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {item.ownerUserId}
        </span>
        <span>
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )

  if (isDragging) {
    return cardContent
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {cardContent}
    </div>
  )
}
