import { Bone, BookOpen, Target } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import type { PatientProfile, RecoveryGoals, InjuryTemplate } from '../../types'
import { RecoveryGoalsCard } from '../dashboard/RecoveryGoalsCard'

interface Props {
  profile: PatientProfile
  goals: RecoveryGoals
  template: InjuryTemplate
  onOpenGuide: () => void
}

export function InjuryCenter({ profile, goals, template, onOpenGuide }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bone className="h-5 w-5 text-primary" />
          我的伤情
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI 康复助手持久记忆 — 所有分析基于此档案
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="text-center py-4">
          <span className="text-4xl">{template.icon}</span>
          <h3 className="text-2xl font-bold mt-2">{profile.injuredSide}</h3>
          <p className="text-sm text-muted-foreground mt-1">{profile.currentPhase}</p>
          <p className="text-xs text-muted-foreground mt-2">受伤 {profile.injuryDate}</p>
        </div>

        <div className="border-t border-border px-4 py-3 space-y-2">
          {profile.diagnoses.map((d) => (
            <p key={d} className="text-sm font-medium text-center">{d}</p>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>影像摘要</CardTitle>
        <ul className="mt-3 space-y-1.5">
          {profile.ctFindings.map((c) => (
            <li key={c} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-success shrink-0">✓</span>{c}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>当前医嘱</CardTitle>
        <CardDescription className="text-success font-medium">✅ {profile.doctorCurrentPhase}</CardDescription>
        <div className="mt-3 space-y-2 text-sm">
          <p><span className="text-danger font-medium">禁止：</span>{profile.doctorForbidden.join('、')}</p>
          <p><span className="text-muted-foreground">建议：</span>{profile.doctorAdvice.join('、')}</p>
        </div>
      </Card>

      <RecoveryGoalsCard goals={goals} />

      <Button variant="outline" className="w-full" onClick={onOpenGuide}>
        <BookOpen className="h-4 w-4" />
        康复指南 & 术语解释
      </Button>

      <Card className="opacity-70">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4" />
          即将支持
        </CardTitle>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>📅 复诊管理 — X光/CT/医嘱时间轴</li>
          <li>🌤️ 天气关联 — 分析酸胀与气温湿度</li>
          <li>🩻 CT 上传 — AI 生成通俗解读</li>
        </ul>
      </Card>
    </div>
  )
}