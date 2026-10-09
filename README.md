# VAS · The Hermetic Vessel

**Play it:** https://thothcher.github.io/archetypes-game/ · **ქართულად:** https://thothcher.github.io/archetypes-game/?lang=ka

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
| 3D | **React Three Fiber + a custom GLSL raymarching shader** | The body is a signed-distance field, so the liquid can be rendered as a true volume with waves, slosh, refraction and glass reflections in a single pass (60 fps on integrated GPUs) |
| Motion | **Framer Motion** | Card transitions, meters, individuation ring |
| Sound | **WebAudio (synthesised)** | Ambient drone plus chimes, no audio files |
| Type | Instrument Serif, Inter Tight, JetBrains Mono + **Noto Serif/Sans Georgian** | The Latin fonts have no Georgian glyphs, so the Georgian fonts take over per character |

## Structure

```
app/
  page.tsx            hero → 01 The Waters → 02 The Experience (game)
  practices/page.tsx  03 Practices of balance
components/
  fluidShader.ts      the vessel: SDF body + volumetric layered liquid
  FluidAvatar.tsx     R3F canvas, drag-to-spin, layer labels
  Intro.tsx           hero and the four archetype cards
  Game.tsx            choose vessel → choose → predict → reveal → ending
  Practices.tsx       tick practices, watch the vessel rebalance
lib/
  archetypes.ts       colours, descriptions, percentage model, individuation index
  scenarios.ts        all situations and riddles, with deltas (edit here to add content)
  practices.ts        balancing practices with their effects
  i18n.tsx            language provider (EN / KA), ?lang= and browser detection
  ui.tsx              interface strings in both languages
  ka.ts               Georgian text for archetypes, scenarios and practices
```

## Languages

The switch sits in the nav. The choice is remembered per browser, `?lang=ka` or `?lang=en` forces a language, and Georgian browsers start in Georgian. English text and all game logic (ids, deltas) live in `archetypes.ts`, `scenarios.ts` and `practices.ts`. The Georgian files only carry text, keyed by the same ids, so scoring can never drift between languages.

## Adding a scenario

Add an object to `SCENARIOS` in `lib/scenarios.ts`. Each choice has raw `deltas` (for example `{ shadow: 6, persona: 3, self: -2 }`). These are applied and then renormalised, so the vessel always totals 100%. Write an `insight` that explains the Jungian mechanism, not just the verdict. That explanation is what students learn from. Then add the Georgian text under the same id in `lib/ka.ts`, with the choices in the same order.

## Model notes (for teachers)

- **Four archetypes, as in Jung's classical model:** Persona, Shadow, the soul-image and the Self. The soul-image is contrasexual: the **Anima** in a man and the **Animus** in a woman. The player picks a vessel (man or woman) at the start, and that choice sets the soul fluid, its colour and character, the body shape, and the gender-specific explanations.
- Stacking order inside the body, bottom → top: **Shadow** (underground), **Anima/Animus** (deeper layer), **Self** (the heart), **Persona** (a quicksilver mask over the face).
- Percentages are a teaching metaphor, not a psychometric measure.
- "Shadow %" means the part of the Shadow that is still unintegrated. The aim is integration, not elimination.
- The Persona and the soul-image are needed in measure. A too-thick mask (identification) or a too-thin one (no boundaries) lowers the score, and so does a soul-image that floods the psyche (possession).
- **Individuation index** = `50 + (Self − Shadow) − 0.8·max(0, Persona−20) − 1.2·max(0, 12−Persona) − 0.8·max(0, Soul−30) − 0.6·max(0, 12−Soul)`, clamped to 0–100.
- In `lib/scenarios.ts`, `deltas`, `insight` and `prompt` can be a single value or `{ man, woman }` when the Anima and the Animus behave differently.
