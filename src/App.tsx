import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRecoveryData } from './hooks/useRecoveryData'
import { useReminder } from './hooks/useReminder'
import { useGuidelines } from './hooks/useGuidelines'
import { Navigation, type Tab } from './components/layout/Navigation'
import { ProgressHeader } from './components/dashboard/ProgressHeader'
import { DailyVerdictCard } from './components/dashboard/DailyVerdictCard'
import { TodayProgress } from './components/dashboard/TodayProgress'
import { PainSection } from './components/dashboard/PainSection'
import { SwellingSection } from './components/dashboard/SwellingSection'
import { WeightBearingSection } from './components/dashboard/WeightBearingSection'
import { TrainingSection } from './components/dashboard/TrainingSection'
import { ActivitySection } from './components/dashboard/ActivitySection'
import { NotesSection } from './components/dashboard/NotesSection'
import { AIAnalysis } from './components/dashboard/AIAnalysis'
import { RiskBadge } from './components/dashboard/RiskBadge'
import { DoctorPlanBanner } from './components/dashboard/DoctorPlanBanner'
import { RecoveryScoreCard } from './components/dashboard/RecoveryScoreCard'
import { RecoveryTimeline } from './components/timeline/RecoveryTimeline'
import { WelcomeCard } from './components/onboarding/WelcomeCard'
import { TrendCharts } from './components/trends/TrendCharts'
import { Milestones } from './components/milestones/Milestones'
import { GuidelinesPanel } from './components/guidelines/GuidelinesPanel'
import { SettingsPanel } from './components/settings/SettingsPanel'
import { generateDemoData } from './lib/demo-data'
import { saveState } from './lib/storage'
import { getActiveTemplate } from './lib/templates'
import type { GuidelinesBundle } from './types'

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const {
    state,
    todayRecord,
    updateToday,
    updateConfig,
    updateProfile,
    updateGoals,
    runAIAnalysis,
    hasTodayRecord,
    setState,
    addCustomTemplate,
  } = useRecoveryData()

  const cacheGuidelines = useCallback(
    (bundle: GuidelinesBundle) => {
      setState((prev) => ({
        ...prev,
        guidelinesCache: bundle,
        guidelinesFetchedAt: new Date().toISOString(),
      }))
    },
    [setState],
  )

  const { bundle, loading, error, reload } = useGuidelines(state.guidelinesCache, cacheGuidelines)
  const activeTemplate = getActiveTemplate(state.config, state.customTemplates)
  const isNewUser = Object.keys(state.records).length === 0

  const loadDemo = () => {
    const demo = generateDemoData()
    setState(demo)
    saveState(demo)
  }

  const goSettings = () => setTab('settings')

  useReminder(state.config, hasTodayRecord)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 pt-6 pb-28">
        <AnimatePresence mode="wait">
          {tab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <ProgressHeader config={state.config} records={state.records} profile={state.profile} />

              {isNewUser && <WelcomeCard onGoSettings={goSettings} />}

              <DailyVerdictCard today={todayRecord} records={state.records} config={state.config} />
              <RecoveryScoreCard today={todayRecord} records={state.records} />
              <TodayProgress record={todayRecord} hasSaved={hasTodayRecord} />
              <DoctorPlanBanner config={state.config} />
              <RiskBadge today={todayRecord} records={state.records} />

              <PainSection record={todayRecord} onChange={updateToday} />
              <SwellingSection record={todayRecord} onChange={updateToday} />
              <WeightBearingSection record={todayRecord} onChange={updateToday} />
              <TrainingSection
                record={todayRecord}
                onChange={updateToday}
                recommendedTraining={activeTemplate.recommendedTraining}
              />
              <ActivitySection record={todayRecord} onChange={updateToday} />
              <NotesSection record={todayRecord} onChange={updateToday} />
              <AIAnalysis record={todayRecord} onAnalyze={runAIAnalysis} />
            </motion.div>
          )}

          {tab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <TrendCharts records={state.records} />
              <RecoveryTimeline injuryDate={state.config.injuryDate} records={state.records} />
            </motion.div>
          )}

          {tab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Milestones milestones={state.milestones} />
            </motion.div>
          )}

          {tab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <SettingsPanel
                config={state.config}
                profile={state.profile}
                goals={state.goals}
                state={state}
                onConfigChange={updateConfig}
                onProfileChange={updateProfile}
                onGoalsChange={updateGoals}
                onLoadDemo={loadDemo}
                customTemplates={state.customTemplates}
                onAddCustomTemplate={addCustomTemplate}
              />
              <GuidelinesPanel
                templateId={state.config.templateId}
                template={activeTemplate}
                bundle={bundle}
                loading={loading}
                error={error}
                onReload={reload}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Navigation active={tab} onChange={setTab} />
    </div>
  )
}