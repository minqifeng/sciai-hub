const fs = require('fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function exists(path) {
  return fs.existsSync(path);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(text, values, label) {
  values.forEach(value => {
    assert(text.includes(value), `${label} is missing required token: ${value}`);
  });
}

function readRequired(path) {
  assert(exists(path), `${path} is missing`);
  return read(path);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getScriptTagIndex(html, scriptPath) {
  const scriptPattern = new RegExp(
    `<script\\b[^>]*\\bsrc=["']${escapeRegExp(scriptPath)}(?:\\?[^"']*)?["'][^>]*>`,
    'i'
  );
  const match = html.match(scriptPattern);
  return match ? match.index : -1;
}

function run() {
  const html = read('index.html');
  const homepageScripts = [
    'js/recommend.js',
    'js/station-data.js',
    'js/station-home.js',
    'js/station-interactions.js',
    'js/app.js'
  ];

  const referencedHomepageScripts = homepageScripts.map(scriptPath => ({
    scriptPath,
    index: getScriptTagIndex(html, scriptPath)
  }));

  const recommendScript = referencedHomepageScripts.find(entry => entry.scriptPath === 'js/recommend.js');
  assert(recommendScript.index >= 0, 'index.html is missing required script tag: js/recommend.js');
  assert(exists('js/recommend.js'), 'index.html still loads js/recommend.js but the file is missing');

  referencedHomepageScripts.forEach(({ scriptPath, index }) => {
    assert(index >= 0, `index.html is missing required script tag: ${scriptPath}`);
    assert(exists(scriptPath), `${scriptPath} is missing`);
  });

  assert(
    referencedHomepageScripts.every((entry, i, arr) => i === 0 || entry.index > arr[i - 1].index),
    'Homepage script order must be recommend -> station-data -> station-home -> station-interactions -> app'
  );

  const app = readRequired('js/app.js');
  const stationData = readRequired('js/station-data.js');
  const stationHome = readRequired('js/station-home.js');
  const stationInteractions = readRequired('js/station-interactions.js');
  const recommend = readRequired('js/recommend.js');

  includesAll(html, [
    'id="heroSection"',
    'id="featuredSection"',
    'id="homePlaybooksSection"',
    'id="toolsSection"',
    'id="homeUpdatesSection"',
    '每日 AI+科研日报总结',
    'GitHub 前沿项目观察',
    'dailyDigestBrief',
    'id="newsSection"',
    'id="modelsSection"',
    'id="githubSection"',
    'id="usecasesSection"',
    'js/recommend.js',
    'js/station-data.js',
    'js/station-home.js',
    'js/station-interactions.js'
  ], 'index.html');

  includesAll(app, [
    'getStationDataDeps',
    'getStationHomeDeps',
    'getStationInteractionDeps',
    'function renderGithubRepos',
    'function fetchGithubTrending',
    'window.__SCIAI_STATION_DATA',
    'window._stationAction',
    'window._openStationHomeFocus',
    'window._refreshGithub'
  ], 'js/app.js');

  assert(!app.includes('setInterval(fetchGithubTrending'), 'GitHub recommendations must not poll external APIs in the background');

  includesAll(stationData, [
    'window.SciAIStationData',
    'getToolCatalog',
    'getStationSearchIndex'
  ], 'js/station-data.js');

  includesAll(stationHome, [
    'window.SciAIStationHome',
    'renderDailyDigest',
    'applyCuratedStationCopy'
  ], 'js/station-home.js');

  includesAll(stationInteractions, [
    'window.SciAIStationInteractions',
    'handleStationEntryAction',
    'renderTools',
    'openCompareModal'
  ], 'js/station-interactions.js');

  includesAll(recommend, [
    'getStationIndex',
    'getFallbackStationIndex',
    'window.__SCIAI_STATION_DATA'
  ], 'js/recommend.js');

  const homepageOrder = [
    'id="heroSection"',
    'id="featuredSection"',
    'id="homePlaybooksSection"',
    'id="toolsSection"',
    'id="homeUpdatesSection"'
  ].map(token => html.indexOf(token));

  assert(homepageOrder.every(index => index >= 0), 'One or more homepage blocks are missing');
  assert(homepageOrder.every((index, i, arr) => i === 0 || index > arr[i - 1]), 'Homepage block order no longer matches the curated station flow');

  console.log('Station smoke check passed.');
}

try {
  run();
} catch (error) {
  console.error(`Station smoke check failed: ${error.message}`);
  process.exit(1);
}
