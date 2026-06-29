import type { DailyRecord, InjuryTemplate, RecoveryConfig, TemplateId, TrainingKey } from '../types'

export const BUILTIN_TEMPLATES: InjuryTemplate[] = [
  {
    id: 'fracture',
    name: '骨折恢复',
    icon: '🦴',
    description: '跖骨、踝部、跟骨等骨折康复。强调医嘱负重时间表，早期踝泵+消肿。',
    expectedRecoveryDays: 120,
    defaultWalkingStatus: 'crutches-both',
    defaultWeightBearing: 0,
    recommendedTraining: ['anklePump', 'toeCurl', 'towelStretch'],
    phaseTips: [
      { phase: '急性期', days: '第 1-2 周', tips: ['不负重或遵医嘱微量触地', '冰敷+抬高', '踝泵每小时 10 次', '记录疼痛和肿胀'] },
      { phase: '修复期', days: '第 3-8 周', tips: ['逐步部分负重（遵医嘱）', '增加勾脚、重心转移', '步数缓慢递增', '复查 X 光确认愈合'] },
      { phase: '功能期', days: '第 9 周+', tips: ['脱拐训练', '提踵、平衡训练', '步态矫正', '运动回归需医生许可'] },
    ],
    redFlags: ['脚趾麻木发紫', '剧烈疼痛突然加重', '发烧或伤口红肿渗液', '小腿肿胀伴胸痛'],
    isBuiltin: true,
  },
  {
    id: 'ligament',
    name: '韧带损伤',
    icon: '🩹',
    description: '踝关节韧带撕裂/部分断裂。POLICE 原则，逐步恢复稳定性训练。',
    expectedRecoveryDays: 75,
    defaultWalkingStatus: 'crutch-one',
    defaultWeightBearing: 25,
    recommendedTraining: ['anklePump', 'toeCurl', 'weightShift', 'balanceTraining', 'towelStretch'],
    phaseTips: [
      { phase: '保护期', days: '第 1-10 天', tips: ['POLICE 原则', '佩戴支具/护踝（遵医嘱）', '避免扭转动作', '冰敷 15-20 分钟'] },
      { phase: '重建期', days: '第 2-6 周', tips: ['部分负重行走', '本体感觉训练', '弹力带内外翻抗阻', '疼痛≤3 分可继续'] },
      { phase: '回归期', days: '第 7 周+', tips: ['单腿平衡 ≥30 秒', '慢跑需医生/康复师评估', '运动贴扎或护踝保护'] },
    ],
    redFlags: ['关节「卡住」或弹响伴剧痛', '反复扭伤', '明显不稳', '肿胀 48 小时不消退'],
    isBuiltin: true,
  },
  {
    id: 'sprain',
    name: '崴脚恢复',
    icon: '🦶',
    description: '常见踝关节扭伤（I-II 度）。恢复通常 3-6 周，关键在于早期活动度+渐进负荷。',
    expectedRecoveryDays: 42,
    defaultWalkingStatus: 'crutch-one',
    defaultWeightBearing: 50,
    recommendedTraining: ['anklePump', 'toeCurl', 'walkingTraining', 'towelStretch', 'balanceTraining'],
    phaseTips: [
      { phase: '急性期', days: '第 1-3 天', tips: ['POLICE 原则', '可耐受范围内活动', '避免完全不动', '肿胀管理优先'] },
      { phase: '恢复期', days: '第 4-21 天', tips: ['逐步全负重', '步态训练', '平衡练习', '避免过早跑步'] },
      { phase: '强化期', days: '第 22 天+', tips: ['单腿提踵', '敏捷性训练（无痛前提）', '运动回归渐进'] },
    ],
    redFlags: ['无法承重行走', '明显畸形', '麻木', '疼痛持续恶化超过 3 天'],
    isBuiltin: true,
  },
  {
    id: 'surgery',
    name: '术后康复',
    icon: '🏥',
    description: 'ORIF、韧带重建等术后。严格遵循主刀医生负重时间表，不可擅自提前。',
    expectedRecoveryDays: 150,
    defaultWalkingStatus: 'crutches-both',
    defaultWeightBearing: 0,
    recommendedTraining: ['anklePump', 'toeCurl'],
    phaseTips: [
      { phase: '术后早期', days: '术后 1-2 周', tips: ['伤口护理', '严格 NWB（除非医嘱）', '踝泵防血栓', '按时复查'] },
      { phase: '骨愈合期', days: '术后 3-8 周', tips: ['按医嘱逐步负重', '关节活动度练习', '肌力等长收缩', '复查影像'] },
      { phase: '功能重建', days: '术后 9 周+', tips: ['步态训练', '平衡+提踵', '运动回归需主刀许可', '避免剧烈扭转'] },
    ],
    redFlags: ['伤口裂开或渗液', '发烧>38°C', '小腿突发肿胀', '剧烈疼痛伴畸形'],
    isBuiltin: true,
  },
]

export function getActiveTemplate(
  config: RecoveryConfig,
  customTemplates: InjuryTemplate[],
): InjuryTemplate {
  if (config.templateId === 'custom' && config.customTemplateId) {
    const custom = customTemplates.find((t) => t.id === config.customTemplateId)
    if (custom) return custom
  }
  const builtin = BUILTIN_TEMPLATES.find((t) => t.id === config.templateId)
  return builtin ?? BUILTIN_TEMPLATES[0]
}

export function applyTemplateToConfig(template: InjuryTemplate): Partial<RecoveryConfig> {
  return {
    templateId: template.isBuiltin ? (template.id as TemplateId) : 'custom',
    customTemplateId: template.isBuiltin ? undefined : template.id,
    injuryType: template.name,
    expectedRecoveryDays: template.expectedRecoveryDays,
  }
}

export function applyTemplateDefaultsToRecord(
  template: InjuryTemplate,
  record: DailyRecord,
): Partial<DailyRecord> {
  return {
    walkingStatus: record.weightBearing === 0 ? template.defaultWalkingStatus : record.walkingStatus,
    weightBearing: record.weightBearing || template.defaultWeightBearing,
    training: {
      ...record.training,
      ...Object.fromEntries(
        template.recommendedTraining.map((k) => [k, record.training[k]]),
      ),
    },
  }
}

export function createCustomTemplate(name: string): InjuryTemplate {
  return {
    id: `custom-${Date.now()}`,
    name,
    icon: '✏️',
    description: '自定义康复方案',
    expectedRecoveryDays: 90,
    defaultWalkingStatus: 'crutches-both',
    defaultWeightBearing: 0,
    recommendedTraining: ['anklePump', 'toeCurl'] as TrainingKey[],
    phaseTips: [{ phase: '遵医嘱', days: '全程', tips: ['以主治医生方案为准', '在此记录每日状态'] }],
    redFlags: ['疼痛持续加重', '发热红肿', '麻木发紫'],
    isBuiltin: false,
  }
}

export const TRAINING_LABELS: Record<TrainingKey, string> = {
  anklePump: '踝泵',
  toeCurl: '勾脚',
  weightShift: '重心转移',
  heelRaise: '提踵',
  towelStretch: '毛巾拉伸',
  walkingTraining: '步行训练',
  balanceTraining: '平衡训练',
}