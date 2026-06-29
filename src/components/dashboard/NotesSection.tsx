import { Card, CardDescription, CardTitle } from '../ui/card'
import type { DailyRecord } from '../../types'

interface Props {
  record: DailyRecord
  onChange: (patch: Partial<DailyRecord>) => void
}

export function NotesSection({ record, onChange }: Props) {
  return (
    <Card>
      <CardTitle>今日备注</CardTitle>
      <CardDescription>记录今天的感受和观察</CardDescription>

      <textarea
        value={record.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
        placeholder="例如：今天开始部分负重。下午走得比昨天自然。外侧还有酸胀。"
        rows={4}
        className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60"
      />
    </Card>
  )
}