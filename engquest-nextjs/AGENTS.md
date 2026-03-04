# LingoLoot Agent Contract

## Scope
- This contract applies to all agent-driven work in this repository.
- It is a project-level hard policy for planning, coding, and reporting.
- It governs code tasks, refactors, fixes, and feature work.
- Existing skill files remain unchanged and are still usable.

## Mandatory Pre-Read (Hard Requirement)
- Must read these files before any code change:
  - `docs/product-context.md`
  - `docs/feature-map.md`
  - `docs/regression-checklist.md`
- No code edits are allowed until this pre-read step is completed.

## Mandatory Workflow (Hard Gate)
- Before editing:
  - Fill Impact Analysis block from `docs/feature-map.md`
  - Identify impacted feature areas and risk level
- During implementation:
  - Keep changes scoped to requested feature
  - Preserve backward compatibility unless user explicitly requests breaking change
- After implementation:
  - Execute regression sections mapped from impact analysis
  - Run:
    - `npm run lint`
    - `npm test`
    - `npm run build`
- Hard gate:
  - If any check fails or is skipped, must explicitly report:
    - failed/skipped command
    - exact reason
    - residual risk

## Output Format Requirement
- Every code task response must include:
  - Impacted features
  - Checks run and results
  - Regression sections executed
  - Known risks / unverified parts
- Report must be explicit, concise, and auditable from command results.

## Git Commit and Push Rules
- Hard gate: do not run `git commit` or `git push` without explicit user approval.
- When a feature/fix is completed, ask the user before any VCS action:
  - "Feature is complete. Do you want me to commit now?"
  - "Commit is ready. Do you want me to push now?"
- Commit message must follow Conventional Commits:
  - Format: `<type>(<scope>): <short summary>`
  - Allowed `type`: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `build`, `ci`, `revert`
- Commit summary rules:
  - Use imperative mood and be specific.
  - Keep it concise, clear, and tied to the actual change.
- Commit body rules (required when change is non-trivial):
  - Explain what changed and why.
  - Mention important risks or compatibility notes when relevant.
- Prefer one logical feature/fix per commit; avoid mixed unrelated changes.

## Definition of Done
- Task is not considered done unless:
  - Impact analysis is provided
  - Required checks are completed (or justified with risk)
  - Regression checklist execution is reported
- "Done" cannot be claimed when required gates are missing.

## Exceptions and Failure Reporting
- For docs-only or non-code tasks, agent may skip build/test but must state why
- For environment limitations (missing env/db/network), agent must provide exact blocker and manual verification steps
- Any skipped validation must include scope of uncertainty and expected follow-up.
