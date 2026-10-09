import type { Locale } from '@/lib/i18n'

export const workContact = 'jaesoon@94soon.dev'

type WorkContent = {
  nav: string
  title: string
  description: string
  intro: string
  portfolio: string
  portfolioLink: string
  aiTitle: string
  ai: string
  areasTitle: string
  areas: { title: string; body: string }[]
  approachTitle: string
  approach: string
  openSourceTitle: string
  openSource: string
  repositories: string
  contactTitle: string
  contact: string
}

export const work: Record<Locale, WorkContent> = {
  en: {
    nav: '94soon',
    title: '94soon — Software development & AI workflows',
    description: '94soon is a Tokyo-based sole proprietorship run by Jaesoon Jeong since September 2026, supporting custom software development, AI workflows, and business automation.',
    intro: 'I am Jaesoon Jeong (정재순). I started 94soon in September 2026 as a sole proprietorship based in Tokyo. I develop software for clients, help build AI workflows and business automation, and work on open-source tools.',
    areasTitle: 'What I work on',
    areas: [
      { title: 'Open-source development', body: 'Tools for developers and people working with AI agents. I publish code so others can inspect it, use it, and build on it.' },
      { title: 'Custom software', body: 'Applications, internal tools, and integrations shaped around the work they need to support. I help turn an idea or a recurring problem into working software.' },
      { title: 'AI workflow automation', body: 'Systems that connect AI with existing tools and information to support recurring tasks. The work includes deciding what to automate, where a person should review the result, and how to handle failures.' },
      { title: 'AI adoption and use', body: 'Hands-on support for choosing useful applications of AI, trying them on a small scale, and incorporating them into day-to-day work.' },
    ],
    approachTitle: 'How I approach a project',
    approach: 'Start with the task and the people doing it. Define a small, testable scope, build something they can try, and use what we learn to decide the next step. Access permissions, human review, and ongoing maintenance belong in the design from the start.',
    openSourceTitle: 'Public work',
    openSource: 'These public projects show my independent development work. They are shared as examples of code and tools, rather than client projects or business results.',
    repositories: 'Browse open-source projects',
    contactTitle: 'Get in touch',
    contact: 'For software development, workflow automation, or help using AI, send a brief description of what you are trying to do and where you are getting stuck.',
    portfolio: 'This page introduces my 94soon business. My personal portfolio covers my career, including my work at freee, separately from this business.',
    portfolioLink: 'View my personal portfolio',
    aiTitle: 'How I use Claude',
    ai: 'I actively use Claude in my development work. Integrating the Claude API into client software and automation is a future plan.',
  },
  ko: {
    nav: '94soon',
    title: '94soon — 소프트웨어 개발과 AI 업무 자동화',
    description: '94soon은 정재순이 2026년 9월 시작한 도쿄 기반 개인사업자로, 고객용 소프트웨어 개발과 AI 워크플로·업무 자동화 구축을 돕습니다.',
    intro: '정재순(Jaesoon Jeong)입니다. 2026년 9월 도쿄를 기반으로 개인사업자 94soon을 시작했습니다. 고객용 소프트웨어를 개발하고, AI 워크플로와 업무 자동화 구축을 지원하며, 오픈소스 도구도 만듭니다.',
    areasTitle: '주요 활동',
    areas: [
      { title: '오픈소스 개발', body: '개발자와 AI 에이전트를 활용하는 사람들을 위한 도구를 만듭니다. 코드를 공개해 직접 살펴보고 사용하거나 확장할 수 있도록 합니다.' },
      { title: '소프트웨어 수탁 개발', body: '필요한 업무에 맞춰 애플리케이션과 내부 도구, 시스템 연동을 개발합니다. 아이디어나 반복되는 문제를 실제로 사용할 수 있는 소프트웨어로 구체화합니다.' },
      { title: 'AI 기반 업무 자동화', body: 'AI를 기존 도구와 정보에 연결해 반복 업무를 돕는 시스템을 만듭니다. 자동화할 범위와 사람이 확인할 지점, 실패했을 때의 처리 방법을 함께 설계합니다.' },
      { title: 'AI 도입·활용 지원', body: 'AI가 도움이 될 업무를 찾고, 작은 범위에서 시험한 뒤 일상 업무에 적용하도록 돕습니다. 도구 선택부터 실제 사용 방식까지 함께 살펴봅니다.' },
    ],
    approachTitle: '일하는 방식',
    approach: '업무와 그 일을 하는 사람을 이해하는 데서 시작합니다. 확인 가능한 작은 범위를 정해 직접 써 볼 수 있는 것을 만들고, 그 결과를 바탕으로 다음 단계를 결정합니다. 접근 권한과 사람의 검토, 유지보수도 처음부터 설계에 포함합니다.',
    openSourceTitle: '공개 작업',
    openSource: '직접 개발하는 공개 프로젝트입니다. 고객 프로젝트나 사업 성과가 아닌, 코드와 도구를 통해 개발 방식을 살펴볼 수 있는 예시로 소개합니다.',
    repositories: '오픈소스 프로젝트 보기',
    contactTitle: '문의',
    contact: '소프트웨어 개발, 업무 자동화, AI 활용에 관해 이야기하고 싶다면 하려는 일과 현재 어려운 점을 간단히 보내 주세요.',
    portfolio: '이 페이지는 94soon의 사업을 소개합니다. freee 재직을 포함한 개인 경력은 사업 소개와 구분해 개인 포트폴리오에서 확인할 수 있습니다.',
    portfolioLink: '개인 포트폴리오 보기',
    aiTitle: 'Claude 활용',
    ai: '현재 개발 작업에 Claude를 적극 활용하고 있습니다. 고객 소프트웨어와 자동화에 Claude API를 통합하는 것은 향후 계획입니다.',
  },
  ja: {
    nav: '94soon',
    title: '94soon — ソフトウェア開発とAI業務自動化',
    description: '94soonは、Jaesoon Jeongが2026年9月に東京で始めた個人事業です。ソフトウェア受託開発、AIワークフローや業務自動化の構築を支援します。',
    intro: 'Jaesoon Jeong（정재순）です。2026年9月に東京を拠点とする個人事業として94soonを始めました。お客様向けのソフトウェア開発、AIワークフローや業務自動化の構築を支援し、オープンソースのツールも開発しています。',
    areasTitle: '取り組んでいること',
    areas: [
      { title: 'オープンソース開発', body: '開発者やAIエージェントを使う人のためのツールを作っています。コードを公開し、仕組みを確認したり、使ったり、拡張したりできるようにしています。' },
      { title: 'ソフトウェア受託開発', body: '業務に合わせたアプリケーションや社内ツール、システム連携を開発します。アイデアや繰り返し起きる課題を、実際に使えるソフトウェアにしていきます。' },
      { title: 'AIによる業務自動化', body: 'AIを既存のツールや情報とつなぎ、繰り返し行う作業を支えるシステムを作ります。自動化する範囲、人が確認する箇所、失敗した場合の対応を合わせて設計します。' },
      { title: 'AIの導入・活用支援', body: 'AIが役立つ業務を見つけ、小さく試し、日々の仕事に取り入れるまでを支援します。ツールの選定から具体的な使い方まで一緒に考えます。' },
    ],
    approachTitle: '進め方',
    approach: 'まず、業務とそれを担う人を理解することから始めます。検証できる小さな範囲を決めて試せるものを作り、その結果をもとに次の段階を考えます。アクセス権限、人による確認、保守も最初から設計に含めます。',
    openSourceTitle: '公開している開発物',
    openSource: '個人で開発している公開プロジェクトです。お客様の案件や事業実績としてではなく、コードやツールから開発の取り組みを知っていただくための例として紹介しています。',
    repositories: 'オープンソースのプロジェクトを見る',
    contactTitle: 'お問い合わせ',
    contact: 'ソフトウェア開発、業務自動化、AIの活用について、ご相談の内容と今お困りのことを簡単にお送りください。',
    portfolio: 'このページでは94soonの事業を紹介しています。freeeでの勤務を含む個人の職歴は、事業とは分けて個人ポートフォリオに掲載しています。',
    portfolioLink: '個人ポートフォリオを見る',
    aiTitle: 'Claudeの活用',
    ai: '現在、開発作業でClaudeを積極的に活用しています。お客様向けのソフトウェアや自動化へのClaude APIの組み込みは、今後の計画です。',
  },
}
