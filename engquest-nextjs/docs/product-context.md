# Product Context: LingoLoot

## Product summary
LingoLoot is an English learning platform with gamification.
Guests enter through a learner-first landing page that points to real study flows such as topics, flashcards, quizzes, Story Cloze, rewards, and profile customization.
Users learn vocabulary and quizzes, gain XP/Gems, keep login streaks, and customize profile visuals from a shop.
Admins manage core content and can generate content with AI.
The public landing page should market learner capabilities only, not admin tooling.

## Primary user roles
- Guest: can access the learner-first landing page, section navigation, and auth entry points.
- Learner (authenticated user): learns, plays, tracks progress, uses profile/shop/inventory.
- Admin: full content and user management from admin portal.

## Core domain objects
- `User`
- `Category`
- `Vocabulary`
- `Quiz`
- `QuizResult`
- `Game`
- `TopicProgress`
- `ShopItem`
- `PasswordResetToken`
- `DictionaryCache`

## Architecture snapshot
- Framework: Next.js App Router (`src/app`).
- Business entry points:
  - Server Actions: `src/actions/**`
  - API routes: `src/app/api/**`
- Data and infra:
  - Models: `src/models/**`
  - Shared logic/utilities: `src/lib/**`
- UI:
  - Routes/pages: `src/app/**/page.tsx`
  - Components: `src/components/**`
  - Public landing composition lives in `src/app/page.tsx` and `src/components/landing/*`, with auth entry embedded through `src/components/auth/AuthTabs.tsx`

## Layering and dependency rules
- `components/*` can depend on `lib/*`, `types/*`, and actions (for UI-triggered operations).
- `actions/*` and `app/api/*` own business workflows and DB writes.
- `models/*` owns schema definitions only; keep query orchestration outside model files.
- `lib/*` should be framework-light and reusable; avoid page-specific logic here.
- Do not import UI components into `lib/*`, `models/*`, `actions/*`, or API routes.

## Library structure rules (hard rule)
- `src/lib` is organized by domain folders, not as a flat file list:
  - `lib/auth/*`: auth/session helpers (`auth-options`, `auth-utils`, `api-auth`, `password-reset`, `email`).
  - `lib/security/*`: boundary safety (`api-error`, `rate-limit`, `request-ip`, `progress-proof`).
  - `lib/db/*`: database connectivity and cached query helpers (`mongodb`, `cached-queries`).
  - `lib/ai/*`: AI prompts and generation helpers.
  - `lib/gamification/*`: XP/level/streak calculations and config.
  - `lib/shared/*`: generic utilities (`utils`).
  - `lib/validations/*`: shared validation schemas.
- New reusable helper modules must be added to the correct domain folder above.
- Avoid adding new top-level `.ts` files directly under `src/lib`.
- Prefer alias imports (`@/lib/<domain>/<module>`) for cross-folder usage.
- Keep tests near the module they verify (for example `lib/auth/password-reset.test.ts`).

## SOLID guardrails (must follow)
1. Single Responsibility:
- One module/function should have one reason to change.
- Split mixed logic (validation + DB + formatting + side effects) into helpers.
2. Open/Closed:
- Extend via new strategy/helper/component, avoid editing stable code paths when possible.
- Example: add new frame renderer via registry entry, not branching everywhere.
3. Liskov Substitution:
- Keep component/action contracts stable.
- New implementations must preserve expected input/output behavior.
4. Interface Segregation:
- Prefer small, explicit TypeScript types over broad "god" interfaces.
- Pass only required props/data.
5. Dependency Inversion:
- High-level workflows depend on abstractions/helpers, not low-level details.
- Isolate external service calls (Gemini, email, Cloudinary) behind thin wrappers/helpers.

## Clean code standards (must follow)
- Names:
  - Use descriptive names (`loadUserProgress`, not `doThing`).
- Function size:
  - Keep functions focused; extract helpers when nested branches grow.
- Control flow:
  - Prefer guard clauses and early returns.
- Data contracts:
  - Validate input at boundaries (API routes/server actions) using Zod or explicit checks.
- Error handling:
  - Never swallow critical errors silently.
  - Return actionable error messages at boundaries, keep internal details in server logs.
- Side effects:
  - Keep DB writes, cache invalidation, and external API calls explicit and near orchestration code.
- Duplication:
  - Remove copy-paste logic by extracting shared utilities.
- Comments:
  - Add comments only when code intent is non-obvious.

## Security and reliability rules
- AuthN/AuthZ:
  - Server actions must use session guards:
    - user scope: `ensureAuthenticated`
    - admin scope: `ensureAdminSession`
  - Reuse guard helpers from `lib/auth/auth-utils.ts`; avoid duplicating custom role/session guard logic inside feature actions.
  - API routes must use `requireUserApiSession` / `requireAdminApiSession` from `lib/auth/api-auth.ts`.
  - Admin surfaces must return:
    - `401` for anonymous requests
    - `403` for authenticated non-admin requests
- Secrets:
  - Read from env vars only; never hardcode tokens/keys.
- Input safety:
  - Validate request payloads and sanitize user-provided text where needed.
- Rate limiting:
  - Use shared `checkRateLimit` helper (`lib/security/rate-limit.ts`) for abuse-prone endpoints.
  - Production target is distributed throttling via Upstash Redis REST (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).
  - In-memory fallback is acceptable for local development only.
  - Prefer composite keys (user id + client IP from `lib/security/request-ip.ts`) for sensitive routes.
- API error boundaries:
  - Use `createApiErrorResponse` (`lib/security/api-error.ts`) at route boundaries.
  - Never expose raw stack traces, DB/provider internals, or unfiltered `error.message` to clients.
- Cloud upload signing:
  - `/api/cloudinary/signature` requires authenticated session.
  - Non-admin uploads must stay in user-scoped folder paths.
  - Admin folder override must be constrained by an allowlist/prefix.

## Data consistency rules
- Shop purchase logic must keep eligibility + write in one conditional DB update:
  - item is active
  - user has sufficient currency
  - user does not already own item
- Inventory ownership arrays must avoid duplicates (for example, `$addToSet` for item ownership).
- Shop mutations should revalidate affected routes explicitly (`/shop`, `/profile`, `/admin/shop-management` as applicable).

## Definition of done for every change
- Impact analysis completed using `docs/feature-map.md`.
- Regression checklist completed using `docs/regression-checklist.md`.
- All required checks pass:
  - `npm run lint`
  - `npm test`
  - `npm run build`
- If any check cannot run, document the exact reason and residual risk in PR/task notes.
