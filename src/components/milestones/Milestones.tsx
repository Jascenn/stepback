import { motion } from 'framer-motion'
import { Card } from '../ui/card'
import type { Milestone } from '../../types'

interface Props {
  milestones: Milestone[]
}

export function Milestones({ milestones }: Props) {
  const unlocked = milestones.filter((m) => m.unlockedAt)
  const locked = milestones.filter((m) => !m.unlockedAt)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">🏅 成就系统</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          已解锁 {unlocked.length} / {milestones.length}
        </p>
      </div>

      {unlocked.length > 0 && (
        <div className="space-y-3">
          {unlocked.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    {m.unlockedAt}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {locked.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">待解锁</p>
          {locked.map((m) => (
            <Card key={m.id} className="opacity-50">
              <div className="flex items-center gap-4">
                <span className="text-2xl grayscale">🔒</span>
                <div>
                  <p className="font-semibold text-muted-foreground">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}