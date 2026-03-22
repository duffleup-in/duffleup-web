# duffleup-web

Next.js 14 marketing website for duffleup.in.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Runs on http://localhost:3000

## Pages

- `/` — Homepage
- `/explore` — Property search & listings
- `/property/[slug]` — Individual property page
- `/list-property` — Owner sign-up landing page
- `/how-it-works` — Trust & verification explained
- `/about` — Company story
- `/blog` — SEO content hub
- `/contact` — Contact form

## Deployment

Connected to Vercel. Every push to `main` auto-deploys to duffleup.in.
