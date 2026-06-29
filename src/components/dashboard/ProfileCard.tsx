import { useState } from 'react'
import { ChevronDown, ChevronUp, User } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import type { PatientProfile } from '../../types'
import { cn } from '../../lib/utils'

interface Props {
  profile: PatientProfile
}

export function ProfileCard({ profile }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <div>
            <CardTitle className="text-base">{profile.name} · {profile.injuredSide}</CardTitle>
            <CardDescription>{profile.currentPhase}</CardDescription>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      <div className={cn('overflow-hidden transition-all', open ? 'max-h-[2000px] mt-4' : 'max-h-0')}>
        <div className="space-y-4 text-sm">
          <Section title="诊断">
            <ul className="space-y-1">
              {profile.diagnoses.map((d) => (
                <li key={d} className="text-muted-foreground flex gap-2"><span className="text-primary">•</span>{d}</li>
              ))}
            </ul>
          </Section>

          <Section title="最新 CT">
            <ul className="space-y-1">
              {profile.ctFindings.map((c) => (
                <li key={c} className="text-muted-foreground flex gap-2"><span className="text-success">✓</span>{c}</li>
              ))}
            </ul>
          </Section>

          <Section title="当前症状">
            <p className="text-muted-foreground mb-1">疼痛位置：{profile.symptomPainLocations.join('、')}</p>
            <ul className="space-y-1">
              {profile.symptomNotes.map((s) => (
                <li key={s} className="text-muted-foreground flex gap-2"><span>☑</span>{s}</li>
              ))}
            </ul>
          </Section>

          <Section title="医嘱">
            <p className="font-medium text-success">✅ {profile.doctorCurrentPhase}</p>
            <p className="text-danger mt-2">禁止：{profile.doctorForbidden.join('、')}</p>
            <p className="text-muted-foreground mt-2">建议：{profile.doctorAdvice.join('、')}</p>
          </Section>
        </div>
      </div>
    </Card>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-3 border-t border-border first:border-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
      {children}
    </div>
  )
}