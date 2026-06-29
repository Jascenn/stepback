import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '../../lib/utils'

interface Option {
  value: string
  label: string
}

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  className?: string
}

export function RadioGroup({ value, onValueChange, options, className }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {options.map((opt) => (
        <RadioGroupPrimitive.Item
          key={opt.value}
          value={opt.value}
          className={cn(
            'inline-flex items-center rounded-xl border px-3.5 py-2 text-sm font-medium transition-all cursor-pointer',
            'border-border bg-background text-muted-foreground',
            'hover:border-primary/40 hover:text-foreground',
            'data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary',
          )}
        >
          {opt.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}