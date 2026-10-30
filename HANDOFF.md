# Handoff — tvinhthanh-portfolio

Paste the block below into Claude Code on the new machine, in the folder where
you want the project to live.

---

## Prompt

```
Resume work on my personal portfolio site.

SETUP
Clone and run it first, then wait for me before changing anything:

  git clone https://github.com/tvinhthanh/tvinhthanh-portfolio.git
  cd tvinhthanh-portfolio
  git switch feat/pavilion   # until it is merged into main
  npm install
  npm run dev          # serves on http://localhost:9105

Node 22+. If npm install warns about peer deps for three.js, ignore it — the
versions in package-lock.json are the ones that work.

WHAT IT IS
A bilingual (EN/VI) personal portfolio for Trương Vĩnh Thành, full-stack
developer in Ho Chi Minh City. Next.js 16 App Router, React 19, TypeScript,
Tailwind v4 (CSS-first @theme), three.js 0.185 + React Three Fiber 9 + drei 10,
GSAP. No component library — everything is hand-built on a token system.

It is laid out as a pavilion you walk through, not a scrolling document:
  /                 Lobby — name and statement, a 3D robot docent, a directory
                    of the rooms, the about note, and the contact desk
  /projects         Room I · The collection — featured projects hung as
                    exhibits, plus the archive
  /projects/[id]    one page per featured project (statically generated)
  /experience       Room II · The path — roles, timeline, education
  /principles       Room III · The reading room
  /stack            Room IV · The workshop — tools and the 3D lab
A floor-plan dock fixed to the foot of the screen is the only navigation.
Room order, numerals and wall texts live in src/content/rooms.ts. Links from
the old one-page site (/#projects, /#lab …) forward to their rooms.

Copy lives in src/content/ (profile.ts, projects.ts, rooms.ts) as bilingual
t("en", "vi") pairs rendered through <T v={...} /> from src/lib/i18n. Short UI
labels sit next to their component, still as t() pairs. Never hardcode
user-facing strings in components.

DESIGN SYSTEM — read src/app/globals.css first
The palette is deliberate, not decorative. The owner's birth element is
Bạch Lạp Kim (metal), so:
  - obsidian ground + pearl/silver body + ONE warm gold accent
  - NO green (metal cuts wood) and NO red/orange (fire melts metal)
  - --status-live is the single exception: a green status LED, fixed per theme,
    semantic rather than brand. Do not swap it to the accent colour.
Light and dark palettes are hand-tuned separately, not mechanically inverted.
Body text runs ~15:1 on paper and ~14:1 on obsidian; keep every change at
WCAG AA or better.

Fonts: Cormorant Garamond (display), Be Vietnam Pro (body, real Vietnamese
cut), JetBrains Mono (metadata). Type scale is --step--2 through --step-hero.
Never introduce a font size outside that scale.

Signature element: a single fixed WebGL canvas behind every room — a silver
mountain range with a gold "qi river" flowing across it. It must stay visible
from the first screen to the last. Each room moves the camera to its own
station along the valley (src/components/world/stations.ts); the river slows
in Room III.

Text over the river sits on .placard and .text-shield plates at 94% paper.
That is the lowest density at which --ink-faint still passes AA with the
brightest stretch of river behind it. Don't thin them.

TRAPS THAT COST ME HOURS — do not rediscover these
1. THREE.Points with shader-computed positions: the position attribute is all
   zeros, so three.js derives a radius-0 bounding sphere at the origin and
   frustum-culls the entire object once the camera moves past that point. Both
   point clouds set `frustumCulled = false`. Leave it that way.
2. The river is a current flowing ACROSS the frame (t drives x, depth only
   meanders). An earlier version ran it into depth; perspective collapsed it
   into a clump near the camera that slid out of frame on scroll.
3. If the project path contains a space, Turbopack's file watching silently
   stops working: the dev server serves a stale in-memory bundle and your edits
   appear to do nothing. Restart the dev server after every edit, or clone to a
   path with no spaces (recommended).
4. Never run `npm run build` while `npm run dev` is running — they fight over
   .next and break HMR.
5. The WebGL canvas is mounted once, in the root layout (src/app/layout.tsx).
   Never move it into a page: a page-level canvas is torn down and rebuilt on
   every room change. Room changes run through React's <ViewTransition>, and
   globals.css hides the root's old snapshot so the live canvas shows through
   the transition. If the river freezes or doubles during a room change, look
   there first.
6. On a fresh clone, `npx tsc --noEmit` fails on PageProps/LayoutProps until
   Next has generated the route types. Run `npx next typegen` (or start
   `npm run dev` once) first.

The repo has an AGENTS.md (included from CLAUDE.md) saying this Next.js
version differs from your training data and to read node_modules/next/dist/docs/
before writing code. Follow it — Next 16 App Router has real breaking changes.

VERIFY BEFORE CLAIMING ANYTHING WORKS
  npx tsc --noEmit && npm run lint
and look at the page in a browser. Do not trust a screenshot taken right after
an edit without restarting the dev server (see trap 3).

WHAT I WANT NEXT
<write the next task here>
```

---

## Current state at handoff

- Remote: `https://github.com/tvinhthanh/tvinhthanh-portfolio.git`
- The work is on branch `feat/pavilion`, which is `main` plus two commits and
  **is not pushed yet**. Push it before you clone elsewhere, or the new machine
  will be missing it: `git push -u origin feat/pavilion`
  - `b20810b` feat(lab): replace the motorsport lab controls with plain sliders
  - `d954c29` feat(layout): rebuild the site as a pavilion of rooms
- `main` is unchanged and in sync with `origin/main`.
- A second copy at `C:\source\tvinhthanh-portfolio` (no space in the path, see
  trap 3) is on the same commit.
- `node_modules/` and `.next/` are gitignored and rebuilt by `npm install`.
- The two CV PDFs in `public/cv/` are committed and are the current versions.
