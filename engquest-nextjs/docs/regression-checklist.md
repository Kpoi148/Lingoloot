# Regression Checklist: LingoLoot

Run this checklist for every non-trivial change.

## 0) Required pre-check
- Complete impact analysis using `docs/feature-map.md`.
- Mark impacted sections in this checklist before coding.

## 1) Automated quality gates (required)
- `npm run lint`
- `npm test`
- `npm run build`

If any command fails or is skipped, record:
- failing/skipped command
- exact error
- risk introduced

## 2) Core functional regression

### Landing and guest entry surface
- `/` loads without runtime errors.
- Hero, navbar, section anchors, and auth quick access render without nested scroll containers or broken overflow.
- Navbar and CTA buttons navigate to the intended landing section.
- Login entry points open the auth card with the login tab active.
- Register entry points open the auth card with the register tab active.

### A. Authentication and session
- Register flow works.
- Login with valid credentials works.
- Invalid login is rejected with clear error.
- Forgot password requests token/email path correctly.
- Reset password updates credentials and allows next login.
- Protected routes require auth.
- Anonymous access to `api/admin/*` is rejected with `401`.
- Authenticated non-admin access to `api/admin/*` is rejected with `403`.
- Admin session can still perform expected admin CRUD operations.

### B. Topics, vocabulary, and learning pages
- `/topics` loads without runtime errors.
- `/learning/[slug]` loads topic data correctly.
- Flashcards page renders and interactions work.
- Quiz page loads questions and submits answers.
- Dictionary lookup endpoint returns meaning for valid word.

### C. Practice/game/progress persistence
- Practice route can load a quiz/game item by ID.
- Progress submission endpoints (`/api/progress/*`) persist expected updates.
- No duplicate or inconsistent progress records after repeated submit.

### D. Gamification
- Daily reward claim logic works:
  - same-day second claim is blocked
  - streak updates correctly across day boundaries
- XP/level/currency values update as expected after progress/reward events.
- Navbar/profile display updated values correctly.

### E. Shop and inventory
- Shop list loads active items.
- Purchase flow updates user inventory/currency correctly.
- Inactive or missing shop items are rejected by purchase flow.
- Repeated fast purchase attempts do not double-charge currency or duplicate inventory.
- Purchase failures for already-owned/insufficient-funds return clear messages.
- Equip avatar/frame updates profile visuals.
- Frame rendering works for registry frames and fallback image frames.

### F. Profile
- Profile page loads current user data.
- Edit profile (display name/bio/avatar) saves correctly.
- Inventory modal shows owned items and equip state.
- `/api/cloudinary/signature` rejects anonymous requests.
- Non-admin upload signature is scoped to user-safe folders.
- Admin upload signature only accepts configured allowlist/prefix folders.

### G. Admin portal
- Admin dashboard stats load.
- User management: list, role toggle, ban/unban, edit modal save.
- Category management CRUD works.
- Vocabulary management CRUD works.
- Quiz management CRUD works.
- Shop management CRUD/toggle active state works.
- Shop management create/edit navigation resolves to `/admin/shop-management/*`.

### H. AI Hub
- AI generate endpoints return valid JSON payloads.
- Generated game/quiz/frame can be previewed and saved.
- AI save-to-shop path persists item and revalidates UI where needed.
- AI save-to-shop revalidates both `/shop` and `/admin/shop-management`.
- `/api/ai/generate` and `/api/admin/games/generate` require admin session.
- AI endpoints return `429` with `Retry-After` when rate-limit is exceeded.

## 3) API contract checks
- Response status codes remain correct (`2xx/4xx/5xx`).
- Response shapes remain backward compatible for existing clients.
- Input validation still rejects malformed payloads.
- Auth/role checks still enforced on admin endpoints.
- Error responses do not leak stack traces or raw internal provider/DB errors.
- Rate-limited routes return stable `429` contract with `Retry-After` header.

## 4) Non-functional checks
- No new ESLint warnings/errors.
- No obvious performance regressions in critical pages:
  - avoid unnecessary client components
  - avoid redundant data fetch loops
- No secrets or sensitive data leaked in logs/responses.
- Production deploy has `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` configured (or fallback risk is explicitly accepted).

## 5) Completion report template

Use this in PR/task notes:

```md
## Regression Report
- Impacted features:
- Automated checks:
  - lint: pass/fail
  - test: pass/fail
  - build: pass/fail
- Manual regression executed:
  - [x] Sections: ...
  - [ ] Sections skipped: ... (reason)
- Known risks:
- Follow-up tasks:
```
