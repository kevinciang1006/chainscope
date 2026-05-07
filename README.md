# ChainScope

Supply Chain ESG Intelligence — a portfolio demo built to mirror the data-density and UX challenges of a real B2B sustainability platform.

**Live:** https://chainscope-six.vercel.app
**Repo:** https://github.com/kevinciang1006/chainscope

## What this is

A focused, single-domain frontend demo: 80 fictional suppliers, ESG ratings, risk classifications, audit history. Three primary surfaces — portfolio dashboard, suppliers list, supplier detail — plus a design system reference.

## What I was practicing

- UX on data-heavy B2B screens: filters that feel instant, tables that read at a glance, detail pages that tell a story
- Design system rigor: tokenized colors, type, spacing — no shadcn defaults shipped raw
- Real loading and empty states (mock API uses async + latency, so TanStack Query loading flows are exercised)
- URL-synced filters — every filtered view is shareable
- Accessibility: keyboard nav, focus rings, sort announcements, color-paired-with-text on every status

## Stack

React 19 · Vite · TypeScript (strict) · Tailwind CSS v4 · TanStack Query · TanStack Table · Recharts · Radix UI · React Router 7

## Design notes

- Color palette: warm off-white base, single restrained emerald accent, muted risk semantics (sage/amber/terracotta/rust). Avoids both generic shadcn slate and ESG-cliché brand greens.
- Typography: Inter for UI, JetBrains Mono for tabular numbers.
- All numbers in tables and KPIs use `tabular-nums` so columns align by digit.
- Risk indicators are always paired with text or icon — never color-alone.

## Trade-offs (deliberate)

- No backend. Mock data is in `src/data/fixtures/` with a seeded PRNG so output is reproducible.
- No auth, no CRUD forms. Action buttons trigger toasts. The pitch was UX quality on data screens, not feature breadth.
- No tests shipped. Vitest scaffolded; given a 2-day budget I prioritized polish and accessibility.
- Light mode only.

## Run locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  app/           # router + providers
  pages/         # one folder per route
  components/
    ui/          # hand-written shadcn-style primitives (button, card, ...)
    common/      # domain-aware (RatingBadge, RiskPill, ...)
    layout/      # AppShell, Sidebar, Topbar
  data/
    fixtures/    # 80 suppliers, 30 activity events, seeded PRNG
    api/         # async functions wrapping fixtures with latency
  hooks/         # useFilters (URL-synced), useDebounce, useToast, TanStack Query wrappers
  lib/           # formatters, risk helpers, constants, cn util
  styles/        # Tailwind v4 @theme tokens
  types.ts       # all domain types
```

## Deploying

1. Push to GitHub: `github.com/kevinciang1006/chainscope`
2. Import the repo in Vercel — auto-detects Vite
3. Build command: `npm run build`. Output: `dist`
4. No env vars needed
5. Add a custom domain or use the default `*.vercel.app` URL

— Built by Kevin Ciang. Two days, one focus: how data-heavy B2B should feel.
