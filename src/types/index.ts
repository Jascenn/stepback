export type Severity = 'none' | 'mild' | 'moderate' | 'severe'
export type WalkingAid = 'crutches-both' | 'crutch-one' | 'none'
export type ShoeFit = 'normal' | 'tight' | 'very-tight'
export type RiskLevel = 'green' | 'yellow' | 'red'
export type TrendRange = '7' | '30' | '90' | 'all'

export type TemplateId = 'fracture' | 'ligament' | 'sprain' | 'surgery' | 'custom'

export interface TrainingItem {
  anklePump: boolean
  toeCurl: boolean
  weightShift: boolean
  heelRaise: boolean
  towelStretch: boolean
  walkingTraining: boolean
  balanceTraining: boolean
}

export type TrainingKey = keyof TrainingItem

export interface InjuryTemplate {
  id: string
  name: string
  icon: string
  description: string
  expectedRecoveryDays: number
  defaultWalkingStatus: WalkingAid
  defaultWeightBearing: number
  recommendedTraining: TrainingKey[]
  phaseTips: { phase: string; days: string; tips: string[] }[]
  redFlags: string[]
  isBuiltin: boolean
}

export interface GuidelineSource {
  title: string
  organization: string
  url: string
  summary: string
  lastChecked?: string
}

export interface GuidelineArticle {
  id: string
  templateIds: TemplateId[]
  term: string
  explanation: string
  sources: GuidelineSource[]
}

export interface GuidelinesBundle {
  version: string
  updatedAt: string
  disclaimer: string
  articles: GuidelineArticle[]
}

export interface DailyRecord {
  date: string
  painRest: number
  painWalking: number
  painPress: number
  morningStiffness: Severity
  swelling: Severity
  shoeFit: ShoeFit
  hasFever: boolean
  isRed: boolean
  walkingStatus: WalkingAid
  weightBearing: number
  canSingleStand: boolean
  canUpstairs: boolean
  canDownstairs: boolean
  canDrive: boolean
  training: TrainingItem
  trainingMinutes: number
  steps: number
  walkingMinutes: number
  footSoak: boolean
  icePack: boolean
  heatPack: boolean
  elevation: boolean
  notes: string
  aiScore?: number
  aiAnalysis?: string
}

export interface RecordDefaults {
  painRest: number
  painWalking: number
  painPress: number
  swelling: Severity
  shoeFit: ShoeFit
  walkingStatus: WalkingAid
  weightBearing: number
  elevation: boolean
}

export interface PatientProfile {
  name: string
  injuredSide: string
  injuryDate: string
  currentPhase: string
  diagnoses: string[]
  ctFindings: string[]
  doctorCurrentPhase: string
  doctorForbidden: string[]
  doctorAdvice: string[]
  symptomPainLocations: string[]
  symptomNotes: string[]
  recordDefaults: RecordDefaults
}

export interface RecoveryGoals {
  targets: string[]
  shortTerm: string[]
  midTerm: string[]
  longTerm: string[]
}

export interface WeeklyTest {
  date: string
  weekNumber: number
  shoeTightnessDiff: boolean
  lateralSwellingChange: boolean
  dorsiflexionAngle: string
  gaitVideoRecorded: boolean
  singleStandSeconds: number
  maxWalkingDistance: string
  canUpstairs: boolean
  reportGenerated: boolean
  reportSummary?: string
}

export interface RecoveryConfig {
  injuryDate: string
  expectedRecoveryDays: number
  injuryType: string
  templateId: TemplateId
  customTemplateId?: string
  doctorPlan: string
  doctorWeightBearingLimit: number | null
  reminderEnabled: boolean
  reminderTime: string
  darkMode: boolean
}

export interface Milestone {
  id: string
  title: string
  icon: string
  description: string
  unlockedAt?: string
}

export interface AppState {
  config: RecoveryConfig
  profile: PatientProfile
  goals: RecoveryGoals
  records: Record<string, DailyRecord>
  weeklyTests: Record<string, WeeklyTest>
  milestones: Milestone[]
  customTemplates: InjuryTemplate[]
  guidelinesCache?: GuidelinesBundle
  guidelinesFetchedAt?: string
}

export interface RiskTrendAlert {
  level: RiskLevel
  label: string
  desc: string
}

export interface AIAnalysisResult {
  score: number
  summary: string[]
  suggestion: string
  suggestions: string[]
  riskLevel: RiskLevel
  references: string[]
}