import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import type { AIAnalysisResult, DailyRecord } from '../../types'
import { getRiskInfo } from '../../lib/recovery'
import { cn } from '../../lib/utils'

interface Props {
  record: DailyRecord
  onAnalyze: () => AIAnalysisResult
}

export function AIAnalysis({ record, onAnalyze }: Props) {
  const [result, setResult] = useState<AIAnalysisResult | null>(
    record.aiScore
      ? {
          score: record.aiScore,
          summary: record.aiAnalysis?.split('\n').filter((l) => !l.startsWith('参考') && !l.startsWith('指南') && !l.startsWith('已录入') && !l.startsWith('建议录入')) ?? [],
          suggestion: '',
          suggestions: [],
          riskLevel: 'green',
          references: record.aiAnalysis?.split('\n').filter((l) => l.startsWith('参考') || l.startsWith('指南') || l.startsWith('已录入') || l.startsWith('建议录入')) ?? [],
        }
      : null,
  )
  const [loading, setLoading] = useState(false)

  const handleAnalyze = () => {
    setLoading(true)
    setTimeout(() => {
      const r = onAnalyze()
      setResult(r)
      setLoading(false)
    }, 600)
  }

  const risk = result ? getRiskInfo(result.riskLevel) : null

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI 康复分析
          </CardTitle>
          <CardDescription>基于今日数据智能分析恢复趋势</CardDescription>
        </div>
        <Button onClick={handleAnalyze} disabled={loading} size="sm">
          {loading ? '分析中...' : '分析今天'}
        </Button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 space-y-4"
          >
            <ul className="space-y-1.5">
              {result.summary.map((line, i) => (
                <li key={i} className="text-sm text-foreground flex gap-2">
                  <span className="text-primary shrink-0">•</span>
                  {line}
                </li>
              ))}
            </ul>

            {(result.suggestions?.length > 0 || result.suggestion) && (
              <div className="bg-muted/50 rounded-xl px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">今日建议</p>
                <ul className="space-y-1">
                  {(result.suggestions?.length ? result.suggestions : [result.suggestion]).map((s) => (
                    <li key={s} className="text-sm text-foreground flex gap-2">
                      <span className="text-success shrink-0">✔</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs text-muted-foreground">恢复指数</p>
                <p className="text-3xl font-bold text-primary">{result.score} <span className="text-lg text-muted-foreground">/100</span></p>
              </div>
              {risk && (
                <div className={cn('rounded-xl border px-3 py-2 text-right', risk.color)}>
                  <p className="text-sm font-semibold">{risk.label}</p>
                  <p className="text-xs opacity-80">{risk.desc}</p>
                </div>
              )}
            </div>

            {result.references.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">分析依据</p>
                {result.references.map((ref) => (
                  <p key={ref} className="text-xs text-muted-foreground">· {ref}</p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}