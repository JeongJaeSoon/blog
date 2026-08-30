/**
 * Single source of truth for everything the résumé pages render.
 *
 * Editing rule: only put things here that are verifiable from a public
 * source (GitHub, a talk, a published post) or that you are happy to show
 * a recruiter. Nothing internal, nothing about compensation.
 */

export type Link = {
  label: string
  href: string
  /** Shown next to the link on the contact list. Keep it to a handle. */
  handle?: string
}

export type Role = {
  /** Team or sub-role inside the same company. */
  title: string
  /** `YYYY-MM`. Omit `end` for the current role. */
  start: string
  end?: string
  summary: string
  highlights: string[]
}

export type Job = {
  company: string
  href?: string
  location: string
  /** Title as it should read on a résumé. Leave empty to hide the line. */
  position: string
  start: string
  end?: string
  roles?: Role[]
}

export type Project = {
  name: string
  href: string
  description: string
  stack: string[]
  /** GitHub stars, refreshed by hand. Omit rather than guess. */
  stars?: number
}

export const profile = {
  name: 'JaeSoon Jeong',
  /** Shown after the name, e.g. how people actually address you. */
  alias: 'jason',
  headline: 'Senior AI Platform Engineer',
  org: 'CAIO Office, freee K.K.',
  location: 'Tokyo, Japan',
  origin: 'Daegu, Korea',
  /** Two or three sentences. This is the first thing anyone reads. */
  about: [
    'I build the platform other engineers use to ship AI features safely — shared LLM runtime and gateway, authentication and supply-chain controls, and the governance that lets a whole company adopt AI tooling without each team reinventing it.',
    'Before that I spent two years on product delivery: receivables and invoicing at freee, where large-scale data, performance, and infrastructure migration were the everyday problems. That end-to-end delivery habit is what I carry into platform work — a feature is not done until it is operable.',
  ],
  avatar: '/avatar.jpg',
  links: [
    { label: 'GitHub', href: 'https://github.com/JeongJaeSoon', handle: '@JeongJaeSoon' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/JeongJaeSoon/', handle: '/in/JeongJaeSoon' },
    { label: 'X', href: 'https://x.com/dev_soon0_0', handle: '@dev_soon0_0' },
    { label: 'Threads', href: 'https://www.threads.com/@dev_soon.0_0', handle: '@dev_soon.0_0' },
    { label: 'Email', href: 'mailto:94jaesoon.jeong@gmail.com', handle: '94jaesoon.jeong@gmail.com' },
  ] satisfies Link[],
} as const

export const experience: Job[] = [
  {
    company: 'freee K.K.',
    href: 'https://corp.freee.co.jp/',
    location: 'Tokyo, Japan',
    position: 'Senior AI Platform Engineer, CAIO Office',
    start: '2023-11',
    roles: [
      {
        title: 'AI Platform Engineering',
        start: '2026-01',
        summary:
          'Shared AI platform for the whole engineering organisation: runtime, integration, and the controls around them.',
        highlights: [
          'Common LLM runtime and gateway, plus the integration surface teams build against',
          'Authentication, credential lifecycle, and supply-chain controls for agent tooling',
          'Evidence-driven delivery — release, deployment, and live end-to-end each proven separately',
          'Enablement so teams operate what they adopt instead of routing every question back to the platform',
        ],
      },
      {
        title: 'AI-Driven Development (AI駆動開発)',
        start: '2025-07',
        end: '2025-12',
        summary:
          'Evaluating and rolling out AI development tooling across product engineering.',
        highlights: [
          'Tool evaluation and company-wide rollout, from sandbox pilot to enterprise operation',
          'MCP servers and RAG groundwork for internal developer tooling',
          'Usage guidelines, workflow automation, hands-on sessions and office hours',
        ],
      },
      {
        title: 'Receivables & Invoicing (債権・請求書)',
        start: '2023-11',
        end: '2025-06',
        summary:
          'Product engineering, then project ownership and TL work on the invoicing product.',
        highlights: [
          'Feature delivery end to end — requirements, design, QA, and operational readiness',
          'Large-volume data and performance work: OOM, DB load, online schema change',
          'Infrastructure migration, CI/CD, and observability with Datadog',
          'Onboarding and runbooks so the team could run what it shipped',
        ],
      },
    ],
  },
  {
    company: 'LIFULL Co., Ltd.',
    href: 'https://lifull.com/',
    location: 'Tokyo, Japan',
    // TODO: fill in the exact job title from your LinkedIn — left blank on
    // purpose rather than guessed. The line is hidden while it is empty.
    position: '',
    start: '2022-04',
    end: '2023-10',
  },
]

export const education = [
  {
    school: 'Korea Cyber University (고려사이버대학교)',
    // TODO: add your department once you want it public.
    degree: '',
    start: '2026-03',
    note: 'Currently enrolled',
  },
]

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'AI Platform',
    items: [
      'MCP (Model Context Protocol)',
      'LLM gateway & proxy',
      'RAG',
      'Agent governance',
      'Langfuse',
      'n8n',
      'Claude Enterprise operations',
    ],
  },
  {
    group: 'Languages',
    items: ['TypeScript', 'Python', 'Go', 'Ruby', 'Shell', 'Swift'],
  },
  {
    group: 'Infrastructure',
    items: ['AWS', 'Kubernetes', 'Terraform', 'Datadog', 'GitHub Actions', 'CI/CD'],
  },
  {
    group: 'Spoken',
    items: ['Korean (native)', 'Japanese (business)', 'English'],
  },
]

/** Public repositories worth showing. Star counts are refreshed by hand. */
export const projects: Project[] = [
  {
    name: 'agent-guard',
    href: 'https://github.com/JeongJaeSoon/agent-guard',
    description:
      'Real-time secret-leak guardrails for AI coding agents, Git hooks, and CI.',
    stack: ['Shell', 'gitleaks', 'GitHub Actions'],
    stars: 24,
  },
  {
    name: 'kollegium',
    href: 'https://github.com/JeongJaeSoon/kollegium',
    description: 'Open-source runtime framework for AI teammates in team chat.',
    stack: ['TypeScript', 'Slack'],
  },
  {
    name: 'terraform-provider-claude-enterprise',
    href: 'https://github.com/JeongJaeSoon/terraform-provider-claude-enterprise',
    description:
      'Community Terraform provider for Claude Enterprise per-member spend limits.',
    stack: ['Go', 'Terraform'],
  },
  {
    name: 'relay',
    href: 'https://github.com/JeongJaeSoon/relay',
    description: 'Personal multi-agent orchestrator for Claude Code.',
    stack: ['TypeScript'],
  },
  {
    name: 'claude-wrapped',
    href: 'https://github.com/JeongJaeSoon/claude-wrapped',
    description: 'Wrapped-style summaries of your Claude Code usage.',
    stack: ['TypeScript'],
  },
  {
    name: 'mux',
    href: 'https://github.com/JeongJaeSoon/mux',
    description: 'tmux session manager with an interactive TUI.',
    stack: ['Go'],
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
