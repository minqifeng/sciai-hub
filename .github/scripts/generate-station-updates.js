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
};

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

function loadSourceSet() {
  const news = safeLoadManifest(SOURCE_FILES.news);
  const modelsSnapshot = safeLoadManifest(SOURCE_FILES.modelsSnapshot);
  const modelsLive = safeLoadManifest(SOURCE_FILES.modelsLive);
  const github = safeLoadManifest(SOURCE_FILES.github);

  const modelsPrimary = modelsSnapshot || modelsLive;
  const modelsSecondary = modelsSnapshot && modelsLive && modelsSnapshot !== modelsLive ? modelsLive : null;

  return {
    news: manifestSummary(news, 'news'),
    models: manifestSummary(modelsPrimary, 'models'),
    modelsSecondary: modelsSecondary ? manifestSummary(modelsSecondary, 'models-live') : null,
    github: manifestSummary(github, 'github'),
    refs: {
      news: news ? toPosix(path.relative(ROOT, SOURCE_FILES.news)) : null,
      modelsSnapshot: modelsSnapshot ? toPosix(path.relative(ROOT, SOURCE_FILES.modelsSnapshot)) : null,
      modelsLive: modelsLive ? toPosix(path.relative(ROOT, SOURCE_FILES.modelsLive)) : null,
      github: github ? toPosix(path.relative(ROOT, SOURCE_FILES.github)) : null,
    },
  };
}

function buildRecordId(date, sourceSet) {
  const pieces = [
    date,
    sourceSet.news.status,
    sourceSet.models.status,
    sourceSet.github.status,
  ];
  return `update-${pieces.join('-')}`;
}

function buildRunRecord(sourceSet) {
  const now = isoNow();
  const date = today();
  const sources = [
    {
      key: 'news',
      datasetId: sourceSet.news.datasetId,
      sourceName: sourceSet.news.sourceName,
      status: sourceSet.news.status,
      freshness: sourceSet.news.freshness,
      freshnessLabel: sourceSet.news.freshnessLabel,
      recordCount: sourceSet.news.recordCount,
      sourceUrl: sourceSet.news.sourceUrl,
      manifest: SOURCE_FILES.news ? toPosix(path.relative(ROOT, SOURCE_FILES.news)) : null,
    },
    {
      key: 'models',
      datasetId: sourceSet.models.datasetId,
      sourceName: sourceSet.models.sourceName,
      status: sourceSet.models.status,
      freshness: sourceSet.models.freshness,
      freshnessLabel: sourceSet.models.freshnessLabel,
      recordCount: sourceSet.models.recordCount,
      sourceUrl: sourceSet.models.sourceUrl,
      manifest: SOURCE_FILES.modelsSnapshot && SOURCE_FILES.modelsLive
        ? [toPosix(path.relative(ROOT, SOURCE_FILES.modelsSnapshot)), toPosix(path.relative(ROOT, SOURCE_FILES.modelsLive))]
            .filter(Boolean)
        : [sourceSet.refs.modelsSnapshot || sourceSet.refs.modelsLive].filter(Boolean),
    },
    {
      key: 'github',
      datasetId: sourceSet.github.datasetId,
      sourceName: sourceSet.github.sourceName,
      status: sourceSet.github.status,
      freshness: sourceSet.github.freshness,
      freshnessLabel: sourceSet.github.freshnessLabel,
      recordCount: sourceSet.github.recordCount,
      sourceUrl: sourceSet.github.sourceUrl,
      manifest: SOURCE_FILES.github ? toPosix(path.relative(ROOT, SOURCE_FILES.github)) : null,
    },
  ];

  const highlights = [
    `news: ${sourceSet.news.status} · ${sourceSet.news.freshnessLabel}`,
    `models: ${sourceSet.models.status} · ${sourceSet.models.freshnessLabel}`,
    `github: ${sourceSet.github.status} · ${sourceSet.github.freshnessLabel}`,
  ];

  return {
    id: buildRecordId(date, sourceSet),
    kind: 'curated-daily-rollup',
    title: 'Curated station update',
    summary: 'Manifest-backed daily update log for news, models, and GitHub.',
    generatedAt: now,
    date,
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
      sourceDatasetId: 'news.models.github.manifests',
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
