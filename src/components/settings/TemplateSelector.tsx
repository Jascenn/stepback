import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import type { InjuryTemplate, RecoveryConfig } from '../../types'
import { BUILTIN_TEMPLATES, applyTemplateToConfig, createCustomTemplate } from '../../lib/templates'
import { cn } from '../../lib/utils'

interface Props {
  config: RecoveryConfig
  customTemplates: InjuryTemplate[]
  onConfigChange: (patch: Partial<RecoveryConfig>) => void
  onAddCustomTemplate: (template: InjuryTemplate) => void
}

export function TemplateSelector({
  config,
  customTemplates,
  onConfigChange,
  onAddCustomTemplate,
}: Props) {
  const [newName, setNewName] = useState('')
  const allTemplates = [...BUILTIN_TEMPLATES, ...customTemplates]

  const selectTemplate = (template: InjuryTemplate) => {
    onConfigChange(applyTemplateToConfig(template))
  }

  const handleCreateCustom = () => {
    if (!newName.trim()) return
    const template = createCustomTemplate(newName.trim())
    onAddCustomTemplate(template)
    onConfigChange(applyTemplateToConfig(template))
    setNewName('')
  }

  const activeId = config.templateId === 'custom' ? config.customTemplateId : config.templateId

  return (
    <div className="space-y-4">
      <Card>
        <CardTitle>伤痛模板</CardTitle>
        <CardDescription>选择最接近你情况的类型，可一键应用默认设置</CardDescription>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {allTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t)}
              className={cn(
                'rounded-xl border p-3 text-left transition-all',
                activeId === t.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/30',
              )}
            >
              <span className="text-xl">{t.icon}</span>
              <p className="text-sm font-semibold mt-1">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.description}</p>
              <p className="text-xs text-primary mt-1">约 {t.expectedRecoveryDays} 天</p>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="自定义模板名称，如「第五跖骨骨折」"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button variant="outline" size="sm" onClick={handleCreateCustom}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center py-2">
        医生医嘱请在「我的档案 → 医嘱」中配置
      </p>
    </div>
  )
}