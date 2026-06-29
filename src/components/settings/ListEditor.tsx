import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface Props {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  addLabel?: string
}

export function ListEditor({ label, items, onChange, placeholder, addLabel = '添加' }: Props) {
  const update = (index: number, value: string) => {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const add = () => {
    onChange([...items, ''])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <FieldLabel>{label}</FieldLabel>
        <Button type="button" variant="ghost" size="sm" onClick={add} className="h-7 text-xs">
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            <Input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 text-muted-foreground hover:text-danger transition-colors rounded-lg hover:bg-danger/10"
              aria-label="删除"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground py-2 text-center border border-dashed border-border rounded-xl">
            暂无条目，点击「{addLabel}」
          </p>
        )}
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-muted-foreground">{children}</span>
}