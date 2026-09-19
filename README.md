# Personal site

A single-page, frontend-only site built with Vite, TypeScript, and Anime.js.
Currently framed as a resume/application piece: Hero → About → Experience →
Skills → Contact, presented as a vertical "carousel" — one scroll, swipe, or
key press advances exactly one page.

## Getting started

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build, output in dist/
npm run preview   # preview the production build locally
```

`npm run build` produces a fully static `dist/` folder — deploy it anywhere
that serves static files (GitHub Pages, Netlify, Vercel, S3, etc.). There is
no backend.

## Editing content

Everything you'd want to change for a first pass lives in two files:

- **`src/content.ts`** — every piece of copy on the site (name, tagline,
  about text, experience entries, skills, contact links). Replace the
  `[bracketed placeholders]` with your real information. Nothing else in the
  codebase needs to change.
- **`src/styles/tokens.css`** — every color, font, spacing, and motion
  value, defined once as CSS custom properties. Change the look of the whole
  site by editing this file only.

Fonts are currently **Bricolage Grotesque** (display/headings) and
**IBM Plex Sans** (body), loaded from Google Fonts in `index.html`. To swap
them, change the `<link>` in `index.html` and the `--font-display` /
`--font-body` values in `tokens.css`.

## Project structure

```
index.html            Loader markup + empty app shell
src/
  main.ts             Wires everything together at startup
  content.ts           <- all copy
  sections.ts          Builds the DOM for every page from content.ts
  loader.ts            Loading sequence: dots -> drop -> smiley -> CRT blip-out
  hero.ts              Drawn-in intro, 3-block wipe, shrink-to-panel effect
  paging.ts            Vertical-carousel scroll/swipe/keyboard controller
  styles/
    tokens.css          <- all design tokens (colors, type, spacing, motion)
    style.css           Layout and component styles, built on the tokens
```

## Notes on behavior

- **Paging**: one wheel gesture, swipe, or arrow/space key press advances
  one page. A cooldown (~1s) after each transition prevents rapid input
  from skipping pages.
- **Reduced motion**: if the OS-level "reduce motion" preference is on, the
  loader and hero drawn-in animation are skipped, and page transitions jump
  instantly instead of animating.
- **The hero "shrink" effect** (full-bleed panel becoming a contained,
  inset panel with rounded corners as you scroll to About) only triggers on
  the hero ↔ About boundary, per the brief.

## Known limitations / good next steps

- The "drawn" text reveal uses a left-to-right clip-path wipe per word
  rather than true SVG pen-stroke animation. It reads as intentional and
  restrained, but if you want a literal hand-drawn stroke effect later,
  that would mean converting the headline to SVG text-outlines — a
  reasonable v2 upgrade.
- Mobile viewport height (`100vh`) can jump slightly when a mobile
  browser's address bar shows/hides mid-scroll. Common issue with
  full-viewport paged layouts; a `visualViewport`-based fix can be added if
  it's noticeable enough on your target devices.
- I have not been able to visually verify the animations in a live browser
  from this environment — it type-checks and builds cleanly, but give it a
  run with `npm run dev` and let me know if anything needs tuning (timing,
  easing, the wipe transition, etc.).
