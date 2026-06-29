import { Card, CardDescription, CardTitle } from '../ui/card'
import { Slider } from '../ui/slider'
import { RadioGroup } from '../ui/radio-group'
import type { DailyRecord, Severity } from '../../types'

interface Props {
  record: DailyRecord
  onChange: (patch: Partial<DailyRecord>) => void
}

const STIFFNESS_OPTIONS = [
  { value: 'none', label: '无' },
  { value: 'mild', label: '轻' },
  { value: 'moderate', label: '中' },
  { value: 'severe', label: '重' },
]

export function PainSection({ record, onChange }: Props) {
  return (
    <Card>
      <CardTitle>Pain Score</CardTitle>
      <CardDescription>今日疼痛评估</CardDescription>

      <div className="mt-5 space-y-5">
        <PainSlider
          label="静息疼痛"
          value={record.painRest}
          onChange={(v) => onChange({ painRest: v })}
        />
        <PainSlider
          label="走路疼痛"
          value={record.painWalking}
          onChange={(v) => onChange({ painWalking: v })}
        />
        <PainSlider
          label="按压疼痛"
          value={record.painPress}
          onChange={(v) => onChange({ painPress: v })}
        />

        <div>
          <p className="text-sm font-medium mb-2.5">晨僵 Morning Stiffness</p>
          <RadioGroup
            value={record.morningStiffness}
            onValueChange={(v) => onChange({ morningStiffness: v as Severity })}
            options={STIFFNESS_OPTIONS}
          />
        </div>
      </div>
    </Card>
  )
}

function PainSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold text-primary tabular-nums">{value}</span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={0} max={10} />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">0</span>
        <span className="text-xs text-muted-foreground">10</span>
      </div>
    </div>
  )
}