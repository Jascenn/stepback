import { Stethoscope } from 'lucide-react'
import { Card } from '../ui/card'
import type { RecoveryConfig } from '../../types'

interface Props {
  config: RecoveryConfig
}

export function DoctorPlanBanner({ config }: Props) {
  if (!config.doctorPlan.trim() && config.doctorWeightBearingLimit == null) return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <div className="flex gap-3">
        <Stethoscope className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary">医生方案（优先参考）</p>
          {config.doctorWeightBearingLimit != null && (
            <p className="text-xs text-muted-foreground mt-1">
              医嘱负重上限：<strong>{config.doctorWeightBearingLimit}%</strong>
            </p>
          )}
          {config.doctorPlan.trim() && (
            <p className="text-sm text-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">
              {config.doctorPlan}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}