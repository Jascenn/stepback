import { LayoutDashboard, TrendingUp, Trophy, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

export type Tab = 'dashboard' | 'trends' | 'achievements' | 'settings'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: '今日', icon: LayoutDashboard },
  { id: 'trends', label: '趋势', icon: TrendingUp },
  { id: 'achievements', label: '成就', icon: Trophy },
  { id: 'settings', label: '设置', icon: Settings },
]

export function Navigation({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl safe-bottom">
      <div className="mx-auto max-w-2xl flex items-center justify-around px-2 py-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all min-w-[64px]',
              active === id ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className={cn('h-5 w-5', active === id && 'scale-110')} strokeWidth={active === id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}