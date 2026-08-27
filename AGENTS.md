# AGENTS.md

## Project

MTG Practice — static web app for practicing Magic: The Gathering games with configurable pressure and events. Mobile-first PWA, no backend.

**Status:** Pre-code. No `package.json` or source code exists yet. First task is scaffolding with Vite + React + TypeScript.

## Language

The UI and all human-facing text are in **Spanish** — including documentation, error messages, test descriptions, and commit messages. Code identifiers (variable/function names) use English conventions for clarity.

## Architecture

Domain logic must be separated from React. Pure functions in `src/features/` should be testable without browser, DOM, or React.

```
UI (React)
  ↓
Game State (reducer)
  ↓
Game Engine (turns, lives, rounds)
  ↓
Event Engine (selection, weights, effects)
  ↓
Pure Functions
```

No `Math.random()` or `Date.now()` in domain logic — use `RandomGenerator` / `Clock` abstractions for deterministic tests.

Events are declarative. Adding a new event should only require registering a new definition, not modifying UI components.

## Event scaling by rounds

The probability of the CPU triggering an event increases as rounds progress. Early rounds have few or no events; later rounds become progressively more punishing. This is the core difficulty ramp — implement event frequency as a function of the current round, not just flat probability.

## Verification

Run these in order — all must pass before committing:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

When E2E tests exist and are relevant:

```bash
npm run test:e2e
```

## Testing

- **Unit tests (Vitest):** Pure functions only. No React, no DOM, no browser APIs. Test descriptions in Spanish.
- **E2E tests (Playwright):** Full user flows (open → setup → play → result → restart).
- Use seeded RNG (`SeededRandom`) for deterministic event/damage tests.
- Domain logic lives in `src/features/game/` and `src/features/events/` — test these independently.
- **Test round-based event scaling explicitly:** verify low event probability in round 1, increasing probability in later rounds, and the boundary behavior (round 1 vs max rounds).

## Code style

Non-obvious rules beyond standard TS/React:

- **No `any`** — prefer `unknown` when truly unknown
- **No magic numbers** — use named constants or config values
- **No `localStorage` calls** in domain logic — use `settingsStore` abstraction
- **localStorage data is untrusted** — always validate, handle corrupt JSON, version migrations
- **`@/` path alias** for internal imports (not relative `../../../`)
- Use real `<button>` elements, not `<div onClick>`
- `aria-live="polite"` for life/turn changes, `assertive` for game end
- Respect `prefers-reduced-motion`

## Key docs

| File           | Contains                                                          |
| -------------- | ----------------------------------------------------------------- |
| `SPECS.md`     | Types, data model, event system, full specification               |
| `CODESTYLE.md` | All code rules, verification steps, commit conventions            |
| `STYLE.md`     | Visual design: MTG old-frame aesthetic, color palette, typography |
| `ROADMAP.md`   | Phased implementation plan (Fase 1–20), milestones, priorities    |

## Stack

React, TypeScript (`strict: true`), Vite, CSS (custom properties), Vitest, Playwright, PWA, localStorage.
