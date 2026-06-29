import { Card, CardDescription, CardTitle } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import type { DailyRecord } from '../../types'

interface Props {
  record: DailyRecord
  onChange: (patch: Partial<DailyRecord>) => void
}

export function ActivitySection({ record, onChange }: Props) {
  return (
    <Card>
      <CardTitle>活动记录</CardTitle>
      <CardDescription>今日活动与护理</CardDescription>

      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="步数"
            value={record.steps}
            onChange={(v) => onChange({ steps: v })}
          />
          <NumberField
            label="步行时间（分钟）"
            value={record.walkingMinutes}
            onChange={(v) => onChange({ walkingMinutes: v })}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <Checkbox checked={record.footSoak} onCheckedChange={(v) => onChange({ footSoak: v })} label="泡脚" />
          <Checkbox checked={record.icePack} onCheckedChange={(v) => onChange({ icePack: v })} label="冰敷" />
          <Checkbox checked={record.heatPack} onCheckedChange={(v) => onChange({ heatPack: v })} label="热敷" />
          <Checkbox checked={record.elevation} onCheckedChange={(v) => onChange({ elevation: v })} label="抬高患肢" />
        </div>
      </div>
    </Card>
  )
}

function NumberField({
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
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}