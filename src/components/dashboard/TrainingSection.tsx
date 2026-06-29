import { Card, CardDescription, CardTitle } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import type { DailyRecord, TrainingKey } from '../../types'
import { TRAINING_LABELS } from '../../lib/templates'
import { cn } from '../../lib/utils'

interface Props {
  record: DailyRecord
  onChange: (patch: Partial<DailyRecord>) => void
  recommendedTraining?: TrainingKey[]
}

const TRAINING_ITEMS: { key: keyof DailyRecord['training']; label: string }[] = [
  { key: 'anklePump', label: '踝泵' },
  { key: 'toeCurl', label: '勾脚' },
  { key: 'weightShift', label: '重心转移' },
  { key: 'heelRaise', label: '提踵' },
  { key: 'towelStretch', label: '毛巾拉伸' },
  { key: 'walkingTraining', label: '步行训练' },
  { key: 'balanceTraining', label: '平衡训练' },
]

export function TrainingSection({ record, onChange, recommendedTraining = [] }: Props) {
  const toggle = (key: keyof DailyRecord['training'], checked: boolean) => {
    onChange({
      training: { ...record.training, [key]: checked },
    })
  }

  return (
    <Card>
      <CardTitle>今日训练</CardTitle>
      <CardDescription>勾选完成的康复训练项目</CardDescription>

      {recommendedTraining.length > 0 && (
        <p className="mt-3 text-xs text-primary bg-primary/5 rounded-lg px-3 py-2">
          模板推荐：{recommendedTraining.map((k) => TRAINING_LABELS[k]).join('、')}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TRAINING_ITEMS.map(({ key, label }) => (
          <div
            key={key}
            className={cn(
              recommendedTraining.includes(key) && !record.training[key] && 'ring-1 ring-primary/30 rounded-lg p-1 -m-1',
            )}
          >
            <Checkbox
              checked={record.training[key]}
              onCheckedChange={(v) => toggle(key, v)}
              label={recommendedTraining.includes(key) ? `${label} ★` : label}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">今日训练</span>
        <span className="text-lg font-bold text-primary">{record.trainingMinutes} 分钟</span>
      </div>
    </Card>
  )
}