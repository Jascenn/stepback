import { useCallback, useEffect, useState } from 'react'
import type { AppState, DailyRecord, PatientProfile, RecoveryConfig, RecoveryGoals, WeeklyTest } from '../types'
import { getTodayRecord, loadState, saveState } from '../lib/storage'
import {
  analyzeRecovery as runAnalysis,
  checkMilestones as runMilestones,
  countTrainingMinutes,
  getRecoveryDay,
  getSortedRecords,
  calculateDailyScore,
} from '../lib/recovery'
import { getActiveTemplate } from '../lib/templates'
import { createEmptyWeeklyTest } from '../lib/profiles/lingyi'
import { addDays, todayString } from '../lib/utils'

export function useRecoveryData() {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    if (state.config.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.config.darkMode])

  const today = todayString()
  const todayRecord = state.records[today] ?? getTodayRecord(state)
  const isSunday = new Date().getDay() === 0
  const weekKey = today
  const weeklyTest = state.weeklyTests[weekKey] ?? {
    ...createEmptyWeeklyTest(today),
    weekNumber: Math.ceil(getRecoveryDay(state.config.injuryDate) / 7),
  }

  const updateToday = useCallback((patch: Partial<DailyRecord>) => {
    setState((prev) => {
      const current = prev.records[today] ?? getTodayRecord(prev)
      const updated: DailyRecord = {
        ...current,
        ...patch,
        date: today,
      }
      if (patch.training) {
        updated.trainingMinutes = countTrainingMinutes(updated)
      }
      const milestones = runMilestones(prev, updated)
      return {
        ...prev,
        records: { ...prev.records, [today]: updated },
        milestones,
      }
    })
  }, [today])

  const updateConfig = useCallback((patch: Partial<RecoveryConfig>) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, ...patch },
    }))
  }, [])

  const updateProfile = useCallback((patch: Partial<PatientProfile>) => {
    setState((prev) => {
      const profile = { ...prev.profile, ...patch }
      const config = { ...prev.config }
      if (patch.injuryDate) config.injuryDate = patch.injuryDate
      return { ...prev, profile, config }
    })
  }, [])

  const updateGoals = useCallback((patch: Partial<RecoveryGoals>) => {
    setState((prev) => ({
      ...prev,
      goals: { ...prev.goals, ...patch },
    }))
  }, [])

  const updateWeeklyTest = useCallback((patch: Partial<WeeklyTest>) => {
    setState((prev) => {
      const current = prev.weeklyTests[weekKey] ?? {
        ...createEmptyWeeklyTest(today),
        weekNumber: Math.ceil(getRecoveryDay(prev.config.injuryDate) / 7),
      }
      return {
        ...prev,
        weeklyTests: {
          ...prev.weeklyTests,
          [weekKey]: { ...current, ...patch, date: today },
        },
      }
    })
  }, [today, weekKey])

  const generateWeeklyReport = useCallback(() => {
    const weekNum = Math.ceil(getRecoveryDay(state.config.injuryDate) / 7)
    const records = getSortedRecords(state.records).slice(-7)
    const avgPain = records.length
      ? records.reduce((s, r) => s + (r.painRest + r.painWalking + r.painPress) / 3, 0) / records.length
      : 0
    const avgScore = records.length
      ? records.reduce((s, r) => s + (r.aiScore ?? calculateDailyScore(r)), 0) / records.length
      : 0

    const report = `《第 ${weekNum} 周康复报告》
患者：${state.profile.name}
阶段：${state.profile.currentPhase}

本周概览：
• 记录天数：${records.length} 天
• 平均疼痛：${avgPain.toFixed(1)} / 10
• 恢复指数：${Math.round(avgScore)} / 100
• 负重比例：${todayRecord.weightBearing}%
• 步态：${todayRecord.walkingStatus === 'crutches-both' ? '双拐' : todayRecord.walkingStatus === 'crutch-one' ? '单拐' : '脱拐'}

周日测试：
• 鞋子松紧差异：${weeklyTest.shoeTightnessDiff ? '是' : '否'}
• 外踝肿胀变化：${weeklyTest.lateralSwellingChange ? '有' : '无'}
• 勾脚角度：${weeklyTest.dorsiflexionAngle || '未记录'}
• 单脚站立：${weeklyTest.singleStandSeconds} 秒

建议：继续双拐部分负重，重点勾脚和重心转移，不建议改单拐。`

    updateWeeklyTest({ reportGenerated: true, reportSummary: report })
    return report
  }, [state, todayRecord, weeklyTest, updateWeeklyTest])

  const runAIAnalysis = useCallback(() => {
    const yesterday = addDays(today, -1)
    const yesterdayRecord = state.records[yesterday] ?? null
    const current = state.records[today] ?? getTodayRecord(state)
    const template = getActiveTemplate(state.config, state.customTemplates)
    const result = runAnalysis(current, yesterdayRecord, template, state.config)

    updateToday({
      aiScore: result.score,
      aiAnalysis: [
        ...result.summary,
        ...result.suggestions,
        ...result.references,
      ].join('\n'),
    })

    return result
  }, [state.records, state.config, state.customTemplates, today, updateToday])

  const addCustomTemplate = useCallback((template: import('../types').InjuryTemplate) => {
    setState((prev) => ({
      ...prev,
      customTemplates: [...prev.customTemplates, template],
    }))
  }, [])

  const hasTodayRecord = Boolean(state.records[today])

  return {
    state,
    todayRecord,
    weeklyTest,
    isSunday,
    updateToday,
    updateConfig,
    updateProfile,
    updateGoals,
    updateWeeklyTest,
    generateWeeklyReport,
    runAIAnalysis,
    hasTodayRecord,
    setState,
    addCustomTemplate,
  }
}