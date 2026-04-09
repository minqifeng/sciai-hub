/**
 * sync-models.js — GitHub Actions 自动同步脚本
 * 每周一从 OpenRouter 公开 API 获取最新模型目录，
 * 更新 js/data.js 中已知模型的 pricing / context / date 字段。
 * 注意：周榜 Token 使用量排名无公开 API，不自动更新。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_FILE = path.join(__dirname, '../../js/data.js');
const TODAY = new Date().toISOString().slice(0, 10);

// ---- 1. Fetch OpenRouter catalog ----
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'sciai-hub-sync/1.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse failed: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

// ---- 2. Build lookup map from catalog ----
function buildCatalogMap(models) {
  const map = {};
  for (const m of models) {
    map[m.id] = m;
    // also index by short id (after last /)
    const short = m.id.split('/').pop();
    if (!map[short]) map[short] = m;
  }
  return map;
}

// ---- 3. Patch MODELS_RANKING array in data.js ----
function patchDataJs(content, catalogMap) {
  let changed = 0;

  // Match each entry in MODELS_RANKING and update fields
  const updated = content.replace(
    /\{ rank: (\d+), liveId: "([^"]+)", name: "([^"]+)", provider: "([^"]+)", type: "([^"]+)", params: "([^"]+)", date: "(\d{4}-\d{2}-\d{2})"(.*?)\}/gs,
    (match, rank, liveId, name, provider, type, params, date, rest) => {
      const catalogEntry = catalogMap[liveId] || catalogMap[liveId.replace(':free', '')];
      if (!catalogEntry) return match; // not found in catalog, leave unchanged

      const ctx = catalogEntry.context_length
        ? formatCtx(catalogEntry.context_length)
        : params;

      // Extract pricing from catalog
      let promptPrice = null, completionPrice = null;
      if (catalogEntry.pricing) {
        promptPrice     = parseFloat(catalogEntry.pricing.prompt)     * 1e6 || null;
        completionPrice = parseFloat(catalogEntry.pricing.completion) * 1e6 || null;
      }

      // Only update if something actually changed
      const newParams = ctx !== params ? ctx : params;
      const newDate   = TODAY;

      if (newParams === params && newDate === date) return match;

      changed++;
      return match
        .replace(`date: "${date}"`, `date: "${newDate}"`)
        .replace(`params: "${params}"`, `params: "${newParams}"`);
    }
  );

  // Also update the SNAPSHOT_DATE comment line for api.js (not done here — separate)
  console.log(`Patched ${changed} model entries.`);
  return updated;
}

function formatCtx(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M ctx`;
  if (n >= 1e3) return `${Math.round(n / 1000)}K ctx`;
  return `${n} ctx`;
}

// ---- 4. Update SNAPSHOT_DATE in api.js ----
function updateSnapshotDate(apiFile) {
  const content = fs.readFileSync(apiFile, 'utf8');
  const updated = content.replace(
    /const SNAPSHOT_DATE = '\d{4}-\d{2}-\d{2}'/,
    `const SNAPSHOT_DATE = '${TODAY}'`
  );
  if (updated !== content) {
    fs.writeFileSync(apiFile, updated, 'utf8');
    console.log(`Updated SNAPSHOT_DATE in api.js → ${TODAY}`);
  }
}

// ---- 5. Update currentModelSnapshotDate in app.js ----
function updateAppDate(appFile) {
  const content = fs.readFileSync(appFile, 'utf8');
  const updated = content.replace(
    /let currentModelSnapshotDate = '\d{4}-\d{2}-\d{2}'/,
    `let currentModelSnapshotDate = '${TODAY}'`
  );
  if (updated !== content) {
    fs.writeFileSync(appFile, updated, 'utf8');
    console.log(`Updated currentModelSnapshotDate in app.js → ${TODAY}`);
  }
}

// ---- Main ----
(async () => {
  try {
    console.log('Fetching OpenRouter model catalog...');
    const catalog = await fetchJSON('https://openrouter.ai/api/v1/models');
    const models  = catalog.data || [];
    console.log(`Fetched ${models.length} models from OpenRouter.`);

    const catalogMap = buildCatalogMap(models);

    // Patch data.js
    const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
    const patched     = patchDataJs(dataContent, catalogMap);
    if (patched !== dataContent) {
      fs.writeFileSync(DATA_FILE, patched, 'utf8');
      console.log('data.js updated.');
    } else {
      console.log('data.js unchanged.');
    }

    // Update date fields in api.js and app.js
    updateSnapshotDate(path.join(__dirname, '../../js/api.js'));
    updateAppDate(path.join(__dirname, '../../js/app.js'));

    console.log('Sync complete.');
  } catch (err) {
    console.error('Sync failed:', err.message);
    process.exit(1);
  }
})();
