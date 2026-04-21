/**
 * sync-models.js
 *
 * Daily catalog sync:
 * - Fetch the OpenRouter model catalog.
 * - Write a provenance-rich manifest under data/models.manifest.json.
 *
 * Weekly snapshot:
 * - Freeze the current catalog into data/models.snapshot.manifest.json.
 *
 * This script no longer patches js/app.js or js/api.js. The app can continue
 * using its existing static snapshot until the UI is ready to consume the new
 * data layer.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '../..');
const DATA_DIR = path.join(ROOT, 'data');
const LIVE_MANIFEST_FILE = path.join(DATA_DIR, 'models.manifest.json');
const SNAPSHOT_MANIFEST_FILE = path.join(DATA_DIR, 'models.snapshot.manifest.json');
const SOURCE_URL = 'https://openrouter.ai/api/v1/models';

function isoNow() {
  return new Date().toISOString();
}

function today() {
  return isoNow().slice(0, 10);
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'sciai-hub-sync/1.0' } }, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error(`JSON parse failed: ${err.message}`));
          }
        });
      })
      .on('error', reject);
  });
}

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeModel(model) {
  return {
    id: model.id,
    name: model.name || model.id,
    provider: model.id?.split('/')?.[0] || '',
    contextLength: model.context_length ?? null,
    pricing: model.pricing
      ? {
          prompt: model.pricing.prompt ?? null,
          completion: model.pricing.completion ?? null,
          request: model.pricing.request ?? null,
          image: model.pricing.image ?? null,
        }
      : null,
    architecture: model.architecture ?? null,
    topProvider: model.top_provider ?? null,
    supportedParameters: Array.isArray(model.supported_parameters) ? model.supported_parameters : [],
  };
}

function ensureNonEmptyRecords(records, context) {
  if (!Array.isArray(records)) {
    throw new Error(`${context} did not produce a records array`);
  }
  if (records.length === 0) {
    throw new Error(`${context} produced zero records`);
  }
  return records;
}

function buildManifest({
  datasetId,
  sourceName,
  sourceUrl,
  status,
  freshness,
  records,
  sourceFetchedAt,
  validatedAt,
  lineage,
}) {
  return {
    datasetId,
    schemaVersion: '1.0.0',
    sourceName,
    sourceUrl,
    sourceFetchedAt,
    validatedAt,
    status,
    freshness,
    lineage: lineage || {},
    recordCount: Array.isArray(records) ? records.length : 0,
    records,
  };
}

async function fetchOpenRouterModels() {
  const catalog = await fetchJSON(SOURCE_URL);
  if (!catalog || !Array.isArray(catalog.data)) {
    throw new Error('OpenRouter response missing data array');
  }
  const records = ensureNonEmptyRecords(
    catalog.data.map(normalizeModel).filter(model => model && model.id),
    'OpenRouter catalog fetch'
  );
  return {
    fetchedAt: isoNow(),
    records,
  };
}

async function writeLiveCatalog() {
  const { fetchedAt, records } = await fetchOpenRouterModels();
  const manifest = buildManifest({
    datasetId: 'models.catalog',
    sourceName: 'OpenRouter Model Catalog',
    sourceUrl: SOURCE_URL,
    sourceFetchedAt: fetchedAt,
    validatedAt: isoNow(),
    status: 'live',
    freshness: {
      cadence: 'daily',
      freshnessPolicy: 'live-catalog',
      refreshedAt: fetchedAt,
      snapshotDate: today(),
    },
    lineage: {
      mode: 'catalog-sync',
      generator: '.github/scripts/sync-models.js',
    },
    records,
  });

  writeJson(LIVE_MANIFEST_FILE, manifest);
  console.log(`Wrote ${path.relative(ROOT, LIVE_MANIFEST_FILE)} (${manifest.recordCount} records).`);
  return manifest;
}

async function writeSnapshot() {
  let sourceManifest = null;

  if (fs.existsSync(LIVE_MANIFEST_FILE)) {
    try {
      sourceManifest = readJson(LIVE_MANIFEST_FILE);
    } catch (err) {
      console.warn(`Live manifest could not be parsed, falling back to a fresh fetch: ${err.message}`);
    }
  }

  let records;
  let sourceFetchedAt;

  if (sourceManifest && Array.isArray(sourceManifest.records) && sourceManifest.records.length > 0) {
    records = sourceManifest.records;
    sourceFetchedAt = sourceManifest.sourceFetchedAt || isoNow();
  } else {
    const fetched = await fetchOpenRouterModels();
    records = fetched.records;
    sourceFetchedAt = fetched.fetchedAt;
  }
  ensureNonEmptyRecords(records, 'Snapshot source');

  const snapshotAt = isoNow();
  const manifest = buildManifest({
    datasetId: 'models.snapshot',
    sourceName: 'OpenRouter Weekly Model Snapshot',
    sourceUrl: SOURCE_URL,
    sourceFetchedAt,
    validatedAt: snapshotAt,
    status: 'snapshot',
    freshness: {
      cadence: 'weekly',
      freshnessPolicy: 'frozen-snapshot',
      snapshotTakenAt: snapshotAt,
      sourceDatasetId: 'models.catalog',
      snapshotDate: today(),
    },
    lineage: {
      mode: 'weekly-snapshot',
      sourceManifest: path.relative(ROOT, LIVE_MANIFEST_FILE),
    },
    records,
  });

  writeJson(SNAPSHOT_MANIFEST_FILE, manifest);
  console.log(`Wrote ${path.relative(ROOT, SNAPSHOT_MANIFEST_FILE)} (${manifest.recordCount} records).`);
  return manifest;
}

function parseArgs(argv) {
  return new Set(argv.slice(2));
}

async function main() {
  ensureDataDir();
  const args = parseArgs(process.argv);

  if (args.has('--snapshot')) {
    await writeSnapshot();
    return;
  }

  await writeLiveCatalog();
}

main().catch(err => {
  console.error(`Sync failed: ${err.message}`);
  process.exit(1);
});
