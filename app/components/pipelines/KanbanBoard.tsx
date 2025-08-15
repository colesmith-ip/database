'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PipelineItem, Stage, Person, Organization } from '@prisma/client'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { updatePipelineItemStage } from '../../actions/pipelines'

type StageWithItems = Stage & {
  items: (PipelineItem & {
    person?: Pick<Person, 'id' | 'name' | 'email'> | null
    organization?: Pick<Organization, 'id' | 'name'> | null
  })[]
}

interface KanbanBoardProps {
  stages: StageWithItems[]
  pipelineId: string
}

export function KanbanBoard({ stages, pipelineId }: KanbanBoardProps) {
  const [activeItem, setActiveItem] = useState<PipelineItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const item = stages
      .flatMap(stage => stage.items)
      .find(item => item.id === active.id)
    
    setActiveItem(item || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) return

    const itemId = active.id as string
    const overId = over.id as string

    // If dropped over a stage column
    let newStageId: string | null = null
    
    // Check if dropped over a stage column
    const targetStage = stages.find(stage => stage.id === overId)
    if (targetStage) {
      newStageId = targetStage.id
    } else {
      // Check if dropped over an item (get the stage of that item)
      const targetItem = stages
        .flatMap(stage => stage.items)
        .find(item => item.id === overId)
      if (targetItem) {
        newStageId = targetItem.stageId
      }
    }

    if (!newStageId) return

    // Get current item and check if stage actually changed
    const currentItem = stages
      .flatMap(stage => stage.items)
      .find(item => item.id === itemId)
    
    if (!currentItem || currentItem.stageId === newStageId) return

    setIsLoading(true)
    try {
      await updatePipelineItemStage(itemId, newStageId)
    } catch (error) {
      console.error('Failed to move item:', error)
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
        {stages.map((stage) => (
          <KanbanColumn 
            key={stage.id} 
            stage={stage} 
            isLoading={isLoading}
            pipelineId={pipelineId}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeItem ? (
          <KanbanCard 
            item={activeItem} 
            isDragging 
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

