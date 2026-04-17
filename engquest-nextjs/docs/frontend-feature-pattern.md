# Frontend Feature Pattern

Use this pattern for complex client-side features such as generators, builders, editors, gameplay screens, and multi-step admin tools.

## Goals
- Keep top-level feature components small and compositional.
- Separate rendering, state orchestration, pure helpers, and data boundaries.
- Preserve import stability for route pages by keeping existing entry components when practical.

## Required structure for complex client features

When a client feature owns multiple local states, async calls, derived values, or large JSX sections, organize it as:

```txt
src/components/<scope>/<feature>/
├── types.ts
├── utils.ts
├── api.ts
├── use<Feature>Controller.ts
├── <PanelOrCard>.tsx
├── <PanelOrCard>.tsx
└── ...
```

Keep the legacy entry file if it is already imported by routes:

```txt
src/components/<scope>/<FeatureName>.tsx
```

That entry file should usually only:
- call the controller hook
- compose panels/cards
- wire props between the controller and presentational components

## Responsibilities

### Entry component
- Own layout composition only.
- Avoid long inline handlers and large derived state blocks.
- Do not perform direct fetch logic unless the feature is trivial.

### `use<Feature>Controller.ts`
- Own local state, derived state, side effects, and UI event handlers.
- Coordinate async work through `api.ts` or imported actions.
- Return a stable feature-facing interface for the entry component.

### `api.ts`
- Own client-side fetch wrappers or action wrappers for the feature.
- Normalize response/error handling close to the boundary.
- Keep route/action URLs out of presentational components.

### `utils.ts`
- Own pure helpers only.
- No React hooks, no fetch, no component imports.
- Good candidates: parsing, normalization, scoring, filtering, mapping helpers.

### `types.ts`
- Own feature-local TypeScript types.
- Keep props and data contracts explicit and narrowly scoped.

### Presentational components
- Render UI from props.
- Avoid feature-wide orchestration state.
- Small local UI state is acceptable when it is truly local to that view fragment.

## Extraction heuristics

Refactor into this pattern when any of the following are true:
- the component mixes rendering, async calls, and normalization logic
- the component has multiple unrelated sections in one return tree
- the component owns more than one user workflow
- the component becomes hard to scan because handlers and JSX are interleaved
- the file is growing mainly because of orchestration logic, not because of one dense visual block

## Naming rules
- Prefer folder names in kebab-case for feature internals.
- Prefer controller hook names like `useStoryClozeGameController`.
- Prefer panel/card names that describe their UI role: `ConfigPanel`, `PreviewPanel`, `SaveModal`.
- Prefer feature-local imports through aliases, for example `@/components/admin/ai-hub/frame-generator/...`.

## Boundary rules
- Server writes and protected workflows still belong in `actions/*` or `app/api/*`.
- Shared reusable logic belongs in `lib/*` only when it is cross-feature, not just because a file feels large.
- Do not move page-specific JSX into `lib/*`.

## UI infrastructure rules
- Reusable UI primitives and registry-style components belong in `src/components/ui/*`.
- Keep shadcn-compatible aliases stable:
  - `components.json`
  - `src/lib/utils.ts`
  - `src/app/globals.css`
- If a feature needs community/chart primitives, prefer adapting them into the local theme system instead of letting a generator overwrite global styles blindly.
- Treat `src/components/ui/chart.tsx` as the shared wrapper for Recharts-based dashboards and admin analytics rather than re-creating chart helpers per feature.

## Landing and marketing surfaces
- Public landing sections may stay as presentational components under `src/components/landing/*`; they do not need controller hooks unless they become stateful workflows.
- Shared landing copy, CTA labels, nav items, and learner-flow bullets should live in a single `content.ts` module instead of being duplicated across hero, navbar, CTA, footer, or preview sections.
- Keep the landing focused on learner-facing flows only; avoid repeating the same feature list in multiple sections.
- Prefer a small number of conversion surfaces:
  - primary CTA in hero/navigation
  - embedded auth entry surface
  - final CTA near the end of the page

## Migration strategy
- Refactor one feature at a time.
- Preserve existing public imports when possible.
- Extract pure helpers before inventing shared abstractions.
- Only promote code to shared modules after at least two real consumers exist.

## Canonical examples
- `src/components/admin/ai-hub/GameBuilder.tsx`
- `src/components/admin/ai-hub/game-builder/useGameBuilderController.ts`
- `src/components/game/StoryClozeGame.tsx`
- `src/components/admin/ai-hub/FrameGenerator.tsx`
