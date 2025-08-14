'use client'

import { useState } from 'react'
import { StageRuleForm } from './StageRuleForm'

interface Stage {
  id: string
  name: string
  order: number
  stageRule?: {
    id: string
    templateTitle: string
    offsetDays: number
  } | null
}

interface StageRulesSectionProps {
  stages: Stage[]
  pipelineId: string
}

export function StageRulesSection({ stages, pipelineId }: StageRulesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const stagesWithRules = stages.filter(stage => stage.stageRule)
  const stagesWithoutRules = stages.filter(stage => !stage.stageRule)

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Stage Rules</h2>
            <p className="text-sm text-gray-600">
              Automatically create tasks when items enter stages
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isExpanded ? 'Hide Rules' : 'Manage Rules'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Stages with Rules */}
          {stagesWithRules.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Active Rules</h3>
              <div className="space-y-3">
                {stagesWithRules.map((stage) => (
                  <div key={stage.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium text-green-900">{stage.name}</div>
                      <div className="text-sm text-green-700">
                        "{stage.stageRule!.templateTitle}" - Due in {stage.stageRule!.offsetDays} days
                      </div>
                    </div>
                    <StageRuleForm 
                      stageId={stage.id} 
                      stageName={stage.name} 
                      pipelineId={pipelineId} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stages without Rules */}
          {stagesWithoutRules.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Add Rules</h3>
              <div className="space-y-3">
                {stagesWithoutRules.map((stage) => (
                  <div key={stage.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{stage.name}</div>
                      <div className="text-sm text-gray-600">No rule configured</div>
                    </div>
                    <StageRuleForm 
                      stageId={stage.id} 
                      stageName={stage.name} 
                      pipelineId={pipelineId} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">How Stage Rules Work</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• When an item enters a stage with a rule, a task is automatically created</li>
              <li>• The task title uses your template and includes the item context</li>
              <li>• The due date is calculated as "offset days" from when the item enters the stage</li>
              <li>• Tasks are assigned to the pipeline item's owner</li>
              <li>• Rules can be updated or deleted at any time</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
