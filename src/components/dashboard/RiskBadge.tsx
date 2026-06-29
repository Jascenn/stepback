import { detectRiskTrends, analyzeRecovery, getRiskInfo } from '../../lib/recovery'
import { addDays, todayString } from '../../lib/utils'
import type { DailyRecord } from '../../types'
import { cn } from '../../lib/utils'

interface Props {
  today: DailyRecord
  records: Record<string, DailyRecord>
}

export function RiskBadge({ today, records }: Props) {
  const yesterday = records[addDays(todayString(), -1)] ?? null
  const { riskLevel: instant } = analyzeRecovery(today, yesterday)
  const trends = detectRiskTrends(records)

  if (trends.length > 0) {
    return (
      <div className="space-y-2">
        {trends.map((alert) => {
          const info = getRiskInfo(alert.level)
          return (
            <div key={alert.label} className={cn('rounded-2xl border px-4 py-3 flex items-center gap-3', info.color)}>
              <div
                className={cn(
                  'h-3 w-3 rounded-full shrink-0',
                  alert.level === 'green' && 'bg-success',
                  alert.level === 'yellow' && 'bg-warning',
                  alert.level === 'red' && 'bg-danger',
                )}
              />
              <div>
                <p className="text-sm font-semibold">{alert.label}</p>
                <p className="text-xs opacity-80">{alert.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const risk = getRiskInfo(instant)

  return (
    <div className={cn('rounded-2xl border px-4 py-3 flex items-center gap-3', risk.color)}>
      <div
        className={cn(
          'h-3 w-3 rounded-full shrink-0',
          instant === 'green' && 'bg-success',
          instant === 'yellow' && 'bg-warning',
          instant === 'red' && 'bg-danger',
        )}
      />
      <div>
        <p className="text-sm font-semibold">{risk.label}</p>
        <p className="text-xs opacity-80">{risk.desc}</p>
      </div>
    </div>
  )
}