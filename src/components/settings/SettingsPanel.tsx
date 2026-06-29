import { useState } from 'react'
import { Download, Moon, Sun, Bell, User, Sliders } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import type { AppState, InjuryTemplate, PatientProfile, RecoveryConfig, RecoveryGoals } from '../../types'
import { exportJSON, exportExcel, exportPDF } from '../../lib/export'
import { TemplateSelector } from './TemplateSelector'
import { ProfileEditor } from './ProfileEditor'
import { cn } from '../../lib/utils'

type SettingsTab = 'profile' | 'app'

interface Props {
  config: RecoveryConfig
  profile: PatientProfile
  goals: RecoveryGoals
  state: AppState
  onConfigChange: (patch: Partial<RecoveryConfig>) => void
  onProfileChange: (patch: Partial<PatientProfile>) => void
  onGoalsChange: (patch: Partial<RecoveryGoals>) => void
  onLoadDemo?: () => void
  customTemplates: InjuryTemplate[]
  onAddCustomTemplate: (template: InjuryTemplate) => void
}

export function SettingsPanel({
  config,
  profile,
  goals,
  state,
  onConfigChange,
  onProfileChange,
  onGoalsChange,
  onLoadDemo,
  customTemplates,
  onAddCustomTemplate,
}: Props) {
  const [tab, setTab] = useState<SettingsTab>('profile')

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        <TabButton active={tab === 'profile'} onClick={() => setTab('profile')} icon={User} label="我的档案" />
        <TabButton active={tab === 'app'} onClick={() => setTab('app')} icon={Sliders} label="应用设置" />
      </div>

      {tab === 'profile' && (
        <>
          <ProfileEditor
            profile={profile}
            goals={goals}
            config={config}
            onProfileChange={onProfileChange}
            onGoalsChange={onGoalsChange}
            onConfigChange={onConfigChange}
          />
          <TemplateSelector
            config={config}
            customTemplates={customTemplates}
            onConfigChange={onConfigChange}
            onAddCustomTemplate={onAddCustomTemplate}
          />
        </>
      )}

      {tab === 'app' && (
        <>
          <Card>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              提醒
            </CardTitle>
            <CardDescription>每天晚上提醒记录康复情况</CardDescription>
            <div className="mt-4 space-y-4">
              <Checkbox
                checked={config.reminderEnabled}
                onCheckedChange={(v) => onConfigChange({ reminderEnabled: v })}
                label="启用每日提醒"
              />
              <Field label="提醒时间">
                <input
                  type="time"
                  value={config.reminderTime}
                  onChange={(e) => onConfigChange({ reminderTime: e.target.value })}
                  disabled={!config.reminderEnabled}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardTitle className="flex items-center gap-2">
              {config.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              外观
            </CardTitle>
            <div className="mt-4">
              <Checkbox
                checked={config.darkMode}
                onCheckedChange={(v) => onConfigChange({ darkMode: v })}
                label="深色模式"
              />
            </div>
          </Card>

          <Card>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              导出数据
            </CardTitle>
            <CardDescription>档案、记录、目标一并导出</CardDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => exportJSON(state)}>
                导出 JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportExcel(state)}>
                导出 Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportPDF(state)}>
                导出 PDF 报告
              </Button>
            </div>
          </Card>

          {onLoadDemo && (
            <Card>
              <CardTitle>演示数据</CardTitle>
              <CardDescription>加载 72 天示例记录，预览完整功能</CardDescription>
              <Button variant="outline" size="sm" className="mt-4" onClick={onLoadDemo}>
                加载演示数据
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
        active ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}