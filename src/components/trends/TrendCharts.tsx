import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { cn } from '../../lib/utils'
import type { DailyRecord, TrendRange } from '../../types'
import { getSortedRecords } from '../../lib/recovery'
import { calculateDailyScore } from '../../lib/recovery'

interface Props {
  records: Record<string, DailyRecord>
}

const RANGES: { value: TrendRange; label: string }[] = [
  { value: '7', label: '7天' },
  { value: '30', label: '30天' },
  { value: '90', label: '90天' },
  { value: 'all', label: '全部' },
]

const SEVERITY_NUM = { none: 0, mild: 1, moderate: 2, severe: 3 }

export function TrendCharts({ records }: Props) {
  const [range, setRange] = useState<TrendRange>('30')
  const all = getSortedRecords(records)

  const filtered = range === 'all' ? all : all.slice(-Number(range))

  const chartData = filtered.map((r) => ({
    date: r.date.slice(5),
    pain: Math.round(((r.painRest + r.painWalking + r.painPress) / 3) * 10) / 10,
    swelling: SEVERITY_NUM[r.swelling],
    weight: r.weightBearing,
    steps: r.steps,
    score: r.aiScore ?? calculateDailyScore(r),
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardTitle>趋势分析</CardTitle>
        <CardDescription>开始记录后自动生成图表</CardDescription>
        <p className="mt-6 text-sm text-muted-foreground text-center py-8">暂无数据，请先完成今日记录</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">趋势分析</h2>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                range === r.value ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <ChartCard title="疼痛趋势" subtitle="每日平均疼痛（0-10）">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)' }} />
          <Line type="monotone" dataKey="pain" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartCard>

      <ChartCard title="肿胀趋势" subtitle="0=无 1=轻 2=中 3=明显">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 3]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area type="monotone" dataKey="swelling" stroke="#F59E0B" fill="#F59E0B20" strokeWidth={2} />
        </AreaChart>
      </ChartCard>

      <ChartCard title="负重能力" subtitle="每日负重百分比">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartCard>

      <ChartCard title="步数" subtitle="每日步数">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area type="monotone" dataKey="steps" stroke="#22C55E" fill="#22C55E20" strokeWidth={2} />
        </AreaChart>
      </ChartCard>

      <ChartCard title="康复指数" subtitle="综合恢复评分">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartCard>
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactElement
}) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{subtitle}</CardDescription>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  )
}