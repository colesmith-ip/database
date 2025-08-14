'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PipelineItem, Stage, Person, Organization } from '@prisma/client'
import { KanbanCard } from './KanbanCard'
import { AddItemForm } from './AddItemForm'
import { EditStageNameForm } from './EditStageNameForm'
import { DeleteStageButton } from './DeleteStageButton'

type StageWithItems = Stage & {
  items: (PipelineItem & {
    person?: Pick<Person, 'id' | 'name' | 'email'> | null
    organization?: Pick<Organization, 'id' | 'name'> | null
  })[]
}

interface KanbanColumnProps {
  stage: StageWithItems
  isLoading: boolean
  pipelineId: string
}

export function KanbanColumn({ stage, isLoading, pipelineId }: KanbanColumnProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const { setNodeRef } = useDroppable({
    id: stage.id,
  })

  const itemIds = stage.items.map(item => item.id)

  return (
    <div className="flex flex-col min-w-[320px] bg-gray-50 rounded-lg p-4">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {isEditingName ? (
            <EditStageNameForm
              stageId={stage.id}
              currentName={stage.name}
              onCancel={() => setIsEditingName(false)}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <h3 
                className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                onClick={() => setIsEditingName(true)}
                title="Click to edit stage name"
              >
                {stage.name}
              </h3>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-gray-400 hover:text-gray-600 text-sm"
                title="Edit stage name"
              >
                ✏️
              </button>
              <DeleteStageButton
                stageId={stage.id}
                stageName={stage.name}
                itemCount={stage.items.length}
              />
            </div>
          )}
          <p className="text-sm text-gray-500">{stage.items.length} items</p>
        </div>
      </div>

      {/* Add Item Form */}
      <AddItemForm stageId={stage.id} pipelineId={pipelineId} />

      {/* Items Container */}
      <div 
        ref={setNodeRef}
        className={`flex-1 space-y-3 min-h-[200px] ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {stage.items.map((item) => (
            <KanbanCard 
              key={item.id} 
              item={item} 
            />
          ))}
        </SortableContext>
        
        {stage.items.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
            Drop items here or add new ones above
          </div>
        )}
      </div>
    </div>
  )
}
