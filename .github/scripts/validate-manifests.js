/**
 * Validate every JSON manifest under data/.
 *
 * Exit non-zero on malformed JSON or missing required provenance fields.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');
const DATA_DIR = path.join(ROOT, 'data');
const REQUIRED_FIELDS = [
  'datasetId',
  'schemaVersion',
  'sourceName',
  'sourceUrl',
  'sourceFetchedAt',
  'validatedAt',
  'status',
  'freshness',
];
const ALLOWED_STATUS = new Set(['live', 'snapshot', 'static', 'seeded', 'draft', 'stale']);
const ISO_TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

function isIsoString(value) {
  return typeof value === 'string' && ISO_TIMESTAMP_RE.test(value);
}

function fail(file, message) {
  throw new Error(`${path.relative(ROOT, file)}: ${message}`);
}

function requireFreshnessString(filePath, freshness, field) {
  if (typeof freshness[field] !== 'string' || !freshness[field].trim()) {
    fail(filePath, `freshness.${field} must be a non-empty string`);
  }
}

function validateManifest(filePath, manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    fail(filePath, 'manifest must be a JSON object');
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in manifest)) fail(filePath, `missing required field "${field}"`);
  }

  for (const field of ['datasetId', 'schemaVersion', 'sourceName', 'sourceUrl', 'status']) {
    if (typeof manifest[field] !== 'string' || !manifest[field].trim()) {
      fail(filePath, `field "${field}" must be a non-empty string`);
    }
  }

  if (!isIsoString(manifest.sourceFetchedAt)) {
    fail(filePath, 'field "sourceFetchedAt" must be an ISO timestamp');
  }

  if (!isIsoString(manifest.validatedAt)) {
    fail(filePath, 'field "validatedAt" must be an ISO timestamp');
  }

  if (!ALLOWED_STATUS.has(manifest.status)) {
    fail(filePath, `field "status" must be one of: ${Array.from(ALLOWED_STATUS).join(', ')}`);
  }

  if (!manifest.freshness || typeof manifest.freshness !== 'object' || Array.isArray(manifest.freshness)) {
    fail(filePath, 'field "freshness" must be an object');
  }
  const freshness = manifest.freshness;
  requireFreshnessString(filePath, freshness, 'cadence');
  requireFreshnessString(filePath, freshness, 'freshnessPolicy');
  requireFreshnessString(filePath, freshness, 'snapshotDate');

  if (manifest.status === 'live') {
    if (!isIsoString(freshness.refreshedAt)) {
      fail(filePath, 'freshness.refreshedAt must be an ISO timestamp for live manifests');
    }
  }

  if (manifest.status === 'snapshot') {
    if (!isIsoString(freshness.snapshotTakenAt)) {
      fail(filePath, 'freshness.snapshotTakenAt must be an ISO timestamp for snapshot manifests');
    }
    requireFreshnessString(filePath, freshness, 'sourceDatasetId');
  }

  if ('recordCount' in manifest && (!Number.isInteger(manifest.recordCount) || manifest.recordCount < 0)) {
    fail(filePath, 'field "recordCount" must be a non-negative integer when present');
  }

  if ('records' in manifest && !Array.isArray(manifest.records)) {
    fail(filePath, 'field "records" must be an array when present');
  }

  if (Array.isArray(manifest.records) && 'recordCount' in manifest && manifest.recordCount !== manifest.records.length) {
    fail(filePath, 'field "recordCount" must match the number of records');
  }
}

function main() {
  if (!fs.existsSync(DATA_DIR)) {
    throw new Error('data/ directory does not exist');
  }

  const manifestFiles = fs
    .readdirSync(DATA_DIR)
    .filter(name => name.endsWith('.manifest.json'))
    .sort();

  if (manifestFiles.length === 0) {
    throw new Error('no manifest files found under data/');
  }

  for (const name of manifestFiles) {
    const filePath = path.join(DATA_DIR, name);
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      fail(filePath, `invalid JSON: ${err.message}`);
    }

    validateManifest(filePath, manifest);
  }

  console.log(`Validated ${manifestFiles.length} manifest file(s).`);
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
