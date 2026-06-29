import { Card, CardDescription, CardTitle } from '../ui/card'
import { RadioGroup } from '../ui/radio-group'
import { Checkbox } from '../ui/checkbox'
import type { DailyRecord, Severity, ShoeFit } from '../../types'

interface Props {
  record: DailyRecord
  onChange: (patch: Partial<DailyRecord>) => void
}

const SWELLING_OPTIONS = [
  { value: 'none', label: '无' },
  { value: 'mild', label: '轻' },
  { value: 'moderate', label: '中' },
  { value: 'severe', label: '明显' },
]

const SHOE_OPTIONS = [
  { value: 'normal', label: '正常' },
  { value: 'tight', label: '比左脚紧一点' },
  { value: 'very-tight', label: '很紧' },
]

export function SwellingSection({ record, onChange }: Props) {
  return (
    <Card>
      <CardTitle>肿胀 Swelling</CardTitle>
      <CardDescription>观察患肢肿胀情况</CardDescription>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-sm font-medium mb-2.5">肿胀程度</p>
          <RadioGroup
            value={record.swelling}
            onValueChange={(v) => onChange({ swelling: v as Severity })}
            options={SWELLING_OPTIONS}
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-2.5">鞋子</p>
          <RadioGroup
            value={record.shoeFit}
            onValueChange={(v) => onChange({ shoeFit: v as ShoeFit })}
            options={SHOE_OPTIONS}
          />
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Checkbox
            checked={record.hasFever}
            onCheckedChange={(v) => onChange({ hasFever: v })}
            label="发热"
          />
          <Checkbox
            checked={!record.isRed}
            onCheckedChange={(v) => onChange({ isRed: !v })}
            label="颜色正常"
          />
        </div>
      </div>
    </Card>
  )
}