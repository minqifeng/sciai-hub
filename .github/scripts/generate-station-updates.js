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
    freshness: source.freshness,
    freshnessLabel: source.freshnessLabel,
    recordCount: source.recordCount,
    sourceUrl: source.sourceUrl,
    manifest: sourceSet.refs[definition.key],
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
  };
}

function buildContentStream(definition, sourceSet) {
  const source = sourceSet[definition.sourceKey];
  const contextSources = definition.contextKeys
    .map(key => buildContextSummary(key, sourceSet))
    .filter(Boolean);
  const modelContext = contextSources.find(item => item.key === 'models');
  const manifestRef = sourceSet.refs[definition.sourceKey];

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
  };
}

function buildRunRecord(sourceSet) {
  const now = isoNow();
  const date = today();
  const contentStreams = STREAM_DEFINITIONS.map(definition => buildContentStream(definition, sourceSet));
  const sources = [
    ...SOURCE_DEFINITIONS.map(definition => buildEditorialSource(definition, sourceSet)),
    {
      key: 'models',
      datasetId: sourceSet.models.datasetId,
      sourceName: sourceSet.models.sourceName,
      status: sourceSet.models.status,
      freshness: sourceSet.models.freshness,
      freshnessLabel: sourceSet.models.freshnessLabel,
      recordCount: sourceSet.models.recordCount,
      sourceUrl: sourceSet.models.sourceUrl,
      manifest: [sourceSet.refs.modelsSnapshot, sourceSet.refs.modelsLive].filter(Boolean),
    },
  ];

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
    contentStreams,
    sources,
    highlights,
    manifestRefs: Object.values(sourceSet.refs).filter(Boolean).map(toPosix),
  };
}

function buildManifest(existing) {
  const sourceSet = loadSourceSet();
  const runRecord = buildRunRecord(sourceSet);
  const history = Array.isArray(existing?.records) ? existing.records.slice() : [];
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
