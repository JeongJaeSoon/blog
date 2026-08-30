import type { Dictionary } from './types'

export const ja: Dictionary = {
  site: {
    title: 'JaeSoon Jeong — AIプラットフォームエンジニア',
    description:
      '東京在住のAIプラットフォームエンジニア。LLMプラットフォーム、エージェントツール、そしてAIを実運用に乗せるための運用面についての記録。',
  },
  nav: {
    about: 'プロフィール',
    blog: 'ブログ',
  },
  sections: {
    experience: '職務経歴',
    openSource: 'オープンソース',
    skills: 'スキル',
    education: '学歴',
    writing: '記事',
    publications: '寄稿記事',
    talks: '登壇',
    codingActivity: 'コーディング活動',
  },
  ui: {
    allPosts: '記事一覧',
    allRepositories: 'リポジトリ一覧',
    allDecks: 'スライド一覧',
    minRead: '分',
    readingTimePrefix: '約',
    noPosts: 'まだ記事がありません。',
    backHome: 'ホームに戻る',
    notFoundTitle: 'このページは存在しません。',
    draft: '下書き',
    language: '言語',
    present: '現在',
  },
  profile: {
    headline: 'シニアAIプラットフォームエンジニア',
    org: 'freee株式会社 CAIO Office',
    locationLine: '東京 — 韓国・大邱出身',
    about: [
      '他のエンジニアが安全にAI機能をリリースするための基盤をつくっている。共通のLLMランタイムとゲートウェイ、認証とサプライチェーンの統制、そして各チームが同じ仕組みを作り直さずに全社でAIツールを導入できるようにするガバナンスまでを担う。',
      'それ以前の2年間はプロダクト開発に従事し、freeeの債権・請求書領域で大規模データ、パフォーマンス、インフラ移行が日常の課題だった。要件から運用までを一気通貫でやり切る姿勢は、そのままプラットフォーム開発にも持ち込んでいる。機能は運用できる状態になって初めて完成する。',
    ],
  },
  experience: {
    freee: {
      company: 'freee株式会社',
      position: 'シニアAIプラットフォームエンジニア、テックリード — CAIO Office',
      location: '東京',
      roles: {
        'ai-platform': {
          title: 'AI Platform Engineering',
          summary:
            'エンジニアリング組織全体で使う共通AI基盤。ランタイム、統合、そしてそれらを支える統制までを担当。',
          highlights: [
            '共通のLLMランタイムとゲートウェイ、および各チームが実装時に利用する統合インターフェース',
            'エージェントツールの認証、クレデンシャルのライフサイクル、サプライチェーンの統制',
            'エビデンス駆動のデリバリー — リリース、デプロイ、本番でのエンドツーエンド動作をそれぞれ個別に検証',
            '導入したものを各チーム自身で運用できるようにするイネーブルメント。あらゆる問い合わせがプラットフォーム側に戻ってこない状態をつくる',
          ],
        },
        'ai-driven-dev': {
          title: 'AI駆動開発',
          summary: 'プロダクト開発全体に向けたAI開発ツールの評価と展開。',
          highlights: [
            'ツール評価と全社展開 — サンドボックスでの試験導入からエンタープライズ運用まで',
            '社内開発者向けツールのためのMCPサーバーとRAG基盤の整備',
            '利用ガイドラインの策定、ワークフローの自動化、ハンズオンとオフィスアワーの運営',
          ],
        },
        invoicing: {
          title: '債権・請求書',
          summary:
            '請求書プロダクトの開発、その後のプロジェクトオーナーおよびTLとしての業務。',
          highlights: [
            '要件定義、設計、QA、運用準備までを一気通貫で担う機能開発',
            '大量データとパフォーマンスへの対応: OOM、DB負荷、オンラインスキーマ変更',
            'インフラ移行、CI/CD、Datadogによるオブザーバビリティ',
            'リリースしたものをチーム自身で運用できるようにするオンボーディングとRunbookの整備',
          ],
        },
      },
    },
    lifull: {
      company: '株式会社LIFULL',
      // Not a stated title: no source gives one. This is his department
      // (プロダクトエンジニアリング部) plus how he described himself in his
      // own LIFULL blog bios. Replace with the exact title if it differs.
      position: 'プロダクトエンジニアリング部 エンジニア',
      location: '東京',
    },
  },
  publications: {
    'freee-claude-enterprise-scim':
      'Claude Enterprise を全社に安全に展開するために、SCIM × IaC で権限運用を整備した話',
    'freee-ai-driven-development-report':
      '数字で振り返る freee の AI 駆動開発 - 後編',
    'freee-ai-driven-development-01':
      'AI駆動開発へ。freee は開発環境をどう進化させているか？- 前編',
    'freee-invoice-email-abuse':
      'より良いプロダクトを目指して、freee 請求書のメール送付機能不正利用防止対策の話',
    'freee-desk-2023':
      '大崎に引越ししてきたので、デスク環境をアップグレード',
    'lifull-info-power':
      'エンジニアの情報力を向上するためのLIFULLの活動',
    'lifull-remote-abroad':
      '新卒韓国人エンジニアの外国生活×リモートワーク',
  },
  talks: {
    'qiita-bash-claude-code':
      'Qiita Bash「キミたちはClaude Codeをどう使いこなす？」LT 登壇資料',
  },
  projects: {
    'agent-guard':
      'AIコーディングエージェント、Gitフック、CIに対応したシークレット漏洩のリアルタイムガードレール。',
    kollegium:
      'チームチャット上で動くAIメンバーのためのオープンソースランタイムフレームワーク。',
    'terraform-provider-claude-enterprise':
      'Claude Enterpriseのメンバー単位の利用上限を管理するコミュニティ製Terraform Provider。',
    relay: 'Claude Code向けの個人用マルチエージェントオーケストレーター。',
    mux: 'インタラクティブなTUIを備えたtmuxセッションマネージャー。',
  },
  education: {
    yeungjin: {
      school: 'Yeungjin University（영진전문대학교）',
      // Sources disagree on the department (일본IT과 vs 웹데이터베이스 전공);
      // left blank rather than picking one.
      degree: '',
      note: '卒業',
    },
    koreacu: {
      school: '高麗サイバー大学校',
      // TODO: add your department once you want it public.
      degree: '',
      note: '在学中',
    },
  },
  skills: [
    {
      group: 'AIプラットフォーム',
      items: [
        'MCP (Model Context Protocol)',
        'LLMゲートウェイ・プロキシ',
        'RAG',
        'エージェントのガバナンス',
        'Langfuse',
        'n8n',
        'Claude Enterpriseの運用',
      ],
    },
    {
      group: 'プログラミング言語',
      items: ['TypeScript', 'Python', 'Go', 'Ruby', 'PHP', 'Shell'],
    },
    {
      group: 'インフラ',
      items: ['AWS', 'Kubernetes', 'Terraform', 'Datadog', 'GitHub Actions', 'CI/CD'],
    },
    {
      group: '語学',
      items: ['韓国語（ネイティブ）', '日本語（ビジネスレベル）', '英語'],
    },
  ],
}
