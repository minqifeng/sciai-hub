# Data manifests

This directory is the foundation for publishable data assets that can be generated and validated independently from the current UI.

## Files

- `models.manifest.json` tracks the live OpenRouter catalog.
- `models.snapshot.manifest.json` freezes the weekly snapshot used for stable weekly publishing.
- `news.manifest.json` seeds the news dataset.
- `github.manifest.json` seeds the GitHub dataset.

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

## Validation

Run the local validator with:

```bash
node .github/scripts/validate-manifests.js
```

The validator exits non-zero if a manifest contains malformed JSON or misses required fields.
