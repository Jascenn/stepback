import { History } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { calculateDailyScore, getSortedRecords } from '../../lib/recovery'
import { daysBetween } from '../../lib/utils'
import type { DailyRecord } from '../../types'
import { cn } from '../../lib/utils'

interface Props {
  injuryDate: string
  records: Record<string, DailyRecord>
}

export function ScoreHistoryCard({ injuryDate, records }: Props) {
  const recent = getSortedRecords(records).slice(-7).reverse()

  if (recent.length < 2) return null

  return (
    <Card>
      <CardTitle className="flex items-center gap-2 text-base">
        <History className="h-4 w-4 text-primary" />
        恢复指数历史
      </CardTitle>
      <CardDescription>最近 {recent.length} 天变化</CardDescription>

      <div className="mt-4 space-y-1">
        {recent.map((r, i) => {
          const score = r.aiScore ?? calculateDailyScore(r)
          const day = daysBetween(injuryDate, r.date) + 1
          const prev = recent[i + 1]
          const prevScore = prev ? (prev.aiScore ?? calculateDailyScore(prev)) : null
          const delta = prevScore != null ? score - prevScore : null

          return (
            <div key={r.date} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-muted-foreground tabular-nums">Day {Math.max(1, day)}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary tabular-nums">{score}</span>
                {delta != null && (
                  <span
                    className={cn(
                      'text-xs tabular-nums',
                      delta > 0 && 'text-success',
                      delta < 0 && 'text-danger',
                      delta === 0 && 'text-muted-foreground',
                    )}
                  >
                    {delta > 0 ? `↑${delta}` : delta < 0 ? `↓${Math.abs(delta)}` : '—'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}