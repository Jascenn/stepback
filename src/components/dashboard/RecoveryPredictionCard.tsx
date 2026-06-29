import { Calendar } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { predictRecoveryEvents, formatPredictionDisclaimer } from '../../lib/predictions'
import { formatDisplayDate } from '../../lib/utils'
import type { DailyRecord, RecoveryConfig } from '../../types'

interface Props {
  records: Record<string, DailyRecord>
  config: RecoveryConfig
}

export function RecoveryPredictionCard({ records, config }: Props) {
  const predictions = predictRecoveryEvents(records, config)

  if (predictions.length === 0) {
    return (
      <Card>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-primary" />
          AI 恢复预测
        </CardTitle>
        <CardDescription>记录 3 天以上后，根据恢复速度预测里程碑日期</CardDescription>
      </Card>
    )
  }

  return (
    <Card>
      <CardTitle className="flex items-center gap-2 text-base">
        <Calendar className="h-4 w-4 text-primary" />
        AI 恢复预测
      </CardTitle>
      <CardDescription>基于近 7 天恢复速度估算</CardDescription>

      <div className="mt-4 space-y-3">
        {predictions.map((p) => (
          <div key={p.event} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-semibold">{p.event}</p>
              <p className="text-xs text-muted-foreground">约 {p.daysAway} 天后</p>
            </div>
            <p className="text-sm font-medium text-primary">{formatDisplayDate(p.date)}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
        {formatPredictionDisclaimer()}
      </p>
    </Card>
  )
}