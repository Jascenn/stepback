import { addDays, todayString } from './utils'
import { calculateDailyScore, getSortedRecords } from './recovery'
import type { DailyRecord, RecoveryConfig } from '../types'

export interface RecoveryPrediction {
  event: string
  date: string
  daysAway: number
}

export function predictRecoveryEvents(
  records: Record<string, DailyRecord>,
  _config: RecoveryConfig,
): RecoveryPrediction[] {
  const sorted = getSortedRecords(records)
  if (sorted.length < 3) return []

  const recent = sorted.slice(-7)
  const scores = recent.map((r) => r.aiScore ?? calculateDailyScore(r))
  const avgDailyGain =
    scores.length > 1 ? (scores[scores.length - 1] - scores[0]) / (scores.length - 1) : 0.5

  const today = sorted[sorted.length - 1]
  const currentScore = today.aiScore ?? calculateDailyScore(today)
  const weight = today.weightBearing
  const aid = today.walkingStatus

  const predictions: RecoveryPrediction[] = []
  const todayStr = todayString()

  const addPrediction = (event: string, targetScore: number, minDays = 7) => {
    const gap = Math.max(0, targetScore - currentScore)
    const days = Math.max(minDays, Math.round(gap / Math.max(avgDailyGain, 0.3)))
    predictions.push({
      event,
      date: addDays(todayStr, days),
      daysAway: days,
    })
  }

  if (aid === 'crutches-both' && weight < 50) {
    addPrediction('改单拐', currentScore + 8, 14)
  }
  if (aid !== 'none') {
    addPrediction('脱拐', currentScore + 15, 21)
  }
  if (!today.canUpstairs) {
    addPrediction('正常上下楼', currentScore + 20, 28)
  }
  if (!today.canDrive) {
    addPrediction('正常开车', currentScore + 25, 35)
  }
  addPrediction('恢复运动能力', 90, 45)

  return predictions.slice(0, 4)
}

export function formatPredictionDisclaimer(): string {
  return '仅供参考，不能替代医生评估。实际进度请遵医嘱。'
}