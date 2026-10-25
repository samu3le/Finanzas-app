# Finanzas

Personal, offline-first finance tracker (web + installable PWA). COP/VES payments, USD reporting, shared-expense activities.

Architecture and decisions live in the project planning doc (`finanzas-app-plan.md`), not here.

## Setup

```bash
npm install
cp .env.example .env.local   # Supabase values, only needed once sync is wired
npm run dev
```

## Scripts

| Script | Purpose |
|---|---|
| `dev` | Vite dev server |
| `build` | Typecheck + production build (generates the service worker) |
| `preview` | Serve the production build; use it to test PWA install/offline |
| `typecheck` | `tsc -b` |
| `lint` | oxlint |
| `test` / `test:watch` | Vitest |

## Structure

```
src/
  routes/       TanStack Router file routes (routeTree.gen.ts is generated, committed)
  components/   Shared UI
  db/           Dexie schema and row types (local source of truth)
  domain/       Pure business logic (money/rates; balances next)
  lib/          External clients (Supabase, lazy)
public/         PWA icons generated from logo.svg via @vite-pwa/assets-generator
```

## Notes

- Money is stored in integer minor units; rates are decimal strings handled with `big.js`.
- `react-hook-form` + `@hookform/resolvers` are deferred: resolvers 5.x/6.x currently fail `npm install` on a broken optional peer chain (`@typeschema/*`). Add them when building forms.
