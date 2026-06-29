import { Card } from '../ui/card'
import type { DailyRecord } from '../../types'
import { cn } from '../../lib/utils'

interface Props {
  record: DailyRecord
  hasSaved: boolean
}

export function TodayProgress({ record, hasSaved }: Props) {
  const checks = [
    record.painRest > 0 || record.painWalking > 0,
    record.swelling !== 'none' || record.shoeFit !== 'normal',
    record.weightBearing > 0,
    Object.values(record.training).some(Boolean),
    record.steps > 0,
    record.notes.length > 0,
    hasSaved,
  ]
  const done = checks.filter(Boolean).length

  return (
    <Card className="py-3 px-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">今日记录进度</span>
        <span className="text-xs font-bold text-primary">{done}/7</span>
      </div>
      <div className="flex gap-1">
        {checks.map((ok, i) => (
          <div
            key={i}
            className={cn('h-1.5 flex-1 rounded-full transition-colors', ok ? 'bg-primary' : 'bg-muted')}
          />
        ))}
      </div>
      {done >= 5 && !record.aiScore && (
        <p className="text-xs text-success mt-2">填得差不多了，可以点「分析今天」</p>
      )}
    </Card>
  )
}