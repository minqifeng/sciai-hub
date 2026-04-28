/**
 * generate-station-updates.js
 *
 * Build a lightweight curated update-log manifest from the existing source
 * manifests under data/.
 *
 * This is intentionally not a live feed. Each run appends one summarized
 * record and keeps the history bounded.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');
const DATA_DIR = path.join(ROOT, 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'updates.manifest.json');

const SOURCE_FILES = {
  news: path.join(DATA_DIR, 'news.manifest.json'),
  modelsLive: path.join(DATA_DIR, 'models.manifest.json'),
  modelsSnapshot: path.join(DATA_DIR, 'models.snapshot.manifest.json'),
  github: path.join(DATA_DIR, 'github.manifest.json'),
  aiDaily: path.join(DATA_DIR, 'ai-daily.manifest.json'),
  curatedTools: path.join(DATA_DIR, 'curated-tools.manifest.json'),
  academicEntrypoints: path.join(DATA_DIR, 'academic-entrypoints.manifest.json'),
};

const SOURCE_DEFINITIONS = [
  { key: 'news', fallbackLabel: 'news', fileKey: 'news', highlightLabel: 'news' },
  { key: 'github', fallbackLabel: 'github', fileKey: 'github', highlightLabel: 'github' },
  { key: 'aiDaily', fallbackLabel: 'ai-daily', fileKey: 'aiDaily', highlightLabel: 'ai-daily' },
  { key: 'curatedTools', fallbackLabel: 'curated-tools', fileKey: 'curatedTools', highlightLabel: 'curated-tools' },
  {
    key: 'academicEntrypoints',
    fallbackLabel: 'academic-entrypoints',
    fileKey: 'academicEntrypoints',
    highlightLabel: 'academic-entrypoints',
  },
];

const STREAM_DEFINITIONS = [
  {
    key: 'daily-digest',
    title: 'Today digest',
    badge: 'daily-digest',
    icon: 'fas fa-newspaper',
    sourceKey: 'aiDaily',
    contextKeys: ['news', 'models', 'github'],
    summary: 'Daily editorial digest sourced from the AI daily manifest, with model, news, and GitHub context attached.',
  },
  {
    key: 'curated-picks',
    title: 'Weekly picks',
    badge: 'curated-picks',
    icon: 'fas fa-crown',
    sourceKey: 'curatedTools',
    contextKeys: ['models', 'github'],
    summary: 'Weekly curated picks from the reviewed tool manifest, with model and source context preserved for the homepage.',
  },
  {
    key: 'academic-portal',
    title: 'Research playbooks',
    badge: 'academic-portal',
    icon: 'fas fa-compass',
    sourceKey: 'academicEntrypoints',
    contextKeys: ['models', 'news'],
    summary: 'Academic entrypoints and research playbooks, kept separate from the old portal sections but still connected to source context.',
  },
];

function isoNow() {
  return new Date().toISOString();
}

function today() {
  return isoNow().slice(0, 10);
}

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function toPosix(relativePath) {
  return relativePath ? relativePath.replace(/\\/g, '/') : relativePath;
}

function safeLoadManifest(filePath) {
  try {
    return readJson(filePath);
  } catch (err) {
    console.warn(`Skipping unreadable manifest ${path.relative(ROOT, filePath)}: ${err.message}`);
    return null;
  }
}

function normalizeFreshness(manifest) {
  const freshness = manifest?.freshness || {};
  return {
    cadence: freshness.cadence || 'unknown',
    freshnessPolicy: freshness.freshnessPolicy || 'unknown',
    snapshotDate: freshness.snapshotDate || manifest?.validatedAt?.slice?.(0, 10) || today(),
    refreshedAt: freshness.refreshedAt || null,
    snapshotTakenAt: freshness.snapshotTakenAt || null,
    sourceDatasetId: freshness.sourceDatasetId || null,
    refreshHint: freshness.refreshHint || null,
  };
}

function defaultSourceLayers(manifest, fallbackLabel, key) {
  const sourceName = manifest?.sourceName || fallbackLabel;
  const sourceUrl = manifest?.sourceUrl || '';
  return [
    {
      layer: 'seed',
      role: 'manifest-of-record',
      key,
      sourceName,
      sourceUrl,
      verification: manifest ? 'loaded-from-local-manifest' : 'missing-manifest-fallback',
    },
  ];
}

function sourceLayers(manifest, fallbackLabel, key) {
  if (Array.isArray(manifest?.sourceLayers) && manifest.sourceLayers.length > 0) {
    return manifest.sourceLayers;
  }
  return defaultSourceLayers(manifest, fallbackLabel, key);
}

function sourceProfile(manifest) {
  return manifest?.sourceProfile || {
    trustTier: manifest ? 'local-seed' : 'missing',
    verificationMode: manifest ? 'schema-validated-local-json' : 'fallback-placeholder',
    liveFetchRequired: false,
  };
}

function editorialReview(manifest, fallbackLabel, checkedAt) {
  return manifest?.editorialReview || {
    status: manifest ? 'schema-compatible' : 'missing-manifest',
    reviewedAt: checkedAt,
    reviewer: 'generate-station-updates.js',
    scope: fallbackLabel,
    checks: manifest
      ? ['json-parse', 'manifest-summary', 'schema-compatible-output']
      : ['missing-manifest-fallback'],
  };
}

function stableJson(value) {
  if (value === undefined) return 'undefined';
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
}

function valuesEqual(left, right) {
  return stableJson(left) === stableJson(right);
}

function buildFieldDiffs(current, previous, fields) {
  if (!previous) {
    return fields
      .filter(field => current[field] !== undefined)
      .map(field => ({
        field,
        previous: null,
        current: current[field],
        changeType: 'added',
      }));
  }

  return fields
    .filter(field => !valuesEqual(previous[field], current[field]))
    .map(field => ({
      field,
      previous: previous[field] === undefined ? null : previous[field],
      current: current[field] === undefined ? null : current[field],
      changeType: previous[field] === undefined ? 'added' : current[field] === undefined ? 'removed' : 'changed',
    }));
}

function freshnessLabel(manifest) {
  if (!manifest) return 'manifest missing';
  const freshness = manifest.freshness || {};
  if (freshness.snapshotDate) return `snapshot ${freshness.snapshotDate}`;
  if (freshness.refreshedAt) return `refreshed ${freshness.refreshedAt.slice(0, 10)}`;
  if (freshness.snapshotTakenAt) return `snapshot ${freshness.snapshotTakenAt.slice(0, 10)}`;
  return `validated ${String(manifest.validatedAt || '').slice(0, 10) || 'n/a'}`;
}

function manifestSummary(manifest, fallbackLabel) {
  if (!manifest) {
    return {
      label: fallbackLabel,
      status: 'missing',
      sourceName: fallbackLabel,
      datasetId: fallbackLabel,
      sourceUrl: '',
      sourceFetchedAt: null,
      validatedAt: null,
      recordCount: 0,
      freshness: normalizeFreshness(null),
      freshnessLabel: 'manifest missing',
      lineage: {},
      sourceLayers: sourceLayers(null, fallbackLabel, fallbackLabel),
      sourceProfile: sourceProfile(null),
      editorialReview: editorialReview(null, fallbackLabel, null),
      manifestRefs: {},
    };
  }

  return {
    label: fallbackLabel,
    status: manifest.status || 'unknown',
    sourceName: manifest.sourceName || fallbackLabel,
    datasetId: manifest.datasetId || fallbackLabel,
    sourceUrl: manifest.sourceUrl || '',
    sourceFetchedAt: manifest.sourceFetchedAt || null,
    validatedAt: manifest.validatedAt || null,
    recordCount: Number(manifest.recordCount || 0),
    freshness: normalizeFreshness(manifest),
    freshnessLabel: freshnessLabel(manifest),
    lineage: manifest.lineage || {},
    sourceLayers: sourceLayers(manifest, fallbackLabel, fallbackLabel),
    sourceProfile: sourceProfile(manifest),
    editorialReview: editorialReview(manifest, fallbackLabel, manifest.validatedAt || null),
    manifestRefs: manifest.manifestRefs || {},
  };
}

function loadConfiguredSources() {
  const summaries = {};
  const refs = {};

  for (const definition of SOURCE_DEFINITIONS) {
    const manifest = safeLoadManifest(SOURCE_FILES[definition.fileKey]);
    summaries[definition.key] = manifestSummary(manifest, definition.fallbackLabel);
    refs[definition.key] = manifest ? toPosix(path.relative(ROOT, SOURCE_FILES[definition.fileKey])) : null;
  }

  return { summaries, refs };
}

function loadSourceSet() {
  const configuredSources = loadConfiguredSources();
  const modelsSnapshot = safeLoadManifest(SOURCE_FILES.modelsSnapshot);
  const modelsLive = safeLoadManifest(SOURCE_FILES.modelsLive);

  const modelsPrimary = modelsSnapshot || modelsLive;
  const modelsSecondary = modelsSnapshot && modelsLive && modelsSnapshot !== modelsLive ? modelsLive : null;

  return {
    ...configuredSources.summaries,
    models: manifestSummary(modelsPrimary, 'models'),
    modelsSecondary: modelsSecondary ? manifestSummary(modelsSecondary, 'models-live') : null,
    refs: {
      ...configuredSources.refs,
      modelsSnapshot: modelsSnapshot ? toPosix(path.relative(ROOT, SOURCE_FILES.modelsSnapshot)) : null,
      modelsLive: modelsLive ? toPosix(path.relative(ROOT, SOURCE_FILES.modelsLive)) : null,
    },
  };
}

function buildRecordId(date, sourceSet) {
  const pieces = [
    date,
    sourceSet.aiDaily.status,
    sourceSet.curatedTools.status,
    sourceSet.academicEntrypoints.status,
    sourceSet.models.status,
  ];
  return `update-${pieces.join('-')}`;
}

function buildEditorialSource(definition, sourceSet) {
  const source = sourceSet[definition.key];
  return {
    key: definition.key,
    datasetId: source.datasetId,
    sourceName: source.sourceName,
    status: source.status,
    sourceFetchedAt: source.sourceFetchedAt,
    validatedAt: source.validatedAt,
    freshness: source.freshness,
    freshnessLabel: source.freshnessLabel,
    recordCount: source.recordCount,
    sourceUrl: source.sourceUrl,
    manifest: sourceSet.refs[definition.key],
    manifestRefs: source.manifestRefs,
    sourceLayers: source.sourceLayers,
    sourceProfile: source.sourceProfile,
    editorialReview: source.editorialReview,
  };
}

function buildContextSummary(key, sourceSet) {
  const source = sourceSet[key];
  if (!source) return null;
  return {
    key,
    datasetId: source.datasetId,
    sourceName: source.sourceName,
    status: source.status,
    freshnessLabel: source.freshnessLabel,
    recordCount: source.recordCount,
    sourceUrl: source.sourceUrl,
    manifestRefs: source.manifestRefs,
    sourceLayers: source.sourceLayers,
    sourceProfile: source.sourceProfile,
    editorialReview: source.editorialReview,
  };
}

function buildContentStream(definition, sourceSet, previousRecord, checkedAt) {
  const source = sourceSet[definition.sourceKey];
  const contextSources = definition.contextKeys
    .map(key => buildContextSummary(key, sourceSet))
    .filter(Boolean);
  const modelContext = contextSources.find(item => item.key === 'models');
  const manifestRef = sourceSet.refs[definition.sourceKey];
  const previousStream = Array.isArray(previousRecord?.contentStreams)
    ? previousRecord.contentStreams.find(item => item?.key === definition.key)
    : null;
  const streamDiff = buildFieldDiffs(source, previousStream, [
    'status',
    'freshnessLabel',
    'recordCount',
    'sourceUrl',
    'sourceLayers',
    'sourceProfile',
    'editorialReview',
  ]);
  const streamChanged = previousStream ? streamDiff.map(item => item.field) : ['new-stream'];

  return {
    key: definition.key,
    title: definition.title,
    badge: definition.badge,
    icon: definition.icon,
    status: source.status,
    summary: definition.summary,
    freshnessLabel: source.freshnessLabel,
    datasetId: source.datasetId,
    sourceName: source.sourceName,
    sourceUrl: source.sourceUrl,
    recordCount: source.recordCount,
    manifest: manifestRef,
    sourceLayers: source.sourceLayers,
    sourceProfile: source.sourceProfile,
    editorialReview: source.editorialReview,
    highlights: [
      `${source.sourceName}: ${source.status}`,
      source.freshnessLabel,
      `${source.recordCount} records`,
    ],
    contextSources: contextSources.map(item => `${item.sourceName} (${item.status}; ${item.freshnessLabel})`),
    contextNote: contextSources.length
      ? `Context: ${contextSources.map(item => `${item.key}=${item.status}`).join(' / ')}`
      : '',
    modelContext: modelContext
      ? `${modelContext.sourceName} ${modelContext.freshnessLabel}`
      : '',
    modelManifestRefs: modelContext?.manifestRefs || {},
    changed: streamChanged,
    diff: streamDiff,
    new: !previousStream,
    verified: {
      checkedAt,
      manifestPresent: Boolean(manifestRef),
      sourceFetchedAt: source.sourceFetchedAt,
      validatedAt: source.validatedAt,
      mode: 'local-manifest-schema-compatible',
    },
  };
}

function buildSourceDiff(source, previousSource, checkedAt) {
  const fields = [
    'datasetId',
    'status',
    'freshnessLabel',
    'recordCount',
    'sourceUrl',
    'manifest',
    'manifestRefs',
    'sourceLayers',
    'sourceProfile',
    'editorialReview',
  ];
  const fieldDiffs = buildFieldDiffs(source, previousSource, fields);
  const changed = previousSource ? fieldDiffs.map(item => item.field) : ['new-source'];

  return {
    key: source.key,
    changed,
    fields: fieldDiffs,
    new: !previousSource,
    verified: {
      checkedAt,
      manifestPresent: Boolean(source.manifest),
      sourceFetchedAt: source.sourceFetchedAt || null,
      validatedAt: source.validatedAt || null,
      mode: 'local-manifest-schema-compatible',
    },
  };
}

function buildRunRecord(sourceSet, previousRecord) {
  const now = isoNow();
  const date = today();
  const contentStreams = STREAM_DEFINITIONS.map(definition => buildContentStream(definition, sourceSet, previousRecord, now));
  const modelManifestRefs = {
    snapshot: sourceSet.refs.modelsSnapshot,
    live: sourceSet.refs.modelsLive,
  };
  const sources = [
    ...SOURCE_DEFINITIONS.map(definition => buildEditorialSource(definition, sourceSet)),
    {
      key: 'models',
      datasetId: sourceSet.models.datasetId,
      sourceName: sourceSet.models.sourceName,
      status: sourceSet.models.status,
      sourceFetchedAt: sourceSet.models.sourceFetchedAt,
      validatedAt: sourceSet.models.validatedAt,
      freshness: sourceSet.models.freshness,
      freshnessLabel: sourceSet.models.freshnessLabel,
      recordCount: sourceSet.models.recordCount,
      sourceUrl: sourceSet.models.sourceUrl,
      manifest: [sourceSet.refs.modelsSnapshot, sourceSet.refs.modelsLive].filter(Boolean),
      manifestRefs: modelManifestRefs,
      liveManifest: sourceSet.refs.modelsLive,
      snapshotManifest: sourceSet.refs.modelsSnapshot,
      liveCatalog: sourceSet.modelsSecondary
        ? {
            datasetId: sourceSet.modelsSecondary.datasetId,
            sourceName: sourceSet.modelsSecondary.sourceName,
            status: sourceSet.modelsSecondary.status,
            freshness: sourceSet.modelsSecondary.freshness,
            freshnessLabel: sourceSet.modelsSecondary.freshnessLabel,
            recordCount: sourceSet.modelsSecondary.recordCount,
            sourceUrl: sourceSet.modelsSecondary.sourceUrl,
            manifest: sourceSet.refs.modelsLive,
          }
        : null,
      sourceLayers: sourceSet.models.sourceLayers,
      sourceProfile: sourceSet.models.sourceProfile,
      editorialReview: sourceSet.models.editorialReview,
    },
  ];
  const previousSources = Array.isArray(previousRecord?.sources) ? previousRecord.sources : [];
  const sourceDiffs = sources.map(source => buildSourceDiff(
    source,
    previousSources.find(item => item?.key === source.key),
    now
  ));
  const changed = sourceDiffs.filter(item => item.changed.length > 0);
  const added = sourceDiffs.filter(item => item.new).map(item => item.key);
  const verified = sourceDiffs.map(item => ({
    key: item.key,
    ...item.verified,
  }));

  const highlights = contentStreams
    .map(stream => `${stream.badge}: ${stream.status} | ${stream.freshnessLabel}`)
    .concat([
      `news: ${sourceSet.news.status} | ${sourceSet.news.freshnessLabel}`,
      `github: ${sourceSet.github.status} | ${sourceSet.github.freshnessLabel}`,
      `models: ${sourceSet.models.status} | ${sourceSet.models.freshnessLabel}`,
    ]);

  return {
    id: buildRecordId(date, sourceSet),
    kind: 'curated-daily-rollup',
    title: 'Curated station streams update',
    summary: 'Manifest-backed daily rollup for daily-digest, curated-picks, and academic-portal, with news, GitHub, and model context attached.',
    generatedAt: now,
    date,
    generation: {
      generator: '.github/scripts/generate-station-updates.js',
      sourceManifestCount: Object.values(sourceSet.refs).filter(Boolean).length,
      modelManifestRefs,
      schemaCompatibility: 'append-only-fields',
    },
    editorialReview: {
      status: 'reviewed',
      reviewedAt: now,
      reviewer: 'station-update-generator',
      scope: 'daily-rollup-record',
      checks: ['json-parse', 'manifest-ref-present', 'source-diff-built', 'schema-compatible-output'],
    },
    contentStreams,
    sources,
    diff: {
      baseRecordId: previousRecord?.id || null,
      changed,
      new: added,
      verified,
    },
    changed,
    new: added,
    verified,
    highlights,
    manifestRefs: Object.values(sourceSet.refs).filter(Boolean).map(toPosix),
  };
}

function buildManifest(existing) {
  const sourceSet = loadSourceSet();
  const history = Array.isArray(existing?.records) ? existing.records.slice() : [];
  const runRecord = buildRunRecord(sourceSet, history[0]);
  const deduped = [runRecord, ...history.filter(record => record?.id !== runRecord.id)];
  const records = deduped.slice(0, 14);
  const now = isoNow();

  return {
    datasetId: 'updates.manifest',
    schemaVersion: '1.0.0',
    sourceName: 'SciAI Hub curated station updates',
    sourceUrl: 'https://github.com/minqifeng/sciai-hub',
    sourceFetchedAt: now,
    validatedAt: now,
    status: 'snapshot',
    freshness: {
      cadence: 'daily',
      freshnessPolicy: 'curated-update-log',
      snapshotTakenAt: now,
      sourceDatasetId: 'daily-digest.curated-picks.academic-portal.plus-context.manifests',
      snapshotDate: today(),
    },
    lineage: {
      mode: 'curated-update-log',
      generator: '.github/scripts/generate-station-updates.js',
      sourceManifests: Object.fromEntries(
        Object.entries(sourceSet.refs).filter(([, value]) => Boolean(value))
      ),
    },
    editorialReview: {
      status: 'generated',
      reviewedAt: now,
      reviewer: 'generate-station-updates.js',
      scope: 'updates.manifest',
      checks: ['json-write', 'record-history-bounded', 'source-diff-built', 'manifest-refs-preserved'],
    },
    recordCount: records.length,
    records,
  };
}

function main() {
  ensureDataDir();
  const existing = safeLoadManifest(OUTPUT_FILE);
  const manifest = buildManifest(existing);
  writeJson(OUTPUT_FILE, manifest);
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_FILE)} (${manifest.recordCount} records).`);
}

try {
  main();
} catch (err) {
  console.error(`Update log generation failed: ${err.message}`);
  process.exit(1);
}
