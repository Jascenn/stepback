import { ExternalLink, RefreshCw, BookOpen, AlertTriangle } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import type { GuidelinesBundle, InjuryTemplate, TemplateId } from '../../types'
import { filterArticlesForTemplate } from '../../lib/guidelines'
import { cn } from '../../lib/utils'

interface Props {
  templateId: TemplateId
  template: InjuryTemplate
  bundle: GuidelinesBundle | null
  loading: boolean
  error: string | null
  onReload: () => void
}

export function GuidelinesPanel({ templateId, template, bundle, loading, error, onReload }: Props) {
  const articles = bundle ? filterArticlesForTemplate(bundle, templateId) : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            康复指南
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {template.icon} {template.name} · 来源可追溯
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReload} disabled={loading}>
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          {loading ? '更新中' : '联网更新'}
        </Button>
      </div>

      <Card className="border-warning/30 bg-warning/5">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">医生方案优先</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {bundle?.disclaimer ?? '本指南整理自公开医学教育资料，不能替代个体化医疗建议。'}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>分阶段建议</CardTitle>
        <CardDescription>基于 {template.name} 模板的通用参考</CardDescription>
        <div className="mt-4 space-y-4">
          {template.phaseTips.map((phase) => (
            <div key={phase.phase} className="border-l-2 border-primary/30 pl-4">
              <p className="text-sm font-semibold">{phase.phase} <span className="text-muted-foreground font-normal">({phase.days})</span></p>
              <ul className="mt-1.5 space-y-1">
                {phase.tips.map((tip) => (
                  <li key={tip} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary shrink-0">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>危险信号</CardTitle>
        <CardDescription>出现以下情况请立即就医</CardDescription>
        <ul className="mt-3 space-y-1.5">
          {template.redFlags.map((flag) => (
            <li key={flag} className="text-sm text-danger flex gap-2">
              <span>⚠️</span>{flag}
            </li>
          ))}
        </ul>
      </Card>

      {error && (
        <p className="text-sm text-danger text-center">{error}</p>
      )}

      {articles.map((article) => (
        <Card key={article.id}>
          <CardTitle>{article.term}</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{article.explanation}</p>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">参考来源</p>
            {article.sources.map((src) => (
              <a
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-border p-3 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{src.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{src.organization}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{src.summary}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </Card>
      ))}

      {bundle && (
        <p className="text-xs text-center text-muted-foreground pb-4">
          指南版本 {bundle.version} · 更新于 {bundle.updatedAt}
        </p>
      )}
    </div>
  )
}