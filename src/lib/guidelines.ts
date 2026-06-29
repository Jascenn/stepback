import type { GuidelinesBundle, TemplateId } from '../types'

const CACHE_KEY = 'recovery-guidelines-cache'
const GUIDELINES_URL = '/guidelines.json'

/** 可配置远程指南地址，部署到 lingyi.tools 后可指向 CDN 实现热更新 */
const REMOTE_GUIDELINES_URL =
  import.meta.env.VITE_GUIDELINES_URL || null

export async function fetchGuidelines(force = false): Promise<GuidelinesBundle> {
  const cached = !force ? loadCachedGuidelines() : null
  if (cached) return cached

  const urls = [REMOTE_GUIDELINES_URL, GUIDELINES_URL].filter(Boolean) as string[]

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: force ? 'no-cache' : 'default' })
      if (!res.ok) continue
      const data = (await res.json()) as GuidelinesBundle
      saveCachedGuidelines(data)
      return data
    } catch {
      continue
    }
  }

  throw new Error('无法加载康复指南')
}

function loadCachedGuidelines(): GuidelinesBundle | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, fetchedAt } = JSON.parse(raw) as { data: GuidelinesBundle; fetchedAt: string }
    const age = Date.now() - new Date(fetchedAt).getTime()
    if (age > 7 * 24 * 60 * 60 * 1000) return null
    return data
  } catch {
    return null
  }
}

function saveCachedGuidelines(data: GuidelinesBundle): void {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data, fetchedAt: new Date().toISOString() }),
  )
}

export function filterArticlesForTemplate(
  bundle: GuidelinesBundle,
  templateId: TemplateId,
): GuidelinesBundle['articles'] {
  return bundle.articles.filter((a) => a.templateIds.includes(templateId))
}