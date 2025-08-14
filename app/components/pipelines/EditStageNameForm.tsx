'use client'

import { useState } from 'react'
import { updateStageName } from '../../actions/pipelines'

interface EditStageNameFormProps {
  stageId: string
  currentName: string
  onCancel: () => void
}

export function EditStageNameForm({ stageId, currentName, onCancel }: EditStageNameFormProps) {
  const [name, setName] = useState(currentName)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      
      await updateStageName(stageId, formData)
      onCancel()
    } catch (error) {
      console.error('Failed to update stage name:', error)
      alert(error instanceof Error ? error.message : 'Failed to update stage name')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Stage name"
        autoFocus
        required
      />
      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
    </form>
  )
}
