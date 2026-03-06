# Feature Map: LingoLoot

Use this map before editing code. Identify impacted features first, then execute matching regression checks.

## Feature to code ownership map

| Feature area | Main user routes | Main APIs / actions | Core components / libs | Data models |
|---|---|---|---|---|
| Authentication and account recovery | `/`, `/forgot-password`, `/reset-password` | `/api/auth/[...nextauth]`, `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password` | `components/auth/*`, `lib/auth/auth-options.ts`, `lib/auth/auth-utils.ts`, `lib/auth/api-auth.ts`, `lib/auth/password-reset.ts`, `lib/auth/email.ts`, `lib/security/rate-limit.ts`, `lib/security/request-ip.ts` | `User`, `PasswordResetToken` |
| Topics and vocabulary browsing | `/topics`, `/learning/[slug]`, `/learning/[slug]/flashcards` | `/api/categories`, `/api/vocabularies`, `/api/dictionary/meaning` | `app/(app)/topics/*`, `app/(app)/learning/*`, dictionary helpers in `lib/*` | `Category`, `Vocabulary`, `DictionaryCache` |
| Practice and quiz gameplay | `/learn/practice`, `/learn/practice/[id]`, `/learning/[slug]/quiz` | `/api/quizzes`, `/api/progress/quiz`, `/api/progress/vocab` | quiz/game UI in `components/game/*`, learning screens under `app/(app)/learn/*` and `app/(app)/learning/*` | `Quiz`, `QuizResult`, `TopicProgress`, `User` |
| Story Cloze game | `/learn/game/[id]` | `/api/games/[id]`, `/api/progress/proof` | `components/game/StoryClozeGame.tsx`, game helpers under `lib/*` | `Game`, `TopicProgress`, `User` |
| Gamification (XP, level, streak, rewards) | profile/navbar surfaces across app | `actions/user/gamification.actions.ts` | `components/gamification/*`, `lib/gamification/gamification.ts`, `lib/gamification/gamification-config.ts` | `User` |
| Shop and inventory | `/shop`, `/profile` (equip flow), `/admin/shop-management` | `actions/user/shop.actions.ts`, `actions/admin/shop.actions.ts`, `actions/admin/ai-shop.actions.ts` | `components/shop/*`, `components/profile/*`, `components/admin/shop/*`, `app/(app)/admin/shop-management/*` | `ShopItem`, `User` |
| Profile management | `/profile` | `actions/user/profile.actions.ts`, `/api/cloudinary/signature` | `app/(app)/profile/ProfileClient.tsx`, `components/profile/*`, `components/shop/InventoryModal.tsx`, `lib/auth/api-auth.ts`, `lib/security/request-ip.ts`, `lib/security/rate-limit.ts` | `User`, `ShopItem` |
| Admin dashboard and user management | `/admin`, `/admin/user-management`, `/admin/profile` | `/api/admin/overview`, `actions/admin/user.actions.ts` | `components/admin/dashboard/*`, `components/admin/users/*`, `lib/db/cached-queries.ts` | `User`, aggregate reads from multiple models |
| Admin content management (categories, vocabulary, quizzes, games) | `/admin/category-management`, `/admin/vocabulary-management`, `/admin/quiz-management` | `/api/admin/categories/*`, `/api/admin/vocabularies/*`, `/api/admin/quizzes/*`, `/api/admin/games` | admin management pages + forms in `components/admin/*` | `Category`, `Vocabulary`, `Quiz`, `Game` |
| AI Hub generation (frames/quizzes/games/vocabulary) | `/admin/ai-hub/*` | `/api/ai/generate`, `/api/admin/games/generate`, `actions/admin/ai-shop.actions.ts` | `components/admin/ai-hub/*`, `lib/ai/ai-prompts.ts`, `lib/auth/api-auth.ts`, `lib/security/rate-limit.ts`, `lib/security/request-ip.ts` | generated content persists to `Game`, `Quiz`, `ShopItem`, `Vocabulary` |
| API security and error boundaries | (cross-cutting) | protected APIs, especially `/api/admin/*`, `/api/ai/generate`, `/api/cloudinary/signature` | `lib/auth/api-auth.ts`, `lib/security/api-error.ts`, `lib/security/rate-limit.ts`, `lib/security/request-ip.ts` | n/a |

## Cross-cutting dependencies
- Navigation/profile chrome:
  - `components/layout/Navbar.tsx`, `components/layout/NavbarUserMenu.tsx`, `components/gamification/StreakNavbarItem.tsx`
- Theme/providers:
  - `components/providers/*`, `app/layout.tsx`
- DB connectivity:
  - `lib/db/mongodb.ts`
- Shared utility behavior:
  - `lib/shared/utils.ts`, `lib/validations/*`, `lib/security/api-error.ts`

## Impact analysis template (fill before coding)

Copy and fill this block in task notes/PR description:

```md
## Impact Analysis
- Requested change:
- Directly edited files:
- Feature areas impacted (from feature map):
- Data models touched:
- APIs/actions touched:
- Risk level: Low / Medium / High
- Required regression sections from docs/regression-checklist.md:
```

## Change scoping rules
- Prefer smallest possible change set for requested behavior.
- If touching shared modules (`lib/*`, layout/nav, auth), assume multi-feature impact and run broader regression.
- For shop currency/inventory flows, preserve atomic purchase invariants in `actions/user/shop.actions.ts` (single conditional write for balance + ownership).
- Any schema or contract change requires:
  - migration/backward-compatibility note
  - API contract verification for all consumers
