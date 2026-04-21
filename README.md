# Simple Battle Royale

Mobile-first cyberpunk mini battle royale on **Base**, with swipe controls, shrinking safe zone, daily **check-in** contract, and **Builder Code** (ERC-8021) attribution on transactions.

## Production

- **URL:** https://simple-battle-royale.vercel.app  
- Set the same URL in Vercel env as `NEXT_PUBLIC_SITE_URL` and register it on [Base dashboard](https://dashboard.base.org) for domain verification (`base:app_id` meta matches `NEXT_PUBLIC_BASE_APP_ID`).

## Repo layout

- **`web/`** — Next.js App Router (deploy with **Vercel Root Directory = `web`**).
- **`contracts/`** — Foundry `CheckIn` contract (`forge test`, see `contracts/DEPLOY.md`).

## Web setup

```bash
cd web
cp .env.example .env.local
# Fill NEXT_PUBLIC_* (see PROMPT.md / Base.dev)
npm install
npm run dev
```

Required env (see `.env.example`): `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS`, `NEXT_PUBLIC_BASE_APP_ID`, `NEXT_PUBLIC_BUILDER_CODE`, `NEXT_PUBLIC_SITE_URL`, etc.

## Contract

```bash
cd contracts
forge test
```

## Assets

- `web/public/app-icon.jpg` — 1024×1024, under 1MB.
- `web/public/thumbnail.jpg` — ~1.91∶1, under 1MB.
