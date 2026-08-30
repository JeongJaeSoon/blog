import type { Dictionary } from './types'

export const en: Dictionary = {
  site: {
    title: 'JaeSoon Jeong — AI Platform Engineer',
    description:
      'AI Platform Engineer in Tokyo. Notes on LLM platforms, agent tooling, and the operational side of shipping AI.',
  },
  nav: {
    about: 'About',
    blog: 'Blog',
  },
  sections: {
    experience: 'Experience',
    openSource: 'Open source',
    skills: 'Skills',
    education: 'Education',
    writing: 'Writing',
    publications: 'Published elsewhere',
    codingActivity: 'Coding activity',
  },
  ui: {
    allPosts: 'All posts',
    allRepositories: 'All repositories',
    minRead: ' min read',
    readingTimePrefix: '',
    noPosts: 'No posts yet.',
    backHome: 'Back home',
    notFoundTitle: 'This page does not exist.',
    draft: 'draft',
    language: 'Language',
    present: 'Present',
  },
  profile: {
    headline: 'Senior AI Platform Engineer',
    org: 'CAIO Office, freee K.K.',
    locationLine: 'Tokyo, Japan — from Daegu, Korea',
    about: [
      'I build the platform other engineers use to ship AI features safely — shared LLM runtime and gateway, authentication and supply-chain controls, and the governance that lets a whole company adopt AI tooling without each team reinventing it.',
      'Before that I spent two years on product delivery: receivables and invoicing at freee, where large-scale data, performance, and infrastructure migration were the everyday problems. That end-to-end delivery habit is what I carry into platform work — a feature is not done until it is operable.',
    ],
  },
  experience: {
    freee: {
      company: 'freee K.K.',
      position: 'Senior AI Platform Engineer, CAIO Office',
      location: 'Tokyo, Japan',
      roles: {
        'ai-platform': {
          title: 'AI Platform Engineering',
          summary:
            'Shared AI platform for the whole engineering organisation: runtime, integration, and the controls around them.',
          highlights: [
            'Common LLM runtime and gateway, plus the integration surface teams build against',
            'Authentication, credential lifecycle, and supply-chain controls for agent tooling',
            'Evidence-driven delivery — release, deployment, and live end-to-end each proven separately',
            'Enablement so teams operate what they adopt instead of routing every question back to the platform',
          ],
        },
        'ai-driven-dev': {
          title: 'AI-Driven Development (AI駆動開発)',
          summary:
            'Evaluating and rolling out AI development tooling across product engineering.',
          highlights: [
            'Tool evaluation and company-wide rollout, from sandbox pilot to enterprise operation',
            'MCP servers and RAG groundwork for internal developer tooling',
            'Usage guidelines, workflow automation, hands-on sessions and office hours',
          ],
        },
        invoicing: {
          title: 'Receivables & Invoicing (債権・請求書)',
          summary:
            'Product engineering, then project ownership and TL work on the invoicing product.',
          highlights: [
            'Feature delivery end to end — requirements, design, QA, and operational readiness',
            'Large-volume data and performance work: OOM, DB load, online schema change',
            'Infrastructure migration, CI/CD, and observability with Datadog',
            'Onboarding and runbooks so the team could run what it shipped',
          ],
        },
      },
    },
    lifull: {
      company: 'LIFULL Co., Ltd.',
      // TODO: fill in the exact job title from your LinkedIn — left blank on
      // purpose rather than guessed. The line is hidden while it is empty.
      position: '',
      location: 'Tokyo, Japan',
    },
  },
  publications: {},
  projects: {
    'agent-guard':
      'Real-time secret-leak guardrails for AI coding agents, Git hooks, and CI.',
    kollegium: 'Open-source runtime framework for AI teammates in team chat.',
    'terraform-provider-claude-enterprise':
      'Community Terraform provider for Claude Enterprise per-member spend limits.',
    relay: 'Personal multi-agent orchestrator for Claude Code.',
    mux: 'tmux session manager with an interactive TUI.',
  },
  education: {
    koreacu: {
      school: 'Korea Cyber University (고려사이버대학교)',
      // TODO: add your department once you want it public.
      degree: '',
      note: 'Currently enrolled',
    },
  },
  skills: [
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
      items: ['TypeScript', 'Python', 'Go', 'Ruby', 'Shell'],
    },
    {
      group: 'Infrastructure',
      items: ['AWS', 'Kubernetes', 'Terraform', 'Datadog', 'GitHub Actions', 'CI/CD'],
    },
    {
      group: 'Spoken',
      items: ['Korean (native)', 'Japanese (business)', 'English'],
    },
  ],
}
