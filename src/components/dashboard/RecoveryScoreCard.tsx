import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { Card } from '../ui/card'
import type { DailyRecord } from '../../types'
import { getRecoveryScoreDelta } from '../../lib/recovery'
import { addDays, todayString } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface Props {
  today: DailyRecord
  records: Record<string, DailyRecord>
}

export function RecoveryScoreCard({ today, records }: Props) {
  const yesterday = records[addDays(todayString(), -1)] ?? null
  const { score, delta } = getRecoveryScoreDelta(today, yesterday)

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today</p>
          <p className="text-sm text-muted-foreground mt-0.5">Recovery Score</p>
          <div className="flex items-baseline gap-1 mt-2">
            <motion.span
              key={score}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-primary tabular-nums"
            >
              {score}
            </motion.span>
            <span className="text-lg text-muted-foreground font-medium">/100</span>
          </div>
        </div>

        {delta !== null && (
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold',
              delta > 0 && 'bg-success/10 text-success',
              delta < 0 && 'bg-danger/10 text-danger',
              delta === 0 && 'bg-muted text-muted-foreground',
            )}
          >
            {delta > 0 && <TrendingUp className="h-4 w-4" />}
            {delta < 0 && <TrendingDown className="h-4 w-4" />}
            {delta === 0 && <Minus className="h-4 w-4" />}
            <span>{delta > 0 ? `+${delta}` : delta}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        {delta !== null ? 'Compared with yesterday' : '完成今日记录后自动计算'}
      </p>
    </Card>
  )
}