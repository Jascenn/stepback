import { analyzeRecovery, calculateDailyScore, detectRiskTrends, getProgressDelta } from './recovery'
import { addDays, todayString } from './utils'
import type { DailyRecord, RecoveryConfig } from '../types'

export type VerdictStatus = 'better' | 'worse' | 'caution' | 'stable'

export interface DailyVerdict {
  status: VerdictStatus
  headline: string
  detail: string
  emoji: string
}

export function getDailyVerdict(
  today: DailyRecord,
  records: Record<string, DailyRecord>,
  config: RecoveryConfig,
): DailyVerdict {
  const yesterday = records[addDays(todayString(), -1)] ?? null
  const trends = detectRiskTrends(records)
  const progress = getProgressDelta(config.injuryDate, config.expectedRecoveryDays, records)
  const analysis = analyzeRecovery(today, yesterday)

  if (trends.some((t) => t.level === 'red')) {
    return {
      status: 'worse',
      emoji: '🔴',
      headline: '今天需要警惕',
      detail: trends.find((t) => t.level === 'red')!.desc,
    }
  }

  if (trends.some((t) => t.level === 'yellow') || analysis.riskLevel === 'yellow') {
    return {
      status: 'caution',
      emoji: '⚠️',
      headline: '今天比昨天挑战更大',
      detail: '训练量可能偏多，建议减少 20% 负重和步行，加强冰敷和抬高患肢。',
    }
  }

  if (progress && progress.delta > 0) {
    return {
      status: 'better',
      emoji: '✅',
      headline: `今天比昨天好了 ${progress.delta}%`,
      detail: buildBetterDetail(today, yesterday),
    }
  }

  if (progress && progress.delta < 0) {
    return {
      status: 'worse',
      emoji: '⚠️',
      headline: `今天较昨天回落 ${Math.abs(progress.delta)}%`,
      detail: '可能是昨天练得稍多，今天以休息和消肿为主，不必焦虑。',
    }
  }

  const scoreDelta = yesterday
    ? (today.aiScore ?? calculateDailyScore(today)) - (yesterday.aiScore ?? calculateDailyScore(yesterday))
    : 0

  if (scoreDelta > 0) {
    return {
      status: 'better',
      emoji: '✅',
      headline: '今天比昨天更好',
      detail: `恢复指数上升 ${scoreDelta} 分。${buildBetterDetail(today, yesterday)}`,
    }
  }

  return {
    status: 'stable',
    emoji: '➡️',
    headline: '今天和昨天差不多',
    detail: '保持稳定也是进步。继续记录，趋势比单日更重要。',
  }
}

function buildBetterDetail(today: DailyRecord, yesterday: DailyRecord | null): string {
  if (!yesterday) return '继续保持每日记录。'

  const parts: string[] = []
  const painToday = (today.painRest + today.painWalking + today.painPress) / 3
  const painYest = (yesterday.painRest + yesterday.painWalking + yesterday.painPress) / 3
  if (painToday < painYest - 0.3) parts.push(`疼痛下降 ${(painYest - painToday).toFixed(1)} 分`)
  if (today.weightBearing > yesterday.weightBearing) {
    parts.push(`负重提高 ${today.weightBearing - yesterday.weightBearing}%`)
  }
  if (today.steps > yesterday.steps + 500) parts.push(`步数增加 ${today.steps - yesterday.steps}`)
  if (parts.length === 0) return '整体状态平稳向好。'
  return parts.join('，') + '。'
}