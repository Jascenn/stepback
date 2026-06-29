import { Sparkles } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'

const ROADMAP = [
  { v: 'V1', status: 'live', title: 'MVP', desc: '记录 + 趋势 + AI 分析', items: ['今日记录', 'Recovery Score', '趋势图', '伤痛模板', '可视化档案'] },
  { v: 'V2', status: 'live', title: '康复中心', desc: '时间轴 + 伤情页 + 恢复曲线', items: ['康复时间轴', '我的伤情', '恢复指数历史', 'AI 预测'] },
  { v: 'V3', status: 'planned', title: 'AI 教练', desc: '每天打开 AI 直接给训练计划，练完聊天反馈' },
  { v: 'V4', status: 'planned', title: 'AI 识别', desc: '照片对比肿胀、视频分析步态、CT 通俗解读' },
  { v: 'V5', status: 'partial', title: '医生模式', desc: '一键导出 60 天 PDF 报告给医生看', items: ['PDF 导出已有', '60天完整报告待增强'] },
  { v: 'V6', status: 'live', title: '数据统计', desc: '恢复指数历史 Day70→81→82→83' },
  { v: 'V7', status: 'live', title: '成就系统', desc: '第一次负重、单拐、脱拐、跑步…' },
  { v: 'V8', status: 'live', title: 'AI 预测', desc: '预测改单拐、脱拐、开车日期（仅供参考）' },
  { v: 'V9', status: 'live', title: '灵魂功能', desc: '「今天比昨天好吗？」— 打开即知道' },
  { v: 'V10', status: 'planned', title: 'AI 聊天', desc: '「今天脚还是有点肿」→ AI 结合数据回复' },
  { v: '—', status: 'planned', title: '天气关联', desc: '记录气温湿度，分析酸胀与天气关系' },
  { v: '—', status: 'planned', title: '复诊管理', desc: 'X光/CT/医嘱形成完整医疗时间轴' },
]

const STATUS_LABEL = {
  live: { text: '已上线', cls: 'bg-success/20 text-success' },
  partial: { text: '部分', cls: 'bg-warning/20 text-warning' },
  planned: { text: '规划中', cls: 'bg-muted text-muted-foreground' },
}

export function RoadmapPanel() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recovery Tracker 路线图
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          用数据记录恢复，用 AI 陪伴康复
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          适用：骨折 · 崴脚 · 韧带 · ACL · 跟腱 · 半月板 · 肩袖 · 关节置换
        </p>
      </div>

      {ROADMAP.map((item) => {
        const st = STATUS_LABEL[item.status as keyof typeof STATUS_LABEL]
        return (
          <Card key={item.v + item.title} className={item.status === 'live' ? 'border-success/20' : ''}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">{item.v}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.cls}`}>
                    {st.text}
                  </span>
                </div>
                <CardTitle className="mt-1 text-base">{item.title}</CardTitle>
                <CardDescription className="mt-1 leading-relaxed">{item.desc}</CardDescription>
                {'items' in item && item.items && (
                  <ul className="mt-2 flex flex-wrap gap-1">
                    {item.items.map((i) => (
                      <li key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-md">{i}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}