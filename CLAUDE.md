# UK Heat Pump Directory — CLAUDE.md

## Project Overview
UK Heat Pump Installer Lead Generation Directory. Connects homeowners with MCS-certified heat pump installers. Built with Next.js 14 (App Router), Supabase, Stripe, Tailwind CSS, deployed on Vercel.

## Owner
Thiago — solo founder, British citizen based in Netherlands. Comfortable with code. Uses Claude Code in VS Code.

## Methodology
STRUCTURE → IDEATE → PLAN → BUILD → TEST → DEPLOY. Always follow this flow before writing code unless explicitly told to skip.

## 3-Layer Architecture
- **Directives** (`directives/`): SOPs in Markdown — what to do
- **Orchestration** (you): Read directives, call tools, handle errors
- **Execution** (`scripts/`): Deterministic Python scripts for data processing

## Tech Stack
- Next.js 14 (App Router) — TypeScript only
- Supabase (database + auth + RLS)
- Stripe (subscription billing — Milestone C)
- Tailwind CSS (all styling — no CSS modules, no inline styles)
- Vercel (hosting)

## Key Files
- `supabase/schema.sql` — Full database schema (run in Supabase SQL Editor)
- `scripts/import_installers.py` — Import 2,244 MCS installers into Supabase
- `src/lib/supabase/server.ts` — Server-side Supabase client
- `src/lib/supabase/client.ts` — Browser-side Supabase client
- `src/lib/types/database.ts` — TypeScript types matching Supabase schema

## Database Tables
- `verticals` — Multi-directory support (heat-pump, solar, ev)
- `installers` — 2,244 MCS-certified businesses, seeded from scraped data
- `leads` — Homeowner enquiries
- `cities` — 50 UK cities for SEO pages
- `content_pages` — CMS-lite for guides and FAQs

## Current Status: Milestone A (Public Site)
Building the public-facing site. No auth, no dashboard yet.

### Done:
- [x] Database schema
- [x] Data import script (2,244 installers)
- [x] Root layout with Header + Footer
- [x] Homepage with postcode search hero
- [x] Installer search results page
- [x] Individual installer profile pages
- [x] City pages (50 cities, SSG)
- [x] BUS grant eligibility checker
- [x] Lead submission API route

### Still needed for Milestone A:
- [ ] Content/guide pages (what is a heat pump, costs guide, FAQs)
- [ ] sitemap.xml and robots.txt
- [ ] SEO meta tags audit
- [ ] "For Installers" landing page
- [ ] Mobile menu (hamburger nav)
- [ ] Loading states / error boundaries
- [ ] Vercel deployment + env vars

## Build Milestones
- **A** (Weeks 1–2): Public site, SEO pages, installer profiles — CURRENT
- **B** (Weeks 3–4): Installer auth, profile claiming, lead capture, email notifications
- **C** (Weeks 5–6): Stripe subscriptions, tier gating, admin tools

## Code Rules
- TypeScript always — no `any` types
- Functional components only
- Server components by default, `'use client'` only when needed
- async/await over .then() chains
- Tailwind for all styling
- All env vars in `.env.local`, prefixed with `NEXT_PUBLIC_` only when client-side
- Never hardcode secrets
- Small, single-purpose components
- Error handling in all API routes and Supabase calls

## Domain Knowledge
- MCS = Microgeneration Certification Scheme (UK quality mark)
- BUS = Boiler Upgrade Scheme (£7,500 grant for England & Wales)
- ASHP = Air Source Heat Pump (most common)
- GSHP = Ground Source Heat Pump (less common, more expensive)
- Average installation cost: ~£13,200 before grant
- ~1,935 MCS-certified heat pump businesses (we scraped 2,244)

## Future Verticals
This codebase will be reused for Solar Panel, EV Charger, and SEND directories. Keep business logic modular and category-agnostic where possible. The `verticals` table enables this.

## Key URLs
- MCS installer data: https://mcscertified.com/find-an-installer/
- BUS grant info: https://www.gov.uk/apply-boiler-upgrade-scheme
