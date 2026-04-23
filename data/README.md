# Data manifests

This directory is the foundation for publishable data assets that can be generated and validated independently from the current UI.

## Files

- `models.manifest.json` tracks the live OpenRouter catalog.
- `models.snapshot.manifest.json` freezes the weekly snapshot used for stable weekly publishing.
- `news.manifest.json` seeds the news dataset.
- `github.manifest.json` seeds the GitHub dataset.
- `ai-daily.manifest.json` seeds the AI daily editorial dataset.
- `curated-tools.manifest.json` seeds the curated tools dataset.
- `academic-entrypoints.manifest.json` seeds the academic entrypoints dataset.
- `updates.manifest.json` rolls the source manifests into a bounded curated update log.

## Common manifest fields

Each manifest includes the provenance and freshness envelope required by the Phase 1 spec:

- `datasetId`
- `schemaVersion`
- `sourceName`
- `sourceUrl`
- `sourceFetchedAt`
- `validatedAt`
- `status`
- `freshness`

Manifests may also include `lineage`, `recordCount`, and a `records` array for the actual dataset payload.

## Editorial seed payloads

The three homepage-facing editorial manifests now carry structured record payloads in addition to the common provenance envelope:

- `ai-daily.manifest.json`
  - Seed with `daily-digest` issue records.
  - Recommended fields: `id`, `kind`, `title`, `summary`, `date`, `generatedAt`, `reviewStatus`, `editorialTheme`, and `highlights`.
  - `highlights` should be an array of concise cards using fields such as `category`, `headline`, `summary`, `importance`, and optional `sourceRefs`.
- `curated-tools.manifest.json`
  - Seed with reviewed tool-card records keyed to existing tool directory items via `toolId`.
  - Recommended fields: `stationSection`, `sortOrder`, `reviewStatus`, `reviewedAt`, `whySelected`, `positioning`, `suitableFor`, `whenToUse`, `howToUse`, `limitations`, `alternatives`, `bestFor`, `avoidIf`, `source`, and `updatedAt`.
  - `toolId` must match an existing entry in the tool directory for UI hydration to succeed.
- `academic-entrypoints.manifest.json`
  - Seed with homepage module or task-line entrypoints.
  - Recommended fields: `id`, `category`, `entryKind`, `taskLine`, `moduleSlug`, `title`, `summary`, `desc`, `usageGuide`, `status`, `icon`, `color`, `keywords`, `aliases`, `actionLabel`, and optional audience/outcome metadata.

The update log is generated from:

- `news.manifest.json`
- `models.manifest.json`
- `models.snapshot.manifest.json`
- `github.manifest.json`
- `ai-daily.manifest.json`
- `curated-tools.manifest.json`
- `academic-entrypoints.manifest.json`

## Validation

Run the local validator with:

```bash
node .github/scripts/validate-manifests.js
```

The validator exits non-zero if a manifest contains malformed JSON or misses required fields.
