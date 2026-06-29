import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ChevronRight } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import type { DailyRecord } from '../../types'
import { calculateDailyScore, getWalkingLabel } from '../../lib/recovery'
import { addDays, daysBetween, todayString } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface Props {
  injuryDate: string
  records: Record<string, DailyRecord>
}

const KEY_DAYS = [1, 15, 30, 60, 90]

export function RecoveryTimeline({ injuryDate, records }: Props) {
  const today = todayString()
  const totalDays = daysBetween(injuryDate, today) + 1
  const [selected, setSelected] = useState<string | null>(
    records[today] ? today : Object.keys(records).sort().at(-1) ?? null,
  )

  const timelineDays = buildTimelineDays(injuryDate, totalDays, records)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">康复时间轴</h2>
        <p className="text-sm text-muted-foreground">像日记一样，回顾每一天的恢复</p>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-2">
          {timelineDays.map((item) => {
            const hasRecord = Boolean(records[item.date])
            const isSelected = selected === item.date
            const isKey = KEY_DAYS.includes(item.day)

            return (
              <div key={item.date} className="relative pl-10">
                <button
                  type="button"
                  onClick={() => setSelected(isSelected ? null : item.date)}
                  className={cn(
                    'absolute left-2 top-3 h-3 w-3 rounded-full border-2 transition-all',
                    hasRecord ? 'bg-primary border-primary' : 'bg-background border-muted-foreground/40',
                    isKey && 'h-4 w-4 left-1.5',
                    isSelected && 'ring-2 ring-primary/40 scale-125',
                  )}
                />

                <button
                  type="button"
                  onClick={() => setSelected(isSelected ? null : item.date)}
                  className={cn(
                    'w-full text-left rounded-xl border p-3 transition-all',
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30',
                    !hasRecord && 'opacity-60',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary">Day {item.day}</span>
                      {isKey && (
                        <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          节点
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                    </div>
                    {hasRecord && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">
                          {records[item.date].aiScore ?? calculateDailyScore(records[item.date])}
                        </span>
                        <ChevronRight className={cn('h-4 w-4 transition-transform', isSelected && 'rotate-90')} />
                      </div>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isSelected && records[item.date] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <DayDiary record={records[item.date]} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function buildTimelineDays(
  injuryDate: string,
  totalDays: number,
  records: Record<string, DailyRecord>,
) {
  const days = new Set<number>()
  KEY_DAYS.forEach((d) => { if (d <= totalDays) days.add(d) })
  Object.keys(records).forEach((date) => {
    const d = daysBetween(injuryDate, date) + 1
    days.add(d)
  })
  days.add(totalDays)

  return [...days]
    .sort((a, b) => b - a)
    .map((day) => ({ day, date: addDays(injuryDate, day - 1) }))
}

function DayDiary({ record }: { record: DailyRecord }) {
  const pain = ((record.painRest + record.painWalking + record.painPress) / 3).toFixed(1)
  const training = Object.entries(record.training).filter(([, v]) => v).length

  return (
    <Card className="mt-2 mb-1 border-dashed">
      <CardTitle className="text-sm">当日记录</CardTitle>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Stat label="疼痛" value={`${pain} / 10`} />
        <Stat label="肿胀" value={record.swelling} />
        <Stat label="负重" value={`${record.weightBearing}%`} />
        <Stat label="步态" value={getWalkingLabel(record.walkingStatus)} />
        <Stat label="步数" value={String(record.steps)} />
        <Stat label="训练" value={`${training} 项`} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Camera className="h-3.5 w-3.5" />
        <span>照片记录 — V4 即将支持</span>
      </div>

      {record.aiAnalysis && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground">AI 分析</p>
          <p className="text-xs mt-1 leading-relaxed line-clamp-4">{record.aiAnalysis}</p>
        </div>
      )}

      {record.notes && (
        <div className="mt-2">
          <p className="text-xs font-medium text-muted-foreground">备注</p>
          <p className="text-xs mt-1 italic">&ldquo;{record.notes}&rdquo;</p>
        </div>
      )}
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg px-2 py-1.5">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold capitalize">{value}</p>
    </div>
  )
}