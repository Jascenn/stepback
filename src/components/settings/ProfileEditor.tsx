import { useState } from 'react'
import { User, Stethoscope, Target, ClipboardList, RotateCcw, Check } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input, Textarea, FieldLabel } from '../ui/input'
import { ListEditor } from './ListEditor'
import { RadioGroup } from '../ui/radio-group'
import type { PatientProfile, RecoveryConfig, RecoveryGoals, Severity, ShoeFit, WalkingAid } from '../../types'
import { LINGYI_DOCTOR_PLAN, LINGYI_RECORD_DEFAULTS } from '../../lib/profiles/lingyi'
import { getFreshState } from '../../lib/storage'
import { cn } from '../../lib/utils'

type Section = 'basic' | 'medical' | 'doctor' | 'symptoms' | 'goals' | 'defaults'

interface Props {
  profile: PatientProfile
  goals: RecoveryGoals
  config: RecoveryConfig
  onProfileChange: (patch: Partial<PatientProfile>) => void
  onGoalsChange: (patch: Partial<RecoveryGoals>) => void
  onConfigChange: (patch: Partial<RecoveryConfig>) => void
}

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'basic', label: '基本', icon: User },
  { id: 'medical', label: '医疗', icon: ClipboardList },
  { id: 'doctor', label: '医嘱', icon: Stethoscope },
  { id: 'symptoms', label: '症状', icon: User },
  { id: 'goals', label: '目标', icon: Target },
  { id: 'defaults', label: '默认', icon: ClipboardList },
]

const SWELLING_OPTIONS = [
  { value: 'none', label: '无' },
  { value: 'mild', label: '轻' },
  { value: 'moderate', label: '中' },
  { value: 'severe', label: '重' },
]

const SHOE_OPTIONS = [
  { value: 'normal', label: '正常' },
  { value: 'tight', label: '偏紧' },
  { value: 'very-tight', label: '很紧' },
]

const WALKING_OPTIONS = [
  { value: 'crutches-both', label: '双拐' },
  { value: 'crutch-one', label: '单拐' },
  { value: 'none', label: '脱拐' },
]

export function ProfileEditor({
  profile,
  goals,
  config,
  onProfileChange,
  onGoalsChange,
  onConfigChange,
}: Props) {
  const [section, setSection] = useState<Section>('basic')
  const [saved, setSaved] = useState(false)
  const defaults = profile.recordDefaults ?? LINGYI_RECORD_DEFAULTS

  const flashSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleProfile = (patch: Partial<PatientProfile>) => {
    onProfileChange(patch)
    if (patch.injuryDate) {
      onConfigChange({ injuryDate: patch.injuryDate })
    }
    flashSaved()
  }

  const handleReset = () => {
    if (!confirm('恢复为凌一默认档案？当前修改将丢失。')) return
    const fresh = getFreshState()
    onProfileChange(fresh.profile)
    onGoalsChange(fresh.goals)
    onConfigChange({
      ...fresh.config,
      doctorPlan: LINGYI_DOCTOR_PLAN,
    })
    flashSaved()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">我的档案</h2>
          <p className="text-sm text-muted-foreground">可视化配置，无需改代码</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-success font-medium">
            <Check className="h-3.5 w-3.5" /> 已保存
          </span>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            className={cn(
              'flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              section === id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {section === 'basic' && (
        <Card>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>显示在首页顶部和报告中</CardDescription>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="患者姓名">
              <Input value={profile.name} onChange={(e) => handleProfile({ name: e.target.value })} />
            </Field>
            <Field label="受伤部位">
              <Input
                value={profile.injuredSide}
                onChange={(e) => handleProfile({ injuredSide: e.target.value })}
                placeholder="例如：右脚"
              />
            </Field>
            <Field label="受伤日期">
              <Input
                type="date"
                value={profile.injuryDate}
                onChange={(e) => handleProfile({ injuryDate: e.target.value })}
              />
            </Field>
            <Field label="当前阶段">
              <Input
                value={profile.currentPhase}
                onChange={(e) => handleProfile({ currentPhase: e.target.value })}
                placeholder="例如：第 8 周（康复恢复期）"
              />
            </Field>
            <Field label="预计恢复天数" className="sm:col-span-2">
              <Input
                type="number"
                min={1}
                value={config.expectedRecoveryDays}
                onChange={(e) => {
                  onConfigChange({ expectedRecoveryDays: Number(e.target.value) || 120 })
                  flashSaved()
                }}
              />
            </Field>
          </div>
        </Card>
      )}

      {section === 'medical' && (
        <Card>
          <CardTitle>医疗信息</CardTitle>
          <CardDescription>诊断与影像结果，首页档案卡片可展开查看</CardDescription>
          <div className="mt-4 space-y-5">
            <ListEditor
              label="诊断"
              items={profile.diagnoses}
              onChange={(diagnoses) => handleProfile({ diagnoses })}
              placeholder="例如：右跟骨前缘骨折（恢复期）"
            />
            <ListEditor
              label="最新 CT / 影像"
              items={profile.ctFindings}
              onChange={(ctFindings) => handleProfile({ ctFindings })}
              placeholder="例如：无新鲜骨折"
            />
          </div>
        </Card>
      )}

      {section === 'doctor' && (
        <Card>
          <CardTitle>医生医嘱</CardTitle>
          <CardDescription>最高优先级，AI 分析和风险预警会参考</CardDescription>
          <div className="mt-4 space-y-4">
            <Field label="当前阶段（一句话）">
              <Input
                value={profile.doctorCurrentPhase}
                onChange={(e) => handleProfile({ doctorCurrentPhase: e.target.value })}
                placeholder="例如：双拐保护下部分负重"
              />
            </Field>
            <Field label="医嘱负重上限 (%)">
              <Input
                type="number"
                min={0}
                max={100}
                value={config.doctorWeightBearingLimit ?? ''}
                onChange={(e) => {
                  onConfigChange({
                    doctorWeightBearingLimit: e.target.value ? Number(e.target.value) : null,
                  })
                  flashSaved()
                }}
                placeholder="例如：30"
              />
            </Field>
            <ListEditor
              label="禁止事项"
              items={profile.doctorForbidden}
              onChange={(doctorForbidden) => handleProfile({ doctorForbidden })}
              placeholder="例如：跑步"
              addLabel="添加禁止项"
            />
            <ListEditor
              label="医生建议"
              items={profile.doctorAdvice}
              onChange={(doctorAdvice) => handleProfile({ doctorAdvice })}
              placeholder="例如：逐渐增加负重"
            />
            <Field label="完整医嘱（自由文本）">
              <Textarea
                rows={6}
                value={config.doctorPlan}
                onChange={(e) => {
                  onConfigChange({ doctorPlan: e.target.value })
                  flashSaved()
                }}
                placeholder="粘贴医生给的完整方案..."
              />
            </Field>
          </div>
        </Card>
      )}

      {section === 'symptoms' && (
        <Card>
          <CardTitle>当前症状</CardTitle>
          <CardDescription>作为康复基线参考</CardDescription>
          <div className="mt-4 space-y-5">
            <ListEditor
              label="疼痛位置"
              items={profile.symptomPainLocations}
              onChange={(symptomPainLocations) => handleProfile({ symptomPainLocations })}
              placeholder="例如：外踝前方"
            />
            <ListEditor
              label="症状描述"
              items={profile.symptomNotes}
              onChange={(symptomNotes) => handleProfile({ symptomNotes })}
              placeholder="例如：肿胀比左脚明显"
            />
          </div>
        </Card>
      )}

      {section === 'goals' && (
        <Card>
          <CardTitle>康复目标</CardTitle>
          <CardDescription>显示在首页底部目标卡片</CardDescription>
          <div className="mt-4 space-y-5">
            <ListEditor
              label="总体目标"
              items={goals.targets}
              onChange={(targets) => { onGoalsChange({ targets }); flashSaved() }}
              placeholder="例如：正常走路"
            />
            <ListEditor
              label="近期（约 2 周）"
              items={goals.shortTerm}
              onChange={(shortTerm) => { onGoalsChange({ shortTerm }); flashSaved() }}
            />
            <ListEditor
              label="中期（约 1 个月）"
              items={goals.midTerm}
              onChange={(midTerm) => { onGoalsChange({ midTerm }); flashSaved() }}
            />
            <ListEditor
              label="长期（约 2 个月）"
              items={goals.longTerm}
              onChange={(longTerm) => { onGoalsChange({ longTerm }); flashSaved() }}
            />
          </div>
        </Card>
      )}

      {section === 'defaults' && (
        <Card>
          <CardTitle>今日记录默认值</CardTitle>
          <CardDescription>每天打开时表单的初始值，改完仍可在「今日」页调整</CardDescription>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Field label="静息疼痛">
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={defaults?.painRest ?? 0}
                  onChange={(e) =>
                    handleProfile({
                      recordDefaults: { ...defaults, painRest: Number(e.target.value) },
                    })
                  }
                />
              </Field>
              <Field label="走路疼痛">
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={defaults?.painWalking ?? 0}
                  onChange={(e) =>
                    handleProfile({
                      recordDefaults: { ...defaults, painWalking: Number(e.target.value) },
                    })
                  }
                />
              </Field>
              <Field label="按压疼痛">
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={defaults?.painPress ?? 0}
                  onChange={(e) =>
                    handleProfile({
                      recordDefaults: { ...defaults, painPress: Number(e.target.value) },
                    })
                  }
                />
              </Field>
            </div>

            <Field label="默认肿胀">
              <RadioGroup
                value={defaults?.swelling ?? 'none'}
                onValueChange={(v) =>
                  handleProfile({
                    recordDefaults: { ...defaults, swelling: v as Severity },
                  })
                }
                options={SWELLING_OPTIONS}
              />
            </Field>

            <Field label="默认鞋子松紧">
              <RadioGroup
                value={defaults?.shoeFit ?? 'normal'}
                onValueChange={(v) =>
                  handleProfile({
                    recordDefaults: { ...defaults, shoeFit: v as ShoeFit },
                  })
                }
                options={SHOE_OPTIONS}
              />
            </Field>

            <Field label="默认行走状态">
              <RadioGroup
                value={defaults?.walkingStatus ?? 'crutches-both'}
                onValueChange={(v) =>
                  handleProfile({
                    recordDefaults: { ...defaults, walkingStatus: v as WalkingAid },
                  })
                }
                options={WALKING_OPTIONS}
              />
            </Field>

            <Field label="默认负重比例 (%)">
              <Input
                type="number"
                min={0}
                max={100}
                value={defaults?.weightBearing ?? 0}
                onChange={(e) =>
                  handleProfile({
                    recordDefaults: { ...defaults, weightBearing: Number(e.target.value) },
                  })
                }
              />
            </Field>
          </div>
        </Card>
      )}

      <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
        <RotateCcw className="h-4 w-4" />
        恢复凌一默认档案
      </Button>
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}