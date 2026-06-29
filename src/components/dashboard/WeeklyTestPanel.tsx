import { CalendarCheck, FileText } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import type { WeeklyTest } from '../../types'
import { getRecoveryDay } from '../../lib/recovery'

interface Props {
  injuryDate: string
  test: WeeklyTest
  isSunday: boolean
  onChange: (patch: Partial<WeeklyTest>) => void
  onGenerateReport: () => void
}

export function WeeklyTestPanel({ injuryDate, test, isSunday, onChange, onGenerateReport }: Props) {
  const weekNum = Math.ceil(getRecoveryDay(injuryDate) / 7)

  if (!isSunday) {
    return (
      <Card className="opacity-60">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarCheck className="h-4 w-4" />
          每周测试（周日）
        </CardTitle>
        <CardDescription>周日记录：鞋子松紧、肿胀、勾脚角度、步态视频等</CardDescription>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardTitle className="flex items-center gap-2">
        <CalendarCheck className="h-4 w-4 text-primary" />
        第 {weekNum} 周康复测试
      </CardTitle>
      <CardDescription>每周日固定测试项目</CardDescription>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Checkbox checked={test.shoeTightnessDiff} onCheckedChange={(v) => onChange({ shoeTightnessDiff: v })} label="双脚鞋子松紧差异" />
        <Checkbox checked={test.lateralSwellingChange} onCheckedChange={(v) => onChange({ lateralSwellingChange: v })} label="外踝肿胀变化" />
        <Checkbox checked={test.gaitVideoRecorded} onCheckedChange={(v) => onChange({ gaitVideoRecorded: v })} label="步态视频已录" />
        <Checkbox checked={test.canUpstairs} onCheckedChange={(v) => onChange({ canUpstairs: v })} label="上楼能力测试" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="勾脚角度（备注）" value={test.dorsiflexionAngle} onChange={(v) => onChange({ dorsiflexionAngle: v })} placeholder="例如：改善 5°" />
        <Field label="最大连续步行" value={test.maxWalkingDistance} onChange={(v) => onChange({ maxWalkingDistance: v })} placeholder="例如：500m" />
        <Field label="单脚站立（秒）" value={String(test.singleStandSeconds)} onChange={(v) => onChange({ singleStandSeconds: Number(v) || 0 })} placeholder="0" type="number" />
      </div>

      <Button className="mt-4 w-full" size="sm" onClick={onGenerateReport}>
        <FileText className="h-4 w-4" />
        生成第 {weekNum} 周康复报告
      </Button>

      {test.reportSummary && (
        <pre className="mt-3 text-xs bg-background rounded-xl p-3 whitespace-pre-wrap text-muted-foreground border border-border">
          {test.reportSummary}
        </pre>
      )}
    </Card>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}