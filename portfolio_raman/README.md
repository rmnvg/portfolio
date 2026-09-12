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

**Important:** set your real domain once deployed — either add a `NEXT_PUBLIC_SITE_URL`
environment variable in Vercel, or edit the fallback in [`src/lib/site.ts`](src/lib/site.ts).
It drives canonical URLs, the sitemap, `robots.txt`, JSON-LD, and the absolute
Open Graph image URL that LinkedIn/X/Slack fetch when the link is shared.

## Updating content

- **Personal info, experience, projects, skills, achievements**: [`src/lib/data.ts`](src/lib/data.ts)
- **Site URL**: [`src/lib/site.ts`](src/lib/site.ts) (or `NEXT_PUBLIC_SITE_URL`)
- **Resume PDF**: replace `public/Ramanjotsingh_resume.pdf`
- **Profile photo**: replace `public/raman.jpg`

## Generated assets

These are produced at build time from code — there are no image files to maintain.

| Route | Source | Purpose |
| --- | --- | --- |
| `/opengraph-image`, `/twitter-image` | [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx) | 1200×630 social share card, built from `data.ts` |
| `/icon`, `/apple-icon` | [`src/app/icon.tsx`](src/app/icon.tsx) | Monogram favicon and touch icon |
| `/sitemap.xml`, `/robots.txt` | [`src/app/sitemap.ts`](src/app/sitemap.ts) | Search engine discovery |
| `/manifest.webmanifest` | [`src/app/manifest.ts`](src/app/manifest.ts) | PWA/install metadata |

The share card pulls Instrument Serif from Google Fonts at build time and falls
back to the bundled Geist if the network is unavailable, so builds never fail on it.

`schema.org` Person/WebSite/ProfilePage data is emitted by
[`src/components/StructuredData.tsx`](src/components/StructuredData.tsx).

## Responsive behaviour

Verified with no horizontal overflow at 320 / 390 / 430 / 768 / 1440px.

- The hero uses `min-h-svh`, not `min-h-screen` — `100vh` on iOS Safari includes
  the area behind the browser chrome, which pushes hero content below the fold.
- Interactive controls are at least 44×44px on touch and may shrink from `sm`/`md`
  up (hamburger, theme toggle, suggestion chips, repo links, contact pills).
- `body` uses `overflow-x: clip` — the hero glow and marquee track are
  deliberately wider than the viewport, and `clip` contains them without
  breaking `position: sticky`/`fixed` the way `hidden` would.
- Expensive visuals are dropped on small screens: the 3D orb is `lg:` only and
  the pipeline canvas is `md:` only, so phones render the stacked cards instead.
- The custom cursor only activates for fine pointers, so touch devices keep
  native behaviour.

## Accessibility notes

- A skip link precedes the canvas backgrounds and jumps to `#main-content`.
- The custom cursor hides the native pointer, so `:focus-visible` gets a loud
  accent outline and the system cursor is restored while tabbing.
- `prefers-reduced-motion` disables the marquee, scroll reveals, count-ups and
  the cursor. Scroll-revealed content starts at `opacity: 0`, so `globals.css`
  force-reveals every `[data-reveal]` element under that media query — the page
  is never left blank if the animation hook lags the media query.
