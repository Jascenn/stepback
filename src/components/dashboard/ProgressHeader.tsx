import { motion } from 'framer-motion'
import type { PatientProfile, RecoveryConfig } from '../../types'
import {
  getExpectedEndDate,
  getProgressDelta,
  getProgressPercent,
  getRecoveryDay,
} from '../../lib/recovery'
import type { DailyRecord } from '../../types'
import { cn } from '../../lib/utils'

interface Props {
  config: RecoveryConfig
  records: Record<string, DailyRecord>
  profile?: PatientProfile
}

export function ProgressHeader({ config, records, profile }: Props) {
  const progress = getProgressPercent(config.injuryDate, config.expectedRecoveryDays, records)
  const day = getRecoveryDay(config.injuryDate)
  const endDate = getExpectedEndDate(config.injuryDate, config.expectedRecoveryDays)
  const progressDelta = getProgressDelta(config.injuryDate, config.expectedRecoveryDays, records)

  const filled = Math.round(progress / 10)
  const bar = '█'.repeat(filled) + '░'.repeat(10 - filled)

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-2xl">🦶</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">StepBack</h1>
            <p className="text-xs text-muted-foreground">AI Recovery Tracker</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 pl-9">
          {profile ? `${profile.name} · ${profile.injuredSide}` : '一步一步，把正常生活走回来'}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg">🦶</span>
          <span className="text-sm font-semibold text-muted-foreground">Day {day}</span>
        </div>

        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-3">
          恢复进度
        </p>

        <p className="font-mono text-sm tracking-wider text-primary mt-2 select-none">{bar}</p>

        <div className="flex items-end justify-between mt-2">
          <p className="text-4xl font-bold text-primary tabular-nums">{progress}%</p>
        </div>

        {progressDelta && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'text-sm mt-3 px-3 py-2 rounded-xl',
              progressDelta.delta > 0
                ? 'bg-success/10 text-success font-medium'
                : progressDelta.delta < 0
                  ? 'bg-warning/10 text-warning'
                  : 'bg-muted text-muted-foreground',
            )}
          >
            {progressDelta.message}
          </motion.p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-border">
          <Stat label="受伤日期" value={config.injuryDate} />
          <Stat label="预计恢复" value={`${config.expectedRecoveryDays} 天`} />
          <Stat label="预计完成" value={endDate} />
        </div>
      </div>
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  )
}