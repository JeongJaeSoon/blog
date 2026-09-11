---
title: Obsidian을 NAS에 셀프 호스팅하고 Remote MCP로 연결하기
date: '2026-08-25'
summary: Mac이 꺼져 있어도 Obsidian Vault를 다룰 수 있도록 UGREEN NAS에 headless Sync와 OAuth 기반 Remote MCP를 올린 기록입니다.
lang: ko
tags:
  - obsidian
  - mcp
  - self-hosting
  - nas
draft: false
---

제 Obsidian Vault는 오랫동안 MacBook 두 대 안에만 있었습니다. 이 Vault를 UGREEN NAS에도 계속 동기화하고, 원격에서 읽고 쓸 수 있는 MCP 서버를 그 위에 올렸습니다. 최종 구성은 컨테이너 3개와 Cloudflare Tunnel 하나입니다.

막상 해보니 설치 순서보다 Portainer의 제약, CLI 옵션, MCP SDK 버전 차이를 알아내는 데 시간이 더 들었습니다. 나중에 다시 구성할 때 헤매지 않도록 실제로 통과한 설정과 다섯 가지 실패 지점을 함께 남깁니다.

## 왜 셀프 호스팅하는가

Obsidian Sync는 MacBook과 iPhone을 동기화하기에 충분히 편리합니다. 하지만 Vault는 각 기기에만 존재합니다.

- Mac이 꺼져 있으면 외부에서 접근할 수 없습니다.
- LLM에게 노트를 검색시킬 때마다 내용을 복사해 붙여넣어야 합니다.
- n8n 같은 자동화에서 사용하려면 항상 켜져 있는 대상이 필요합니다.

이 빈자리를 채우기 위해 NAS를 네 번째 Sync 클라이언트로 만들었습니다.

동기화 계층에는 공식 `obsidian-headless`를 사용합니다. GUI 없이 동기화된 Vault를 일반 Markdown 파일로 펼쳐 줍니다. Syncthing, Git, Self-hosted LiveSync도 후보였지만 이미 Obsidian Sync를 구독하고 있으므로 동기화 방식을 하나 더 추가할 이유가 없었습니다.

다만 `obsidian-headless`는 아직 오픈 베타라 안정판처럼 다루지는 않았습니다. 시작하기 전에 Vault 스냅샷을 만들어 두는 편이 안전합니다.

접근 계층에서는 파일 시스템을 직접 읽는 독립 MCP 서버를 사용합니다. Local REST API 커뮤니티 플러그인은 Obsidian 앱이 실행 중이어야 하므로 NAS에서 상시 운영하기에는 적합하지 않습니다.

MCP 서버를 고를 때는 두 조건을 먼저 정했습니다.

- Claude 커스텀 커넥터에서 사용할 수 있도록 Streamable HTTP와 OAuth 2.0을 지원할 것. stdio 전용 MCP는 Remote Connector로 쓸 수 없습니다.
- Obsidian Sync가 쓰다 만 파일을 보지 않도록 파일을 원자적으로 교체할 것.

이 두 계층을 Cloudflare Tunnel로 외부에 연결하는 것이 전체 구조입니다.

## 준비물

- UGREEN NAS(UGOS Pro)와 Portainer
- Cloudflare에서 관리하는 도메인
- Obsidian Sync 구독

Portainer는 Marius Hosting의 [SSH 없이 설치하는 안내](https://mariushosting.com/ugreen-nas-how-to-install-portainer-without-ssh/)를 따라 설치했습니다.

아래에서는 호스트 이름을 `vault.example.com`, NAS IP 주소를 `<NAS_IP>`로 표시합니다.

## 0. 공용 네트워크 만들기

Portainer에서 **Networks → Add network**를 열고 `edge`라는 bridge 네트워크를 만듭니다. 나머지 설정은 기본값으로 두면 됩니다. Stack을 배포하기 전에 먼저 만들어야 합니다.

Tunnel은 별도 Stack으로 실행하고 MCP와 이 `edge` 네트워크를 공유합니다. MCP의 LAN 포트를 공개할 필요는 없습니다.

## 1. Vault 디렉터리와 Secret 준비하기

NAS에 빈 `docker/obsidian-remote/vault` 디렉터리를 만들고 확인된 절대 경로를 복사합니다. 흔히 `/volume1/docker/obsidian-remote/vault`이지만 추측하지 말고 실제 경로를 확인하세요.

필요한 Secret은 이때 한꺼번에 만들었습니다.

```bash
openssl rand -hex 32   # MCP bearer token
openssl rand -hex 32   # OAuth client secret
openssl rand -hex 24   # OAuth login password
```

## 2. `obsidian-remote` Stack 배포하기

Portainer에서 `obsidian-remote` Stack을 만들고 Web editor에 [전체 Compose 파일](https://gist.github.com/JeongJaeSoon/c7ba9387778a21116408830a655bc65b)을 붙여넣습니다.

이 Compose에서 실행하는 서비스는 둘입니다.

- `obsidian-sync`: `node:22-bookworm-slim`에 `obsidian-headless`를 설치하고 `ob sync --continuous`를 실행합니다. 초기 설정을 마칠 때까지 의도적으로 `/root/.ob-ready`가 생기기를 기다립니다.
- `obsidian-mcp`: `python:3.12-slim`, uv, vault-mcp 소스로 실행됩니다. Sync와 같은 호스트 경로를 마운트하고 default 및 `edge` 네트워크에 참여합니다.

설치 결과물은 named volume에 보존합니다. 호스트에 공개하는 포트는 없습니다.

Portainer의 Environment variables에는 다음을 설정합니다.

```text
VAULT_HOST_PATH=/확인한/Vault의/절대경로
VAULT_MCP_HOSTNAME=vault.example.com
VAULT_MCP_TOKEN=생성한 bearer token
VAULT_OAUTH_CLIENT_ID=vault-mcp-client
VAULT_OAUTH_CLIENT_SECRET=생성한 client secret
VAULT_OAUTH_USERNAME=원하는 로그인 이름
VAULT_OAUTH_PASSWORD=생성한 로그인 password
```

`VAULT_OAUTH_PASSWORD`를 비워 두면 모든 로그인이 거부됩니다.

배포 후 컨테이너는 두 개가 생깁니다. 아직 초기 설정 전이므로 `obsidian-sync`가 대기하는 것이 정상입니다.

## 3. Headless Sync 초기화하기

Portainer에서 `obsidian-sync`의 Console을 열고 다음을 실행합니다.

```bash
ob login
ob sync-list-remote
ob sync-setup --vault "<Vault 이름>"
ob sync
ob sync-status
ls /vault | head
touch /root/.ob-ready
```

ready file까지 만든 다음 컨테이너를 재시작합니다. 제 환경에서는 동기화가 정상적으로 붙으면 다음 로그가 나왔습니다.

```text
Starting sync:
  Vault: <Vault 이름>
  Location: /vault
  Sync mode: bidirectional
  Conflict strategy: merge
Connecting...
Connection successful. Detecting changes...
Fully synced
```

## 4. LAN에서 MCP 확인하기

첫 실행 때는 의존성을 준비하느라 MCP가 뜨기까지 1~2분 정도 걸렸습니다. 아래 네 줄을 기동 기준으로 삼았습니다.

```text
INFO  Starting vault MCP server. Vault: /vault
INFO  Frontmatter index built: N files
INFO  Starting server on 0.0.0.0:8420 with bearer auth + OAuth
INFO  Uvicorn running on http://0.0.0.0:8420
```

DNS rebinding 방어 때문에 LAN IP를 Host로 보내면 요청이 거부됩니다. `Host` 헤더를 붙여 테스트합니다.

```bash
curl -s -D - -o /dev/null -H "Host: vault.example.com" \
  http://<NAS_IP>:8420/mcp
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: vault.example.com" \
  -H "Authorization: Bearer $VAULT_MCP_TOKEN" http://<NAS_IP>:8420/mcp
```

첫 번째 응답은 `401`이어야 합니다. `404`라면 경로가 잘못된 것입니다. 두 번째는 `406`이어야 합니다. 일반 GET 요청은 MCP 요청으로 유효하지 않기 때문입니다.

`www-authenticate`의 `resource_metadata`가 LAN IP가 아니라 `https://vault.example.com/...`를 가리키는지도 확인합니다.

## 5. Cloudflare Tunnel 추가하기

Cloudflare Zero Trust에서 **Networks → Tunnels**를 열어 Tunnel을 만듭니다. 표시되는 Docker 명령 전체를 복사한 뒤 `--token` 다음의 실제 token을 추출하세요. 화면에 줄여서 보이는 `eyJ...`는 완전한 token이 아닙니다.

별도 Stack으로 `cloudflared`를 배포합니다.

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

Environment variables에 `CF_TUNNEL_TOKEN`을 설정합니다.

Public Hostname은 다음과 같이 구성합니다.

- Subdomain: `vault`
- Domain: `example.com`
- Path: 비워 둠
- Service: HTTP → `obsidian-mcp:8420`

Path는 반드시 비워 두어야 합니다. OAuth discovery의 `/.well-known/...`과 `/oauth/...` 경로도 Tunnel을 통해 접근할 수 있어야 하기 때문입니다.

공개 여부는 OAuth metadata를 직접 조회해 확인했습니다.

```bash
curl -s https://vault.example.com/.well-known/oauth-authorization-server | jq
```

`issuer`, `authorization_endpoint`, `token_endpoint`, `registration_endpoint`가 모두 `vault.example.com`을 가리키면 성공입니다. `registration_endpoint`가 있다는 것은 Dynamic Client Registration이 열려 있다는 뜻입니다.

## 6. Claude에 연결하기

Claude 웹의 **Settings → Connectors**에서 커스텀 커넥터를 추가합니다.

- 이름: 자유롭게 지정
- URL: `https://vault.example.com/mcp`
- Advanced의 Client ID / Client Secret: 비워 둠

Dynamic Client Registration 덕분에 Claude가 자신의 redirect URI를 등록할 수 있습니다. 고정 Client ID와 Secret을 입력하면 다른 흐름으로 전환되며, Claude의 redirect URI를 미리 등록해야 합니다.

Connect를 누르고 `VAULT_OAUTH_USERNAME`과 `VAULT_OAUTH_PASSWORD`로 로그인합니다. 한 번 등록하면 모바일 Claude에서도 보입니다.

## 구축하면서 걸렸던 다섯 가지 함정

### 1. Portainer Remote deployment는 `build:`를 지원하지 않는다

Compose에 `build:`를 넣으면 다음 오류가 발생했습니다.

```text
Unable to upgrade to tcp, received 200
```

SSH에서 미리 build하고 tag를 붙이거나, 공식 image 위에서 bootstrap한 결과물을 named volume에 cache해야 합니다. 이번에는 후자를 선택했습니다. 재시작할 때마다 다시 만들지 않도록 bootstrap은 기존 결과물이 있으면 건너뛰어야 합니다.

### 2. `ob sync`에는 conflict strategy를 전달할 수 없다

`ob sync --conflict-strategy merge`를 실행하면 다음 오류가 납니다.

```text
error: unknown option '--conflict-strategy'
```

`ob sync`가 받는 옵션은 `--path`와 `--continuous`뿐입니다. 동기화 방향, conflict strategy, 제외 항목, 파일 형식 같은 설정은 `ob sync-config`에서 정하고 Vault 설정으로 저장합니다. 기본값이 이미 bidirectional + merge라서 여기서는 변경할 필요가 없었습니다.

또한 메인 프로세스가 죽어 있어도 Portainer Console에는 들어갈 수 있습니다. 실행 여부는 Console이 아니라 컨테이너 Status와 Logs로 판단해야 합니다.

### 3. MCP SDK 2.0에서 `mcp.server.fastmcp`가 제거됐다

upstream 의존성이 상한 없는 `mcp[cli]>=1.9.0`이어서 uv가 2.0.0을 가져왔고, 1.x용 import가 깨졌습니다. `<2`를 추가해 1.29 계열로 고정합니다.

```bash
grep -q 'mcp\[cli\]>=1.9.0,<2' pyproject.toml \
  || sed -i 's/"mcp\[cli\]>=1.9.0"/"mcp[cli]>=1.9.0,<2"/' pyproject.toml
```

repository의 `.python-version`은 3.14이고 컨테이너 image는 3.12였으므로 Python 버전 조건도 맞춰야 했습니다.

### 4. `127.0.0.1`에 bind하면 Docker network에서 접근할 수 없다

기본 bind 주소인 `127.0.0.1`로는 다른 컨테이너의 Cloudflare Tunnel이 접근할 수 없습니다. `VAULT_MCP_HOST=0.0.0.0`을 설정합니다.

컨테이너 내부의 `0.0.0.0` bind와 호스트 포트 공개는 별개입니다. published ports를 설정하지 않고 `edge` 네트워크로만 연결하면 LAN에는 열리지 않습니다.

### 5. OAuth client registry를 영속화해야 한다

OAuth client registry는 기본적으로 컨테이너 HOME에 저장됩니다. 컨테이너를 다시 만들면 등록한 `client_id`를 잊어버려 Connector가 끊어집니다.

영속 volume의 경로를 지정합니다.

```yaml
OAUTH_CLIENTS_PATH: /data/oauth_clients.json
```

## 실제로 연결하고 나서

MCP는 20개의 tool을 제공합니다.

- 파일 읽기, 일괄 읽기, 목록, 전문 검색, frontmatter 검색
- 쓰기, binary 쓰기, 부분 편집, 이어 쓰기, frontmatter 일괄 수정
- 이동, 삭제
- Canvas 읽기, node와 edge 조작
- Daily note 경로 조회, 읽기, 이어 쓰기
- Vault health check

처음 health analysis를 돌렸을 때 frontmatter가 없는 파일과 깨진 Wiki link가 수백 개 나왔습니다. 내용을 잃어버린 문제라기보다 표기 방식이 어긋난 경우가 많아서, 이런 정리는 자동화에 잘 맞았습니다.

## 남은 제약과 운영 시 주의사항

운영을 시작한 뒤에도 `obsidian-headless`가 오픈 베타라는 점은 그대로입니다. 첫 동기화가 끝나면 파일 수를 대조하고 스냅샷을 남깁니다. 같은 기기의 같은 경로에서 desktop Obsidian Sync와 headless Sync를 동시에 실행하지 않습니다.

MCP는 인터넷에 공개된 endpoint입니다. 추측하기 어려운 OAuth password를 사용하세요. Cloudflare Access를 앞에 두면 Connector의 OAuth handshake가 사람용 로그인 화면에서 멈추기 때문에 여기서는 사용하지 않습니다. 연결을 마친 뒤 필요하다면 WAF에서 국가나 IP를 제한할 수 있습니다.

n8n처럼 같은 NAS에서 실행되는 자동화는 Vault를 직접 mount할 수도 있습니다. 다만 충돌을 줄이려면 기계가 쓰는 영역을 `inbox/`처럼 분리하는 편이 좋습니다.
