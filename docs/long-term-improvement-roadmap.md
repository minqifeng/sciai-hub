# SciAI Hub Long-Term Improvement Roadmap

## Goal

Turn the site from a legacy AI directory shell into a stable curated research station for graduate and PhD users.

The target product is not:

- a broad tool directory
- a traffic-distribution homepage
- a mixed portal with multiple homepage narratives

The target product is:

- a task-first, editorial homepage
- a manifest-first content system
- a small number of high-value entrypoints
- a maintainable frontend with clear module boundaries

## North Star

The homepage should answer five questions in order:

1. What matters today?
2. What is worth opening this week?
3. Which playbook matches my current research task?
4. Which high-frequency module should I jump into?
5. How is this station updated and how should I use it?

Everything else is secondary.

## Working Principles

- Curated station first: homepage narrative always beats directory logic.
- Manifest first: runtime should prefer manifest-backed records over static fallback arrays.
- Task lines over categories: user journeys should be organized around research tasks, not tool taxonomies.
- Small visible surface: extension sections exist, but should not dominate the main story.
- Compatibility with discipline: preserve current IDs and core hooks while refactoring incrementally.

## Phases

### Phase 1: Narrative Convergence

Objective:
Make the homepage visibly behave like one curated station instead of one curated shell laid on top of a directory core.

Target outcomes:

- homepage settles into five visible blocks
- old directory wording is removed from visible UI
- recommendation and search no longer default to full-catalog behavior
- extension sections are visually demoted

Key tasks:

- remove remaining homepage copy that references old directory framing
- continue shrinking default fallback exposure in recommendation/search
- keep only compatibility aliases for old home/nav terms
- validate that tools, playbooks, modules, and updates each have one clear role

Exit criteria:

- no visible “300+ tools / tool directory / navigation platform / all tools” wording on primary surfaces
- homepage has one narrative path
- search and recommendation default to curated subsets, not full lists

### Phase 2: Manifest-First Data Architecture

Objective:
Make manifests the real source of homepage/runtime truth, with static arrays acting only as fallback.

Target outcomes:

- curated-tools drives tool cards
- ai-daily drives daily digest
- academic-entrypoints drives playbooks and method entrypoints
- updates manifest consistently aggregates the three content streams

Key tasks:

- move more runtime assembly off `js/data.js` full arrays and onto manifest adapters
- isolate static fallbacks by concern instead of treating `TOOLS_DATA` as universal fallback
- define stable shapes for:
  - curated tools
  - digest cards
  - academic entrypoints
  - updates stream cards
- document refresh expectations and fallback rules

Exit criteria:

- homepage can fully render from manifests
- static arrays are no longer the implicit default for homepage/search/recommend
- updates stream correctly reflects daily-digest / curated-picks / academic-portal

### Phase 3: Frontend Runtime Refactor

Objective:
Reduce the size and coupling of `app.js`, and make browser behavior easier to verify.

Target outcomes:

- `app.js` becomes orchestration-heavy, not logic-heavy
- station data, station home, and station interactions own their domains cleanly
- legacy dead code is removed in controlled passes

Key tasks:

- continue extracting active logic from `app.js`
- remove unreachable legacy fallback branches after replacements stabilize
- isolate extension-section behavior from homepage behavior
- add a small smoke-check layer for startup, search, tool modal, and compare/favorite flows

Exit criteria:

- active homepage/runtime logic is mostly outside `app.js`
- duplicate or unreachable legacy code is materially reduced
- basic regressions can be detected without manual code inspection

### Phase 4: Content Operations and Automation

Objective:
Turn the editorial station into a sustainable content system instead of a one-off frontend rewrite.

Target outcomes:

- daily digest has a stable update rhythm
- curated picks have a review cadence
- academic portal entrypoints have explicit ownership and update logic
- workflow outputs are easy to validate

Key tasks:

- stabilize GitHub workflows around the three content streams
- define editorial fields for tool cards:
  - suitableFor
  - whenToUse
  - howToUse
  - limitations
  - alternatives
  - source
  - updatedAt
- add workflow-level validation for missing fields and stale manifests
- document content production flow

Exit criteria:

- content streams update independently but aggregate consistently
- editorial fields are complete enough for homepage and recommendation use
- workflow outputs are predictable and reviewable

### Phase 5: Quality and Experience Hardening

Objective:
Make the station resilient enough for ongoing iteration.

Target outcomes:

- browser-level regressions are caught quickly
- interaction flows are coherent on desktop and mobile
- extension sections remain available without reclaiming homepage priority

Key tasks:

- run targeted browser regression loops after each major UI pass
- validate nav, search, recommendation, modal, compare, and favorites flows
- audit mobile spacing and section ordering
- review copy consistency and tone

Exit criteria:

- key user paths are stable
- homepage remains curated after future additions
- extension sections do not silently re-promote themselves

## Current Phase

We are in Phase 1 moving into Phase 2.

Already done:

- homepage shell is largely converted to curated-station framing
- new manifests exist for `ai-daily`, `curated-tools`, `academic-entrypoints`
- update aggregation has been extended to three content streams
- interaction logic has started moving out of `app.js`

Still open in the current cycle:

- browser-level regression on the new homepage flow
- further reduction of visible old directory language
- tighter fallback behavior for recommendation/search/runtime
- continued cleanup of legacy runtime branches

## Immediate Execution Queue

1. Finish Phase 1 text and interaction cleanup.
2. Run browser-level regression for:
   - homepage block flow
   - search result routing
   - tool modal open path
   - favorites / compare
3. Start Phase 2 by reducing homepage reliance on large static arrays.
4. Remove dead runtime branches that are no longer reachable.

## Decision Rules For Future Changes

- If a change increases visible homepage complexity, reject it unless it replaces something larger.
- If a new dataset or section cannot be explained in one sentence, it should not be homepage-primary.
- If a feature only makes sense as a legacy directory affordance, move it to extension sections or remove it.
- If a runtime path can be manifest-backed, do not add new static-array-first logic.
