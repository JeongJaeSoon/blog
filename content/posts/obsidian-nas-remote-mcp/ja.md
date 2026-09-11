---
title: ObsidianをNASにセルフホストしてRemote MCP化する
date: '2026-08-25'
summary: Obsidian SyncのVaultをUGREEN NASへ常時同期し、OAuth対応のRemote MCPとしてClaudeから安全に読み書きできるようにした構成と、実際につまずいた5点をまとめます。
lang: ja
tags:
  - obsidian
  - mcp
  - self-hosting
  - nas
draft: false
---

MacBook 2台だけに置いていたObsidian Vaultを、UGREEN NASにも常時同期するようにしました。そのVaultを遠隔から読み書きできる独立したMCPサーバーも追加しています。

構成は3コンテナとCloudflare Tunnel 1本です。この記事では、実際の構築手順と、途中で踏んだ5つの落とし穴をまとめます。

## なぜセルフホストするのか

Obsidian SyncはMacBookとiPhoneの同期には十分便利です。ただし、Vaultは各端末にしか存在しません。

- Macが起動していないと外部からアクセスできない
- LLMにノートを検索させるたびにコピー＆ペーストが必要
- n8nなどの自動化から使うには常時稼働する対象が必要

そこでNASを4台目のSyncクライアントにしました。

同期層には公式の`obsidian-headless`を使います。GUIなしで同期済みVaultを通常のMarkdownファイルとして展開できます。Syncthing、Git、Self-hosted LiveSyncも候補でしたが、すでにObsidian Syncを契約しているので、同期方式を増やす理由はありませんでした。

ただし`obsidian-headless`はオープンベータです。導入前に必ずVaultのスナップショットを取ってください。

アクセス層には、ファイルシステムを直接読む独立したMCPサーバーを使います。Local REST APIコミュニティプラグインはObsidianアプリの起動が前提なので、NASでの常時運用には向きません。

MCPサーバーを選ぶ条件は次の2つでした。

- Claudeのカスタムコネクタから使えるStreamable HTTPとOAuth 2.0に対応していること。stdio専用MCPはRemote Connectorとして使えません。
- Obsidian Syncに書きかけのファイルを見せないよう、ファイルをアトミックに置換できること。

この同期層とアクセス層の上にCloudflare Tunnelを置きます。

## 前提

- UGREEN NAS（UGOS Pro）とPortainer
- Cloudflareで管理しているドメイン
- Obsidian Syncの契約

PortainerはMarius Hostingの[SSHを使わない導入手順](https://mariushosting.com/ugreen-nas-how-to-install-portainer-without-ssh/)で入れました。

以下ではホスト名を`vault.example.com`、NASのIPアドレスを`<NAS_IP>`と表記します。

## 0. 共通ネットワークを作る

Portainerで **Networks → Add network** を開き、`edge`という名前でbridgeネットワークを作ります。設定はデフォルトのままで構いません。Stackをデプロイする前に作ってください。

Tunnelは別Stackで動かし、MCPとこの`edge`ネットワークを共有します。MCPのLAN向けポートを公開する必要はありません。

## 1. Vault用ディレクトリとSecretを用意する

NAS上に空の`docker/obsidian-remote/vault`ディレクトリを作り、確認済みの絶対パスを控えます。多くの環境では`/volume1/docker/obsidian-remote/vault`ですが、推測せず実際のパスを確認してください。

Secretは次のように生成します。

```bash
openssl rand -hex 32   # MCP bearer token
openssl rand -hex 32   # OAuth client secret
openssl rand -hex 24   # OAuth login password
```

## 2. `obsidian-remote` Stackをデプロイする

PortainerでStack `obsidian-remote`を作り、Web editorに[完全なComposeファイル](https://gist.github.com/JeongJaeSoon/c7ba9387778a21116408830a655bc65b)を貼り付けます。

Stackには2つのサービスがあります。

- `obsidian-sync`: `node:22-bookworm-slim`上に`obsidian-headless`を導入し、`ob sync --continuous`を実行します。初期設定が終わるまで、意図的に`/root/.ob-ready`の作成を待ちます。
- `obsidian-mcp`: `python:3.12-slim`、uv、vault-mcpのソースで動作します。Syncと同じホストパスをマウントし、defaultと`edge`の両ネットワークに参加します。

インストール済み成果物はnamed volumeに保存します。ホスト側へ公開するポートはありません。

PortainerのEnvironment variablesには次を設定します。

```text
VAULT_HOST_PATH=/確認した/Vaultの絶対パス
VAULT_MCP_HOSTNAME=vault.example.com
VAULT_MCP_TOKEN=生成したbearer token
VAULT_OAUTH_CLIENT_ID=vault-mcp-client
VAULT_OAUTH_CLIENT_SECRET=生成したclient secret
VAULT_OAUTH_USERNAME=任意のログイン名
VAULT_OAUTH_PASSWORD=生成したログインpassword
```

`VAULT_OAUTH_PASSWORD`を空にすると、全員のログインが拒否されます。

デプロイすると2コンテナが作られます。この時点で`obsidian-sync`が待機しているのは正常です。

## 3. Headless Syncを初期化する

Portainerから`obsidian-sync`のConsoleを開き、次を実行します。

```bash
ob login
ob sync-list-remote
ob sync-setup --vault "<Vault名>"
ob sync
ob sync-status
ls /vault | head
touch /root/.ob-ready
```

その後、コンテナを再起動します。ログが次のようになれば同期できています。

```text
Starting sync:
  Vault: <Vault名>
  Location: /vault
  Sync mode: bidirectional
  Conflict strategy: merge
Connecting...
Connection successful. Detecting changes...
Fully synced
```

## 4. MCPをLAN内から確認する

MCPの初回起動には1〜2分かかります。次のログを確認します。

```text
INFO  Starting vault MCP server. Vault: /vault
INFO  Frontmatter index built: N files
INFO  Starting server on 0.0.0.0:8420 with bearer auth + OAuth
INFO  Uvicorn running on http://0.0.0.0:8420
```

DNS rebinding対策により、LANのIPアドレスをHostとして送ると拒否されます。`Host`ヘッダーを付けてテストします。

```bash
curl -s -D - -o /dev/null -H "Host: vault.example.com" \
  http://<NAS_IP>:8420/mcp
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: vault.example.com" \
  -H "Authorization: Bearer $VAULT_MCP_TOKEN" http://<NAS_IP>:8420/mcp
```

1つ目は`401`になるのが正解です。`404`ならパスが間違っています。2つ目は`406`になります。通常のGETはMCPリクエストとして無効だからです。

`www-authenticate`の`resource_metadata`がLAN IPではなく、`https://vault.example.com/...`を指していることも確認します。

## 5. Cloudflare Tunnelを追加する

Cloudflare Zero Trustで **Networks → Tunnels** を開き、Tunnelを作ります。表示されたDockerコマンドを丸ごとコピーし、`--token`の後ろにある実際のtokenを取り出してください。画面上で省略表示された`eyJ...`は完全なtokenではありません。

別Stackとして`cloudflared`をデプロイします。

```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token ${CF_TUNNEL_TOKEN}
    networks:
      - edge
networks:
  edge:
    external: true
```

Environment variablesに`CF_TUNNEL_TOKEN`を設定します。

Public Hostnameは次のようにします。

- Subdomain: `vault`
- Domain: `example.com`
- Path: 空欄
- Service: HTTP → `obsidian-mcp:8420`

Pathは必ず空欄にします。OAuth discoveryの`/.well-known/...`と`/oauth/...`にもTunnel経由で到達する必要があるためです。

公開後に確認します。

```bash
curl -s https://vault.example.com/.well-known/oauth-authorization-server | jq
```

`issuer`、`authorization_endpoint`、`token_endpoint`、`registration_endpoint`がすべて`vault.example.com`上を指していれば成功です。`registration_endpoint`があるのは、Dynamic Client Registrationが有効という意味です。

## 6. Claudeに接続する

Claude Webの **Settings → Connectors** からカスタムコネクタを追加します。

- 名前: 任意
- URL: `https://vault.example.com/mcp`
- AdvancedのClient ID / Client Secret: 空欄

Dynamic Client Registrationにより、Claudeが自分のredirect URIを登録できます。固定のClient IDとSecretを入力すると別のフローに切り替わり、Claudeのredirect URIを事前登録する必要があります。

Connectを押し、`VAULT_OAUTH_USERNAME`と`VAULT_OAUTH_PASSWORD`でログインします。一度登録されれば、モバイル版Claudeからも使えます。

## 実際につまずいた5つの点

### 1. PortainerのRemote deploymentは`build:`に対応しない

Composeに`build:`があると、次のエラーになりました。

```text
Unable to upgrade to tcp, received 200
```

SSHで事前にbuildしてtagを付けるか、公式image上でbootstrapして成果物をnamed volumeにcacheする必要があります。今回は後者を選びました。再起動のたびに作り直さないよう、bootstrapは既存成果物があればskipする実装にします。

### 2. `ob sync`にconflict strategyを渡せない

`ob sync --conflict-strategy merge`を実行すると、次のエラーになります。

```text
error: unknown option '--conflict-strategy'
```

`ob sync`が受け取るのは`--path`と`--continuous`だけです。同期方向、conflict strategy、除外、ファイル形式などは`ob sync-config`で設定し、Vault設定として保存されます。デフォルトがすでにbidirectional + mergeなので、今回は変更不要でした。

また、メインプロセスが停止していてもPortainerのConsoleには入れる場合があります。稼働判定はConsoleではなく、コンテナのStatusとLogsで行います。

### 3. MCP SDK 2.0で`mcp.server.fastmcp`が消えた

upstreamの指定が`mcp[cli]>=1.9.0`で上限なしだったため、uvが2.0.0を取得し、1.x向けimportが壊れました。`<2`を追加して1.29系に固定します。

```bash
grep -q 'mcp\[cli\]>=1.9.0,<2' pyproject.toml \
  || sed -i 's/"mcp\[cli\]>=1.9.0"/"mcp[cli]>=1.9.0,<2"/' pyproject.toml
```

repositoryの`.python-version`は3.14、コンテナimageは3.12だったため、Pythonのversion条件も合わせる必要がありました。

### 4. `127.0.0.1` bindではDocker networkから到達できない

デフォルトのbind先が`127.0.0.1`だと、別コンテナのCloudflare Tunnelから到達できません。`VAULT_MCP_HOST=0.0.0.0`を設定します。

コンテナ内の`0.0.0.0` bindと、ホストへのport公開は別の話です。published portsを設定せず、`edge`ネットワークだけで接続すれば、LANには公開されません。

### 5. OAuth client registryを永続化する

OAuth client registryはデフォルトではコンテナのHOMEに保存されます。コンテナを作り直すと登録済み`client_id`を忘れ、Connectorが使えなくなります。

永続volume上に保存先を指定します。

```yaml
OAUTH_CLIENTS_PATH: /data/oauth_clients.json
```

## できるようになったこと

MCPは20個のtoolを公開します。

- ファイル読み込み、batch読み込み、一覧、全文検索、frontmatter検索
- 書き込み、binary書き込み、部分編集、追記、frontmatter一括更新
- 移動、削除
- Canvasの読み込み、nodeとedgeの操作
- Daily noteのpath取得、読み込み、追記
- Vault health check

最初のhealth analysisだけで、frontmatterがないファイルや壊れたWiki linkが数百件見つかりました。その多くは内容の欠損ではなく表現の不一致で、自動化と相性のよい修正対象です。

## 残る制約と運用上の注意

`obsidian-headless`はオープンベータです。初回同期後にファイル数を照合し、スナップショットも残してください。同じ端末・同じpathに対してdesktop版Obsidian Syncとheadless Syncを同時に動かしてはいけません。

MCPはインターネット上の公開endpointになります。推測されにくいOAuth passwordを使ってください。Cloudflare Accessを前段に置くと、ConnectorのOAuth handshakeが人間向けlogin画面で止まるため、ここでは使いません。接続完了後、必要であればWAFで国やIPを絞れます。

n8nのように同じNAS上で動く自動化はVaultを直接mountできます。ただし競合を減らすため、機械が書き込む領域を`inbox/`などに分けておくのがおすすめです。

