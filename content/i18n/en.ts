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
    talks: 'Talks',
    codingActivity: 'Coding activity',
  },
  ui: {
    allPosts: 'All posts',
    allRepositories: 'All repositories',
    allDecks: 'All decks',
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
      'I build the foundation and enablement for freee’s company-wide transition to an AI-native organisation. I operate an internal AI workflow platform (n8n), build context pipelines with BigQuery and vector databases for RAG/MCP, and establish technical guardrails and guidelines for safely adopting tools such as Claude Code, Codex, and Devin. I also work with each department to design AI workflows and agents, then spread what works through showcases, hands-on sessions, and documentation.',
      'Before that, I delivered the receivables and invoicing product at freee end to end. Earlier at LIFULL, I built and operated a web application for searching and viewing archived real-estate listing data, then led PoCs and MVPs applying generative AI and LLMs to improve B2B real-estate operations. That experience of operating real products and validating AI against business value is the foundation I bring to platform work. A feature is not done until it is operable.',
    ],
  },
  experience: {
    freee: {
      company: 'freee K.K.',
      position: 'Senior AI Platform Engineer, Tech Lead — CAIO Office',
      location: 'Tokyo, Japan',
      roles: {
        'ai-platform': {
          title: 'AI Platform Engineering',
          position: 'Senior AI Platform Engineer, Tech Lead',
          summary:
            'Platform engineering for freee’s AI-native transition: internal workflows, context infrastructure, and safe AI-tool adoption.',
          highlights: [
            'Self-hosted operation and enterprise expansion of the internal n8n-based AI workflow platform, including custom nodes',
            'Context-aware data pipelines with BigQuery and vector databases for RAG and MCP integration',
            'Technical guardrails and guidelines for safely using AI development tools such as Claude Code, Codex, and Devin',
            'Department discovery, AI workflow and agent design, and leadership from showcase through validation and company-wide rollout',
            'AI literacy and self-sufficiency through hands-on sessions, study groups, documentation, and learning materials',
          ],
        },
        'ai-driven-dev': {
          title: 'AI-Driven Development (AI駆動開発)',
          position: 'Software Engineer, Tech Lead',
          summary:
            'Built the foundation and enablement for more than 600 engineers and roughly 400 product managers and applied product developers to use AI tooling in their work.',
          highlights: [
            'Tool evaluation and company-wide rollout, from sandbox pilot to enterprise operation',
            'Internal AI development foundations with a Python LLM proxy, internal-knowledge vector embeddings, and Go local/remote MCP',
            'Access controls and usage guidelines, followed by 1:1 support, hands-on sessions, and rollout follow-up',
          ],
        },
        'accounting-db': {
          title: 'Accounting Database Infrastructure',
          position: 'Software Engineer',
          summary:
            'Improved accounting-application performance from a database perspective.',
          highlights: [
            'Improved query performance and optimized indexing strategy',
            'Improved and optimized replica-database performance',
          ],
        },
        invoicing: {
          title: 'Receivables & Invoicing (債権・請求書)',
          position: 'Software Engineer, Tech Lead',
          summary:
            'Product engineering, then project ownership and TL work on the invoicing product.',
          highlights: [
            'Feature delivery end to end — requirements, design, QA, and operational readiness',
            'Large-volume data and DB performance work: query, indexing, and replica-DB optimization; OOM, DB load, and online schema changes',
            'Infrastructure migration, CI/CD, and observability with Datadog',
            'Onboarding and runbooks so the team could run what it shipped',
          ],
        },
      },
    },
    lifull: {
      company: 'LIFULL Co., Ltd.',
      position: 'Application Engineer',
      location: 'Tokyo, Japan',
      roles: {
        'generative-ai': {
          title: 'Generative AI Product Development Office · Product Development Unit',
          position: 'Application Engineer',
          summary:
            'Planned and built PoCs and MVPs that applied LLMs and generative AI to improve real-estate B2B workflows.',
          highlights: [
            'Led technical experiments through practical product validation',
            'Improved features and product quality based on user feedback',
          ],
        },
        'product-engineering': {
          title: 'Product Engineering Department 3 Unit · Development 1 Group',
          position: 'Application Engineer',
          summary:
            'Developed and operated a web application for managing, searching, and viewing archived property-listing data.',
          highlights: [
            'Owned the system end to end, including database design',
            'Built and operated the supporting cloud infrastructure',
          ],
        },
      },
    },
  },
  publications: {
    'freee-claude-enterprise-scim':
      'Rolling out Claude Enterprise company-wide: permission operations with SCIM and IaC',
    'freee-ai-driven-development-report':
      'freee\'s AI-driven development in numbers — part 2',
    'freee-ai-driven-development-01':
      'Toward AI-driven development: how freee is evolving its dev environment — part 1',
    'freee-invoice-email-abuse':
      'Preventing abuse of freee Invoice\'s email delivery feature',
    'freee-desk-2023':
      'Upgrading my desk setup after moving to Osaki',
    'lifull-info-power':
      'How LIFULL helps its engineers stay informed',
    'lifull-remote-abroad':
      'A new-grad Korean engineer abroad, working remotely',
  },
  talks: {
    'freee-opensearch-full-indexing':
      'OpenSearch Full-Indexing — unexpected challenges and solutions',
    'qiita-bash-claude-code':
      'Qiita Bash lightning talk — how we actually use Claude Code',
  },
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
    yeungjin: {
      school: 'Yeungjin University (영진전문대학교)',
      degree: 'Associate’s Degree in Computer Information · School of Computer Information',
      note: 'Graduated',
    },
    koreacu: {
      school: 'Korea Cyber University (고려사이버대학교)',
      degree: 'Bachelor’s degree · Computer Engineering',
      note: 'Graduated',
    },
  },
  skills: [
    {
      group: 'AI Platform',
      items: [
        'MCP (Model Context Protocol)',
        'LLM gateway & proxy',
        'RAG',
        'Vector DB',
        'OpenSearch',
        'Agent governance',
        'Langfuse',
        'n8n',
        'Claude Enterprise operations',
      ],
    },
    {
      group: 'Languages',
      items: ['TypeScript', 'Python', 'Go', 'Ruby', 'PHP', 'Shell'],
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
