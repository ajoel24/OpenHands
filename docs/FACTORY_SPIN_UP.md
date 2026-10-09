# Spinning up this factory fork

This repo is a factory fork of OpenHands: same Agent Canvas, plus a Telegram
bot integration, extra model providers (pi, OpenCode Zen, Meta Muse Spark),
and prebuilt images so you never compile anything locally.

Upstream's own [Quickstart](../README.md#quickstart) and
[SELF_HOSTING](SELF_HOSTING.md) guides apply as-is — except every image,
package, and URL they reference is upstream's. Below is the equivalent path
for *this* fork's code.

## What you get

- **Agent Canvas + agent server + automation** in one container, built from
  this repo's `main` on every push (`.github/workflows/docker.yml`).
- **Telegram bot**: drive agents from Telegram; per-chat conversations,
  selectable agent profiles, encrypted token storage.
- **Extra providers**: pi, OpenCode Zen gateway, Meta Muse Spark + the
  frontier models they serve.

## Prerequisites

- Docker Engine 24+ (or Podman — replace `docker compose` with
  `podman-compose` and drop the `:z` volume flags if SELinux is off) with
  the Compose plugin.
- A host `~/projects` directory (agent workspace) — created on first run
  if missing, but create it yourself to set permissions deliberately.
- One LLM provider key (Anthropic, OpenAI, OpenCode, …).
- Optional: a Telegram bot token from [@BotFather](https://t.me/BotFather).

## Run it (2 minutes)

```sh
git clone https://github.com/ajoel24/OpenHands.git && cd OpenHands
cp docker/.env.factory.sample docker/.env.factory
# Edit docker/.env.factory: set LOCAL_BACKEND_API_KEY (openssl rand -base64 32)
# and at least one provider key.
mkdir -p ~/projects
docker compose -f docker/docker-compose.factory.yml \
  --env-file docker/.env.factory up -d
```

Open http://localhost:8000, enter the backend key once, add any remaining
provider keys in Canvas → Settings → Secrets, and start a conversation.

## Telegram setup

1. In Telegram, message [@BotFather](https://t.me/BotFather): `/newbot`,
   follow the prompts, copy the token.
2. Open the **Telegram** app inside Canvas (sidebar), paste the token, Start.
   The token is encrypted into the server's SecretsStore — a container
   restart reuses it.
3. In your bot chat: `/new [profile]` starts a linked conversation;
   every message after that runs the agent. Conversations are fully visible
   in the Canvas UI.

Lock it down on any shared host: set `TELEGRAM_ALLOWED_USERNAMES` to your
handle(s). Unset means anyone who finds the bot can talk to your agent.

## Standalone agent server (optional)

The all-in-one container above already embeds an agent server — most users
stop there. If you want the server without the UI (headless Telegram bot,
or several sandboxes sharing one Canvas), enable the `server` profile:

```sh
docker compose -f docker/docker-compose.factory.yml --profile server \
  --env-file docker/.env.factory up -d
```

This starts `ghcr.io/ajoel24/openhands-agent-server:main` on `127.0.0.1:8001`
(published by the SDK fork's `factory-server-image.yml`). Set
`SESSION_API_KEY` and `OH_SECRET_KEY` in `docker/.env.factory` first.

## Updating

```sh
docker compose -f docker/docker-compose.factory.yml pull
docker compose -f docker/docker-compose.factory.yml \
  --env-file docker/.env.factory up -d
```

Data lives in `~/.openhands` and `~/projects` (bind mounts), so updates
never touch conversations, secrets, or settings.

## Developing (build locally instead of pulling)

You need both this repo and the
[software-agent-sdk fork](https://github.com/ajoel24/software-agent-sdk)
checked out:

```sh
# Agent server (Telegram integration lives here)
podman build -f openhands-agent-server/openhands/agent_server/docker/Dockerfile \
  --target source -t localhost/openhands_agent-server \
  --build-arg INSTALL_ACP_PROVIDERS=pi --build-arg INSTALL_CAPABILITIES= \
  /path/to/software-agent-sdk

# Canvas (embeds the server image above)
podman build -f docker/Dockerfile.local \
  --build-arg AGENT_SERVER_IMAGE=localhost/openhands_agent-server \
  --build-arg AGENT_SERVER_VERSION=1.53.0 --build-arg AUTOMATION_VERSION=1.19.0 .
```

Then point the compose file's `image:` at your local tags (or
`FACTORY_CANVAS_IMAGE=...`).

## How this differs from upstream, file by file

- `docker/Dockerfile.local` — same all-in-one image, but based on the
  factory agent-server build and with snapshot-free apt sources.
- `docker/docker-compose.factory.yml` + `docker/.env.factory.sample`
  (this kit) — no upstream equivalent; upstream documents `docker run`.
- `config/defaults.json` (`images.*`) — points at this fork's GHCR images.
- `src/constants/acp-providers.ts` — extra `pi` provider entry + secrets.
- Everything else behaves like upstream; their docs still apply.

## CI images

- Canvas: this repo's `docker.yml` → `ghcr.io/ajoel24/openhands-agent-canvas:main`
  (plus `sha-*` tags). Override with repo variables: `CANVAS_IMAGE`,
  `CANVAS_DOCKERFILE`, `CANVAS_SERVER_IMAGE`.
- Agent server: the SDK fork's `factory-server-image.yml` →
  `ghcr.io/ajoel24/openhands-agent-server:main` (plus `latest`, `sha-*`,
  `<version>-python` for the canvas base pin).
