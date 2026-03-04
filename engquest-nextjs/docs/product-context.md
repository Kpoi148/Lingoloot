# Product Context: LingoLoot

## Product summary
LingoLoot is an English learning platform with gamification.
Users learn vocabulary and quizzes, gain XP/Gems, keep login streaks, and customize profile visuals from a shop.
Admins manage core content and can generate content with AI.

## Primary user roles
- Guest: can access landing and auth pages.
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

## Layering and dependency rules
- `components/*` can depend on `lib/*`, `types/*`, and actions (for UI-triggered operations).
- `actions/*` and `app/api/*` own business workflows and DB writes.
- `models/*` owns schema definitions only; keep query orchestration outside model files.
- `lib/*` should be framework-light and reusable; avoid page-specific logic here.
- Do not import UI components into `lib/*`, `models/*`, `actions/*`, or API routes.

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
  - Use `ensureAuthenticated` for protected server actions.
  - Enforce role checks for admin routes/actions.
- Secrets:
  - Read from env vars only; never hardcode tokens/keys.
- Input safety:
  - Validate request payloads and sanitize user-provided text where needed.
- Rate limiting:
  - Use shared rate limit helpers for abuse-prone endpoints.

## Definition of done for every change
- Impact analysis completed using `docs/feature-map.md`.
- Regression checklist completed using `docs/regression-checklist.md`.
- All required checks pass:
  - `npm run lint`
  - `npm test`
  - `npm run build`
- If any check cannot run, document the exact reason and residual risk in PR/task notes.
