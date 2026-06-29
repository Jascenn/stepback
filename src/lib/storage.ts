import type { AppState, DailyRecord, InjuryTemplate, RecoveryConfig } from '../types'
import {
  LINGYI_DOCTOR_PLAN,
  LINGYI_GOALS,
  LINGYI_PROFILE,
  LINGYI_RECORD_DEFAULTS,
  LINGYI_TEMPLATE,
} from './profiles/lingyi'
import { todayString } from './utils'

const STORAGE_KEY = 'recovery-tracker-v3'

export const DEFAULT_MILESTONES = [
  { id: 'first-weight', title: '第一次正常负重', icon: '🏅', description: '开始部分负重' },
  { id: 'single-crutch', title: '第一次改单拐', icon: '🏅', description: '从双拐改为单拐' },
  { id: 'no-crutch', title: '第一次脱拐', icon: '🏅', description: '完全脱拐行走' },
  { id: 'normal-walk', title: '第一次正常走路', icon: '🏅', description: '步态自然行走' },
  { id: 'stairs', title: '第一次正常上下楼', icon: '🏅', description: '独立上下楼梯' },
  { id: 'drive', title: '第一次正常开车', icon: '🏅', description: '恢复正常驾驶' },
  { id: 'sport', title: '第一次恢复运动', icon: '🏅', description: '恢复运动能力' },
]

export const DEFAULT_CONFIG: RecoveryConfig = {
  injuryDate: LINGYI_PROFILE.injuryDate,
  expectedRecoveryDays: 120,
  injuryType: LINGYI_TEMPLATE.name,
  templateId: 'custom',
  customTemplateId: LINGYI_TEMPLATE.id,
  doctorPlan: LINGYI_DOCTOR_PLAN,
  doctorWeightBearingLimit: 30,
  reminderEnabled: true,
  reminderTime: '20:30',
  darkMode: false,
}

export function createEmptyRecord(date: string, profile?: { recordDefaults?: typeof LINGYI_RECORD_DEFAULTS }): DailyRecord {
  const d = profile?.recordDefaults ?? LINGYI_RECORD_DEFAULTS
  return {
    date,
    painRest: d.painRest,
    painWalking: d.painWalking,
    painPress: d.painPress,
    morningStiffness: 'mild',
    swelling: d.swelling,
    shoeFit: d.shoeFit,
    hasFever: false,
    isRed: false,
    walkingStatus: d.walkingStatus,
    weightBearing: d.weightBearing,
    canSingleStand: false,
    canUpstairs: false,
    canDownstairs: false,
    canDrive: false,
    training: {
      anklePump: false,
      toeCurl: false,
      weightShift: false,
      heelRaise: false,
      towelStretch: false,
      walkingTraining: false,
      balanceTraining: false,
    },
    trainingMinutes: 0,
    steps: 0,
    walkingMinutes: 0,
    footSoak: false,
    icePack: false,
    heatPack: false,
    elevation: d.elevation,
    notes: '',
  }
}

function migrate(parsed: Record<string, unknown>): AppState {
  const config = { ...DEFAULT_CONFIG, ...(parsed.config as Partial<RecoveryConfig>) }
  return {
    config: {
      ...config,
      reminderTime: config.reminderTime || '20:30',
      doctorPlan: config.doctorPlan || LINGYI_DOCTOR_PLAN,
      doctorWeightBearingLimit: config.doctorWeightBearingLimit ?? 30,
      customTemplateId: config.customTemplateId || LINGYI_TEMPLATE.id,
      templateId: config.templateId || 'custom',
    },
    profile: {
      ...LINGYI_PROFILE,
      ...(parsed.profile as Partial<typeof LINGYI_PROFILE>),
      recordDefaults: {
        ...LINGYI_RECORD_DEFAULTS,
        ...(parsed.profile as Partial<typeof LINGYI_PROFILE>)?.recordDefaults,
      },
    },
    goals: { ...LINGYI_GOALS, ...(parsed.goals as Partial<typeof LINGYI_GOALS>) },
    records: (parsed.records as Record<string, DailyRecord>) ?? {},
    weeklyTests: (parsed.weeklyTests as Record<string, AppState['weeklyTests'][string]>) ?? {},
    milestones: mergeMilestones(parsed.milestones as AppState['milestones']),
    customTemplates: mergeCustomTemplates(parsed.customTemplates as InjuryTemplate[]),
    guidelinesCache: parsed.guidelinesCache as AppState['guidelinesCache'],
    guidelinesFetchedAt: parsed.guidelinesFetchedAt as string | undefined,
  }
}

function mergeMilestones(existing?: AppState['milestones']): AppState['milestones'] {
  if (!existing?.length) return DEFAULT_MILESTONES.map((m) => ({ ...m }))
  const map = new Map(existing.map((m) => [m.id, m]))
  return DEFAULT_MILESTONES.map((d) => {
    const old = map.get(d.id)
    if (d.id === 'run' && map.has('run')) {
      return { ...d, id: 'sport', unlockedAt: map.get('run')?.unlockedAt }
    }
    return old ? { ...d, unlockedAt: old.unlockedAt } : { ...d }
  })
}

function mergeCustomTemplates(existing?: InjuryTemplate[]): InjuryTemplate[] {
  const hasLingyi = existing?.some((t) => t.id === LINGYI_TEMPLATE.id)
  if (hasLingyi) return existing!
  return [LINGYI_TEMPLATE, ...(existing ?? [])]
}

export function loadState(): AppState {
  try {
    for (const key of [STORAGE_KEY, 'recovery-tracker-v2', 'recovery-tracker-v1']) {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      return migrate(JSON.parse(raw) as Record<string, unknown>)
    }
  } catch {
    // fall through
  }
  return getFreshState()
}

export function getFreshState(): AppState {
  return {
    config: { ...DEFAULT_CONFIG },
    profile: { ...LINGYI_PROFILE },
    goals: { ...LINGYI_GOALS },
    records: {},
    weeklyTests: {},
    milestones: DEFAULT_MILESTONES.map((m) => ({ ...m })),
    customTemplates: [LINGYI_TEMPLATE],
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getTodayRecord(state: AppState): DailyRecord {
  const today = todayString()
  return state.records[today] ?? createEmptyRecord(today, state.profile)
}