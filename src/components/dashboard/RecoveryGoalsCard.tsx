import { Target } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import type { RecoveryGoals } from '../../types'
import { cn } from '../../lib/utils'

interface Props {
  goals: RecoveryGoals
}

export function RecoveryGoalsCard({ goals }: Props) {
  return (
    <Card>
      <CardTitle className="flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        我的康复目标
      </CardTitle>
      <CardDescription>近期 → 中期 → 长期</CardDescription>

      <div className="mt-4 space-y-3">
        <GoalBlock label="近期（2 周）" items={goals.shortTerm} color="text-primary" />
        <GoalBlock label="中期（1 个月）" items={goals.midTerm} color="text-warning" />
        <GoalBlock label="长期（2 个月）" items={goals.longTerm} color="text-success" />
      </div>
    </Card>
  )
}

function GoalBlock({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div>
      <p className={cn('text-xs font-semibold', color)}>{label}</p>
      <ul className="mt-1 space-y-0.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground flex gap-2">
            <span className="text-success shrink-0">✔</span>{item}
          </li>
        ))}
      </ul>
    </div>
  )
}

