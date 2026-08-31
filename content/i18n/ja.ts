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
      'freee全体のAI-Native化に向けた基盤づくりとイネーブルメントを担うAIプラットフォームエンジニアです。社内AIワークフロー基盤（n8n）の運用、BigQueryとVector DBを使ったRAG/MCP向けのコンテキストパイプラインの構築、Claude Code・Codex・DevinなどのAI開発ツールを安全に導入するための技術的ガードレールとガイドラインの整備を行っています。各部門の業務を分析してAIワークフローやAgentを設計し、ショーケース、ハンズオン、ドキュメントを通じて社内全体への展開もリードしています。',
      'それ以前はfreeeで債権・請求書プロダクトを要件から運用まで一気通貫で開発し、その前はLIFULLで不動産情報のアーカイブデータを検索・閲覧するWebアプリケーションを開発・運用しました。さらに、生成AI・LLMを活用した不動産B2B業務効率化のPoC・MVPも企画・開発しました。プロダクトを実際に運用し、AI技術をビジネス価値として検証してきた経験が、現在のプラットフォーム業務の基盤です。機能は運用できる状態になって初めて完成する。',
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
            'freeeのAI-Native化を支えるプラットフォームエンジニアリング。社内ワークフロー、コンテキスト基盤、AIツールの安全な導入を担当。',
          highlights: [
            '社内AIワークフロー基盤（n8n）のセルフホスト運用とEnterprise展開、カスタムノードの開発',
            'BigQueryとVector DBを活用した、RAG・MCP連携のためのコンテキストデータパイプラインの設計・構築',
            'Claude Code、Codex、DevinなどのAI開発ツールを安全に利用するための技術的ガードレールとガイドラインの整備',
            '各部門の業務分析、AIワークフロー・Agentの設計、ショーケースから検証・全社展開までのリード',
            'ハンズオン、勉強会、ドキュメント・教材を通じたAIリテラシー向上と自走支援',
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
      position: 'アプリケーションエンジニア',
      location: '東京',
      roles: {
        'generative-ai': {
          title: 'Generative AIプロダクト開発室 · プロダクト開発ユニット',
          summary:
            'LLMと生成AIを活用し、不動産B2B業務を効率化するPoC・MVPを企画・開発しました。',
          highlights: [
            '技術検証から実プロダクトでの価値検証までをリード',
            'ユーザーフィードバックをもとに機能とプロダクトを改善',
          ],
        },
        'product-engineering': {
          title: 'プロダクトエンジニアリング3部 · 開発1グループ',
          summary:
            '不動産物件のアーカイブデータを管理し、検索・閲覧できるWebアプリケーションを開発・運用しました。',
          highlights: [
            'データベース設計を含むシステム全体を担当',
            'クラウドインフラの構築と運用',
          ],
        },
      },
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
      degree: 'コンピュータ情報系列 · コンピュータ情報専門学士',
      note: '卒業',
    },
    koreacu: {
      school: '高麗サイバー大学校',
      degree: '学士 · コンピュータ工学',
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
