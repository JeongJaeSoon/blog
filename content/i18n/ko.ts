import type { Dictionary } from './types'

export const ko: Dictionary = {
  site: {
    title: '정재순 — AI 플랫폼 엔지니어',
    description:
      '도쿄에서 일하는 AI 플랫폼 엔지니어. LLM 플랫폼, 에이전트 도구, 그리고 AI를 실제로 운영하는 일에 대한 기록.',
  },
  nav: {
    about: '소개',
    blog: '블로그',
  },
  sections: {
    experience: '경력',
    openSource: '오픈소스',
    skills: '기술',
    education: '학력',
    writing: '글',
    publications: '기고',
    talks: '발표',
    codingActivity: '코딩 활동',
  },
  ui: {
    allPosts: '전체 글',
    allRepositories: '전체 저장소',
    allDecks: '전체 슬라이드',
    minRead: '분 읽기',
    readingTimePrefix: '',
    noPosts: '아직 작성된 글이 없습니다.',
    backHome: '홈으로',
    notFoundTitle: '존재하지 않는 페이지입니다.',
    draft: '초안',
    language: '언어',
    present: '현재',
  },
  profile: {
    headline: '시니어 AI 플랫폼 엔지니어',
    org: 'CAIO Office, freee K.K.',
    locationLine: '일본 도쿄 — 대구 출신',
    about: [
      '전사의 AI-Native 전환을 위한 기반과 활용 문화를 만드는 AI 플랫폼 엔지니어입니다. 사내 AI 워크플로우 기반(n8n)과 컨텍스트 기반(BigQuery·Vector DB를 활용한 RAG/MCP 파이프라인)을 구축·운영하고, Claude Code·Codex·Devin 등 AI 개발 도구를 안전하게 도입할 수 있도록 기술적 가드레일과 가이드라인을 마련합니다. 각 부문의 업무를 함께 분석해 AI 워크플로우와 Agent를 설계하고, 쇼케이스·핸즈온·문서화를 통해 조직 전반의 AI 활용을 확산시키는 역할을 맡고 있습니다.',
      '그전에는 freee에서 채권·청구서 프로덕트를 엔드투엔드로 개발했고, 그보다 앞서 LIFULL에서는 부동산 데이터 검색·열람 웹 애플리케이션을 개발·운영하며 Generative AI·LLM을 활용한 B2B 업무 효율화 PoC와 MVP까지 기획·개발했습니다. 제품을 실제로 운영하고 AI 기술을 비즈니스 가치로 검증해 온 경험이 플랫폼 업무의 기반입니다. 운영할 수 없는 기능은 완성된 것이 아닙니다.',
    ],
  },
  experience: {
    freee: {
      company: 'freee 주식회사',
      position: '시니어 AI 플랫폼 엔지니어, 테크 리드 — CAIO Office',
      location: '일본 도쿄',
      roles: {
        'ai-platform': {
          title: 'AI 플랫폼 엔지니어링',
          summary:
            '전사의 AI-Native 전환을 위해 사내 워크플로우·컨텍스트 기반·AI 도구의 안전한 도입을 지원하는 플랫폼 엔지니어링을 맡고 있습니다.',
          highlights: [
            '사내 AI 워크플로우 기반(n8n)의 셀프호스트 운영과 Enterprise 확장, 커스텀 노드 개발',
            'BigQuery·Vector DB를 활용해 RAG/MCP에 연결되는 컨텍스트 데이터 파이프라인 설계·구축',
            'Claude Code, Codex, Devin 등 AI 개발 도구의 안전한 사용을 위한 기술적 가드레일·가이드라인 수립',
            '각 부문 업무 분석, AI 워크플로우·Agent 설계, 쇼케이스부터 검증·전사 확산까지 리드',
            '핸즈온·스터디·문서와 교재를 통한 AI 리터러시 향상 및 자율적 활용 지원',
          ],
        },
        'ai-driven-dev': {
          title: 'AI 구동 개발 (AI駆動開発)',
          summary:
            '600명 이상의 엔지니어와 약 400명 규모의 PdM·ApD가 AI 개발 도구를 실제 업무에 활용할 수 있도록 기반과 지원 체계를 만들었습니다.',
          highlights: [
            '도구 평가부터 전사 도입까지 — 샌드박스 파일럿에서 엔터프라이즈 운영으로',
            'Python LLM Proxy, 내부 지식 Vector Embeddings, Go Local·Remote MCP를 활용한 사내 AI 개발 기반 구축',
            '사용 가이드라인과 접근 권한을 정비하고, 1on1·핸즈온·후속 지원으로 도입 확산',
          ],
        },
        invoicing: {
          title: '채권·청구서 (債権・請求書)',
          summary:
            '청구서 프로덕트에서 프로덕트 엔지니어링을 담당했고, 이후 프로젝트 오너십과 TL 업무를 맡았습니다.',
          highlights: [
            '요건 정의, 설계, QA, 운영 준비까지 기능 개발을 엔드투엔드로 담당',
            '대용량 데이터와 성능 개선: OOM, DB 부하, 온라인 스키마 변경',
            '인프라 마이그레이션, CI/CD, Datadog 기반 옵저버빌리티',
            '팀이 직접 출시한 것을 스스로 운영할 수 있도록 온보딩과 런북 정비',
          ],
        },
      },
    },
    lifull: {
      company: 'LIFULL 주식회사',
      position: '애플리케이션 엔지니어',
      location: '일본 도쿄',
      roles: {
        'generative-ai': {
          title: '생성 AI 프로덕트 개발실 · 프로덕트 개발 유닛',
          summary:
            'LLM과 생성 AI를 활용해 부동산 B2B 업무 효율화를 위한 PoC와 MVP를 기획·개발했습니다.',
          highlights: [
            '기술 실험부터 실제 제품 검증까지 주도',
            '사용자 피드백을 바탕으로 기능 개선과 제품 고도화',
          ],
        },
        'product-engineering': {
          title: '프로덕트 엔지니어링 3부 · 개발 1그룹',
          summary:
            '부동산 매물의 아카이브 데이터를 관리하고 검색·열람하는 웹 애플리케이션을 개발·운영했습니다.',
          highlights: [
            '데이터베이스 설계를 포함한 시스템 전반 담당',
            '클라우드 인프라 구성과 운영',
          ],
        },
      },
    },
  },
  publications: {
    'freee-claude-enterprise-scim':
      'Claude Enterprise를 전사에 안전하게 배포하기 위해 SCIM × IaC로 권한 운영을 정비한 이야기',
    'freee-ai-driven-development-report':
      '숫자로 돌아보는 freee의 AI 구동 개발 — 후편',
    'freee-ai-driven-development-01':
      'AI 구동 개발로. freee는 개발 환경을 어떻게 진화시키고 있는가 — 전편',
    'freee-invoice-email-abuse':
      'freee 청구서 메일 발송 기능의 부정 이용 방지 대책',
    'freee-desk-2023':
      '오사키로 이사하며 데스크 환경 업그레이드',
    'lifull-info-power':
      '엔지니어의 정보력을 높이기 위한 LIFULL의 활동',
    'lifull-remote-abroad':
      '신입 한국인 엔지니어의 해외 생활과 리모트 워크',
  },
  talks: {
    'qiita-bash-claude-code':
      'Qiita Bash LT — Claude Code를 어떻게 쓰고 있는가',
  },
  projects: {
    'agent-guard':
      'AI 코딩 에이전트, Git 훅, CI를 위한 실시간 시크릿 유출 방지 가드레일.',
    kollegium: '팀 채팅에서 동작하는 AI 팀메이트를 위한 오픈소스 런타임 프레임워크.',
    'terraform-provider-claude-enterprise':
      'Claude Enterprise의 멤버별 지출 한도를 관리하는 커뮤니티 Terraform 프로바이더.',
    relay: 'Claude Code를 위한 개인용 멀티 에이전트 오케스트레이터.',
    mux: '인터랙티브 TUI를 갖춘 tmux 세션 매니저.',
  },
  education: {
    yeungjin: {
      school: '영진전문대학교',
      degree: '컴퓨터정보계열 · 컴퓨터정보 전문학사',
      note: '졸업',
    },
    koreacu: {
      school: '고려사이버대학교',
      degree: '학사 · 컴퓨터 공학',
      note: '졸업',
    },
  },
  skills: [
    {
      group: 'AI 플랫폼',
      items: [
        'MCP (Model Context Protocol)',
        'LLM 게이트웨이 및 프록시',
        'RAG',
        '에이전트 거버넌스',
        'Langfuse',
        'n8n',
        'Claude Enterprise 운영',
      ],
    },
    {
      group: '프로그래밍 언어',
      items: ['TypeScript', 'Python', 'Go', 'Ruby', 'PHP', 'Shell'],
    },
    {
      group: '인프라',
      items: ['AWS', 'Kubernetes', 'Terraform', 'Datadog', 'GitHub Actions', 'CI/CD'],
    },
    {
      group: '사용 언어',
      items: ['한국어 (모국어)', '일본어 (비즈니스)', '영어'],
    },
  ],
}
