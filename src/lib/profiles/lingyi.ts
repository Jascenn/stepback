import type { InjuryTemplate, PatientProfile, RecordDefaults, RecoveryGoals, WeeklyTest } from '../../types'

export const LINGYI_RECORD_DEFAULTS: RecordDefaults = {
  painRest: 2,
  painWalking: 3,
  painPress: 2,
  swelling: 'moderate',
  shoeFit: 'tight',
  walkingStatus: 'crutches-both',
  weightBearing: 30,
  elevation: true,
}

export const LINGYI_PROFILE: PatientProfile = {
  name: '凌一',
  injuredSide: '右脚',
  injuryDate: '2026-04-14',
  currentPhase: '第 8 周（康复恢复期）',
  diagnoses: [
    '右跟骨前缘骨折（恢复期）',
    '右第5跖骨基底部骨折（恢复期）',
    '严重踝关节扭伤',
    '外侧韧带损伤恢复中',
    '局部废用性骨质疏松',
  ],
  ctFindings: [
    '无新鲜骨折',
    '无明显移位',
    '无骨不连',
    '无骨坏死',
    '骨折恢复中',
    '骨质密度降低',
    '跟骨前缘游离骨片',
  ],
  doctorCurrentPhase: '双拐保护下部分负重',
  doctorForbidden: ['跑步', '跳跃', '剧烈运动'],
  doctorAdvice: ['逐渐增加负重', '康复训练', '定期复查'],
  symptomPainLocations: ['外踝前方', '跟骨前缘'],
  symptomNotes: [
    '肿胀比左脚明显',
    '鞋子比左脚紧',
    '背屈（勾脚）明显受限',
    '双拐行走，左脚先迈，右脚拖步',
    '尝试部分负重',
    '暂不能正常上下楼、开车',
  ],
  recordDefaults: { ...LINGYI_RECORD_DEFAULTS },
}

export const LINGYI_DOCTOR_PLAN = `当前阶段：双拐保护下部分负重（约30%）

禁止：跑步、跳跃、剧烈运动

建议：
• 逐渐增加负重
• 康复训练（踝泵、勾脚、重心转移）
• 定期复查
• 晚上泡温水 10 分钟
• 睡觉抬高患肢`

export const LINGYI_GOALS: RecoveryGoals = {
  targets: [
    '正常走路',
    '单拐',
    '脱拐',
    '正常上下楼',
    '正常开车',
    '恢复运动能力',
  ],
  shortTerm: [
    '双拐下稳定部分负重',
    '背屈活动度改善',
    '外侧酸胀减轻',
  ],
  midTerm: ['改单拐', '平地正常步行'],
  longTerm: [
    '正常走路',
    '正常上下楼',
    '正常开车',
    '恢复日常生活',
  ],
}

export const LINGYI_TEMPLATE: InjuryTemplate = {
  id: 'lingyi-multi',
  name: '凌一 · 跟骨+跖骨复合伤',
  icon: '🦶',
  description: '右跟骨前缘 + 第5跖骨基底部骨折，伴踝关节扭伤及韧带损伤',
  expectedRecoveryDays: 120,
  defaultWalkingStatus: 'crutches-both',
  defaultWeightBearing: 30,
  recommendedTraining: ['anklePump', 'toeCurl', 'weightShift', 'towelStretch', 'walkingTraining'],
  phaseTips: [
    {
      phase: '第 8 周',
      days: '康复恢复期',
      tips: [
        '双拐部分负重约 30%',
        '重点：勾脚训练改善背屈',
        '重心转移训练',
        '不建议改单拐',
        '外踝酸胀需持续观察',
      ],
    },
  ],
  redFlags: ['疼痛连续 3 天加重', '肿胀持续增加', '滑倒或扭伤', '脚趾麻木发紫'],
  isBuiltin: false,
}

export function createEmptyWeeklyTest(date: string): WeeklyTest {
  return {
    date,
    weekNumber: 0,
    shoeTightnessDiff: false,
    lateralSwellingChange: false,
    dorsiflexionAngle: '',
    gaitVideoRecorded: false,
    singleStandSeconds: 0,
    maxWalkingDistance: '',
    canUpstairs: false,
    reportGenerated: false,
  }
}