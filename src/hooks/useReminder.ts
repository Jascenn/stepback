import { useEffect } from 'react'
import type { RecoveryConfig } from '../types'
import { todayString } from '../lib/utils'

export function useReminder(config: RecoveryConfig, hasTodayRecord: boolean) {
  useEffect(() => {
    if (!config.reminderEnabled || !('Notification' in window)) return

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const check = () => {
      const now = new Date()
      const [h, m] = config.reminderTime.split(':').map(Number)
      const today = todayString()
      const key = `reminder-${today}`

      if (
        now.getHours() === h &&
        now.getMinutes() === m &&
        !hasTodayRecord &&
        !sessionStorage.getItem(key)
      ) {
        if (Notification.permission === 'granted') {
          new Notification('🦶 StepBack', {
            body: '今天还没有记录康复。今天完成训练了吗？',
            icon: '/favicon.svg',
          })
          sessionStorage.setItem(key, '1')
        }
      }
    }

    const interval = setInterval(check, 60_000)
    check()
    return () => clearInterval(interval)
  }, [config.reminderEnabled, config.reminderTime, hasTodayRecord])
}