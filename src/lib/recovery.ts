import { addDays, daysBetween, todayString } from './utils'
import type {
  AIAnalysisResult,
  AppState,
  DailyRecord,
  InjuryTemplate,
  Milestone,
  RecoveryConfig,
  RiskLevel,
  RiskTrendAlert,
  Severity,
} from '../types'
import { TRAINING_LABELS } from './templates'

const SEVERITY_SCORE: Record<Severity, number> = {
  none: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
}

const WALKING_LABELS = {
  'crutches-both': '双拐',
  'crutch-one': '单拐',
  none: '脱拐',
} as const

export function getRecoveryDay(injuryDate: string): number {
  return daysBetween(injuryDate, todayString()) + 1
}

export function getExpectedEndDate(injuryDate: string, expectedDays: number): string {
  return addDays(injuryDate, expectedDays - 1)
}

function getRecentRecordsBefore(
  records: Record<string, DailyRecord>,
  asOfDate: string,
  limit = 7,
): DailyRecord[] {
  return Object.values(records)
    .filter((r) => r.date <= asOfDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit)
}

export function getProgressPercent(
  injuryDate: string,
  expectedDays: number,
  records: Record<string, DailyRecord>,
  asOfDate = todayString(),
): number {
  const day = daysBetween(injuryDate, asOfDate) + 1
  const timeProgress = Math.min((day / expectedDays) * 100, 100)

  const recentRecords = getRecentRecordsBefore(records, asOfDate)
  if (recentRecords.length === 0) return Math.round(timeProgress * 0.5)

  const avgScore =
    recentRecords.reduce((sum, r) => sum + calculateDailyScore(r), 0) / recentRecords.length

  return Math.round(timeProgress * 0.4 + avgScore * 0.6)
}

export function getProgressDelta(
  injuryDate: string,
  expectedDays: number,
  records: Record<string, DailyRecord>,
): { delta: number; message: string } | null {
  const today = todayString()
  const yesterday = addDays(today, -1)
  const todayProgress = getProgressPercent(injuryDate, expectedDays, records, today)
  const yesterdayProgress = getProgressPercent(injuryDate, expectedDays, records, yesterday)
  const delta = Math.round((todayProgress - yesterdayProgress) * 10) / 10

  if (!records[today] && !records[yesterday]) return null

  if (delta > 0) {
    return { delta, message: `今天比昨天多恢复了 ${delta}%` }
  }
  if (delta < 0) {
    return { delta, message: `今天较昨天回落 ${Math.abs(delta)}%，注意休息` }
  }
  return { delta: 0, message: '今天和昨天恢复进度持平，保持稳定也是进步' }
}

export function getRecoveryScoreDelta(
  today: DailyRecord,
  yesterday: DailyRecord | null,
): { score: number; delta: number | null } {
  const score = today.aiScore ?? calculateDailyScore(today)
  if (!yesterday) return { score, delta: null }
  const yesterdayScore = yesterday.aiScore ?? calculateDailyScore(yesterday)
  return { score, delta: score - yesterdayScore }
}

export function calculateDailyScore(record: DailyRecord): number {
  const painAvg = (record.painRest + record.painWalking + record.painPress) / 3
  const painScore = Math.max(0, 100 - painAvg * 10)
  const swellingPenalty = SEVERITY_SCORE[record.swelling] * 8
  const trainingCount = Object.values(record.training).filter(Boolean).length
  const trainingScore = (trainingCount / 7) * 20
  const weightScore = record.weightBearing * 0.3

  return Math.min(100, Math.round(painScore * 0.4 + weightScore + trainingScore - swellingPenalty + 10))
}

export function countTrainingMinutes(record: DailyRecord): number {
  const durations: Record<keyof DailyRecord['training'], number> = {
    anklePump: 5,
    toeCurl: 5,
    weightShift: 8,
    heelRaise: 6,
    towelStretch: 5,
    walkingTraining: 10,
    balanceTraining: 8,
  }
  return Object.entries(record.training).reduce(
    (sum, [key, done]) => sum + (done ? durations[key as keyof typeof durations] : 0),
    0,
  )
}

export function analyzeRecovery(
  today: DailyRecord,
  yesterday: DailyRecord | null,
  template?: InjuryTemplate,
  config?: RecoveryConfig,
): AIAnalysisResult {
  const summary: string[] = []
  let riskLevel: RiskLevel = 'green'

  if (yesterday) {
    const painDelta =
      (today.painRest + today.painWalking + today.painPress) / 3 -
      (yesterday.painRest + yesterday.painWalking + yesterday.painPress) / 3

    if (painDelta < -0.5) {
      summary.push(`今天疼痛较昨日下降 ${Math.abs(painDelta).toFixed(1)} 分。`)
    } else if (painDelta > 0.5) {
      summary.push(`今天疼痛较昨日上升 ${painDelta.toFixed(1)} 分。`)
      riskLevel = painDelta > 2 ? 'red' : 'yellow'
    } else {
      summary.push('今天疼痛水平与昨日基本持平。')
    }

    const weightDelta = today.weightBearing - yesterday.weightBearing
    if (weightDelta > 0) {
      summary.push(`负重能力提高 ${weightDelta}%。`)
    } else if (weightDelta < 0) {
      summary.push(`负重能力下降 ${Math.abs(weightDelta)}%，建议减少训练量。`)
      riskLevel = 'yellow'
    }

    const swellDelta = SEVERITY_SCORE[today.swelling] - SEVERITY_SCORE[yesterday.swelling]
    if (swellDelta > 0) {
      summary.push('肿胀有所加重，建议冰敷并抬高患肢。')
      riskLevel = riskLevel === 'red' ? 'red' : 'yellow'
    } else if (swellDelta < 0) {
      summary.push('肿胀有所减轻。')
    } else {
      summary.push('肿胀无明显变化。')
    }
  } else {
    summary.push('这是你的第一条康复记录，继续保持每日记录。')
  }

  if (today.hasFever || today.isRed) {
    summary.push('检测到发热或发红症状，建议联系医生。')
    riskLevel = 'red'
  }

  if (config?.doctorWeightBearingLimit != null && today.weightBearing > config.doctorWeightBearingLimit) {
    summary.push(`今日负重 ${today.weightBearing}% 已超过医嘱上限 ${config.doctorWeightBearingLimit}%。`)
    riskLevel = riskLevel === 'red' ? 'red' : 'yellow'
  }

  const missedTraining = template?.recommendedTraining.filter((k) => !today.training[k]) ?? []
  if (missedTraining.length > 0 && riskLevel === 'green') {
    summary.push(`建议完成模板推荐训练：${missedTraining.map((k) => TRAINING_LABELS[k]).join('、')}。`)
  }

  const trendGood = riskLevel === 'green'
  if (trendGood) {
    summary.push('目前恢复趋势良好。')
  }

  const score = calculateDailyScore(today)

  const references = [
    template ? `参考模板：${template.name}` : null,
    config?.doctorPlan ? '已录入医生方案，分析时已纳入医嘱约束' : '建议录入医生方案以获得更精准建议',
    '指南来源：AAOS / NHS / Mayo Clinic 等公开资料（见「指南」页）',
  ].filter(Boolean) as string[]

  const suggestions = buildDailySuggestions(today, riskLevel, template, config)

  return { score, summary, suggestion: suggestions.join('\n'), suggestions, riskLevel, references }
}

export function buildDailySuggestions(
  record: DailyRecord,
  risk: RiskLevel,
  _template?: InjuryTemplate,
  config?: RecoveryConfig,
): string[] {
  if (risk === 'red') {
    return ['暂停增加训练量', '联系医生评估', '今晚抬高患肢']
  }
  if (risk === 'yellow') {
    return ['减少 20% 负重和步行', '加强冰敷', '今晚抬高患肢']
  }

  const items: string[] = []

  if (record.walkingStatus === 'crutches-both') {
    items.push('继续双拐部分负重')
    items.push('不建议改单拐')
  }

  if (!record.training.toeCurl) items.push('勾脚训练 20 分钟')
  if (!record.training.weightShift) items.push('重心转移训练')
  if (!record.training.anklePump) items.push('踝泵练习')

  if (!record.footSoak) items.push('晚上泡温水 10 分钟')
  if (record.elevation) items.push('睡觉抬高患肢')

  if (config?.doctorWeightBearingLimit != null && record.weightBearing < config.doctorWeightBearingLimit) {
    items.push(`可逐步向医嘱上限 ${config.doctorWeightBearingLimit}% 靠近`)
  }

  return items.length ? items : ['保持当前训练节奏，继续每日记录']
}

export function detectRiskTrends(records: Record<string, DailyRecord>): RiskTrendAlert[] {
  const sorted = getSortedRecords(records)
  const alerts: RiskTrendAlert[] = []

  if (sorted.length >= 3) {
    const last3 = sorted.slice(-3)
    const pains = last3.map((r) => (r.painRest + r.painWalking + r.painPress) / 3)
    const painRising = pains[2] - pains[0] >= 2
    if (painRising) {
      alerts.push({
        level: 'red',
        label: '疼痛持续上升',
        desc: '连续 3 天疼痛增加 ≥2 分，建议联系医生',
      })
    }

    const swellRising =
      SEVERITY_SCORE[last3[2].swelling] > SEVERITY_SCORE[last3[0].swelling] &&
      SEVERITY_SCORE[last3[2].swelling] > SEVERITY_SCORE[last3[1].swelling]
    if (swellRising) {
      alerts.push({
        level: 'yellow',
        label: '肿胀持续增加',
        desc: '连续 3 天肿胀加重，建议减少训练量',
      })
    }
  }

  if (sorted.length >= 7) {
    const last7 = sorted.slice(-7)
    const scores = last7.map((r) => r.aiScore ?? calculateDailyScore(r))
    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores)
    if (maxScore - minScore < 3) {
      alerts.push({
        level: 'yellow',
        label: '恢复停滞',
        desc: '连续 7 天恢复指数无明显进步，建议调整康复计划或复诊',
      })
    }
  }

  return alerts
}

export function checkMilestones(state: AppState, record: DailyRecord): Milestone[] {
  const today = record.date
  const updates: { id: string; date: string }[] = []

  if (record.weightBearing > 0) updates.push({ id: 'first-weight', date: today })
  if (record.walkingStatus === 'crutch-one') updates.push({ id: 'single-crutch', date: today })
  if (record.walkingStatus === 'none') updates.push({ id: 'no-crutch', date: today })
  if (record.walkingStatus === 'none' && record.painWalking <= 2 && record.steps > 3000) {
    updates.push({ id: 'normal-walk', date: today })
  }
  if (record.canUpstairs && record.canDownstairs) updates.push({ id: 'stairs', date: today })
  if (record.canDrive) updates.push({ id: 'drive', date: today })
  if (record.training.balanceTraining && record.weightBearing >= 100 && record.painWalking <= 1) {
    updates.push({ id: 'sport', date: today })
  }

  return state.milestones.map((m) => {
    const unlock = updates.find((u) => u.id === m.id)
    if (unlock && !m.unlockedAt) {
      return { ...m, unlockedAt: unlock.date }
    }
    return m
  })
}

export function getRiskInfo(level: RiskLevel) {
  const map = {
    green: { label: '恢复正常', desc: '继续训练', color: 'text-success bg-success/10 border-success/20' },
    yellow: { label: '注意', desc: '今天训练量偏大，建议减少 20%', color: 'text-warning bg-warning/10 border-warning/20' },
    red: { label: '警告', desc: '疼痛持续增加，建议联系医生', color: 'text-danger bg-danger/10 border-danger/20' },
  }
  return map[level]
}

export function getWalkingLabel(status: DailyRecord['walkingStatus']): string {
  return WALKING_LABELS[status]
}

export function getSortedRecords(records: Record<string, DailyRecord>): DailyRecord[] {
  return Object.values(records).sort((a, b) => a.date.localeCompare(b.date))
}