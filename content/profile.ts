/**
 * Locale-invariant facts: dates, URLs, repository names, tech stacks, star counts.
 *
 * Anything translatable — job titles, summaries, descriptions, skills — lives
 * in `content/i18n/<locale>.ts`, keyed by the `id` fields declared here. That
 * way a date or a repository name is stored exactly once and cannot drift
 * between languages.
 *
 * Editing rule: only put things here that are verifiable from a public source
 * (GitHub, a talk, a published post) or that you are happy to show a recruiter.
 * Nothing internal, nothing about compensation.
 */

export type Link = {
  label: string
  href: string
  /** Shown next to the link when the page is printed. Keep it to a handle. */
  handle?: string
}

export type Role = {
  /** Key into `dictionary.experience[jobId].roles`. */
  id: string
  /** `YYYY-MM`. Omit `end` for the current role. */
  start: string
  end?: string
}

export type Job = {
  /** Key into `dictionary.experience` — the display name lives there. */
  id: string
  href?: string
  start: string
  end?: string
  roles?: Role[]
}

export type Project = {
  /** Key into `dictionary.projects`. Also the displayed repository name. */
  id: string
  href: string
  stack: string[]
  /** GitHub stars, refreshed by hand. Omit rather than guess. */
  stars?: number
}

export type Education = {
  /** Key into `dictionary.education`. */
  id: string
  start: string
  end?: string
}

export const identity = {
  name: 'JaeSoon Jeong',
  /** Shown after the name, e.g. how people actually address you. */
  alias: 'jason',
  avatar: '/avatar.jpg',
  links: [
    { label: 'GitHub', href: 'https://github.com/JeongJaeSoon', handle: '@JeongJaeSoon' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/JeongJaeSoon/', handle: '/in/JeongJaeSoon' },
    { label: 'X', href: 'https://x.com/dev_soon0_0', handle: '@dev_soon0_0' },
    { label: 'Threads', href: 'https://www.threads.com/@dev_soon.0_0', handle: '@dev_soon.0_0' },
    { label: 'Speaker Deck', href: 'https://speakerdeck.com/jeongjaesoon', handle: '/jeongjaesoon' },
    { label: 'Email', href: 'mailto:94jaesoon.jeong@gmail.com', handle: '94jaesoon.jeong@gmail.com' },
  ] satisfies Link[],
  /** Repository listing linked from the open-source section. */
  repositories: 'https://github.com/JeongJaeSoon?tab=repositories',
  /** Slide listing linked from the talks section. */
  decks: 'https://speakerdeck.com/jeongjaesoon',
} as const

export const experience: Job[] = [
  {
    id: 'freee',
    href: 'https://corp.freee.co.jp/',
    start: '2023-11',
    roles: [
      { id: 'ai-platform', start: '2026-01' },
      { id: 'ai-driven-dev', start: '2025-07', end: '2025-12' },
      { id: 'invoicing', start: '2023-11', end: '2025-06' },
    ],
  },
  {
    id: 'lifull',
    href: 'https://lifull.com/',
    start: '2022-04',
    end: '2023-10',
  },
]

export const education: Education[] = [{ id: 'koreacu', start: '2026-03' }]

/** Public repositories worth showing. Star counts are refreshed by hand. */
export const projects: Project[] = [
  {
    id: 'agent-guard',
    href: 'https://github.com/JeongJaeSoon/agent-guard',
    stack: ['Shell', 'gitleaks', 'GitHub Actions'],
    stars: 24,
  },
  {
    id: 'kollegium',
    href: 'https://github.com/JeongJaeSoon/kollegium',
    stack: ['TypeScript', 'Slack'],
  },
  {
    id: 'terraform-provider-claude-enterprise',
    href: 'https://github.com/JeongJaeSoon/terraform-provider-claude-enterprise',
    stack: ['Go', 'Terraform'],
  },
  {
    id: 'relay',
    href: 'https://github.com/JeongJaeSoon/relay',
    stack: ['TypeScript'],
  },
  {
    id: 'mux',
    href: 'https://github.com/JeongJaeSoon/mux',
    stack: ['Go'],
  },
]

export type Publication = {
  /** Key into `dictionary.publications`, where the title is translated. */
  id: string
  /** Title in the language it was published in — shown alongside translations. */
  originalTitle: string
  href: string
  /** Where it was published — shown verbatim, not translated. */
  outlet: string
  /**
   * `YYYY-MM-DD` when the exact day is known, `YYYY-MM` when only the month
   * is. Month precision is deliberate: freee's URLs carry no date and the
   * site is unreachable from the build environment, so the day would be a
   * guess. Rendering follows whichever precision is given.
   */
  date: string
  /** Language the article itself is written in. */
  lang: 'en' | 'ko' | 'ja'
}

export type Talk = {
  /** Key into `dictionary.talks`, where the title is translated. */
  id: string
  /** Title in the language it was delivered in. */
  originalTitle: string
  href: string
  /** Event it was given at — shown verbatim, not translated. */
  event: string
  /** `YYYY-MM-DD` or `YYYY-MM`, same precision rule as publications. */
  date: string
  lang: 'en' | 'ko' | 'ja'
}

/**
 * Conference and meetup talks.
 *
 * Speaker Deck hosts the slides (see `identity.decks`), but that site is
 * unreachable from the build environment and its deck pages are not in the
 * search index, so individual deck URLs could not be collected here. Entries
 * therefore link to whatever public page is verifiable; add deck URLs as they
 * are confirmed.
 */
export const talks: Talk[] = [
  {
    id: 'qiita-bash-claude-code',
    originalTitle: 'Qiita Bash「キミたちはClaude Codeをどう使いこなす？」LT 登壇資料',
    href: 'https://developers.freee.co.jp/entry/qiita-claude-code',
    event: 'Qiita Bash',
    // The date is in the event itself, not inferred.
    date: '2025-11-14',
    lang: 'ja',
  },
]

/**
 * Articles written for someone else's publication — company engineering
 * blogs, guest posts. Ordered newest first at render time.
 *
 * Rule: a publication only goes in here once its real date is known. An
 * approximate date on a résumé is worse than no entry.
 */
export const publications: Publication[] = [
  {
    id: 'freee-claude-enterprise-scim',
    originalTitle:
      'Claude Enterprise を全社に安全に展開するために、SCIM × IaC で権限運用を整備した話',
    href: 'https://developers.freee.co.jp/entry/freee-claude-enterprise-scim',
    outlet: 'freee Developers Hub',
    date: '2026-05',
    lang: 'ja',
  },
  {
    id: 'freee-ai-driven-development-report',
    originalTitle: '数字で振り返る freee の AI 駆動開発 - 後編',
    href: 'https://developers.freee.co.jp/entry/ai-driven-development-2025-report',
    outlet: 'freee Developers Hub',
    date: '2025-12',
    lang: 'ja',
  },
  {
    id: 'freee-ai-driven-development-01',
    originalTitle: 'AI駆動開発へ。freee は開発環境をどう進化させているか？- 前編',
    href: 'https://developers.freee.co.jp/entry/ai-driven-development-01',
    outlet: 'freee Developers Hub',
    date: '2025-09',
    lang: 'ja',
  },
  {
    id: 'freee-invoice-email-abuse',
    originalTitle:
      'より良いプロダクトを目指して、freee 請求書のメール送付機能不正利用防止対策の話',
    href: 'https://developers.freee.co.jp/entry/freee-invoice-enhance-email-delivery',
    outlet: 'freee Developers Hub',
    date: '2024-12',
    lang: 'ja',
  },
  {
    id: 'freee-desk-2023',
    originalTitle: '大崎に引越ししてきたので、デスク環境をアップグレード',
    href: 'https://developers.freee.co.jp/entry/jason-desk-2023',
    outlet: 'freee Developers Hub',
    date: '2023-12',
    lang: 'ja',
  },
  {
    id: 'lifull-info-power',
    originalTitle: 'エンジニアの情報力を向上するためのLIFULLの活動',
    href: 'https://www.lifull.blog/entry/2023/02/13/090000',
    outlet: 'LIFULL Creators Blog',
    date: '2023-02-13',
    lang: 'ja',
  },
  {
    id: 'lifull-remote-abroad',
    originalTitle: '新卒韓国人エンジニアの外国生活×リモートワーク',
    href: 'https://www.lifull.blog/entry/2022/08/24/100949',
    outlet: 'LIFULL Creators Blog',
    date: '2022-08-24',
    lang: 'ja',
  },
]


/**
 * WakaTime coding stats.
 *
 * The dashboard itself is private, so nothing is rendered until you paste in
 * a *share* embed. Create one at wakatime.com → Settings → Embeddable Charts,
 * then drop the `.svg` URLs here. Leave the array empty to hide the section.
 */
export const codingStats: { title: string; svg: string }[] = [
  // { title: 'Languages · last 30 days', svg: 'https://wakatime.com/share/@you/xxxx.svg' },
]
