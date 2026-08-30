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
    codingActivity: '코딩 활동',
  },
  ui: {
    allPosts: '전체 글',
    allRepositories: '전체 저장소',
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
      '다른 엔지니어가 AI 기능을 안전하게 출시할 수 있도록 뒷받침하는 플랫폼을 만듭니다. 공용 LLM 런타임과 게이트웨이, 인증과 공급망 통제, 그리고 각 팀이 같은 것을 다시 만들지 않고도 전사가 AI 도구를 도입할 수 있게 하는 거버넌스를 담당합니다.',
      '그전에는 2년간 프로덕트 개발을 담당했습니다. freee의 채권·청구서 영역에서 대규모 데이터, 성능, 인프라 마이그레이션이 일상적인 과제였습니다. 그때 몸에 익힌 엔드투엔드 개발 습관을 플랫폼 업무에도 그대로 가져왔습니다. 운영할 수 없는 기능은 완성된 것이 아닙니다.',
    ],
  },
  experience: {
    freee: {
      company: 'freee 주식회사',
      position: '시니어 AI 플랫폼 엔지니어, CAIO Office',
      location: '일본 도쿄',
      roles: {
        'ai-platform': {
          title: 'AI 플랫폼 엔지니어링',
          summary:
            '엔지니어링 조직 전체가 사용하는 공용 AI 플랫폼. 런타임, 연동, 그리고 이를 둘러싼 통제 장치를 담당합니다.',
          highlights: [
            '공용 LLM 런타임과 게이트웨이, 그리고 각 팀이 기반으로 삼아 개발하는 연동 인터페이스',
            '에이전트 도구를 위한 인증, 크리덴셜 수명 주기, 공급망 통제',
            '근거 기반 딜리버리 — 릴리스, 배포, 실환경 엔드투엔드를 각각 별도로 검증',
            '도입한 도구를 각 팀이 직접 운영하도록 지원하여 모든 문의가 플랫폼으로 되돌아오지 않게 함',
          ],
        },
        'ai-driven-dev': {
          title: 'AI 구동 개발 (AI駆動開発)',
          summary:
            '프로덕트 엔지니어링 전반에 걸쳐 AI 개발 도구를 평가하고 도입합니다.',
          highlights: [
            '도구 평가부터 전사 도입까지 — 샌드박스 파일럿에서 엔터프라이즈 운영으로',
            '사내 개발자 도구를 위한 MCP 서버와 RAG 기반 구축',
            '사용 가이드라인, 워크플로 자동화, 실습 세션과 오피스 아워 운영',
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
      // TODO: fill in the exact job title from your LinkedIn — left blank on
      // purpose rather than guessed. The line is hidden while it is empty.
      position: '',
      location: '일본 도쿄',
    },
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
    koreacu: {
      school: '고려사이버대학교',
      // TODO: add your department once you want it public.
      degree: '',
      note: '재학 중',
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
      items: ['TypeScript', 'Python', 'Go', 'Ruby', 'Shell'],
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
