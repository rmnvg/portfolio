# Ramanjot Singh — Portfolio

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for scroll/entry animations
- **lucide-react** for icons

All content (experience, projects, skills, links) lives in [`src/lib/data.ts`](src/lib/data.ts) — edit that file to update the site.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset is auto-detected as Next.js — no config needed.
4. Deploy.

Optional: update `siteUrl` in [`src/app/layout.tsx`](src/app/layout.tsx) to your real domain once deployed (used for SEO metadata).

## Updating content

- **Personal info, experience, projects, skills, achievements**: [`src/lib/data.ts`](src/lib/data.ts)
- **Resume PDF**: replace `public/Ramanjotsingh_resume.pdf`
- **Profile photo**: replace `public/raman.png`
