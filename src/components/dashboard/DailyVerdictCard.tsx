import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Card } from '../ui/card'
import { getDailyVerdict } from '../../lib/dailyVerdict'
import type { DailyRecord, RecoveryConfig } from '../../types'
import { cn } from '../../lib/utils'

interface Props {
  today: DailyRecord
  records: Record<string, DailyRecord>
  config: RecoveryConfig
}

const STATUS_STYLE = {
  better: 'border-success/30 bg-success/5',
  worse: 'border-danger/30 bg-danger/5',
  caution: 'border-warning/30 bg-warning/5',
  stable: 'border-border bg-muted/30',
}

export function DailyVerdictCard({ today, records, config }: Props) {
  const verdict = getDailyVerdict(today, records, config)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className={cn('relative overflow-hidden', STATUS_STYLE[verdict.status])}>
        <div className="flex gap-3">
          <span className="text-3xl">{verdict.emoji}</span>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              今天比昨天好吗？
            </p>
            <p className="text-lg font-bold mt-1">{verdict.headline}</p>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{verdict.detail}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}