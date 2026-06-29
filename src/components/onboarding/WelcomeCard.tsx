import { ArrowRight } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

interface Props {
  onGoSettings: () => void
}

export function WelcomeCard({ onGoSettings }: Props) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardTitle>👋 开始你的康复记录</CardTitle>
      <CardDescription className="mt-2 leading-relaxed">
        每天 1 分钟：填疼痛、肿胀、负重、训练 → 点「分析今天」。
        先去设置确认你的档案和医嘱。
      </CardDescription>
      <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
        <li><span className="font-semibold text-foreground">1.</span> 设置 → 我的档案，确认伤情和医嘱</li>
        <li><span className="font-semibold text-foreground">2.</span> 今日页填写状态（约 1 分钟）</li>
        <li><span className="font-semibold text-foreground">3.</span> 点「分析今天」查看恢复指数和建议</li>
      </ol>
      <Button size="sm" className="mt-4 w-full" onClick={onGoSettings}>
        配置我的档案
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  )
}