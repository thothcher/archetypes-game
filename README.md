# VAS · The Hermetic Vessel

**Play it:** https://thothcher.github.io/archetypes-game/ · **ქართულად:** https://thothcher.github.io/archetypes-game/ka/

A gamified lesson on C. G. Jung's analytical psychology. A glass human body holds four liquids (**Persona, Shadow, Anima/Animus, Self**), and each choice the player makes changes how much of each one fills the body. Available in **English** and **Georgian (ქართული)**.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm start          # serve out/ locally
npm run deploy     # publish to GitHub Pages
```

## Deploy

```bash
npm run deploy
```

This builds the static site with the base path `/<repo name>` and force-pushes `out/` to the `gh-pages` branch, which GitHub Pages serves (Settings → Pages → Deploy from a branch → `gh-pages` / root). No GitHub Actions minutes needed. The workflow in `.github/workflows/deploy.yml` is an alternative for when Actions is available; it is manual-only for now. Locally the base path is empty, so the dev server stays at `/`.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript**, static export | Fast first load, hosts anywhere, including GitHub Pages |
| 3D | **Plain WebGL + a custom GLSL raymarching shader** (no 3D library) | The body is a signed-distance field, so the liquid is a true volume with waves, slosh, refraction and glass reflections in one full-screen pass. A ~200-line renderer replaces Three.js: it compiles in the background, starts only near the viewport, pauses off-screen and lowers its resolution on slow devices |
| Motion | **Framer Motion** via `LazyMotion` (features load after first paint) + CSS transitions | Card transitions; meters and ring animate on the compositor |
| Sound | **WebAudio (synthesised)** | Ambient drone plus chimes, no audio files |
| Type | Instrument Serif, Inter Tight, JetBrains Mono + **Noto Serif/Sans Georgian** | The Latin fonts have no Georgian glyphs, so the Georgian fonts take over per character |

## Structure

```
app/
  page.tsx            hero → 01 The Waters → 02 The Experience (game)
  practices/page.tsx  03 Practices of balance
app/(en)/, app/ka/   the same pages in English (/) and Georgian (/ka/), prerendered
app/sitemap.ts, manifest.ts, not-found.tsx, icon.svg, apple-icon.png
components/
  FluidAvatar.tsx     vessel canvas, drag-to-spin, layer labels, no-WebGL fallback
  Intro.tsx           hero and the four archetype cards
  Game.tsx            choose vessel → choose → predict → reveal → ending (a random day each time)
  Faq.tsx             common questions (also FAQPage structured data)
  Practices.tsx       tick practices, watch the vessel rebalance
lib/
  fluidShader.ts      the vessel: SDF body + volumetric layered liquid
  vesselRenderer.ts   tiny WebGL renderer for that shader
  gameStore.ts        game progress (survives switching language mid-game)
  seo.ts              titles, descriptions, canonical/hreflang, Open Graph, JSON-LD
  archetypes.ts       colours, descriptions, percentage model, individuation index
  scenarios.ts        the pool of situations and riddles, with deltas, and the random day draw
  practices.ts        balancing practices with their effects
  i18n.tsx, locale.ts language context and URL helpers
  ui.tsx              interface strings in both languages
  ka.ts               Georgian text for archetypes, scenarios and practices
```

## Languages

Each language has its own prerendered URLs (`/` and `/ka/`, `/practices/` and `/ka/practices/`), so search engines index both. The switch in the nav links between them, remembers the choice, and old `?lang=ka` links redirect to `/ka/`. English text and all game logic (ids, deltas) live in `archetypes.ts`, `scenarios.ts` and `practices.ts`. The Georgian files only carry text, keyed by the same ids, so scoring can never drift between languages.

## SEO

- Separate, prerendered URLs per language with `<link rel="alternate" hreflang>` (en, ka, x-default) and canonical URLs
- Localized titles and descriptions, Open Graph and Twitter cards with share images (`public/og-en.png`, `og-ka.png`)
- JSON-LD: `WebSite`, `LearningResource` and `FAQPage` (the FAQ section is real page content)
- `sitemap.xml` with language alternates, web manifest, theme colour, app icons
- GitHub project pages can't serve a root `robots.txt`, so submit the sitemap in Google Search Console instead: https://thothcher.github.io/archetypes-game/sitemap.xml

## Adding a scenario

Each playthrough draws a fresh day from the pool: 10 random situations and 2 of the 4 riddles (one per archetype), with the riddles spread out and never first. The sizes are `SITUATIONS_PER_DAY` and `RIDDLES_PER_DAY` in `lib/scenarios.ts`.

Add an object to `SCENARIOS` in `lib/scenarios.ts`. Each choice has raw `deltas` (for example `{ shadow: 6, persona: 3, self: -2 }`). These are applied and then renormalised, so the vessel always totals 100%. Write an `insight` that explains the Jungian mechanism, not just the verdict. That explanation is what students learn from. Set `practice` to the id of the practice in `lib/practices.ts` that trains the healthier response; the reveal card links to it. Then add the Georgian text under the same id in `lib/ka.ts`, with the choices in the same order.

## Model notes (for teachers)

- **Four archetypes, as in Jung's classical model:** Persona, Shadow, the soul-image and the Self. The soul-image is contrasexual: the **Anima** in a man and the **Animus** in a woman. The player picks a vessel (man or woman) at the start, and that choice sets the soul fluid, its colour and character, the body shape, and the gender-specific explanations.
- Stacking order inside the body, bottom → top: **Shadow** (underground), **Anima/Animus** (deeper layer), **Self** (the heart), **Persona** (a quicksilver mask over the face).
- Percentages are a teaching metaphor, not a psychometric measure.
- "Shadow %" means the part of the Shadow that is still unintegrated. The aim is integration, not elimination.
- The Persona and the soul-image are needed in measure. A too-thick mask (identification) or a too-thin one (no boundaries) lowers the score, and so does a soul-image that floods the psyche (possession).
- **Individuation index** = `50 + (Self − Shadow) − 0.8·max(0, Persona−20) − 1.2·max(0, 12−Persona) − 0.8·max(0, Soul−30) − 0.6·max(0, 12−Soul)`, clamped to 0–100.
- In `lib/scenarios.ts`, `deltas`, `insight` and `prompt` can be a single value or `{ man, woman }` when the Anima and the Animus behave differently.
