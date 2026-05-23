# Collab Editor

Real-time collaborative text editor — TypeScript monorepo with Fastify + WebSockets + Yjs, and a React (Vite) frontend.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+

## Setup

Install dependencies first (required before `build`):

```bash
pnpm install
pnpm run build
```

If you see `'tsc' is not recognized` or `node_modules missing`, run `pnpm install` again from the project root.

## Development

```bash
pnpm dev
```

- Web UI: http://localhost:5173
- API / WS: http://localhost:3001 (proxied through Vite)

## Project layout

- `apps/server` — Fastify HTTP API + Yjs sync over WebSocket
- `apps/web` — React client
- `packages/shared` — shared types (`RoomId`, etc.)

## Try it

1. Open http://localhost:5173 and click **Create room** (or **Open demo room**).
2. Copy the join link and open it in a second browser tab.
3. Type in either tab — changes appear in both.
