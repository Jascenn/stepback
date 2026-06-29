import { Card, CardDescription, CardTitle } from '../ui/card'
import { Slider } from '../ui/slider'
import { RadioGroup } from '../ui/radio-group'
import { Checkbox } from '../ui/checkbox'
import type { DailyRecord, WalkingAid } from '../../types'

interface Props {
  record: DailyRecord
  onChange: (patch: Partial<DailyRecord>) => void
}

const WALKING_OPTIONS = [
  { value: 'crutches-both', label: '双拐' },
  { value: 'crutch-one', label: '单拐' },
  { value: 'none', label: '脱拐' },
]

export function WeightBearingSection({ record, onChange }: Props) {
  return (
    <Card>
      <CardTitle>负重 Weight Bearing</CardTitle>
      <CardDescription>行走状态与负重能力</CardDescription>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-sm font-medium mb-2.5">Walking Status</p>
          <RadioGroup
            value={record.walkingStatus}
            onValueChange={(v) => onChange({ walkingStatus: v as WalkingAid })}
            options={WALKING_OPTIONS}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Weight Bearing</span>
            <span className="text-sm font-bold text-primary tabular-nums">{record.weightBearing}%</span>
          </div>
          <Slider
            value={[record.weightBearing]}
            onValueChange={([v]) => onChange({ weightBearing: v })}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-3">是否能</p>
          <div className="grid grid-cols-2 gap-3">
            <Checkbox
              checked={record.canSingleStand}
              onCheckedChange={(v) => onChange({ canSingleStand: v })}
              label="单脚站立"
            />
            <Checkbox
              checked={record.canUpstairs}
              onCheckedChange={(v) => onChange({ canUpstairs: v })}
              label="上楼"
            />
            <Checkbox
              checked={record.canDownstairs}
              onCheckedChange={(v) => onChange({ canDownstairs: v })}
              label="下楼"
            />
            <Checkbox
              checked={record.canDrive}
              onCheckedChange={(v) => onChange({ canDrive: v })}
              label="正常开车"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}