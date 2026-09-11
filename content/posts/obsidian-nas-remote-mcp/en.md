---
title: Self-hosting Obsidian on a NAS and exposing it as a Remote MCP
date: '2026-08-25'
summary: Notes from putting headless Obsidian Sync and an OAuth-enabled Remote MCP on a UGREEN NAS so the vault remains available when my Macs are off.
lang: en
tags:
  - obsidian
  - mcp
  - self-hosting
  - nas
draft: false
---

For a long time, my Obsidian vault lived on two MacBooks and nowhere else. I have now made a UGREEN NAS another always-on Sync peer and put an independent MCP server beside it for remote reads and writes. The finished setup is three containers behind one Cloudflare Tunnel.

The deployment order turned out to be the easy part. Portainer's limitations, a misleading CLI option, and an MCP SDK version change took longer to untangle. I am writing down both the working setup and the five failures I would want to remember if I built it again.

## Why self-host it

Obsidian Sync works well for keeping my MacBooks and iPhone in sync. The problem is that the vault still exists only on those devices.

- I cannot reach it when the Macs are off.
- Asking an LLM to search my notes requires copying and pasting content.
- Automations such as n8n need an always-on target.

That gap is what the NAS, as a fourth Sync peer, is meant to fill.

The sync layer uses the official `obsidian-headless` client, which expands a synced vault into ordinary Markdown files without a GUI. I considered Syncthing, Git, and Self-hosted LiveSync, but I already pay for Obsidian Sync and had no reason to introduce another sync mechanism.

`obsidian-headless` is still an open beta, so I do not treat it like a settled release. I took a vault snapshot before starting, and recommend doing the same.

The access layer is an independent MCP server that reads the filesystem directly. The Local REST API community plugin requires the Obsidian app to be running, so it is not a good fit for an always-on NAS.

I ruled out any MCP server that did not meet these two conditions:

- It must support Streamable HTTP and OAuth 2.0 so Claude can use it as a custom connector. An stdio-only MCP cannot be used as a remote connector.
- It must replace files atomically so Obsidian Sync never observes a partially written file.

A Cloudflare Tunnel then connects those two layers to the outside world.

## Prerequisites

- A UGREEN NAS running UGOS Pro and Portainer
- A domain managed by Cloudflare
- An Obsidian Sync subscription

I installed Portainer by following Marius Hosting's [no-SSH guide for UGREEN NAS](https://mariushosting.com/ugreen-nas-how-to-install-portainer-without-ssh/).

The examples below use `vault.example.com` as the hostname and `<NAS_IP>` as the NAS address.

## 0. Create the shared network

In Portainer, open **Networks → Add network** and create a bridge network named `edge`. The defaults are fine. Create it before deploying the stacks.

The tunnel runs in a separate stack and shares this `edge` network with the MCP server. The MCP server does not need to publish a LAN port.

## 1. Create the vault directory and secrets

Create an empty `docker/obsidian-remote/vault` directory on the NAS and copy its verified absolute path. It is often `/volume1/docker/obsidian-remote/vault`, but do not guess—confirm the actual path on your NAS.

I generated the required secrets together at this point:

```bash
openssl rand -hex 32   # MCP bearer token
openssl rand -hex 32   # OAuth client secret
openssl rand -hex 24   # OAuth login password
```

## 2. Deploy the `obsidian-remote` stack

Create a Portainer stack named `obsidian-remote` and paste the [complete Compose file](https://gist.github.com/JeongJaeSoon/c7ba9387778a21116408830a655bc65b) into the Web editor.

The Compose file runs two services:

- `obsidian-sync` installs `obsidian-headless` on `node:22-bookworm-slim` and runs `ob sync --continuous`. It deliberately waits for `/root/.ob-ready` until initial setup is complete.
- `obsidian-mcp` runs from `python:3.12-slim` with uv and the vault-mcp source. It mounts the same host path as the sync service and joins both the default and `edge` networks.

Named volumes preserve the installed artifacts. No ports are published to the host.

Set these Portainer environment variables:

```text
VAULT_HOST_PATH=/the/verified/absolute/vault/path
VAULT_MCP_HOSTNAME=vault.example.com
VAULT_MCP_TOKEN=the generated bearer token
VAULT_OAUTH_CLIENT_ID=vault-mcp-client
VAULT_OAUTH_CLIENT_SECRET=the generated client secret
VAULT_OAUTH_USERNAME=your login name
VAULT_OAUTH_PASSWORD=the generated login password
```

An empty `VAULT_OAUTH_PASSWORD` denies every login attempt.

The deployment creates two containers. `obsidian-sync` is supposed to be waiting at this point because its initial setup has not happened yet.

## 3. Initialize headless Sync

Open the `obsidian-sync` console in Portainer and run:

```bash
ob login
ob sync-list-remote
ob sync-setup --vault "<Vault name>"
ob sync
ob sync-status
ls /vault | head
touch /root/.ob-ready
```

After creating the ready file, restart the container. This is the log I saw once Sync connected successfully:

```text
Starting sync:
  Vault: <Vault name>
  Location: /vault
  Sync mode: bidirectional
  Conflict strategy: merge
Connecting...
Connection successful. Detecting changes...
Fully synced
```

## 4. Test the MCP server on the LAN

On its first run, the MCP server spent one or two minutes preparing dependencies. I used these four log lines as the sign that it was ready:

```text
INFO  Starting vault MCP server. Vault: /vault
INFO  Frontmatter index built: N files
INFO  Starting server on 0.0.0.0:8420 with bearer auth + OAuth
INFO  Uvicorn running on http://0.0.0.0:8420
```

DNS rebinding protection rejects requests whose Host is a raw LAN address. Test with an explicit `Host` header:

```bash
curl -s -D - -o /dev/null -H "Host: vault.example.com" \
  http://<NAS_IP>:8420/mcp
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: vault.example.com" \
  -H "Authorization: Bearer $VAULT_MCP_TOKEN" http://<NAS_IP>:8420/mcp
```

The first request should return `401`; a `404` means the path is wrong. The second should return `406`, because a plain GET is not a valid MCP request.

Also check that the `resource_metadata` value in `www-authenticate` points to `https://vault.example.com/...`, rather than the LAN IP.

## 5. Add the Cloudflare Tunnel

In Cloudflare Zero Trust, open **Networks → Tunnels** and create a tunnel. Copy the complete Docker command and extract the actual token after `--token`. The shortened `eyJ...` shown in the interface is not the complete token.

Deploy `cloudflared` as a separate stack:

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

Set `CF_TUNNEL_TOKEN` in the stack's environment variables.

Configure the Public Hostname as follows:

- Subdomain: `vault`
- Domain: `example.com`
- Path: leave blank
- Service: HTTP → `obsidian-mcp:8420`

The Path must remain blank. OAuth discovery at `/.well-known/...` and the `/oauth/...` routes also need to pass through the tunnel.

I checked the public side by querying the OAuth metadata directly:

```bash
curl -s https://vault.example.com/.well-known/oauth-authorization-server | jq
```

The `issuer`, `authorization_endpoint`, `token_endpoint`, and `registration_endpoint` should all point to `vault.example.com`. The presence of a `registration_endpoint` means Dynamic Client Registration is available.

## 6. Connect Claude

In Claude on the web, open **Settings → Connectors** and add a custom connector.

- Name: anything you prefer
- URL: `https://vault.example.com/mcp`
- Client ID / Client Secret under Advanced: leave both blank

Dynamic Client Registration lets Claude register its own redirect URI. Entering fixed credentials switches to a different flow and requires you to preregister Claude's redirect URI.

Click Connect and sign in with `VAULT_OAUTH_USERNAME` and `VAULT_OAUTH_PASSWORD`. Once registered, the connector is also available in Claude on mobile.

## Five things that went wrong

### 1. Portainer remote deployment does not support `build:`

Using `build:` in the Compose file produced this error:

```text
Unable to upgrade to tcp, received 200
```

You can prebuild and tag the image over SSH, or bootstrap on top of official images and cache the artifacts in named volumes. I chose the second option. The bootstrap process must skip work when its output already exists so it does not rebuild on every restart.

### 2. `ob sync` does not accept a conflict strategy

Running `ob sync --conflict-strategy merge` fails with:

```text
error: unknown option '--conflict-strategy'
```

`ob sync` only accepts `--path` and `--continuous`. The direction, conflict strategy, exclusions, file types, and related settings belong to `ob sync-config` and are stored as vault settings. The defaults are already bidirectional with merge conflict handling, so I did not need to change them.

Also, Portainer may let you open a console while the container's main process is dead. Use the container Status and Logs—not console access—to determine whether it is running.

### 3. MCP SDK 2.0 removed `mcp.server.fastmcp`

The upstream dependency was `mcp[cli]>=1.9.0` with no upper bound. uv therefore installed 2.0.0, breaking the import written for 1.x. Pin it below 2 to stay on the 1.29 series:

```bash
grep -q 'mcp\[cli\]>=1.9.0,<2' pyproject.toml \
  || sed -i 's/"mcp\[cli\]>=1.9.0"/"mcp[cli]>=1.9.0,<2"/' pyproject.toml
```

The repository's `.python-version` was 3.14 while the container image used 3.12, so I also had to align the Python version constraints.

### 4. Binding to `127.0.0.1` makes the server unreachable from Docker networking

With the default bind address of `127.0.0.1`, the Cloudflare Tunnel in another container cannot reach the server. Set `VAULT_MCP_HOST=0.0.0.0`.

Binding to `0.0.0.0` inside a container is separate from exposing a port on the host. With no published ports and connectivity only through the `edge` network, the service remains closed to the LAN.

### 5. Persist the OAuth client registry

By default, the OAuth client registry lives under the container's HOME. Recreating the container makes it forget registered `client_id` values and breaks the connector.

Point it at a persistent volume:

```yaml
OAUTH_CLIENTS_PATH: /data/oauth_clients.json
```

## What the connection made possible

The MCP server exposes 20 tools:

- Read, batch read, list, full-text search, and frontmatter search
- Write, binary write, partial edit, append, and bulk frontmatter updates
- Move and delete
- Canvas reads plus node and edge operations
- Daily note path lookup, read, and append
- Vault health checks

My first health analysis turned up hundreds of files with missing frontmatter or broken wiki links. Many were representation mismatches rather than lost content, exactly the kind of cleanup that lends itself to automation.

## Remaining limitations and operational notes

Even after the setup is running, `obsidian-headless` remains an open beta. I compare file counts after the first sync and keep a snapshot. Desktop Obsidian Sync and headless Sync should never run simultaneously against the same path on the same device.

The MCP server is a public internet endpoint. Use an unguessable OAuth password. Putting Cloudflare Access in front of it stops the connector's OAuth handshake at a human login page, so I do not use Access here. After the connector is established, you can narrow access by country or IP with WAF rules if needed.

An automation service such as n8n running on the same NAS can mount the vault directly. To reduce conflicts, keep machine-written content in a separate area such as `inbox/`.
