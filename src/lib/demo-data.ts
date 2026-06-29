import type { AppState, DailyRecord } from '../types'
import { LINGYI_GOALS, LINGYI_PROFILE, LINGYI_TEMPLATE } from './profiles/lingyi'
import { DEFAULT_CONFIG, DEFAULT_MILESTONES } from './storage'
import { addDays } from './utils'

export function generateDemoData(): AppState {
  const injuryDate = '2026-04-14'
  const records: Record<string, DailyRecord> = {}

  for (let day = 0; day < 72; day++) {
    const date = addDays(injuryDate, day)
    const progress = day / 120

    const painRest = Math.max(0, Math.round(6 - progress * 8 + Math.random() * 1.5))
    const painWalking = Math.max(0, Math.round(7 - progress * 9 + Math.random() * 1.5))
    const painPress = Math.max(0, Math.round(5 - progress * 7 + Math.random() * 1.5))
    const weightBearing = Math.min(100, Math.round(progress * 120))
    const walkingStatus =
      weightBearing < 15 ? 'crutches-both' : weightBearing < 50 ? 'crutch-one' : 'none'

    records[date] = {
      date,
      painRest,
      painWalking,
      painPress,
      morningStiffness: day < 20 ? 'moderate' : day < 50 ? 'mild' : 'none',
      swelling: day < 15 ? 'moderate' : day < 40 ? 'mild' : 'none',
      shoeFit: day < 30 ? 'tight' : 'normal',
      hasFever: false,
      isRed: false,
      walkingStatus,
      weightBearing,
      canSingleStand: weightBearing >= 30,
      canUpstairs: weightBearing >= 60,
      canDownstairs: weightBearing >= 55,
      canDrive: weightBearing >= 70,
      training: {
        anklePump: true,
        toeCurl: true,
        weightShift: weightBearing >= 20,
        heelRaise: weightBearing >= 40,
        towelStretch: true,
        walkingTraining: weightBearing >= 25,
        balanceTraining: weightBearing >= 60,
      },
      trainingMinutes: 20 + Math.round(progress * 30),
      steps: Math.round(progress * 8000 + Math.random() * 1000),
      walkingMinutes: Math.round(progress * 40),
      footSoak: day % 3 === 0,
      icePack: day < 30,
      heatPack: day >= 30 && day % 2 === 0,
      elevation: day < 40,
      notes: day === 71 ? '今天开始部分负重。下午走得比昨天自然。外侧还有酸胀。' : '',
      aiScore: Math.round(40 + progress * 50),
    }
  }

  const milestones = DEFAULT_MILESTONES.map((m) => {
    const unlockDates: Record<string, string> = {
      'first-weight': addDays(injuryDate, 25),
      'single-crutch': addDays(injuryDate, 42),
      'no-crutch': addDays(injuryDate, 58),
      'normal-walk': addDays(injuryDate, 62),
      stairs: addDays(injuryDate, 55),
      drive: addDays(injuryDate, 60),
    }
    return { ...m, unlockedAt: unlockDates[m.id] }
  })

  return {
    config: { ...DEFAULT_CONFIG, injuryDate },
    profile: { ...LINGYI_PROFILE },
    goals: { ...LINGYI_GOALS },
    records,
    weeklyTests: {},
    milestones,
    customTemplates: [LINGYI_TEMPLATE],
  }
}