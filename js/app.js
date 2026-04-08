// ============================================
// SciAI Hub - 应用逻辑 v3
// ============================================
(function () {
    'use strict';
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    // ---- DOM ----
    const sidebar         = $('#sidebar');
    const mainContent     = $('#mainContent');
    const mobileMenuBtn   = $('#mobileMenuBtn');
    const sidebarBackdrop = $('#sidebarBackdrop');
    const globalSearch    = $('#globalSearch');
    const heroSearch      = $('#heroSearch');
    const heroSearchBtn   = $('#heroSearchBtn');
    const themeToggle     = $('#themeToggle');
    const loginBtn        = $('#loginBtn');
    const loginModal      = $('#loginModal');
    const modalClose      = $('#modalClose');
    const toolsGrid       = $('#toolsGrid');
    const promptsGrid     = $('#promptsGrid');
    const tutorialsGrid   = $('#tutorialsGrid');
    const newsList        = $('#newsList');
    const featuredGrid    = $('#featuredGrid');
    const pageTitle       = $('#pageTitle');
    const sortSelect      = $('#sortSelect');
    const backToTop       = $('#backToTop');
    const emptyState      = $('#emptyState');
    const toolModal       = $('#toolModal');
    const toolModalClose  = $('#toolModalClose');
    const favCount        = $('#favCount');
    const compareToggle   = $('#compareToggle');
    const compareBar      = $('#compareBar');
    const compareSlots    = $('#compareSlots');
    const doCompare       = $('#doCompare');
    const clearCompare    = $('#clearCompare');
    const compareModal    = $('#compareModal');
    const compareModalClose = $('#compareModalClose');
    const resourcesModal  = $('#resourcesModal');
    const resourcesModalClose = $('#resourcesModalClose');

    const sections = {
        hero:         $('#heroSection'),
        featured:     $('#featuredSection'),
        tools:        $('#toolsSection'),
        stats:        $('#statsSection'),
        statMethods:  $('#statMethodsSection'),
        prompts:      $('#promptsSection'),
        tutorials:    $('#tutorialsSection'),
        news:         $('#newsSection'),
        models:       $('#modelsSection'),
        github:       $('#githubSection'),
        usecases:     $('#usecasesSection'),
        graph:        $('#graphSection'),
        searchPapers: $('#searchPapersSection'),
        journal:      $('#journalSection'),
        citeCheck:    $('#citeCheckSection'),
        paperdeck:    $('#paperdeckSection'),
    };

    // ---- 新增 DOM refs ----
    const sidebarPinBtn   = $('#sidebarPinBtn');
    const sidebarToggle   = $('#sidebarToggle');
    const shortcutsModal  = $('#shortcutsModal');
    const suggestModal    = $('#suggestModal');
    const exportFavsBtn   = $('#exportFavsBtn');
    const shortcutHelpBtn = $('#shortcutHelpBtn');

    // ---- 状态 ----
    let currentCategory  = 'all';
    let currentPricing   = 'all';
    let currentSort      = 'default';
    let currentToolId    = null;
    let currentModelFilter = 'all';
    let currentModelSort   = 'rank';
    let currentModelLens   = 'overview';
    let currentModelsData  = [...(MODELS_RANKING || [])];
    let currentModelSnapshotDate = '2026-03-31';
    let currentModelLiveUpdatedAt = null;
    let currentModelCatalogCount = 0;
    let currentModelSnapshotTopCount = Array.isArray(MODELS_RANKING) ? MODELS_RANKING.length : 0;
    let currentArxivUpdatedAt = null;
    let currentNewsUpdatedAt = null;
    let currentNewsFilter = '全部';
    let currentNewsTab = 'static';
    let currentNewsData = Array.isArray(NEWS_DATA) ? [...NEWS_DATA] : [];
    let newsRefreshInFlight = null;
    let hasRequestedLiveNews = false;
    let modelsRefreshInFlight = null;
    let hasRequestedLiveModelRefresh = false;
    let favorites        = loadLS('sciai-favs', []);
    let recentlyViewed   = loadLS('sciai-recent', []);
    let compareList      = [];   // max 3 ids
    let userLikes        = loadLS('sciai-likes', {});
    let sidebarDrawerOpen = false;
    let sidebarPinned     = loadLS('sciai-sidebar-pinned', false);

    // ---- LS 工具 ----
    function loadLS(key, def) {
        try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); }
        catch { return def; }
    }
    function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

    const LIVE_NEWS_FEEDS = [
        { label: 'Planet AI',       url: 'https://planet-ai.net/rss.xml' },
        { label: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' },
        { label: 'VentureBeat AI',  url: 'https://venturebeat.com/category/ai/feed/' },
        { label: 'The Verge AI',    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml' },
        { label: 'TechCrunch AI',   url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
    ];

    // CORS proxy fallback chain
    const CORS_PROXIES = [
        u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
        u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
        u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
    ];

    // GitHub cache config
    const GITHUB_CACHE_KEY     = 'sciai-github-trending';
    const GITHUB_CACHE_TTL     = 2 * 60 * 60 * 1000; // 2h

    const TOOL_TAB_CATS = new Set([
        'all', 'hot', 'new', 'favorites', 'recent',
        'writing', 'reading', 'data', 'figure', 'code',
        'experiment', 'llm', 'image-ai', 'voice', 'video',
        'aisoft', 'agents', 'cli'
    ]);

    function syncToolTabsVisibility(cat) {
        const tabsContainer = $('#toolsCategoryTabs');
        if (!tabsContainer) return;
        const visible = TOOL_TAB_CATS.has(cat);
        tabsContainer.style.display = visible ? 'block' : 'none';
        document.body.classList.toggle('tool-tabs-visible', visible);
    }

    // ---- 收藏 ----
    function isFav(id)    { return favorites.includes(id); }
    function toggleFav(id) {
        favorites = isFav(id) ? favorites.filter(f => f !== id) : [...favorites, id];
        saveLS('sciai-favs', favorites);
        updateFavBadge();
        syncFavUI(id);
        showToast(isFav(id) ? '已加入收藏 ❤' : '取消收藏');
    }
    function syncFavUI(id) {
        $$('.card-fav-btn').forEach(b => { if (+b.dataset.id === id) b.classList.toggle('active', isFav(id)); });
        if (currentToolId === id) updateModalFavUI(id);
    }
    function updateFavBadge() {
        if (!favCount) return;
        favCount.textContent = favorites.length;
        favCount.style.display = favorites.length ? '' : 'none';
    }

    // ---- 最近浏览 ----
    function addRecent(id) {
        recentlyViewed = [id, ...recentlyViewed.filter(r => r !== id)].slice(0, 12);
        saveLS('sciai-recent', recentlyViewed);
    }

    // ---- 对比 ----
    function isInCompare(id) { return compareList.includes(id); }
    function toggleCompare(id) {
        if (isInCompare(id)) {
            compareList = compareList.filter(c => c !== id);
        } else {
            if (compareList.length >= 3) { showToast('对比已满3个工具'); return; }
            compareList.push(id);
        }
        updateCompareBar();
        syncCompareUI(id);
    }
    function updateCompareBar() {
        const n = compareList.length;
        compareToggle.style.display = n ? 'flex' : 'none';
        $('#compareCount').textContent = n;
        compareBar.classList.toggle('show', n > 0);
        doCompare.disabled = n < 2;

        compareSlots.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'compare-slot' + (compareList[i] ? ' filled' : '');
            if (compareList[i]) {
                const t = TOOLS_DATA.find(t => t.id === compareList[i]);
                slot.innerHTML = `<span class="compare-slot-name">${t ? t.name : ''}</span>
                    <button class="compare-slot-remove" onclick="window._removeCompare(${compareList[i]})">×</button>`;
            } else {
                slot.innerHTML = `<span style="font-size:11px;color:var(--text-muted)">+ 添加工具</span>`;
            }
            compareSlots.appendChild(slot);
        }
    }
    function syncCompareUI(id) {
        $$('.card-compare-cb').forEach(b => { if (+b.dataset.id === id) b.classList.toggle('active', isInCompare(id)); });
        if (currentToolId === id) updateModalCompareUI(id);
    }
    window._removeCompare = function(id) { compareList = compareList.filter(c => c !== id); updateCompareBar(); syncCompareUI(id); };

    function openCompareModal() {
        const tools = compareList.map(id => TOOLS_DATA.find(t => t.id === id)).filter(Boolean);
        if (tools.length < 2) return;

        const rows = [
            ['描述', t => `<td>${t.desc}</td>`],
            ['评分', t => `<td><span class="compare-stars">${'★'.repeat(Math.floor(t.rating))}${'☆'.repeat(5 - Math.floor(t.rating))}</span> ${t.rating}</td>`],
            ['用户量', t => `<td>${t.users}</td>`],
            ['价格', t => `<td><span class="pricing-badge ${t.pricing}">${{free:'免费',freemium:'免费增值',paid:'付费'}[t.pricing]}</span></td>`],
            ['地区', t => `<td>${t.region === 'domestic' ? '中国地区' : '海外'}</td>`],
            ['标签', t => `<td>${t.tags.join(', ')}</td>`],
            ['官网', t => `<td><a href="${t.url}" target="_blank" style="color:var(--primary);text-decoration:none">访问 ↗</a></td>`],
        ];

        const headerCells = tools.map(t => `
            <th>
                <div class="compare-tool-header">
                    <div class="compare-tool-icon" style="background:${t.color}">
                        ${t.logo ? `<img src="${t.logo}" alt="${t.name}">` : `<i class="${t.icon}"></i>`}
                    </div>
                    <span>${t.name}</span>
                </div>
            </th>`).join('');

        const bodyRows = rows.map(([label, fn]) => `
            <tr>
                <td>${label}</td>
                ${tools.map(fn).join('')}
            </tr>`).join('');

        $('#compareModalBody').innerHTML = `
            <table class="compare-table">
                <thead><tr><th>对比项</th>${headerCells}</tr></thead>
                <tbody>${bodyRows}</tbody>
            </table>`;
        compareModal.classList.add('show');
    }

    // ---- 渲染 GitHub 推荐（静态备用）----
    function renderGithubRepos() {
        const grid = $('#githubGrid');
        if (!grid) return;
        grid.innerHTML = GITHUB_REPOS.map(r => 
            `<a class="github-card" href="${r.url}" target="_blank" rel="noopener">
                <div class="github-card-header">
                    <i class="fab fa-github github-card-icon"></i>
                    <div class="github-card-meta">
                        <span class="github-owner">${r.owner}</span>
                        <span class="github-name">/ ${r.name}</span>
                    </div>
                    <span class="github-stars"><i class="fas fa-star"></i> ${r.stars}</span>
                </div>
                <p class="github-desc">${r.desc}</p>
                <div class="github-footer">
                    <span class="github-lang"><span class="lang-dot" style="background:${r.langColor}"></span>${r.lang}</span>
                    <div class="github-topics">${r.topics.map(t => `<span class="github-topic">${t}</span>`).join('')}</div>
                </div>
            </a>`).join('');
    }

    function renderGithubItems(grid, items, timeEl, timeLabel) {
        const langColors = { Python:'#3572A5', JavaScript:'#f1e05a', TypeScript:'#2b7489', Rust:'#dea584', Go:'#00ADD8', 'C++':'#f34b7d', Java:'#b07219', Shell:'#89e051' };
        grid.innerHTML = items.map(r => {
            const stars = r.stargazers_count >= 1000 ? (r.stargazers_count / 1000).toFixed(1) + 'k' : r.stargazers_count;
            const langColor = langColors[r.language] || '#8b949e';
            const topics = (r.topics || []).slice(0, 3);
            const owner = r.full_name.split('/')[0];
            const desc = (r.description || '\u6682\u65e0\u63cf\u8ff0').slice(0, 80);
            return `<a class="github-card" href="${r.html_url}" target="_blank" rel="noopener">
                <div class="github-card-header">
                    <i class="fab fa-github github-card-icon"></i>
                    <div class="github-card-meta">
                        <span class="github-owner">${owner}</span>
                        <span class="github-name">/ ${r.name}</span>
                    </div>
                    <span class="github-stars"><i class="fas fa-star"></i> ${stars}</span>
                </div>
                <p class="github-desc">${desc}</p>
                <div class="github-footer">
                    <span class="github-lang"><span class="lang-dot" style="background:${langColor}"></span>${r.language || 'N/A'}</span>
                    <div class="github-topics">${topics.map(t => `<span class="github-topic">${t}</span>`).join('')}</div>
                </div>
            </a>`;
        }).join('');
        if (timeEl) timeEl.textContent = timeLabel;
    }

    function fetchGithubTrending(force = false) {
        const grid = $('#githubGrid');
        const timeEl = $('#githubUpdateTime');
        if (!grid) return;

        if (!force) {
            try {
                const cached = JSON.parse(localStorage.getItem(GITHUB_CACHE_KEY) || 'null');
                if (cached && cached.ts && (Date.now() - cached.ts) < GITHUB_CACHE_TTL && cached.items?.length) {
                    renderGithubItems(grid, cached.items, timeEl, `\u7f13\u5b58\u6570\u636e \u00b7 ${cached.items.length} \u4e2a\u9879\u76ee \u00b7 \u66f4\u65b0\u4e8e ${new Date(cached.ts).toLocaleTimeString('zh-CN', { hour:'2-digit', minute:'2-digit' })}`);
                    return;
                }
            } catch (e) {}
        }

        grid.innerHTML = '<div class="arxiv-loading"><i class="fas fa-spinner fa-spin"></i> \u6b63\u5728\u62c9\u53d6 GitHub \u5b9e\u65f6\u9ad8\u661f\u9879\u76ee...</div>';
        const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const url = `https://api.github.com/search/repositories?q=(topic:llm+OR+topic:ai+OR+topic:machine-learning+OR+topic:deep-learning)+pushed:>${since}+stars:>200&sort=stars&order=desc&per_page=50`;
        fetch(url, { headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } })
            .then(r => { if (!r.ok) throw new Error('api error ' + r.status); return r.json(); })
            .then(data => {
                const items = data.items || [];
                if (!items.length) throw new Error('empty');
                try { localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify({ ts: Date.now(), items })); } catch (e) {}
                renderGithubItems(grid, items, timeEl, `\u5df2\u540c\u6b65 ${items.length} \u4e2a\u9879\u76ee \u00b7 \u6570\u636e\u7a97\u53e3 ${since} \u81f3\u4eca \u00b7 \u66f4\u65b0\u4e8e ${formatModelRefreshTime(new Date().toISOString())}`);
            })
            .catch(() => {
                renderGithubRepos();
                if (timeEl) timeEl.textContent = `API \u9650\u6d41\uff0c\u5f53\u524d\u663e\u793a\u672c\u5730\u7cbe\u9009 ${GITHUB_REPOS.length} \u4e2a\u9879\u76ee`;
            });
    }
    window._refreshGithub = fetchGithubTrending;

    function renderFrontierItems(container, items) {
        if (!items.length) {
            container.innerHTML = '<div class="rec-empty">\u6682\u65e0\u6570\u636e</div>';
            return;
        }
        container.innerHTML = items.map(r => {
            const stars = r.stargazers_count >= 1000 ? (r.stargazers_count / 1000).toFixed(1) + 'k' : r.stargazers_count;
            const desc = (r.description || '\u6682\u65e0\u63cf\u8ff0').slice(0, 55);
            return `<a class="frontier-rising-card" href="${r.html_url}" target="_blank" rel="noopener">
                <div class="frontier-rising-name">${r.full_name}</div>
                <div class="frontier-rising-desc">${desc}</div>
                <div class="frontier-rising-footer">
                    <span class="frontier-rising-stars"><i class="fas fa-star"></i> ${stars}</span>
                    <span class="frontier-rising-gain">\u672c\u5468\u6d3b\u8dc3</span>
                </div>
            </a>`;
        }).join('');
    }

    function fetchFrontierRising(topic) {
        const container = $('#frontierRising');
        if (!container) return;

        const cacheKey = `sciai-frontier-${topic || 'all'}`;
        const cached = (() => {
            try {
                const c = JSON.parse(localStorage.getItem(cacheKey) || 'null');
                return c && (Date.now() - c.ts) < 3600000 ? c.items : null;
            } catch (e) {
                return null;
            }
        })();
        if (cached) {
            renderFrontierItems(container, cached);
            return;
        }

        container.innerHTML = '<div class="arxiv-loading"><i class="fas fa-spinner fa-spin"></i> \u52a0\u8f7d\u4e2d...</div>';
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        let topicQ = topic && topic !== 'all' ? `topic:${topic}+` : '(topic:llm+OR+topic:agent+OR+topic:rag+OR+topic:diffusion+OR+topic:multimodal)+';
        const url = `https://api.github.com/search/repositories?q=${topicQ}pushed:>${since}+stars:>100&sort=stars&order=desc&per_page=8`;
        fetch(url, { headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } })
            .then(r => { if (!r.ok) throw new Error('api ' + r.status); return r.json(); })
            .then(data => {
                const items = (data.items || []).slice(0, 8);
                try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), items })); } catch (e) {}
                renderFrontierItems(container, items);
            })
            .catch(() => {
                container.innerHTML = '<div class="rec-empty">API 请求失败，请稍后重试</div>';
            });
    }
    window._fetchFrontierRising = fetchFrontierRising;

    // ---- 绑定前沿看点事件 ----
    function bindFrontierEvents() {
        const topicsEl = $('#frontierTopics');
        if (!topicsEl) return;
        topicsEl.addEventListener('click', e => {
            const btn = e.target.closest('.frontier-topic');
            if (!btn) return;
            topicsEl.querySelectorAll('.frontier-topic').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const topic = btn.dataset.topic;
            fetchFrontierRising(topic);
            // Also filter main grid
            const q = topic === 'all' ? '' : topic;
            if (q) {
                const grid = $('#githubGrid');
                const timeEl = $('#githubUpdateTime');
                if (grid) {
                    // Check topic-specific cache first (1h TTL)
                    const topicCacheKey = `sciai-github-topic-${q}`;
                    try {
                        const cached = JSON.parse(localStorage.getItem(topicCacheKey) || 'null');
                        if (cached && cached.ts && (Date.now() - cached.ts) < 3600000 && cached.items?.length) {
                            renderGithubItems(grid, cached.items, timeEl, `话题 #${q} · 缓存 ${cached.items.length} 个项目`);
                            return;
                        }
                    } catch(e) {}

                    const url = `https://api.github.com/search/repositories?q=topic:${q}+stars:>500&sort=stars&order=desc&per_page=20`;
                    grid.innerHTML = '<div class="arxiv-loading"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';
                    fetch(url, { headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } })
                        .then(r => r.json())
                        .then(data => {
                            const items = data.items || [];
                            if (!items.length) { grid.innerHTML = '<div class="rec-empty">暂无数据</div>'; return; }
                            try { localStorage.setItem(topicCacheKey, JSON.stringify({ ts: Date.now(), items })); } catch(e) {}
                            renderGithubItems(grid, items, timeEl, `话题 #${q} · ${items.length} 个项目`);
                        })
                        .catch(() => { grid.innerHTML = '<div class="rec-empty">加载失败，请稍后重试</div>'; });
                }
            } else {
                fetchGithubTrending();
            }
        });
    }
    window._bindFrontierEvents = bindFrontierEvents;

    // ---- 渲染应用示例 ----
    function renderUseCases() {
        const grid = $('#usecasesGrid');
        if (!grid) return;
        grid.innerHTML = USE_CASES_DATA.map(u => `
            <div class="usecase-card">
                <div class="usecase-icon" style="background:${u.color}">
                    <i class="${u.icon}"></i>
                </div>
                <div class="usecase-body">
                    <div class="usecase-meta">
                        <span class="usecase-scenario">${u.scenario}</span>
                        <span class="usecase-impact">${u.impact}</span>
                    </div>
                    <h4>${u.title}</h4>
                    <p>${u.desc}</p>
                    <div class="usecase-tools">${u.tools.map(t => `<span class="usecase-tool">${t}</span>`).join('')}</div>
                </div>
                <a class="usecase-link" href="${u.link}" target="_blank" rel="noopener">
                    查看详情 <i class="fas fa-arrow-right"></i>
                </a>
            </div>`).join('');
    }

    // ---- arXiv 实时资讯 ----
    function fetchArxivLatest() {
        const container = $('#arxivList');
        if (!container) return;
        container.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
                <span class="section-sub" id="arxivUpdateTime">正在同步 arXiv 最新论文..</span>
                <button class="arxiv-retry-btn" type="button" onclick="window.fetchArxivLatest && window.fetchArxivLatest()"><i class="fas fa-sync-alt"></i> 刷新</button>
            </div>
            <div id="arxivFeedBody">
                <div class="arxiv-loading"><i class="fas fa-spinner fa-spin"></i> 正在加载 arXiv 最新论文..</div>
            </div>`;
        fetch('https://export.arxiv.org/api/query?search_query=(cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL)&sortBy=submittedDate&sortOrder=descending&max_results=6')
            .then(r => r.text())
            .then(xml => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, 'application/xml');
                const entries = [...doc.querySelectorAll('entry')].slice(0, 6);
                if (!entries.length) throw new Error('no entries');
                const feedBody = $('#arxivFeedBody');
                const newestPublished = entries[0]?.querySelector('published')?.textContent?.slice(0, 10) || '';
                currentArxivUpdatedAt = new Date().toISOString();
                if (feedBody) {
                    feedBody.innerHTML = entries.map(e => {
                        const title   = e.querySelector('title')?.textContent?.trim().replace(/\s+/g,' ') || '';
                        const summary = e.querySelector('summary')?.textContent?.trim().slice(0, 120) + '...' || '';
                        const link    = e.querySelector('id')?.textContent?.trim() || '#';
                        const authors = [...e.querySelectorAll('author name')].slice(0,3).map(a => a.textContent).join(', ');
                        const published = e.querySelector('published')?.textContent?.slice(0,10) || '';
                        return `<a class="arxiv-item" href="${link}" target="_blank" rel="noopener">
                            <div class="arxiv-item-header">
                                <span class="arxiv-badge">arXiv</span>
                                <span class="arxiv-date">${published}</span>
                            </div>
                            <h4>${title}</h4>
                            <p>${summary}</p>
                            <span class="arxiv-authors"><i class="fas fa-user-friends"></i> ${authors}</span>
                        </a>`;
                    }).join('');
                }
                const timeEl = $('#arxivUpdateTime');
                if (timeEl) {
                    timeEl.textContent = `已同步 6 篇最新论文· 论文日期截至 ${newestPublished || '未知'} · 更新于 ${formatModelRefreshTime(currentArxivUpdatedAt)}`;
                }
            })
            .catch(() => {
                const feedBody = $('#arxivFeedBody');
                const timeEl = $('#arxivUpdateTime');
                if (feedBody) {
                    feedBody.innerHTML = '<div class="arxiv-error"><i class="fas fa-exclamation-circle"></i> 加载失败，请<button onclick="fetchArxivLatest()">重试</button>或访?<a href="https://arxiv.org" target="_blank">arxiv.org</a></div>';
                }
                if (timeEl) {
                    timeEl.textContent = currentArxivUpdatedAt
                        ? `最近一次成功同步于 ${formatModelRefreshTime(currentArxivUpdatedAt)}`
                        : 'arXiv 实时同步失败';
                }
            });
    }
    window.fetchArxivLatest = fetchArxivLatest;

    // ---- 渲染精选 ----
    function renderFeatured() {
        featuredGrid.innerHTML = FEATURED_TOOLS.map(f => {
            const t = TOOLS_DATA.find(tool => tool.id === f.id);
            if (!t) return '';
            return `
            <div class="featured-card" style="--card-color:${t.color}" onclick="window._openTool(${t.id})">
                <div class="featured-icon" style="background:${t.color}">
                    ${t.logo ? `<img src="${t.logo}" alt="${t.name}" onerror="this.style.display='none'">` : `<i class="${t.icon}" style="color:#fff;font-size:18px"></i>`}
                </div>
                <div class="featured-info">
                    <h4>${t.name}</h4>
                    <div class="featured-reason">${f.reason}</div>
                    <div class="featured-rating">${'★'.repeat(Math.floor(t.rating))} ${t.rating}</div>
                </div>
            </div>`;
        }).join('');
    }

    // ---- 渲染工具卡片 ----
    function renderTools(tools) {
        if (!tools.length) { toolsGrid.innerHTML = ''; emptyState.style.display = 'block'; return; }
        emptyState.style.display = 'none';
        toolsGrid.innerHTML = tools.map(tool => `
            <div class="tool-card ${tool.hot ? 'is-hot' : ''}" data-id="${tool.id}">
                <button class="card-fav-btn ${isFav(tool.id) ? 'active' : ''}" data-id="${tool.id}" title="收藏" onclick="event.stopPropagation();window._toggleFav(${tool.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="card-compare-cb ${isInCompare(tool.id) ? 'active' : ''}" data-id="${tool.id}" title="加入对比" onclick="event.stopPropagation();window._toggleCompare(${tool.id})">
                    <i class="fas fa-code-compare"></i>
                </button>
                <div class="tool-card-header">
                    <div class="tool-icon" style="background:${tool.color}">
                        ${tool.logo
                            ? `<img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="icon-fallback" style="display:none"><i class="${tool.icon}"></i></span>`
                            : `<i class="${tool.icon}"></i>`}
                    </div>
                    <div class="tool-card-info">
                        <h4>${tool.name}</h4>
                        <div class="tool-tags">
                            ${tool.tags.map(t => `<span class="tool-tag">${t}</span>`).join('')}
                            ${tool.pricing === 'free'  ? '<span class="tool-tag free">免费</span>' : ''}
                            ${tool.pricing === 'paid'  ? '<span class="tool-tag paid">付费</span>' : ''}
                            ${tool.isNew               ? '<span class="tool-tag new">NEW</span>'   : ''}
                        </div>
                    </div>
                </div>
                <div class="tool-card-desc">${tool.desc}</div>
                <div class="tool-card-footer">
                    <div class="tool-rating">${'<i class="fas fa-star"></i>'.repeat(Math.floor(tool.rating))}<span>${tool.rating}</span></div>
                    <div class="tool-users"><i class="fas fa-user"></i>${tool.users}</div>
                </div>
            </div>`).join('');

        $$('.tool-card').forEach(card => {
            card.addEventListener('click', () => openToolModal(+card.dataset.id));
        });
    }

    // ---- 工具详情弹窗 ----
    function openToolModal(id) {
        const tool = TOOLS_DATA.find(t => t.id === id);
        if (!tool) return;
        currentToolId = id;
        addRecent(id);

        const iconEl = $('#toolModalIcon');
        iconEl.style.background = tool.color;
        iconEl.innerHTML = tool.logo
            ? `<img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none'"><i class="${tool.icon}" style="font-size:22px;color:#fff;display:none"></i>`
            : `<i class="${tool.icon}" style="font-size:22px;color:#fff"></i>`;

        $('#toolModalName').textContent = tool.name;
        $('#toolModalTags').innerHTML = tool.tags.map(t => `<span class="tool-tag">${t}</span>`).join('');
        $('#toolModalDesc').textContent = tool.desc;
        $('#toolModalRating').innerHTML = `${'★'.repeat(Math.floor(tool.rating))} ${tool.rating}`;
        $('#toolModalUsers').textContent = tool.users;
        $('#toolModalPricing').textContent = { free:'免费', freemium:'免费增值', paid:'付费' }[tool.pricing] || tool.pricing;
        $('#toolModalRegion').textContent = tool.region === 'domestic' ? '🇨🇳 国产' : '🌐 海外';
        $('#toolModalUrl').href = tool.url;
        const docBtn = $('#toolModalDoc');
        const docUrl = typeof TOOL_DOCS !== 'undefined' && TOOL_DOCS[id];
        if (docUrl) { docBtn.href = docUrl; docBtn.style.display = 'flex'; }
        else { docBtn.style.display = 'none'; }
        updateModalFavUI(id);
        updateModalCompareUI(id);
        updateModalLikeUI(id);
        renderRelatedTools(tool);
        toolModal.classList.add('show');
    }
    function updateModalFavUI(id) {
        const fav = isFav(id);
        $('#toolModalFavBtn').classList.toggle('active', fav);
        $('#toolModalFavText').textContent = fav ? '已收藏' : '收藏该工具';
        $('#toolModalFav').classList.toggle('active', fav);
    }
    function updateModalCompareUI(id) {
        const inC = isInCompare(id);
        $('#toolModalCompare').classList.toggle('active', inC);
        $('#toolModalCompareText').textContent = inC ? '已加入对比' : '加入对比';
    }
    function closeToolModal() { toolModal.classList.remove('show'); currentToolId = null; }

    // ---- 渲染提示词 ----
    function renderPrompts(prompts) {
        promptsGrid.innerHTML = prompts.map(p => `
            <div class="prompt-card">
                <h4><i class="fas fa-lightbulb"></i>${p.title}</h4>
                <p>${p.content}</p>
                <div class="prompt-card-footer">
                    <span class="prompt-category">${getCategoryLabel(p.category)}</span>
                    <button class="btn-copy" data-content="${encodeURIComponent(p.content)}"><i class="fas fa-copy"></i> 复制</button>
                </div>
            </div>`).join('');

        $$('.btn-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(decodeURIComponent(btn.dataset.content)).then(() => {
                    const orig = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
                    btn.style.color = '#059669';
                    setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1500);
                });
            });
        });
    }

    function renderTutorials(tutorials) {
        tutorialsGrid.innerHTML = tutorials.map(t => `
            <a class="tutorial-card" href="${t.url || '#'}" target="_blank" rel="noopener">
                <div class="tutorial-cover" style="background:${t.cover}"><i class="${t.icon}"></i></div>
                <div class="tutorial-body">
                    <h4>${t.title}</h4><p>${t.desc}</p>
                    <div class="tutorial-meta">
                        <span><i class="fas fa-eye"></i> ${t.views}</span>
                        <span><i class="fas fa-calendar"></i> ${t.date}</span>
                        ${t.url ? '<span class="tutorial-link"><i class="fas fa-external-link-alt"></i> 查看</span>' : ''}
                    </div>
                </div>
            </a>`).join('');
    }

    function slugifyLabel(value = '') {
        return String(value).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');
    }

    function normalizeNewsEventType(item = {}) {
        const raw = String(item.eventType || item.category || '').trim();
        if (!raw) return inferNewsEventType(item.title || '', item.desc || '');
        const aliases = {
            all: '全部',
            '全部': '全部',
            LLM: '模型发布',
            Model: '模型发布',
            model: '模型发布',
            模型: '模型发布',
            产品: '产品更新',
            product: '产品更新',
            launch: '产品更新',
            tool: '产品更新',
            开源: '开源发布',
            open: '开源发布',
            release: '开源发布',
            research: '论文进展',
            paper: '论文进展',
            study: '论文进展',
            论文: '论文进展',
            投资: '投融资合作',
            funding: '投融资合作',
            finance: '投融资合作',
            report: '行业报告',
            行业: '行业报告',
            infra: '基础设施',
            hardware: '基础设施',
            基础设施: '基础设施',
            industry: '行业动态',
            动态: '行业动态'
        };
        const key = aliases[raw] || aliases[raw.toLowerCase()] || raw;
        return key || '行业动态';
    }

    function groupNewsByEvent(news) {
        const order = ['模型发布', '产品更新', '开源发布', '论文进展', '投融资合作', '行业报告', '基础设施', '行业动态'];
        const groups = new Map(order.map(key => [key, []]));
        news.forEach(item => {
            const key = normalizeNewsEventType(item);
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(item);
        });
        return Array.from(groups.entries())
            .map(([key, items]) => ({
                key,
                items: items.sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 30)
            }))
            .filter(group => group.items.length);
    }

    function inferNewsEventType(title = '', desc = '') {
        const text = `${title} ${desc}`.toLowerCase();
        if (/funding|raise|investment|acquire|partnership|融资|投资|合作/.test(text)) return '投融资合作';
        if (/open source|open-source|开源|github|repo|release/.test(text)) return '开源发布';
        if (/paper|arxiv|research|study|论文|研究|benchmark/.test(text)) return '论文进展';
        if (/gpu|chip|infra|inference|data center|硬件|芯片|基础设施/.test(text)) return '基础设施';
        if (/report|survey|index|行业|调研/.test(text)) return '行业报告';
        if (/model|gpt|claude|gemini|llama|deepseek|qwen|mistral|模型/.test(text)) return '模型发布';
        if (/launch|api|app|feature|tool|agent|product|platform|功能|工具|产品/.test(text)) return '产品更新';
        return '行业动态';
    }

    function normalizeFeedDate(value) {
        if (!value) return new Date().toISOString().slice(0, 10);
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
        return date.toISOString().slice(0, 10);
    }

    function extractFeedItems(xmlText, feedLabel) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        const readText = (node, selectors) => {
            for (const selector of selectors) {
                const found = node.querySelector(selector);
                if (found?.textContent?.trim()) return found.textContent.trim();
            }
            return '';
        };
        const readLink = node => {
            const atomLink = node.querySelector('link[href]');
            if (atomLink?.getAttribute('href')) return atomLink.getAttribute('href');
            const rssLink = node.querySelector('link');
            return rssLink?.textContent?.trim() || '';
        };
        const nodes = [...xml.querySelectorAll('item, entry')];
        return nodes.map((node, index) => {
            const title = readText(node, ['title']);
            const desc = readText(node, ['description', 'summary', 'content', 'content\\:encoded']);
            const url = readLink(node);
            const date = normalizeFeedDate(readText(node, ['pubDate', 'published', 'updated']));
            return {
                id: `live-${slugifyLabel(feedLabel)}-${slugifyLabel(title || String(index))}-${date}`,
                title: title || '未命名',
                source: feedLabel,
                date,
                category: '实时',
                desc: desc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180),
                url,
                icon: 'fas fa-newspaper',
                eventType: inferNewsEventType(title, desc)
            };
        }).filter(item => item.title && item.url);
    }

    async function fetchLiveNews(force = false) {
        if (newsRefreshInFlight && !force) return newsRefreshInFlight;
        newsRefreshInFlight = (async () => {
            const requests = LIVE_NEWS_FEEDS.map(async feed => {
                for (const makeUrl of CORS_PROXIES) {
                    try {
                        const res = await fetch(makeUrl(feed.url), { signal: AbortSignal.timeout(8000) });
                        if (!res.ok) continue;
                        const xml = await res.text();
                        const items = extractFeedItems(xml, feed.label);
                        if (items.length) return items;
                    } catch (e) { /* try next proxy */ }
                }
                console.warn('All proxies failed for:', feed.url);
                return [];
            });

            const merged = (await Promise.all(requests)).flat();
            const deduped = [];
            const seen = new Set();
            merged
                .sort((a, b) => String(b.date).localeCompare(String(a.date)))
                .forEach(item => {
                    const key = `${item.url}::${item.title}`;
                    if (seen.has(key)) return;
                    seen.add(key);
                    deduped.push(item);
                });

            if (deduped.length) {
                currentNewsData = deduped;
                currentNewsUpdatedAt = new Date().toISOString();
            } else if (!currentNewsData.length) {
                currentNewsData = Array.isArray(NEWS_DATA) ? [...NEWS_DATA] : [];
                currentNewsUpdatedAt = new Date().toISOString();
            }
            newsRefreshInFlight = null;
            return currentNewsData;
        })();
        return newsRefreshInFlight;
    }

        async function refreshNewsRealtime() {
        const result = await fetchLiveNews(true);
        renderNews(result && result.length ? result : currentNewsData);
        showToast(result && result.length ? '已同步实时 RSS 新闻' : '实时 RSS 暂不可用，已保留本地兜底新闻');
    }
    window.refreshNewsRealtime = refreshNewsRealtime;

    function updateNewsSectionMeta() {
        const el = $('#newsSectionUpdatedAt');
        if (!el) return;
        el.textContent = currentNewsUpdatedAt ? `更新于 ${formatModelRefreshTime(currentNewsUpdatedAt)}` : '';
    }

    function renderNewsSectionNav(allNews) {
        const container = $('#newsSectionNav');
        if (!container) return;
        const all = [...(allNews || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
        const filterOrder = ['全部', '模型发布', '产品更新', '开源发布', '论文进展', '投融资合作', '行业报告', '基础设施', '行业动态'];
        const availableFilters = filterOrder.filter(key => key === '全部' || all.some(item => normalizeNewsEventType(item) === key));
        if (!availableFilters.includes(currentNewsFilter)) currentNewsFilter = '全部';
        const visibleNews = currentNewsFilter === '全部'
            ? all
            : all.filter(item => normalizeNewsEventType(item) === currentNewsFilter);
        const dateJumps = [...new Set(visibleNews.map(item => item.date).filter(Boolean))].slice(0, 8);
        container.innerHTML = `
            <div class="news-section-nav-row">
                <div class="news-section-nav-group">
                    <span class="news-section-nav-label">新闻快讯</span>
                    <div class="news-section-tabs">
                        <button class="news-section-tab ${currentNewsTab === 'static' ? 'active' : ''}" type="button" data-news-tab="static">新闻快讯</button>
                        <button class="news-section-tab ${currentNewsTab === 'arxiv' ? 'active' : ''}" type="button" data-news-tab="arxiv"><i class="fas fa-rss"></i> arXiv 实时 <span class="live-dot"></span></button>
                    </div>
                </div>
                <button class="arxiv-retry-btn news-section-refresh" type="button" onclick="window.refreshNewsRealtime && window.refreshNewsRealtime()"><i class="fas fa-sync-alt"></i> 实时更新</button>
            </div>
            <div class="news-section-nav-group">
                <span class="news-section-nav-label">分类导航</span>
                <div class="news-section-filters">
                    ${availableFilters.map(key => `<button class="news-section-filter ${currentNewsFilter === key ? 'active' : ''}" type="button" data-news-filter="${key}">${key}</button>`).join('')}
                </div>
            </div>
            <div class="news-section-nav-group">
                <span class="news-section-nav-label">日期跳转</span>
                <div class="news-section-jumps">
                    ${dateJumps.map(date => `<button class="news-section-jump" type="button" data-news-jump="news-day-${date}">${date}</button>`).join('') || '<span class="section-sub">暂无可跳转日期</span>'}
                </div>
            </div>`;

        container.querySelectorAll('[data-news-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentNewsTab = btn.dataset.newsTab || 'static';
                if (currentNewsTab === 'arxiv' && $('#arxivList')?.innerHTML === '') fetchArxivLatest();
                renderNews(all);
            });
        });
        container.querySelectorAll('[data-news-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentNewsFilter = btn.dataset.newsFilter || '全部';
                renderNews(all);
            });
        });
        container.querySelectorAll('[data-news-jump]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = document.getElementById(btn.dataset.newsJump || '');
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function renderNews(news) {
        const newsList = $('#newsList');
        if (!newsList) return;
        currentNewsUpdatedAt = currentNewsUpdatedAt || new Date().toISOString();
        const allNews = [...(news || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
        renderNewsSectionNav(allNews);
        updateNewsSectionMeta();
        const filterOrder = ['全部', '模型发布', '产品更新', '开源发布', '论文进展', '投融资合作', '行业报告', '基础设施', '行业动态'];
        if (!filterOrder.includes(currentNewsFilter)) currentNewsFilter = '全部';
        const filteredNews = allNews
            .filter(item => currentNewsFilter === '全部' || normalizeNewsEventType(item) === currentNewsFilter)
            .slice(0, 30);
        const newsByDate = filteredNews.reduce((acc, item) => {
            const key = item.date || '未标注日期';
            if (!acc.has(key)) acc.set(key, []);
            acc.get(key).push(item);
            return acc;
        }, new Map());

        newsList.innerHTML = `
            <div class="news-feed-toolbar">
                <div>
                    <h4 class="news-event-title">具体新闻</h4>
                    <p class="news-event-sub">按日期展示具体新闻，当前仅保留前 30 条，便于快速浏览。</p>
                </div>
                <div class="news-event-toolbar-right">
                    <span class="section-sub">${currentNewsUpdatedAt ? `更新于 ${formatModelRefreshTime(currentNewsUpdatedAt)}` : ''}</span>
                    <span class="news-count-pill">${filteredNews.length} 条</span>
                </div>
            </div>
            <div class="news-feed-shell">
                <div id="staticNewsList" style="display:${currentNewsTab === 'static' ? '' : 'none'};">
                    <div class="news-feed-list">
                        ${Array.from(newsByDate.entries()).map(([date, items]) => `
                            <section class="news-day-block" id="news-day-${date}">
                                <div class="news-day-header">
                                    <strong>${date}</strong>
                                    <span>${items.length} 条快讯</span>
                                </div>
                                <div class="news-event-stream">
                                    ${items.map(n => {
                                        const d = new Date(n.date);
                                        const safeDay = Number.isNaN(d.getDate()) ? '--' : d.getDate();
                                        const safeMonth = Number.isNaN(d.getMonth()) ? '--' : d.getMonth() + 1;
                                        return `<a class="news-event-notice" href="${n.url || '#'}" target="_blank" rel="noopener">
                                            <div class="news-event-date"><span class="day">${safeDay}</span><span class="month">${safeMonth}月</span></div>
                                            <div class="news-event-copy">
                                                <div class="news-event-meta-row">
                                                    <span class="news-tag" style="background:#3b82f618;color:#3b82f6">${normalizeNewsEventType(n)}</span>
                                                    <span class="news-notice-source">${n.source || '行业监测'}</span>
                                                </div>
                                                <h4>${n.title || '未命名新闻'}</h4>
                                                <p>${n.desc || '暂无摘要'}</p>
                                            </div>
                                            <span class="news-notice-arrow"><i class="fas fa-arrow-up-right-from-square"></i></span>
                                        </a>`;
                                    }).join('')}
                                </div>
                            </section>
                        `).join('') || `<div class="models-empty"><i class="fas fa-newspaper"></i><p>当前分类下暂无新闻</p></div>`}
                    </div>
                </div>
                <div id="arxivList" style="display:${currentNewsTab === 'arxiv' ? '' : 'none'};"></div>
            </div>`;

        if (currentNewsTab === 'arxiv' && $('#arxivList').innerHTML === '') fetchArxivLatest();
    }

    function getProviderTheme(provider) {
        const themes = {
            OpenAI: { accent: '#10a37f', soft: 'rgba(16,163,127,0.12)', label: 'OA' },
            Anthropic: { accent: '#d97706', soft: 'rgba(217,119,6,0.12)', label: 'AN' },
            DeepSeek: { accent: '#0f766e', soft: 'rgba(15,118,110,0.12)', label: 'DS' },
            Google: { accent: '#2563eb', soft: 'rgba(37,99,235,0.12)', label: 'GG' },
            Meta: { accent: '#1d4ed8', soft: 'rgba(29,78,216,0.12)', label: 'ME' },
            Mistral: { accent: '#7c3aed', soft: 'rgba(124,58,237,0.12)', label: 'MI' },
            Xiaomi: { accent: '#f97316', soft: 'rgba(249,115,22,0.12)', label: 'XM' },
            StepFun: { accent: '#0ea5e9', soft: 'rgba(14,165,233,0.12)', label: 'SF' },
            MiniMax: { accent: '#7c3aed', soft: 'rgba(124,58,237,0.12)', label: 'MM' },
            'Z.ai': { accent: '#4f46e5', soft: 'rgba(79,70,229,0.12)', label: 'ZA' },
            xAI: { accent: '#111827', soft: 'rgba(17,24,39,0.12)', label: 'xA' },
            '百度': { accent: '#2563eb', soft: 'rgba(37,99,235,0.12)', label: 'BD' },
            '阿里': { accent: '#ea580c', soft: 'rgba(234,88,12,0.12)', label: 'AL' },
            MosaicML: { accent: '#475569', soft: 'rgba(71,85,105,0.12)', label: 'MM' }
        };
        return themes[provider] || { accent: '#4f46e5', soft: 'rgba(79,70,229,0.12)', label: provider.slice(0, 2).toUpperCase() };
    }

    function formatModelPricing(pricing) {
        return ({ free:'免费', paid:'付费', freemium:'免费试用' }[pricing] || pricing);
    }

    function getModelMetric(model, key) {
        return Number(model.benchmark?.[key] || 0);
    }

    function formatModelRefreshTime(value) {
        if (!value) return '';
        return new Date(value).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    function formatPricePerMillion(value) {
        const num = Number(value || 0);
        if (!num) return '免费';
        return `$${num.toFixed(num >= 10 ? 0 : 2)}/M`;
    }

    function parseVolumeLabel(label = '') {
        const match = String(label).trim().match(/^([\d.]+)\s*([KMBT])$/i);
        if (!match) return 0;
        const num = Number(match[1]);
        const unit = match[2].toUpperCase();
        const map = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
        return num * (map[unit] || 1);
    }

    function deriveModelFeedback(model) {
        if (model.arena?.votes) {
            const score = model.arena.score || 0;
            const votes = Number(model.arena.votes || 0);
            const starScore = score >= 1490 ? 5 : score >= 1470 ? 4 : score >= 1440 ? 3 : score >= 1410 ? 2 : 1;
            const label = score >= 1490 ? '真实投票领先超强' : score >= 1470 ? '真实投票表现优秀' : score >= 1440 ? '真实投票表现较好' : '真实投票表现一般';
            const reasons = [
                `Arena 评分 ${score}${model.arena.spread || ''}`,
                `累计 ${votes.toLocaleString()} 票`,
                `快照日期 ${model.arena.snapshotDate}`
            ];
            if (model.arena.exact === false) reasons.push(`对应公开基准模型 ${model.arena.model}`);
            return {
                score: starScore,
                label,
                summary: reasons.join(' · ')
            };
        }

        const usage = parseVolumeLabel(model.weeklyTokens);
        const growth = Number(String(model.weeklyGrowth || '0').replace(/[^\d.-]/g, ''));
        const price = Number(model.promptPricePerM || 0) + Number(model.completionPricePerM || 0);
        let score = 3;
        if (usage >= 1e12) score += 1;
        if (growth >= 30) score += 1;
        if (growth <= 0 && usage < 9e11) score -= 1;
        if (price > 20) score -= 1;
        if (model.pricing === 'free') score += 0.5;
        score = Math.max(1, Math.min(5, Math.round(score)));

        const label = score >= 5 ? '用户满意度很高' : score >= 4 ? '用户评价较好' : score >= 3 ? '表现较好' : '数据偏少';
        const reasons = [];
        if (usage >= 1e12) reasons.push('月使用量处于高位');
        else if (usage >= 8e11) reasons.push('稳定使用规模');
        if (growth >= 30) reasons.push('近期增长明显');
        else if (growth > 0) reasons.push('保持增长');
        if (model.pricing === 'free') reasons.push('免费可用优先');
        else if (price > 20) reasons.push('价格偏高');
        if (model.type === 'Multimodal') reasons.push('多模态支持广泛');
        if (model.type === 'Code-Optimized') reasons.push('代码能力偏强');
        return {
            score,
            label,
            summary: reasons.slice(0, 3).join(' · ') || '当前主要依据官方目录使用信号推导'
        };
    }

    function setModelsRefreshLoading(isLoading) {
        const btn = $('#modelsRefreshBtn');
        if (!btn) return;
        btn.classList.toggle('is-loading', isLoading);
        btn.disabled = isLoading;
        btn.innerHTML = isLoading
            ? '<i class="fas fa-rotate"></i> 刷新中...'
            : '<i class="fas fa-rotate"></i> 实时刷新';
    }

    function syncModelFilterUI() {
        $$('.models-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.modelFilter === currentModelFilter);
        });
        $$('.models-lens-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.modelLens === currentModelLens);
        });
        const sortSelect = $('#modelsSortSelect');
        if (sortSelect) sortSelect.value = currentModelSort;
    }

    function getFilteredModels() {
        let list = [...currentModelsData];
        if (currentModelFilter !== 'all') list = list.filter(model => model.type === currentModelFilter);

        if (currentModelSort === 'elo') list.sort((a, b) => Number(b.elo || 0) - Number(a.elo || 0));
        else if (currentModelSort === 'mmlu') list.sort((a, b) => getModelMetric(b, 'mmlu') - getModelMetric(a, 'mmlu'));
        else if (currentModelSort === 'code') list.sort((a, b) => getModelMetric(b, 'code') - getModelMetric(a, 'code'));
        else list.sort((a, b) => a.rank - b.rank);

        return list;
    }

    function renderModels(models) {
        const grid = $('#modelsGrid');
        const meta = $('#modelsMetaInfo');
        if (!grid) return;

        if (meta) {
            const latestModelDate = (MODELS_RANKING || [])
                .map(model => model.date)
                .filter(Boolean)
                .sort()
                .slice(-1)[0] || '2026-03-31';
            meta.textContent = `\u5171 ${models.length} \u4e2a\u6a21\u578b\u00b7 \u76ee\u5f55\u5b9e\u65f6\u540c\u6b65 \u00b7 \u5468\u699c ${currentModelSnapshotDate} \u00b7 \u5f53\u524d\u89c6\u56fe\uff1a${({ rank:'\u7efc\u5408\u6392\u540d', elo:'ELO', mmlu:'MMLU', code:'\u4ee3\u7801\u52a9\u624b' }[currentModelSort] || '\u7efc\u5408\u6392\u540d')}\u6392\u5e8f`;
        }

        if (!models.length) {
            grid.innerHTML = `<div class="models-empty"><i class="fas fa-layer-group"></i><p>当前筛选条件下没有匹配模型</p></div>`;
            return;
        }

        grid.innerHTML = models.map(model => {
            const theme = getProviderTheme(model.provider);
            const metrics = [
                { key:'mmlu', label:'MMLU' },
                { key:'code', label:'代码' },
                { key:'gsm8k', label:'GSM8K' }
            ];

            return `
                <article class="model-card" style="--model-accent:${theme.accent};--model-soft:${theme.soft};">
                    <div class="model-card-top">
                        <div class="model-rank-badge">#${model.rank}</div>
                        <div class="model-provider-badge">
                            <span class="model-provider-logo">${theme.label}</span>
                            <span>${model.provider}</span>
                        </div>
                    </div>
                    <div class="model-card-name-row">
                        <h3 class="model-card-name">${model.name}${model.hot ? ' <i class="fas fa-fire"></i>' : ''}</h3>
                        <span class="model-chip subtle">${model.params}</span>
                    </div>
                    <div class="model-chip-row">
                        <span class="model-chip strong">${model.type}</span>
                        <span class="model-chip">${formatModelPricing(model.pricing)}</span>
                        <span class="model-chip">Arena ${Number(model.arena_wins || 0).toLocaleString()}</span>
                    </div>
                    <div class="model-metric-primary">
                        <span class="metric-primary-label">ELO</span>
                        <strong>${model.elo}</strong>
                    </div>
                    <div class="model-metrics">
                        ${metrics.map(metric => {
                            const value = getModelMetric(model, metric.key);
                            return `
                                <div class="model-metric-row">
                                    <div class="metric-meta">
                                        <span>${metric.label}</span>
                                        <strong>${value.toFixed(1)}%</strong>
                                    </div>
                                    <div class="metric-bar"><span style="width:${Math.max(6, Math.min(100, value))}%"></span></div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="model-card-footer">
                        <a class="model-action-btn primary" href="${model.url}" target="_blank" rel="noopener noreferrer">查看详情</a>
                        <button class="model-action-btn ghost js-model-compare" type="button" data-model-name="${model.name}">加入对比</button>
                    </div>
                </article>
            `;
        }).join('');

        grid.querySelectorAll('.js-model-compare').forEach(btn => {
            btn.addEventListener('click', () => showToast(`已加入对比候选：${btn.dataset.modelName}`));
        });
    }

    function applyModelFilters() {
        syncModelFilterUI();
        renderModelsRealtimeV2(getFilteredModels());
    }

    async function refreshModelsData(force = false, silent = false) {
        if (modelsRefreshInFlight && !force) return modelsRefreshInFlight;
        if (typeof ModelRankingAPI === 'undefined' || !ModelRankingAPI.getLeaderboard) {
            applyModelFilters();
            return null;
        }

        setModelsRefreshLoading(true);
        modelsRefreshInFlight = (async () => {
            try {
                const payload = await ModelRankingAPI.getLeaderboard(force);
                if (Array.isArray(payload.models) && payload.models.length) currentModelsData = payload.models;
                currentModelSnapshotDate = payload.snapshotDate || currentModelSnapshotDate;
                currentModelLiveUpdatedAt = payload.refreshedAt || new Date().toISOString();
                currentModelCatalogCount = Number(payload.liveCatalogCount || 0);
                currentModelSnapshotTopCount = Number(payload.snapshotTopCount || currentModelSnapshotTopCount || 0);
                applyModelFilters();
                if (!silent) showToast(`已同步 OpenRouter 官方模型目录 (${currentModelCatalogCount || currentModelsData.length} 个模型`);
                return payload;
            } catch (error) {
                console.warn('Model refresh failed:', error);
                applyModelFilters();
                if (!silent) showToast('实时刷新失败，已保留 2026-03-31 周榜快照');
                return null;
            } finally {
                setModelsRefreshLoading(false);
                modelsRefreshInFlight = null;
            }
        })();
        return modelsRefreshInFlight;
    }

    function renderModelsRealtimeV2(models) {
        const grid = $('#modelsGrid');
        const meta = $('#modelsMetaInfo');
        if (!grid) return;

        if (meta) {
            const sortLabel = ({ rank:'综合排名', elo:'ELO', mmlu:'MMLU', code:'代码能力' }[currentModelSort] || '综合排名');
            const lensLabel = ({ overview:'概览', performance:'性能', usage:'使用量', price:'价格', feedback:'用户反馈' }[currentModelLens] || '概览');
            const snapshotLabel = currentModelSnapshotTopCount
                ? `Top ${currentModelSnapshotTopCount} 为周榜快照 ${currentModelSnapshotDate}`
                : `周榜快照 ${currentModelSnapshotDate}`;
            const liveLabel = currentModelLiveUpdatedAt ? ` · 补充目录同步 ${formatModelRefreshTime(currentModelLiveUpdatedAt)}` : '';
            const catalogLabel = currentModelCatalogCount ? ` · 官方目录 ${currentModelCatalogCount} 个模型` : '';
            meta.textContent = `\u5171 ${models.length} \u4e2a\u6a21\u578b\u00b7 \u76ee\u5f55\u5b9e\u65f6\u540c\u6b65 \u00b7 \u5468\u699c ${currentModelSnapshotDate}${liveLabel}${catalogLabel} \u00b7 \u5f53\u524d\u89c6\u56fe\uff1a${sortLabel}\u6392\u5e8f`;
        }

        if (!models.length) {
            grid.innerHTML = `<div class="models-empty"><i class="fas fa-layer-group"></i><p>当前筛选条件下没有匹配模型</p></div>`;
            return;
        }

        grid.innerHTML = models.map(model => {
            const theme = getProviderTheme(model.provider);
            const feedback = deriveModelFeedback(model);
            const metrics = [
                { key:'mmlu', label:'MMLU', value: getModelMetric(model, 'mmlu') },
                { key:'code', label:'代码', value: getModelMetric(model, 'code') },
                { key:'gsm8k', label:'GSM8K', value: getModelMetric(model, 'gsm8k') }
            ].filter(metric => metric.value > 0);
            const primaryLabel = model.weeklyTokens ? '月使用量' : (model.elo ? 'ELO' : '参数量');
            const primaryValue = model.weeklyTokens || model.elo || model.params;
            const growthClass = !model.weeklyGrowth || model.weeklyGrowth === '0%' ? 'flat' : '';
            const growthBadge = model.weeklyGrowth
                ? `<span class="model-growth ${growthClass}">周增 ${model.weeklyGrowth}</span>`
                : `<span class="model-growth flat">${model.date || currentModelSnapshotDate}</span>`;

            const arenaSummary = model.arena ? `
                <div class="model-lens-panel">
                    <div class="model-lens-item"><span>Arena 评分</span><strong>${model.arena.score}${model.arena.spread || ''}</strong></div>
                    <div class="model-lens-item"><span>真实投票</span><strong>${Number(model.arena.votes || 0).toLocaleString()} 票</strong></div>
                    <div class="model-lens-item"><span>基准模型</span><strong>${model.arena.model}${model.arena.exact === false ? ' · 邻近公开版本' : ''}</strong></div>
                    <div class="model-lens-item"><span>快照日期</span><strong>${model.arena.snapshotDate}</strong></div>
                </div>
            ` : '';

            const panels = {
                overview: `
                    <div class="model-live-summary">
                        <div class="model-live-stat"><span>上下文/span><strong>${model.params || '未知'}</strong></div>
                        <div class="model-live-stat"><span>更新日期</span><strong>${model.date || currentModelSnapshotDate}</strong></div>
                        <div class="model-live-stat"><span>输入模态/span><strong>${(model.inputModalities || []).join(' / ') || 'text'}</strong></div>
                        <div class="model-live-stat"><span>输出模态/span><strong>${(model.outputModalities || []).join(' / ') || 'text'}</strong></div>
                    </div>
                `,
                performance: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>上下文长度/span><strong>${model.arena?.context || model.params || '未知'}</strong></div>
                        <div class="model-lens-item"><span>参数量</span><strong>${model.maxCompletionTokens ? `${Math.round(model.maxCompletionTokens / 1000)}K tokens` : '未公布'}</strong></div>
                        <div class="model-lens-item"><span>支持参数</span><strong>${(model.supportedParameters || []).length || 0} 票</strong></div>
                        <div class="model-lens-item"><span>模型摘要</span><strong>${model.arena ? 'Arena ' + model.arena.score + (model.arena.spread || '') + ' / ' + Number(model.arena.votes || 0).toLocaleString() + 'Ʊ' : (metrics.length ? metrics.map(item => item.label + ' ' + item.value.toFixed(1) + '%').join(' / ') : model.type + ' / ' + ((model.inputModalities || []).join('/') || 'text'))}</strong></div>
                    </div>
                    ${arenaSummary}
                `,
                usage: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>月使用量</span><strong>${model.weeklyTokens || '未公布'}</strong></div>
                        <div class="model-lens-item"><span>周增长率</span><strong>${model.weeklyGrowth || '未公布'}</strong></div>
                        <div class="model-lens-item"><span>榜单排名</span><strong>#${model.rank}</strong></div>
                        <div class="model-lens-item"><span>Ծź</span><strong>${model.hot ? '较稳定' : feedback.label}</strong></div>
                    </div>
                `,
                price: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>输入价格</span><strong>${formatPricePerMillion(model.promptPricePerM)}</strong></div>
                        <div class="model-lens-item"><span>输出价格</span><strong>${formatPricePerMillion(model.completionPricePerM)}</strong></div>
                        <div class="model-lens-item"><span>缓存读取</span><strong>${formatPricePerMillion(model.cacheReadPricePerM)}</strong></div>
                        <div class="model-lens-item"><span>价格标签</span><strong>${formatModelPricing(model.pricing)}</strong></div>
                    </div>
                `,
                feedback: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>星级反馈</span><strong>${'★'.repeat(feedback.score)}${'☆'.repeat(5 - feedback.score)}</strong></div>
                        <div class="model-lens-item"><span>判断依据</span><strong>${feedback.label}</strong></div>
                        <div class="model-lens-item"><span>摘要说明</span><strong>${feedback.summary}</strong></div>
                        <div class="model-lens-item"><span>官方来源</span><strong>${model.arena ? 'arena.ai 投票结果 + OpenRouter 官方目录' : 'OpenRouter 官方目录月使用信号'}</strong></div>
                    </div>
                    <div class="model-feedback-note">${model.arena ? '用户在 arena.ai 的真实投票综合，以投票数为权重，当前展示基于 arena.ai 的投票结果，随着数据量增加结果更稳定' : '当前模型数据较稳定，映射的官方投票结果，可以官方目录使用信号补充展示'}</div>
                `,
            };

            return `
                <article class="model-card" style="--model-accent:${theme.accent};--model-soft:${theme.soft};">
                    <div class="model-card-top">
                        <div class="model-rank-badge">#${model.rank}</div>
                        <div class="model-provider-badge">
                            <span class="model-provider-logo">${theme.label}</span>
                            <span>${model.provider}</span>
                        </div>
                    </div>
                    <div class="model-card-name-row">
                        <h3 class="model-card-name">${model.name}${model.hot ? ' <i class="fas fa-fire"></i>' : ''}</h3>
                        <span class="model-chip subtle">${model.params}</span>
                    </div>
                    <div class="model-chip-row">
                        <span class="model-chip strong">${model.type}</span>
                        <span class="model-chip">${formatModelPricing(model.pricing)}</span>
                        <span class="model-chip">${model.rankingSource === 'snapshot' ? '周榜快照' : '官方目录补充'}</span>
                    </div>
                    <div class="model-metric-primary">
                        <span class="metric-primary-label">${primaryLabel}</span>
                        <strong>${primaryValue}</strong>
                        ${growthBadge}
                    </div>
                    <div class="model-metrics">
                        ${panels[currentModelLens] || panels.overview}
                    </div>
                    <div class="model-card-footer">
                        <a class="model-action-btn primary" href="${model.url}" target="_blank" rel="noopener noreferrer">查看详情</a>
                        <button class="model-action-btn ghost js-model-compare" type="button" data-model-name="${model.name}">加入对比</button>
                    </div>
                </article>
            `;
        }).join('');

        grid.querySelectorAll('.js-model-compare').forEach(btn => {
            btn.addEventListener('click', () => showToast(`已加入对比候选：${btn.dataset.modelName}`));
        });
    }

    function renderModelsRealtime(models) {
        const grid = $('#modelsGrid');
        const meta = $('#modelsMetaInfo');
        if (!grid) return;

        if (meta) {
            const sortLabel = ({ rank:'综合排名', elo:'ELO', mmlu:'MMLU', code:'代码能力' }[currentModelSort] || '综合排名');
            const liveLabel = currentModelLiveUpdatedAt ? ` · 官方目录同步 ${formatModelRefreshTime(currentModelLiveUpdatedAt)}` : '';
            const catalogLabel = currentModelCatalogCount ? ` · 目录 ${currentModelCatalogCount} 个模型` : '';
            meta.textContent = `\u5171 ${models.length} \u4e2a\u6a21\u578b\u00b7 \u76ee\u5f55\u5b9e\u65f6\u540c\u6b65 \u00b7 \u5468\u699c ${currentModelSnapshotDate}${liveLabel}${catalogLabel} \u00b7 \u5f53\u524d\u89c6\u56fe\uff1a${sortLabel}\u6392\u5e8f`;
        }

        if (!models.length) {
            grid.innerHTML = `<div class="models-empty"><i class="fas fa-layer-group"></i><p>当前筛选条件下没有匹配模型</p></div>`;
            return;
        }

        grid.innerHTML = models.map(model => {
            const theme = getProviderTheme(model.provider);
            const metricDefs = [
                { key:'mmlu', label:'MMLU' },
                { key:'code', label:'代码' },
                { key:'gsm8k', label:'GSM8K' }
            ];
            const metrics = metricDefs
                .map(metric => ({ ...metric, value: getModelMetric(model, metric.key) }))
                .filter(metric => metric.value > 0);
            const primaryLabel = model.weeklyTokens ? '月使用量' : (model.elo ? 'ELO' : '参数量');
            const primaryValue = model.weeklyTokens || model.elo || model.params;
            const growthClass = !model.weeklyGrowth || model.weeklyGrowth === '0%' ? 'flat' : '';
            const growthBadge = model.weeklyGrowth
                ? `<span class="model-growth ${growthClass}">周增 ${model.weeklyGrowth}</span>`
                : `<span class="model-growth flat">${model.date || currentModelSnapshotDate}</span>`;
            const liveSummary = `
                <div class="model-live-summary">
                    <div class="model-live-stat">
                        <span>上下文/span>
                        <strong>${model.params || '未知'}</strong>
                    </div>
                    <div class="model-live-stat">
                        <span>更新日期</span>
                        <strong>${model.date || currentModelSnapshotDate}</strong>
                    </div>
                    <div class="model-live-stat">
                        <span>输入模态/span>
                        <strong>${(model.inputModalities || []).join(' / ') || 'text'}</strong>
                    </div>
                    <div class="model-live-stat">
                        <span>输出模态/span>
                        <strong>${(model.outputModalities || []).join(' / ') || 'text'}</strong>
                    </div>
                </div>
            `;

            return `
                <article class="model-card" style="--model-accent:${theme.accent};--model-soft:${theme.soft};">
                    <div class="model-card-top">
                        <div class="model-rank-badge">#${model.rank}</div>
                        <div class="model-provider-badge">
                            <span class="model-provider-logo">${theme.label}</span>
                            <span>${model.provider}</span>
                        </div>
                    </div>
                    <div class="model-card-name-row">
                        <h3 class="model-card-name">${model.name}${model.hot ? ' <i class="fas fa-fire"></i>' : ''}</h3>
                        <span class="model-chip subtle">${model.params}</span>
                    </div>
                    <div class="model-chip-row">
                        <span class="model-chip strong">${model.type}</span>
                        <span class="model-chip">${formatModelPricing(model.pricing)}</span>
                        <span class="model-chip">${model.liveId ? 'OpenRouter 官方目录' : '榜单快照'}</span>
                    </div>
                    <div class="model-metric-primary">
                        <span class="metric-primary-label">${primaryLabel}</span>
                        <strong>${primaryValue}</strong>
                        ${growthBadge}
                    </div>
                    <div class="model-metrics">
                        ${metrics.length ? metrics.map(metric => `
                            <div class="model-metric-row">
                                <div class="metric-meta">
                                    <span>${metric.label}</span>
                                    <strong>${metric.value.toFixed(1)}%</strong>
                                </div>
                                <div class="metric-bar"><span style="width:${Math.max(6, Math.min(100, metric.value))}%"></span></div>
                            </div>
                        `).join('') : liveSummary}
                    </div>
                    <div class="model-card-footer">
                        <a class="model-action-btn primary" href="${model.url}" target="_blank" rel="noopener noreferrer">查看详情</a>
                        <button class="model-action-btn ghost js-model-compare" type="button" data-model-name="${model.name}">加入对比</button>
                    </div>
                </article>
            `;
        }).join('');

        grid.querySelectorAll('.js-model-compare').forEach(btn => {
            btn.addEventListener('click', () => showToast(`已加入对比候选：${btn.dataset.modelName}`));
        });
    }

    function deriveModelFeedback(model) {
        if (model.arena?.votes) {
            const score = Number(model.arena.score || 0);
            const votes = Number(model.arena.votes || 0);
            const starScore = score >= 1490 ? 5 : score >= 1470 ? 4 : score >= 1440 ? 3 : score >= 1410 ? 2 : 1;
            const label = score >= 1490 ? '真实投票榜首' : score >= 1470 ? '真实投票强势' : score >= 1440 ? '真实投票领先' : '真实投票中上';
            const details = [
                `Arena 评分 ${score}${model.arena.spread || ''}`,
                `累计 ${votes.toLocaleString()} 票`,
                `快照日期 ${model.arena.snapshotDate}`
            ];
            if (model.arena.exact === false) details.push(`对应公开基准模型 ${model.arena.model}`);
            return { score: starScore, label, summary: details.join(' · ') };
        }

        const usage = parseVolumeLabel(model.weeklyTokens);
        const growth = Number(String(model.weeklyGrowth || '0').replace(/[^\d.-]/g, ''));
        const price = Number(model.promptPricePerM || 0) + Number(model.completionPricePerM || 0);
        let score = 3;
        if (usage >= 1e12) score += 1;
        if (growth >= 30) score += 1;
        if (growth <= 0 && usage < 9e11) score -= 1;
        if (price > 20) score -= 1;
        if (model.pricing === 'free') score += 0.5;
        score = Math.max(1, Math.min(5, Math.round(score)));

        const label = score >= 5 ? '使用热度很高' : score >= 4 ? '综合表现稳定' : score >= 3 ? '中等偏上' : '偏冷门';
        const reasons = [];
        if (usage >= 1e12) reasons.push('使用量处于高位');
        else if (usage >= 8e11) reasons.push('具有较大使用规模');
        if (growth >= 30) reasons.push('近期增长明显');
        else if (growth > 0) reasons.push('保持增长');
        if (model.pricing === 'free') reasons.push('免费可用');
        else if (price > 20) reasons.push('价格偏高');
        if (model.type === 'Multimodal') reasons.push('多模态适配');
        if (model.type === 'Code-Optimized') reasons.push('代码能力偏强');
        return {
            score,
            label,
            summary: reasons.slice(0, 3).join(' · ') || '当前目录数据不足，先按公开目录与使用趋势展示'
        };
    }

    function renderModelsRealtimeV2(models) {
        const grid = $('#modelsGrid');
        const meta = $('#modelsMetaInfo');
        if (!grid) return;

        if (meta) {
            const sortLabel = ({ rank:'综合排名', elo:'ELO', mmlu:'MMLU', code:'代码能力' }[currentModelSort] || '综合排名');
            const lensLabel = ({ overview:'概览', performance:'性能', usage:'使用', price:'价格', feedback:'反馈' }[currentModelLens] || '概览');
            const snapshotLabel = currentModelSnapshotTopCount
                ? `Top ${currentModelSnapshotTopCount} 为周榜快照 ${currentModelSnapshotDate}`
                : `周榜快照 ${currentModelSnapshotDate}`;
            const liveLabel = currentModelLiveUpdatedAt ? ` · 官方目录同步 ${formatModelRefreshTime(currentModelLiveUpdatedAt)}` : '';
            const catalogLabel = currentModelCatalogCount ? ` · 官方目录 ${currentModelCatalogCount} 个模型` : '';
            meta.textContent = `${models.length} 个模型 · ${snapshotLabel}${liveLabel}${catalogLabel} · 当前视图 ${lensLabel} · 按 ${sortLabel} 排序`;
        }

        if (!models.length) {
            grid.innerHTML = `<div class="models-empty"><i class="fas fa-layer-group"></i><p>当前筛选条件下没有匹配模型</p></div>`;
            return;
        }

        grid.innerHTML = models.map(model => {
            const theme = getProviderTheme(model.provider);
            const feedback = deriveModelFeedback(model);
            const metrics = [
                { key:'mmlu', label:'MMLU', value: getModelMetric(model, 'mmlu') },
                { key:'code', label:'代码', value: getModelMetric(model, 'code') },
                { key:'gsm8k', label:'GSM8K', value: getModelMetric(model, 'gsm8k') }
            ].filter(metric => metric.value > 0);
            const primaryLabel = model.weeklyTokens ? '周使用量' : (model.elo ? 'ELO' : '参数规模');
            const primaryValue = model.weeklyTokens || model.elo || model.params;
            const growthClass = !model.weeklyGrowth || model.weeklyGrowth === '0%' ? 'flat' : '';
            const growthBadge = model.weeklyGrowth
                ? `<span class="model-growth ${growthClass}">周增 ${model.weeklyGrowth}</span>`
                : `<span class="model-growth flat">${model.date || currentModelSnapshotDate}</span>`;

            const arenaSummary = model.arena ? `
                <div class="model-lens-panel">
                    <div class="model-lens-item"><span>Arena 评分</span><strong>${model.arena.score}${model.arena.spread || ''}</strong></div>
                    <div class="model-lens-item"><span>真实投票</span><strong>${Number(model.arena.votes || 0).toLocaleString()} 票</strong></div>
                    <div class="model-lens-item"><span>基准模型</span><strong>${model.arena.model}${model.arena.exact === false ? ' · 邻近公开版本' : ''}</strong></div>
                    <div class="model-lens-item"><span>快照日期</span><strong>${model.arena.snapshotDate}</strong></div>
                </div>
            ` : '';

            const panels = {
                overview: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>参数规模</span><strong>${model.params || '未披露'}</strong></div>
                        <div class="model-lens-item"><span>更新时间</span><strong>${model.date || currentModelSnapshotDate}</strong></div>
                        <div class="model-lens-item"><span>输入模态</span><strong>${(model.inputModalities || []).join(' / ') || 'text'}</strong></div>
                        <div class="model-lens-item"><span>输出模态</span><strong>${(model.outputModalities || []).join(' / ') || 'text'}</strong></div>
                    </div>
                `,
                performance: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>上下文长度</span><strong>${model.arena?.context || model.params || '未披露'}</strong></div>
                        <div class="model-lens-item"><span>最大输出</span><strong>${model.maxCompletionTokens ? `${Math.round(model.maxCompletionTokens / 1000)}K tokens` : '未披露'}</strong></div>
                        <div class="model-lens-item"><span>支持参数</span><strong>${(model.supportedParameters || []).length || 0} 项</strong></div>
                        <div class="model-lens-item"><span>评测摘要</span><strong>${model.arena ? `Arena ${model.arena.score}${model.arena.spread || ''} / ${Number(model.arena.votes || 0).toLocaleString()} 票` : (metrics.length ? metrics.map(item => `${item.label} ${item.value.toFixed(1)}%`).join(' / ') : `${model.type} / ${(model.inputModalities || []).join('/') || 'text'}`)}</strong></div>
                    </div>
                    ${arenaSummary}
                `,
                usage: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>周使用量</span><strong>${model.weeklyTokens || '未披露'}</strong></div>
                        <div class="model-lens-item"><span>周增幅</span><strong>${model.weeklyGrowth || '未披露'}</strong></div>
                        <div class="model-lens-item"><span>榜单排名</span><strong>#${model.rank}</strong></div>
                        <div class="model-lens-item"><span>热度判断</span><strong>${model.hot ? '热度较高' : feedback.label}</strong></div>
                    </div>
                `,
                price: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>输入价格</span><strong>${formatPricePerMillion(model.promptPricePerM)}</strong></div>
                        <div class="model-lens-item"><span>输出价格</span><strong>${formatPricePerMillion(model.completionPricePerM)}</strong></div>
                        <div class="model-lens-item"><span>缓存读价</span><strong>${formatPricePerMillion(model.cacheReadPricePerM)}</strong></div>
                        <div class="model-lens-item"><span>价格标签</span><strong>${formatModelPricing(model.pricing)}</strong></div>
                    </div>
                `,
                feedback: `
                    <div class="model-lens-panel">
                        <div class="model-lens-item"><span>星级反馈</span><strong class="model-stars">${'★'.repeat(feedback.score)}${'☆'.repeat(5 - feedback.score)}</strong></div>
                        <div class="model-lens-item"><span>判断依据</span><strong>${feedback.label}</strong></div>
                        <div class="model-lens-item"><span>摘要说明</span><strong>${feedback.summary}</strong></div>
                        <div class="model-lens-item"><span>数据来源</span><strong>${model.arena ? 'arena.ai 投票结果 + OpenRouter 官方目录' : 'OpenRouter 官方目录月使用信号'}</strong></div>
                    </div>
                    <div class="model-feedback-note">${model.arena ? '用户在 arena.ai 的真实投票综合，以投票数为权重，当前展示基于 arena.ai 的投票结果，随着数据量增加结果更稳定' : '当前模型数据较稳定，映射的官方投票结果，可以官方目录使用信号补充展示'}</div>
                `,
            };

            return `
                <article class="model-card" style="--model-accent:${theme.accent};--model-soft:${theme.soft};">
                    <div class="model-card-top">
                        <div class="model-rank-badge">#${model.rank}</div>
                        <div class="model-provider-badge">
                            <span class="model-provider-logo">${theme.label}</span>
                            <span>${model.provider}</span>
                        </div>
                    </div>
                    <div class="model-card-name-row">
                        <h3 class="model-card-name">${model.name}${model.hot ? ' <i class="fas fa-fire"></i>' : ''}</h3>
                        <span class="model-chip subtle">${model.params}</span>
                    </div>
                    <div class="model-chip-row">
                        <span class="model-chip strong">${model.type}</span>
                        <span class="model-chip">${formatModelPricing(model.pricing)}</span>
                        <span class="model-chip">${model.rankingSource === 'snapshot' ? '周榜快照' : '官方目录补充'}</span>
                    </div>
                    <div class="model-metric-primary">
                        <span class="metric-primary-label">${primaryLabel}</span>
                        <strong>${primaryValue}</strong>
                        ${growthBadge}
                    </div>
                    <div class="model-metrics">
                        ${panels[currentModelLens] || panels.overview}
                    </div>
                    <div class="model-card-footer">
                        <a class="model-action-btn primary" href="${model.url}" target="_blank" rel="noopener noreferrer">查看详情</a>
                        <button class="model-action-btn ghost js-model-compare" type="button" data-model-name="${model.name}">加入对比</button>
                    </div>
                </article>
            `;
        }).join('');

        grid.querySelectorAll('.js-model-compare').forEach(btn => {
            btn.addEventListener('click', () => showToast(`已加入对比候选：${btn.dataset.modelName}`));
        });
    }

    function renderModelsRealtime(models) {
        renderModelsRealtimeV2(models);
    }

    function renderFeatured() {
        if (!featuredGrid) return;
        featuredGrid.innerHTML = FEATURED_TOOLS.map(f => {
            const t = TOOLS_DATA.find(tool => tool.id === f.id);
            if (!t) return '';
            return `
            <div class="featured-card" style="--card-color:${t.color}" onclick="window._openTool(${t.id})">
                <div class="featured-icon" style="background:${t.color}">
                    ${t.logo ? `<img src="${t.logo}" alt="${t.name}" onerror="this.style.display='none'">` : `<i class="${t.icon}" style="color:#fff;font-size:18px"></i>`}
                </div>
                <div class="featured-info">
                    <h4>${t.name}</h4>
                    <div class="featured-reason">${f.reason}</div>
                    <div class="featured-rating">${'★'.repeat(Math.floor(t.rating))} ${t.rating}</div>
                </div>
            </div>`;
        }).join('');
    }

    function openCompareModal() {
        const tools = compareList.map(id => TOOLS_DATA.find(t => t.id === id)).filter(Boolean);
        if (tools.length < 2) return;

        const rows = [
            ['描述', t => `<td>${t.desc}</td>`],
            ['评分', t => `<td><span class="compare-stars">${'★'.repeat(Math.floor(t.rating))}${'☆'.repeat(5 - Math.floor(t.rating))}</span> ${t.rating}</td>`],
            ['用户', t => `<td>${t.users}</td>`],
            ['价格', t => `<td><span class="pricing-badge ${t.pricing}">${{free:'免费',freemium:'免费增值',paid:'付费'}[t.pricing]}</span></td>`],
            ['地区', t => `<td>${t.region === 'domestic' ? '国产' : '海外'}</td>`],
            ['标签', t => `<td>${t.tags.join(', ')}</td>`],
            ['链接', t => `<td><a href="${t.url}" target="_blank" style="color:var(--primary);text-decoration:none">查看外链</a></td>`],
        ];

        const headerCells = tools.map(t => `
            <th>
                <div class="compare-tool-header">
                    <div class="compare-tool-icon" style="background:${t.color}">
                        ${t.logo ? `<img src="${t.logo}" alt="${t.name}">` : `<i class="${t.icon}"></i>`}
                    </div>
                    <span>${t.name}</span>
                </div>
            </th>`).join('');

        const bodyRows = rows.map(([label, fn]) => `
            <tr>
                <td>${label}</td>
                ${tools.map(fn).join('')}
            </tr>`).join('');

        $('#compareModalBody').innerHTML = `
            <table class="compare-table">
                <thead><tr><th>对比项</th>${headerCells}</tr></thead>
                <tbody>${bodyRows}</tbody>
            </table>`;
        compareModal.classList.add('show');
    }

    function openToolModal(id) {
        const tool = TOOLS_DATA.find(t => t.id === id);
        if (!tool) return;
        currentToolId = id;
        addRecent(id);

        const iconEl = $('#toolModalIcon');
        iconEl.style.background = tool.color;
        iconEl.innerHTML = tool.logo
            ? `<img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none'"><i class="${tool.icon}" style="font-size:22px;color:#fff;display:none"></i>`
            : `<i class="${tool.icon}" style="font-size:22px;color:#fff"></i>`;

        $('#toolModalName').textContent = tool.name;
        $('#toolModalTags').innerHTML = tool.tags.map(t => `<span class="tool-tag">${t}</span>`).join('');
        $('#toolModalDesc').textContent = tool.desc;
        $('#toolModalRating').innerHTML = `${'★'.repeat(Math.floor(tool.rating))} ${tool.rating}`;
        $('#toolModalUsers').textContent = tool.users;
        $('#toolModalPricing').textContent = { free:'免费', freemium:'免费增值', paid:'付费' }[tool.pricing] || tool.pricing;
        $('#toolModalRegion').textContent = tool.region === 'domestic' ? '国产' : '海外';
        $('#toolModalUrl').href = tool.url;
        const docBtn = $('#toolModalDoc');
        const docUrl = typeof TOOL_DOCS !== 'undefined' && TOOL_DOCS[id];
        if (docUrl) { docBtn.href = docUrl; docBtn.style.display = 'flex'; }
        else { docBtn.style.display = 'none'; }
        updateModalFavUI(id);
        updateModalCompareUI(id);
        updateModalLikeUI(id);
        renderRelatedTools(tool);
        toolModal.classList.add('show');
    }

    const getCategoryLabel = cat => ({writing:'论文写作',review:'文献综述',analysis:'数据分析',translate:'翻译润色'}[cat] || cat);

    // ---- 过滤 + 排序 ----
    function getFilteredTools() {
        let list = [...TOOLS_DATA];
        if      (currentCategory === 'favorites') list = list.filter(t => isFav(t.id));
        else if (currentCategory === 'recent')    list = recentlyViewed.map(id => list.find(t => t.id === id)).filter(Boolean);
        else if (currentCategory === 'hot')       list = list.filter(t => t.hot);
        else if (currentCategory === 'new')       list = list.filter(t => t.isNew);
        else if (currentCategory !== 'all')       list = list.filter(t => t.category === currentCategory);

        if (currentPricing === 'domestic' || currentPricing === 'foreign')
            list = list.filter(t => t.region === currentPricing);
        else if (currentPricing !== 'all')
            list = list.filter(t => t.pricing === currentPricing);

        if (currentSort === 'rating')      list.sort((a,b) => b.rating - a.rating);
        else if (currentSort === 'users')  list.sort((a,b) => parseUsers(b.users) - parseUsers(a.users));
        else if (currentSort === 'name')   list.sort((a,b) => a.name.localeCompare(b.name));
        return list;
    }
    function parseUsers(s) {
        const n = parseFloat(s.replace(/[^\d.]/g,''));
        if (s.includes('亿')) return n*1e8;
        if (s.includes('万')) return n*1e4;
        return n;
    }
    function filterTools() { renderTools(getFilteredTools()); }

    // ---- 搜索 ----
    function doSearch(query) {
        showSection('all');
        $$('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector('.nav-item[data-category="all"]').classList.add('active');
        currentCategory = 'all';
        if (!query.trim()) { filterTools(); return; }
        const q = query.toLowerCase();
        renderTools(TOOLS_DATA.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q) ||
            t.tags.some(tag => tag.toLowerCase().includes(q))
        ));
        document.getElementById('toolsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function scrollCategoryIntoView(cat) {
        const targetIdMap = {
            all: 'toolsSection',
            hot: 'toolsSection',
            new: 'toolsSection',
            favorites: 'toolsSection',
            recent: 'toolsSection',
            writing: 'toolsSection',
            reading: 'toolsSection',
            data: 'toolsSection',
            figure: 'toolsSection',
            code: 'toolsSection',
            experiment: 'toolsSection',
            llm: 'toolsSection',
            'image-ai': 'toolsSection',
            voice: 'toolsSection',
            video: 'toolsSection',
            prompts: 'promptsSection',
            tutorials: 'tutorialsSection',
            news: 'newsSection',
            models: 'modelsSection',
            github: 'githubSection',
            usecases: 'usecasesSection',
            aisoft: 'toolsSection',
            agents: 'toolsSection',
            cli: 'toolsSection',
            graph: 'graphSection',
            'search-papers': 'searchPapersSection',
            journal: 'journalSection',
            'cite-check': 'citeCheckSection',
            paperdeck: 'paperdeckSection',
            stats: 'statMethodsSection'
        };
        const targetId = targetIdMap[cat] || 'toolsSection';
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---- 显示板块 ----
    function showSection(cat) {
        Object.values(sections).forEach(s => { if (s) s.style.display = 'none'; });
        const titleMap = {
            all:'全部工具', hot:'热门推荐', new:'最新上线', favorites:'我的收藏', recent:'最近浏览',
            writing:'论文写作', reading:'文献阅读', data:'数据分析',
            figure:'科研绘图', code:'代码助手', experiment:'实验设计',
            llm:'大语言模型', 'image-ai':'AI 绘画', voice:'语音合成', video:'AI 视频',
            prompts:'提示词库', tutorials:'学习教程', news:'行业资讯', models:'大模型排名',
            github:'GitHub 推荐', usecases:'科研 AI 应用示例',
            aisoft:'AI 软件推荐', agents:'智能体与自动化', cli:'CLI 工具',
            graph:'研究图谱', 'search-papers':'论文检索', journal:'选刊助手',
            'cite-check':'引文核查', paperdeck:'PaperDeck 论文学习卡片',
            stats:'统计方法可视化库',
        };
        pageTitle.textContent = titleMap[cat] || cat;
        closeSidebarDrawer();
        const toolboxCats = ['graph', 'search-papers', 'journal', 'cite-check', 'paperdeck'];

        // Tab 栏显示/隐藏逻辑
        const NON_TOOL_CATS = ['prompts','tutorials','news','models','github','usecases','graph','search-papers','journal','cite-check','paperdeck','stats'];
        const tabsContainer = $('#toolsCategoryTabs');
        if (NON_TOOL_CATS.includes(cat)) {
            if (tabsContainer) tabsContainer.style.display = 'none';
        } else {
            if (tabsContainer) tabsContainer.style.display = 'block';
            // 同步 Tab 的 active 状态            $$('.tab-item').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tab-item[data-category="${cat}"]`);
            if (activeTab) activeTab.classList.add('active');
        }

        if      (cat === 'prompts')        sections.prompts.style.display = 'block';
        else if (cat === 'tutorials')      sections.tutorials.style.display = 'block';
        else if (cat === 'news')           {
            sections.news.style.display = 'block';
            renderNews(currentNewsData || []);
            if (!hasRequestedLiveNews) {
                hasRequestedLiveNews = true;
                fetchLiveNews(false).then(data => renderNews(data || currentNewsData)).catch(() => renderNews(currentNewsData || []));
            }
        }
        else if (cat === 'models')         {
            sections.models.style.display = 'block';
            applyModelFilters();
            if (!hasRequestedLiveModelRefresh) {
                hasRequestedLiveModelRefresh = true;
                refreshModelsData(false, true);
            }
        }
        else if (cat === 'github')         sections.github.style.display = 'block';
        else if (cat === 'usecases')       sections.usecases.style.display = 'block';
        else if (cat === 'graph')          sections.graph.style.display = 'block';
        else if (cat === 'search-papers')  sections.searchPapers.style.display = 'block';
        else if (cat === 'journal')        sections.journal.style.display = 'block';
        else if (cat === 'cite-check')     sections.citeCheck.style.display = 'block';
        else if (cat === 'paperdeck')      sections.paperdeck.style.display = 'block';
        else if (cat === 'stats')          {
            if (sections.statMethods) {
                sections.statMethods.style.display = 'block';
                sections.statMethods.style.width = '100%';
                sections.statMethods.style.maxWidth = 'none';
                sections.statMethods.style.marginLeft = '0';
                sections.statMethods.style.marginRight = '0';
                sections.statMethods.style.alignSelf = 'stretch';
                sections.statMethods.style.clear = 'both';
                sections.statMethods.style.position = 'relative';
                StatsFeature.render();
                sections.statMethods.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                StatsFeature.render();
            }
        }
        else {
            const isAll = cat === 'all';
            sections.hero.style.display      = isAll ? '' : 'none';
            sections.featured.style.display  = isAll ? '' : 'none';
            sections.stats.style.display     = '';
            sections.tools.style.display     = '';
            const recSec = document.getElementById('recommendSection');
            if (recSec) recSec.style.display = isAll ? '' : 'none';
        }
        // 收藏视图显示导出按钮
        if (exportFavsBtn) exportFavsBtn.style.display = cat === 'favorites' ? 'flex' : 'none';

        // Final UI normalization: keep titles and tool tabs consistent.
        const cleanTitleMap = {
            all:'全部工具', hot:'热门推荐', new:'最新上线', favorites:'我的收藏', recent:'最近浏览',
            writing:'论文写作', reading:'文献阅读', data:'数据分析',
            figure:'科研绘图', code:'代码助手', experiment:'实验设计',
            llm:'大语言模型', 'image-ai':'AI 绘画', voice:'语音合成', video:'AI 视频',
            prompts:'提示词库', tutorials:'学习教程', news:'行业资讯', models:'大模型排名',
            github:'GitHub 推荐', usecases:'科研 AI 应用示例',
            aisoft:'AI 软件推荐', agents:'智能体与自动化', cli:'CLI 工具',
            graph:'研究图谱', 'search-papers':'论文检索', journal:'选刊助手',
            'cite-check':'引文核查', paperdeck:'PaperDeck 论文学习卡片',
            stats:'统计方法可视化库'
        };
        pageTitle.textContent = cleanTitleMap[cat] || cat;
        syncToolTabsVisibility(cat);
        if (TOOL_TAB_CATS.has(cat)) {
            $$('.tab-item').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tab-item[data-category="${cat}"]`);
            if (activeTab) activeTab.classList.add('active');
        }
        const finalTabsContainer = $('#toolsCategoryTabs');
        if (finalTabsContainer) finalTabsContainer.style.display = TOOL_TAB_CATS.has(cat) ? 'block' : 'none';
        const finalTitleMap = {
            all: '全部工具',
            hot: '热门推荐',
            new: '最新上线',
            favorites: '我的收藏',
            recent: '最近浏览',
            writing: '论文写作',
            reading: '文献阅读',
            data: '数据分析',
            figure: '科研绘图',
            code: '代码助手',
            experiment: '实验设计',
            llm: '大语言模型',
            'image-ai': 'AI 绘画',
            voice: '语音合成',
            video: 'AI 视频',
            prompts: '提示词库',
            tutorials: '学习教程',
            news: '行业资讯',
            models: '大模型排名',
            github: 'GitHub 推荐',
            usecases: '科研 AI 应用示例',
            aisoft: 'AI 软件推荐',
            agents: '智能体与自动化',
            cli: 'CLI 工具',
            graph: '研究图谱',
            'search-papers': '论文检索',
            journal: '选刊助手',
            'cite-check': '引文核查',
            paperdeck: 'PaperDeck 论文学习卡片',
            stats: '统计方法可视化库'
        };
        pageTitle.textContent = finalTitleMap[cat] || cat;
        if (cat === 'stats' && sections.statMethods) {
            sections.statMethods.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ---- 数字动画 ----
    function animateStats() {
        $$('.stats-value').forEach(el => {
            const target = parseInt(el.dataset.target), dur = 1500, t0 = performance.now();
            const tick = now => {
                const p = Math.min((now-t0)/dur,1), e = 1-Math.pow(1-p,3);
                el.textContent = Math.floor(e*target).toLocaleString();
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }

    // ---- 主题 ----
    function loadTheme() {
        const t = localStorage.getItem('sciai-theme') || 'light';
        document.documentElement.setAttribute('data-theme', t);
        themeToggle.querySelector('i').className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    function toggleTheme() {
        const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', n);
        localStorage.setItem('sciai-theme', n);
        themeToggle.querySelector('i').className = n === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ---- Toast ----
    let toastTimer;
    function showToast(msg) {
        let el = $('.toast');
        if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
    }

    // ---- 全局暴露 ----
    window._toggleFav     = id => toggleFav(id);
    window._toggleCompare = id => toggleCompare(id);
    window._openTool      = id => openToolModal(id);
    window._isFav         = id => isFav(id);

    // ---- 键盘快捷键 ----
    document.addEventListener('keydown', e => {
        const tag = document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (e.key === '/') { e.preventDefault(); globalSearch.focus(); }
        if (e.key === 'Escape') {
            closeToolModal();
            loginModal.classList.remove('show');
            compareModal.classList.remove('show');
            if (shortcutsModal)  shortcutsModal.classList.remove('show');
            if (suggestModal)    suggestModal.classList.remove('show');
        }
        if (e.key === '?') { if (shortcutsModal) shortcutsModal.classList.toggle('show'); }
        if (e.key === 'd' || e.key === 'D') { toggleTheme(); }
    });

    // ---- 回到顶部 ----
    window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 400));
    backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

    // ---- 绑定事件 ----
    function bindEvents() {
        // 周增长率
        $$('.nav-item').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                currentCategory = item.dataset.category;
                currentPricing = 'all';
                $$('.tag[data-filter]').forEach(t => t.classList.remove('active'));
                const at = document.querySelector('.tag[data-filter="all"]');
                if (at) at.classList.add('active');
                showSection(currentCategory);
                scrollCategoryIntoView(currentCategory);
                const NON_TOOL_CATS = ['prompts','tutorials','news','models','github','usecases','graph','search-papers','journal','cite-check','paperdeck','stats'];
                if (!NON_TOOL_CATS.includes(currentCategory)) filterTools();
                if (window.innerWidth <= 768) sidebar.classList.remove('open');
            });
        });
        // Hero 分类标签
        $$('.hero-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const cat = tag.dataset.category;
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                const ni = document.querySelector(`.nav-item[data-category="${cat}"]`);
                if (ni) ni.classList.add('active');
                currentCategory = cat;
                showSection(cat);
                scrollCategoryIntoView(cat);
                if (cat !== 'stats') filterTools();
            });
        });

        $$('[data-category].hero-action-card, [data-category].hero-mini-item, [data-category].hero-flow-step, [data-category].taxonomy-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category;
                if (!cat) return;
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                document.querySelector(`.nav-item[data-category="${cat}"]`)?.classList.add('active');
                currentCategory = cat;
                showSection(cat);
                scrollCategoryIntoView(cat);
                const NON_TOOL_CATS = ['prompts','tutorials','news','models','github','usecases','graph','search-papers','journal','cite-check','paperdeck','stats'];
                if (!NON_TOOL_CATS.includes(cat)) filterTools();
                tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            });
        });

        // 切换 Tab 参数量
        $$('.tab-item').forEach(tab => {
            tab.addEventListener('click', () => {
                $$('.tab-item').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const cat = tab.dataset.category;
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                currentCategory = cat;
                currentPricing = 'all';
                $$('.tag[data-filter]').forEach(t => t.classList.remove('active'));
                const at = document.querySelector('.tag[data-filter="all"]');
                if (at) at.classList.add('active');
                showSection(cat);
                scrollCategoryIntoView(cat);
                const NON_TOOL_CATS = ['prompts','tutorials','news','models','github','usecases','graph','search-papers','journal','cite-check','paperdeck','stats'];
                if (!NON_TOOL_CATS.includes(cat)) filterTools();
                // 切换 Tab 成功回调
            });
        });

        // ߼۸ɸѡ
        $$('.tag[data-filter]').forEach(tag => {
            tag.addEventListener('click', () => {
                $$('.tag[data-filter]').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                currentPricing = tag.dataset.filter;
                filterTools();
            });
        });

        // 显示筛选
        $$('.tag[data-prompt-filter]').forEach(tag => {
            tag.addEventListener('click', () => {
                $$('.tag[data-prompt-filter]').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                const f = tag.dataset.promptFilter;
                renderPrompts(f === 'all' ? PROMPTS_DATA : PROMPTS_DATA.filter(p => p.category === f));
            });
        });
        // 大模型筛选与排序
        $$('.models-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentModelFilter = btn.dataset.modelFilter || 'all';
                applyModelFilters();
            });
        });
        $$('.models-lens-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentModelLens = btn.dataset.modelLens || 'overview';
                applyModelFilters();
            });
        });
        $('#modelsSortSelect')?.addEventListener('change', e => {
            currentModelSort = e.target.value || 'rank';
            applyModelFilters();
        });
        $('#modelsRefreshBtn')?.addEventListener('click', () => refreshModelsData(true, false));

        // 搜索
        let st;
        globalSearch.addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => doSearch(e.target.value), 300); });
        heroSearch.addEventListener('input', e => {
            clearTimeout(st);
            st = setTimeout(() => {
                if (e.target.value) { globalSearch.value = e.target.value; doSearch(e.target.value); }
            }, 300);
        });
        heroSearchBtn.addEventListener('click', () => {
            const q = heroSearch.value;
            if (q) { globalSearch.value = q; doSearch(q); }
        });

        // 主题
        themeToggle.addEventListener('click', toggleTheme);

        mobileMenuBtn.addEventListener('click', e => { e.stopPropagation(); toggleSidebarDrawer(); });
        sidebarToggle?.addEventListener('click', e => { e.stopPropagation(); toggleSidebarDrawer(); });
        sidebarPinBtn?.addEventListener('click', e => { e.stopPropagation(); toggleSidebarPin(); });
        sidebarBackdrop?.addEventListener('click', closeSidebarDrawer);
        mainContent.addEventListener('click', closeSidebarDrawer);

        // 工具详情弹窗
        toolModalClose.addEventListener('click', closeToolModal);
        toolModal.addEventListener('click', e => { if (e.target === toolModal) closeToolModal(); });
        $('#toolModalFav').addEventListener('click', () => { if (currentToolId) toggleFav(currentToolId); });
        $('#toolModalFavBtn').addEventListener('click', () => { if (currentToolId) toggleFav(currentToolId); });
        $('#toolModalCompare').addEventListener('click', () => { if (currentToolId) toggleCompare(currentToolId); });

        // 对比
        doCompare.addEventListener('click', openCompareModal);
        clearCompare.addEventListener('click', () => { compareList = []; updateCompareBar(); $$('.card-compare-cb').forEach(b => b.classList.remove('active')); });
        compareModalClose.addEventListener('click', () => compareModal.classList.remove('show'));
        compareModal.addEventListener('click', e => { if (e.target === compareModal) compareModal.classList.remove('show'); });
        compareToggle.addEventListener('click', () => { if (compareList.length >= 2) openCompareModal(); });

        // 学习资源
        resourcesModalClose?.addEventListener('click', () => resourcesModal?.classList.remove('show'));
        resourcesModal?.addEventListener('click', e => { if (e.target === resourcesModal) resourcesModal.classList.remove('show'); });

        // 精选 view-all
        document.querySelector('.view-all')?.addEventListener('click', e => {
            e.preventDefault();
            const cat = e.target.dataset.category || 'hot';
            $$('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelector(`.nav-item[data-category="${cat}"]`)?.classList.add('active');
            currentCategory = cat; showSection(cat);
            if (cat !== 'stats') filterTools();
        });

        // 登录
        loginBtn.addEventListener('click', () => { refreshLoginModal(); loginModal.classList.add('show'); });
        modalClose.addEventListener('click', () => loginModal.classList.remove('show'));
        loginModal.addEventListener('click', e => { if (e.target === loginModal) loginModal.classList.remove('show'); });
        $('#localLoginBtn')?.addEventListener('click', doLocalLogin);
        $('#loginUsername')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLocalLogin(); });
        $('#loginUsername')?.addEventListener('input', e => {
            const preview = $('#loginAvatarPreview');
            if (!preview) return;
            const name = e.target.value.trim();
            if (name) { renderAvatarEl(preview, name); preview.style.display = 'flex'; }
            else { preview.textContent = ''; preview.style.display = 'none'; }
        });
        $('#logoutBtn')?.addEventListener('click', doLogout);

        // 工具点赞
        $('#toolModalLike')?.addEventListener('click', () => { if (currentToolId) toggleLike(currentToolId); });

        // 收藏导出
        exportFavsBtn?.addEventListener('click', exportFavoritesMarkdown);

        // 快捷键帮助        shortcutHelpBtn?.addEventListener('click', () => shortcutsModal?.classList.toggle('show'));
        $('#shortcutsModalClose')?.addEventListener('click', () => shortcutsModal?.classList.remove('show'));
        shortcutsModal?.addEventListener('click', e => { if (e.target === shortcutsModal) shortcutsModal.classList.remove('show'); });

        // 建议工具
        $('#suggestToolBtn')?.addEventListener('click', e => { e.preventDefault(); suggestModal?.classList.add('show'); });
        $('#suggestModalClose')?.addEventListener('click', () => suggestModal?.classList.remove('show'));
        suggestModal?.addEventListener('click', e => { if (e.target === suggestModal) suggestModal.classList.remove('show'); });
        $('#suggestSubmit')?.addEventListener('click', () => {
            const name = $('#suggestName')?.value.trim();
            const url  = $('#suggestUrl')?.value.trim();
            if (!name || !url) { showToast('请填写工具名称和 URL'); return; }
            suggestModal.classList.remove('show');
            ['suggestName','suggestUrl','suggestCategory','suggestDesc'].forEach(id => {
                const el = $(`#${id}`); if (el) el.value = '';
            });
            showToast('感谢建议！我们会尽快审核 🎉');
        });
    }

    // ---- 抽屉导航 ----
    function applySidebarCollapse() {
        sidebar.classList.toggle('open', !!sidebarPinned || !!sidebarDrawerOpen);
        sidebar.classList.toggle('pinned', !!sidebarPinned);
        sidebarBackdrop?.classList.toggle('show', !!sidebarDrawerOpen && !sidebarPinned);
        document.body.classList.toggle('sidebar-drawer-open', !!sidebarDrawerOpen && !sidebarPinned);
        document.body.classList.toggle('sidebar-pinned', !!sidebarPinned);
        if (sidebarPinBtn) sidebarPinBtn.classList.toggle('active', !!sidebarPinned);
        if (sidebarPinBtn) sidebarPinBtn.title = sidebarPinned ? '取消固定导航' : '固定导航';
        const icon = sidebarToggle ? sidebarToggle.querySelector('i') : null;
        if (icon) icon.className = sidebarPinned || sidebarDrawerOpen ? 'fas fa-chevron-left' : 'fas fa-bars';
        if (sidebarToggle) sidebarToggle.title = sidebarPinned ? '取消固定并收起' : (sidebarDrawerOpen ? '收起导航' : '打开导航');
    }
    function toggleSidebarPin(force) {
        sidebarPinned = typeof force === 'boolean' ? force : !sidebarPinned;
        if (sidebarPinned) sidebarDrawerOpen = false;
        saveLS('sciai-sidebar-pinned', sidebarPinned);
        saveLS('sciai-sidebar-drawer-open', sidebarDrawerOpen);
        applySidebarCollapse();
    }
    function toggleSidebarDrawer() {
        if (sidebarPinned) {
            toggleSidebarPin(false);
            return;
        }
        sidebarDrawerOpen = !sidebarDrawerOpen;
        saveLS('sciai-sidebar-drawer-open', sidebarDrawerOpen);
        applySidebarCollapse();
    }
    function closeSidebarDrawer() {
        if (sidebarPinned || !sidebarDrawerOpen) return;
        sidebarDrawerOpen = false;
        saveLS('sciai-sidebar-drawer-open', sidebarDrawerOpen);
        applySidebarCollapse();
    }
    // ---- 用户点赞 ----
    function isLiked(id)    { return !!userLikes[String(id)]; }
    function toggleLike(id) {
        const key = String(id);
        userLikes[key] = userLikes[key] ? 0 : 1;
        saveLS('sciai-likes', userLikes);
        updateModalLikeUI(id);
        showToast(userLikes[key] ? '已登录 ✅' : '取消固定');
    }
    function updateModalLikeUI(id) {
        const btn = $('#toolModalLike');
        if (!btn) return;
        const liked = isLiked(id);
        btn.classList.toggle('active', liked);
        $('#toolModalLikeText').textContent = liked ? '已点赞' : '点赞';
    }

    // ---- 相关工具推荐 ----
    function renderRelatedTools(tool) {
        const sec  = $('#relatedToolsSection');
        const list = $('#relatedToolsList');
        if (!sec || !list) return;
        const related = TOOLS_DATA
            .filter(t => t.id !== tool.id && t.category === tool.category)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4);
        if (!related.length) { sec.style.display = 'none'; return; }
        sec.style.display = '';
        list.innerHTML = related.map(t => `
            <button class="related-tool-chip" onclick="window._openTool(${t.id})">
                <div class="related-tool-chip-icon" style="background:${t.color}">
                    ${t.logo
                        ? `<img src="${t.logo}" alt="${t.name}" onerror="this.style.display='none'">`
                        : `<i class="${t.icon}"></i>`}
                </div>
                <span>${t.name}</span>
                <span class="related-chip-rating">${t.rating}个/span>
            </button>`).join('');
    }

    // ---- 统计与可视化方法库 ----
    function buildStatsVisualizationDetail(method) {
        return buildStatsVisualizationDetailClean(method);
    }

    function enrichStatsMethods() {
        if (typeof STATS_METHODS === 'undefined' || !Array.isArray(STATS_METHODS)) return;
        STATS_METHODS.forEach(method => {
            if (!method.visualGuide) method.visualGuide = buildStatsVisualizationDetail(method);
        });
    }
    enrichStatsMethods();

    function buildStatsVisualizationDetailClean(method) {
        const name = `${method.name || ''} ${method.nameEn || ''}`.toLowerCase();
        const detail = {
            charts: ['箱线图', '小提琴图', '散点图', '分组均值图'],
            implementation: ['Python: pandas / seaborn / statsmodels', 'R: tidyverse / ggplot2 / broom'],
            steps: ['先确认变量类型与分布', '选择方法前先检查假设', '输出效应量、置信区间和 p 值'],
            caution: '不要只看 p 值，必须同时报告效应量和样本条件。'
        };

        if (method.category === 'descriptive') {
            detail.charts = ['直方图', '箱线图', 'Q-Q 图', '描述统计表'];
            detail.implementation = ['Python: pandas.describe(), seaborn', 'R: summary(), psych::describe()'];
            detail.steps = ['清理缺失值与异常值', '汇总均值、中位数、标准差', '检查分布形态与离散程度'];
            detail.caution = '描述统计是起点，不是结论。';
        } else if (method.category === 'visualization') {
            detail.charts = ['折线图', '散点图', '热图', '地理分级图'];
            detail.implementation = ['Python: matplotlib / seaborn / plotly', 'R: ggplot2 / patchwork / sf'];
            detail.steps = ['先确定展示目标', '再选图形编码', '统一配色、坐标和注释'];
            detail.caution = '可视化优先表达结构，不要堆装饰。';
        } else if (method.category === 'inferential') {
            detail.charts = ['组间箱线图', '显著性标注图', '森林图'];
            detail.implementation = ['Python: scipy / statsmodels / pingouin', 'R: rstatix / ggpubr / broom'];
            detail.steps = ['确认正态性与方差齐性', '选择参数或非参数检验', '展示 p 值、效应量与置信区间'];
            detail.caution = '推断统计必须交代假设、样本量和多重比较校正。';
        } else if (method.category === 'multivariate') {
            detail.charts = ['碎石图', '双标图', '载荷图', '聚类树状图'];
            detail.implementation = ['Python: sklearn / prince / seaborn', 'R: FactoMineR / factoextra'];
            detail.steps = ['先标准化变量', '再做降维或聚类', '解释主成分或簇的含义'];
            detail.caution = '多变量方法依赖变量预处理。';
        } else if (method.category === 'spatial') {
            detail.charts = ['分级设色图', '气泡图', 'Moran 散点图', 'LISA 聚类图'];
            detail.implementation = ['Python: geopandas / esda / contextily', 'R: sf / tmap / spdep / leaflet'];
            detail.steps = ['统一投影坐标系', '检查空间自相关', '选择静态图或交互地图'];
            detail.caution = '空间分析先看投影、尺度和邻接矩阵。';
        } else if (method.category === 'timeseries') {
            detail.charts = ['时间序列图', 'ACF/PACF 图', '分解图', '预测区间图'];
            detail.implementation = ['Python: statsmodels / prophet / pmdarima', 'R: forecast / fable / feasts'];
            detail.steps = ['先看趋势与季节性', '再做平稳化或差分', '最后展示预测区间与残差诊断'];
            detail.caution = '时间序列要处理自相关和结构突变。';
        } else if (method.category === 'causal') {
            detail.charts = ['DAG 因果图', '平衡性图', '事件研究图', '森林图'];
            detail.implementation = ['Python: dowhy / econml', 'R: MatchIt / fixest / did'];
            detail.steps = ['明确处理变量、结果变量和混杂项', '检查识别策略', '报告稳健性与敏感性分析'];
            detail.caution = '因果分析依赖识别假设，不等于相关分析。';
        } else if (method.category === 'bayesian') {
            detail.charts = ['后验密度图', '轨迹图', '森林图', '后验预测检验图'];
            detail.implementation = ['Python: pymc / arviz', 'R: brms / bayesplot / rstan'];
            detail.steps = ['设定先验与似然', '检查收敛与采样质量', '展示后验区间与预测分布'];
            detail.caution = '贝叶斯结果要结合先验和收敛诊断。';
        } else if (method.category === 'ml') {
            detail.charts = ['特征重要性图', 'SHAP 图', 'ROC/PR 曲线', '混淆矩阵'];
            detail.implementation = ['Python: scikit-learn / shap', 'R: tidymodels / vip / DALEX'];
            detail.steps = ['划分训练集和验证集', '交叉验证和调参', '解释模型性能和可解释性'];
            detail.caution = '机器学习图表要放在验证集上看。';
        } else if (method.category === 'dl') {
            detail.charts = ['训练曲线', '学习率曲线', '注意力热图', '特征图'];
            detail.implementation = ['Python: PyTorch / TensorFlow / Keras', 'TensorBoard / Weights & Biases'];
            detail.steps = ['记录损失、精度和梯度', '监控过拟合和收敛速度', '输出可视化诊断图'];
            detail.caution = '深度学习不要只看最终分数。';
        }

        if (/anova|方差分析/.test(name)) {
            detail.charts = ['组间箱线图', '均值点图', '事后比较图', '显著性标注图'];
            detail.implementation = ['Python: statsmodels + seaborn + statannotations', 'R: aov() / emmeans / ggpubr', 'GraphPad Prism'];
        } else if (/t-test|t检验|welch/.test(name)) {
            detail.charts = ['两组箱线图', '配对前后散点连线图', '均值差森林图'];
            detail.implementation = ['Python: scipy.stats.ttest_ind / ttest_rel', 'R: t.test() / ggpubr'];
        } else if (/regression|回归/.test(name)) {
            detail.charts = ['散点回归图', '残差图', '系数森林图', '预测值对比图'];
            detail.implementation = ['Python: statsmodels + seaborn', 'R: ggplot2 + broom + performance'];
        } else if (/pca|主成分/.test(name)) {
            detail.charts = ['碎石图', '双标图', '得分散点图', '载荷图'];
            detail.implementation = ['Python: sklearn + plotly', 'R: FactoMineR + factoextra'];
        } else if (/cluster|聚类/.test(name)) {
            detail.charts = ['聚类热图', '树状图', '二维嵌入散点图', '轮廓系数图'];
            detail.implementation = ['Python: sklearn + seaborn clustermap', 'R: pheatmap + factoextra'];
        } else if (/spatial|空间|遥感/.test(name)) {
            detail.charts = ['专题地图', '热点图', '空间权重图', '局部 Moran 图'];
            detail.implementation = ['Python: geopandas + esda', 'R: sf + tmap + spdep', 'QGIS / ArcGIS'];
        } else if (/time series|arima|lstm|gru|时序|时间序列/.test(name)) {
            detail.charts = ['时间序列图', 'ACF/PACF', '预测区间图', '残差诊断图'];
            detail.implementation = ['Python: statsmodels / prophet / pytorch', 'R: forecast / fable'];
        }

        return detail;
    }

    function refreshStatsVisualizationGuides() {
        if (typeof STATS_METHODS === 'undefined' || !Array.isArray(STATS_METHODS)) return;
        STATS_METHODS.forEach(method => { method.visualGuide = buildStatsVisualizationDetailClean(method); });
    }

    refreshStatsVisualizationGuides();

    const StatsFeature = (() => {
        let activeStage = 'all', activeDisc = 'all', searchQuery = '';
        const stageBg = {descriptive:'#3b82f6',visualization:'#8b5cf6',inferential:'#10b981',multivariate:'#f59e0b',spatial:'#06b6d4',timeseries:'#ec4899',causal:'#ef4444',bayesian:'#a855f7',ml:'#22c55e',dl:'#f97316'};
        const stageLbl = {descriptive:'描述统计',visualization:'数据可视化',inferential:'推断统计',multivariate:'多变量分析',spatial:'空间分析',timeseries:'时间序列',causal:'因果推断',bayesian:'贝叶斯',ml:'机器学习',dl:'深度学习'};
        const discLbl = {general:'通用',ecology:'生态学',environmental:'环境科学',sociology:'社会学',economics:'经济学'};
        function dots(n) { return Array.from({length:5},(_,i)=>'<span class="stats-difficulty-dot'+(i<n?' filled':'')+'"></span>').join(''); }
        function getList() {
            if (typeof STATS_METHODS === 'undefined') return [];
            const q = searchQuery;
            return STATS_METHODS.filter(m =>
                (activeStage === 'all' || m.category === activeStage) &&
                (activeDisc === 'all' || m.discipline.includes(activeDisc)) &&
                (!q || m.name.includes(q) || m.nameEn.toLowerCase().includes(q) || (m.tools||[]).some(t => t.toLowerCase().includes(q)))
            );
        }
        function render() {
            const grid = document.getElementById('statsGrid');
            const info = document.getElementById('statsResultInfo');
            if (!grid) return;
            const list = getList();
            if (info) info.textContent = '共 ' + list.length + ' 个方法';
            if (!list.length) { grid.innerHTML = '<div class="stats-empty"><i class="fas fa-search"></i><p>没有匹配的方法</p></div>'; return; }
            grid.innerHTML = list.map(m => {
                const bg = stageBg[m.category] || '#6366f1';
                const lbl = stageLbl[m.category] || m.category;
                const discs = (m.discipline||[]).map(d => '<span class="stats-disc-chip ' + d + '">' + (discLbl[d]||d) + '</span>').join('');
                const tools = (m.tools||[]).slice(0,3).map(t => '<span class="stats-tool-chip">' + t.split(':')[0] + '</span>').join('');
                const hasResources = m.resources && m.resources.length > 0;
                const guide = m.visualGuide || {};
                const charts = (guide.charts || []).slice(0, 4).map(item => '<span class="stats-visual-chip">' + item + '</span>').join('');
                const impl = (guide.implementation || []).slice(0, 2).map(item => '<div class="stats-impl-line">' + item + '</div>').join('');
                return '<article class="stats-card stats-card--full" data-method-id="' + m.id + '">'
                    + '<div class="stats-card-summary">'
                    + '<div class="stats-card-summary-main">'
                    + '<div class="stats-card-head"><div class="stats-card-icon" style="background:' + bg + '"><i class="' + (m.icon||'fas fa-chart-bar') + '"></i></div>'
                    + '<div class="stats-card-title"><div class="stats-card-name">' + m.name + '</div>'
                    + '<div class="stats-card-name-en">' + m.nameEn + '</div>'
                    + '<span class="stats-stage-badge" style="background:' + bg + '">' + lbl + '</span></div></div>'
                    + '<p class="stats-card-desc stats-card-desc--compact">' + m.desc + '</p>'
                    + '<div class="stats-card-summary-meta"><span class="stats-summary-usecase">' + m.useCase + '</span>' + discs + '</div>'
                    + '</div>'
                    + '<div class="stats-card-summary-side">'
                    + '<div class="stats-tools">' + tools + '</div>'
                    + '<div class="stats-difficulty"><span class="stats-difficulty-label">难度</span>' + dots(m.difficulty||1) + '</div>'
                    + '<div class="stats-card-summary-hint"><i class="fas fa-square-list"></i> 方法内容全展开</div>'
                    + '</div>'
                    + '<div class="stats-card-body">'
                    + '<div class="stats-card-body-grid">'
                    + '<div class="stats-visual-block"><div class="stats-block-title">建议图形</div><div class="stats-visual-chips">' + charts + '</div></div>'
                    + '<div class="stats-impl-block"><div class="stats-block-title">实现方式</div>' + impl + '</div>'
                    + '</div>'
                    + '<div class="stats-caution"><i class="fas fa-triangle-exclamation"></i><span>' + (guide.caution || '注意报告效应量、置信区间和样本条件。') + '</span></div>'
                    + '<div class="stats-card-footer"><div class="stats-tools">' + tools + '</div>'
                    + '<div class="stats-difficulty"><span class="stats-difficulty-label">难度</span>' + dots(m.difficulty||1) + '</div></div>'
                    + (hasResources ? '<div class="stats-card-resources"><button class="btn-resources-small" data-method-id="' + m.id + '"><i class="fas fa-graduation-cap"></i> 参考资源</button></div>' : '')
                    + '<div class="stats-disc-chips">' + discs + '</div>'
                    + '</div>'
                    + '</article>';
            }).join('');
            document.querySelectorAll('.btn-resources-small').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const methodId = parseInt(btn.dataset.methodId);
                    renderResourcesModal(methodId);
                });
            });
        }
        function init() {
            document.querySelectorAll('.stats-stage-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.stats-stage-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active'); activeStage = tab.dataset.stage; render();
                });
            });
            document.querySelectorAll('.stats-disc-tag').forEach(tag => {
                tag.addEventListener('click', () => {
                    document.querySelectorAll('.stats-disc-tag').forEach(t => t.classList.remove('active'));
                    tag.classList.add('active'); activeDisc = tag.dataset.disc; render();
                });
            });
            const s = document.getElementById('statsSearch');
            if (s) { let st; s.addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => { searchQuery = e.target.value.toLowerCase().trim(); render(); }, 250); }); }
            render();
        }
        return { init, render };
    })();

    // ---- 登录系统（localStorage 模拟）---
    function getUser() { return loadLS('sciai-user', null); }
    function makeAvatar(name) {
        const colors = ['#6366f1','#8b5cf6','#ec4899','#f97316','#10b981','#3b82f6','#ef4444','#f59e0b'];
        const color = colors[name.charCodeAt(0) % colors.length];
        const letter = (name[0] || '?').toUpperCase();
        return { color, letter };
    }
    function renderAvatarEl(el, name) {
        if (!el) return;
        const { color, letter } = makeAvatar(name);
        el.style.background = color;
        el.textContent = letter;
    }
    function updateLoginBtn(user) {
        if (user) {
            const { color, letter } = makeAvatar(user.name);
            loginBtn.innerHTML = `<span class="user-avatar-sm" style="background:${color}">${letter}</span> ${user.name}`;
        } else {
            loginBtn.innerHTML = '<i class="fab fa-github"></i> 登录';
        }
    }
    function refreshLoginModal() {
        const user = getUser();
        const formEl = $('#loginForm');
        const profileEl = $('#loggedInView');
        if (!formEl || !profileEl) return;
        if (user) {
            formEl.style.display = 'none';
            profileEl.style.display = '';
            renderAvatarEl($('#userAvatarLg'), user.name);
            $('#userNameDisplay').textContent = user.name;
            $('#userEmailDisplay').textContent = user.email || 'δд䣩';
            $('#userFavCount').textContent = favorites.length;
            $('#userSavedCount').textContent = JSON.parse(localStorage.getItem('sciai-saved-papers') || '[]').length;
            $('#userDeckCount').textContent = JSON.parse(localStorage.getItem('sciai-deck-saved') || '[]').length;
        } else {
            formEl.style.display = '';
            profileEl.style.display = 'none';
            $('#loginAvatarPreview').innerHTML = '';
        }
    }
    function doLocalLogin() {
        const name = $('#loginUsername')?.value.trim();
        if (!name) { showToast('请输入用户名'); return; }
        const email = $('#loginEmail')?.value.trim() || '';
        const user = { name, email, createdAt: Date.now() };
        saveLS('sciai-user', user);
        // 迁移收藏到用户 key
        saveLS(`sciai-favs-${name}`, favorites);
        updateLoginBtn(user);
        refreshLoginModal();
        showToast(`欢迎 ${name}！已本地登录 ✅`);
    }
    function doLogout() {
        localStorage.removeItem('sciai-user');
        updateLoginBtn(null);
        loginModal.classList.remove('show');
        showToast('退出登录');
    }

    // ---- 收藏导出 Markdown ----
    function exportFavoritesMarkdown() {
        const favTools = favorites.map(id => TOOLS_DATA.find(t => t.id === id)).filter(Boolean);
        if (!favTools.length) { showToast('暂无收藏工具'); return; }
        const catNames = {
            writing:'论文写作', reading:'文献阅读', data:'数据分析',
            figure:'科研绘图', code:'代码助手', experiment:'实验设计',
            llm:'大语言模型', 'image-ai':'AI绘画', voice:'语音合成',
            video:'AI 视频', aisoft:'AI 软件推荐', agents:'智能体与自动化', cli:'CLI 工具'
        };
        const pricingMap = { free:'免费', freemium:'免费增值', paid:'付费' };
        const cats = [...new Set(favTools.map(t => t.category))];
        const lines = [
            '# 我的 SciAI Hub 收藏\n',
            `> 共 ${favTools.length} 款工具 · 导出于 ${new Date().toLocaleDateString('zh-CN')}\n`,
            '---\n',
        ];
        cats.forEach(cat => {
            lines.push(`\n## ${catNames[cat] || cat}\n`);
            favTools.filter(t => t.category === cat).forEach(t => {
                lines.push(`### [${t.name}](${t.url})`);
                lines.push(`- **评分**: ${t.rating} / 5.0 · **用户量**: ${t.users} · **价格**: ${pricingMap[t.pricing] || t.pricing}`);
                lines.push(`- ${t.desc}\n`);
            });
        });
        lines.push(`---\n*来源：[SciAI Hub](https://sciai-hub.vercel.app)*`);
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `sciai-favorites-${new Date().toISOString().slice(0,10)}.md`;
        a.click();
        URL.revokeObjectURL(a.href);
        showToast('ղ已登录 ?');
    }

    // ---- 学习资源模态框 ----
    function renderResourceItem(resource) {
        const {type, platform, title, url, icon, level, instructor} = resource;
        return `
            <a href="${url}" target="_blank" rel="noopener" class="resource-item">
                <div class="resource-icon">
                    <i class="${icon || 'fas fa-book'}"></i>
                </div>
                <div class="resource-info">
                    <div class="resource-title">${title}</div>
                    <div class="resource-meta">
                        <span class="platform">${platform}</span>
                        ${level ? `<span class="level">${level}</span>` : ''}
                        ${instructor ? `<span class="instructor">${instructor}</span>` : ''}
                    </div>
                </div>
                <i class="fas fa-external-link-alt"></i>
            </a>
        `;
    }

    function renderResourcesModal(methodId) {
        if (typeof STATS_METHODS === 'undefined') return;
        const method = STATS_METHODS.find(m => m.id === methodId);
        if (!method || !method.resources || !method.resources.length) {
            showToast('暂无学习资源');
            return;
        }

        const resourcesModal = $('#resourcesModal');
        const title = $('#resourcesModalTitle');
        const container = $('#resourcesContainer');

        if (!resourcesModal || !title || !container) return;

        title.textContent = `${method.name} 学习资源`;

        const guide = method.visualGuide || {};
        const detailBlock = `
            <div class="resource-section">
                <h4>详细信息</h4>
                <div class="stats-detail-panel">
                    <div class="stats-detail-group">
                        <strong>建议图形</strong>
                        <div class="stats-visual-chips">${(guide.charts || []).map(item => `<span class="stats-visual-chip">${item}</span>`).join('')}</div>
                    </div>
                    <div class="stats-detail-group">
                        <strong>实现方式</strong>
                        <div class="stats-detail-lines">${(guide.implementation || []).map(item => `<div class="stats-impl-line">${item}</div>`).join('')}</div>
                    </div>
                    <div class="stats-detail-group">
                        <strong>可视化步骤</strong>
                        <div class="stats-detail-lines">${(guide.steps || []).map(item => `<div class="stats-impl-line">${item}</div>`).join('')}</div>
                    </div>
                    <div class="stats-detail-group">
                        <strong>注意事项</strong>
                        <div class="stats-impl-line">${guide.caution || '注意报告效应量、置信区间和样本条件。'}</div>
                    </div>
                </div>
            </div>
        `;

        // 按类型分组学习资源
        const grouped = {};
        method.resources.forEach(r => {
            if (!grouped[r.type]) grouped[r.type] = [];
            grouped[r.type].push(r);
        });

        const typeLabels = {docs: '官方文档', course: '在线课程', paper: '论文资源'};
        const typeOrder = ['docs', 'course', 'paper'];

        container.innerHTML = detailBlock + typeOrder
            .filter(type => grouped[type])
            .map(type => {
                const items = grouped[type];
                return `
                    <div class="resource-section">
                        <h4>${typeLabels[type] || type}</h4>
                        <div class="resource-list">
                            ${items.map(r => renderResourceItem(r)).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        resourcesModal.classList.add('show');
    }

    // ---- 初始化 ----
    function init() {
        renderFeatured();
        renderTools(TOOLS_DATA);
        renderPrompts(PROMPTS_DATA);
        renderTutorials(TUTORIALS_DATA);
        renderNews(currentNewsData);
        fetchLiveNews(false).then(data => {
            if (Array.isArray(data) && data.length) renderNews(data);
        }).catch(() => {});
        renderGithubRepos();
        fetchFrontierRising('all');
        bindFrontierEvents();
        fetchGithubTrending();
        setInterval(fetchGithubTrending, 10 * 60 * 1000);
        setInterval(() => {
            if (currentCategory === 'news' && document.querySelector('.news-tab.active')?.dataset.tab === 'arxiv') fetchArxivLatest();
        }, 10 * 60 * 1000);
        setInterval(() => {
            if (currentCategory === 'news') fetchLiveNews(true).then(data => renderNews(data || currentNewsData)).catch(() => {});
        }, 20 * 60 * 1000);
        setInterval(() => {
            if (currentCategory === 'models') refreshModelsData(true, true);
        }, 30 * 60 * 1000);
        renderUseCases();
        if (typeof initRecommend === 'function') initRecommend();
        bindEvents();
        animateStats();
        loadTheme();
        updateFavBadge();
        updateCompareBar();
        applySidebarCollapse();
        if (typeof GraphFeature !== 'undefined') GraphFeature.init();
        if (typeof SearchFeature !== 'undefined') SearchFeature.init();
        if (typeof JournalFeature !== 'undefined') JournalFeature.init();
        if (typeof CiteCheckFeature !== 'undefined') CiteCheckFeature.init();
        if (typeof PaperDeckFeature !== 'undefined') PaperDeckFeature.init();
        StatsFeature.init();
        StatsFeature.init();
        // ʼʵʱ API Ͷ̬ǩ
        if (typeof initializeRealtimeAPIs !== 'undefined') {
            initializeRealtimeAPIs();
        }
        // ȫ周增长率Ǳ
        const badge = $('#navBadgeAll');
        if (badge) badge.textContent = TOOLS_DATA.length;
        // ָ¼״̬
        updateLoginBtn(getUser());
        // ʼ参数量书ģ
        if (typeof GraphFeature !== 'undefined') GraphFeature.init();
        if (typeof SearchFeature !== 'undefined') SearchFeature.init();
        if (typeof JournalFeature !== 'undefined') JournalFeature.init();
        if (typeof CiteCheckFeature !== 'undefined') CiteCheckFeature.init();
        if (typeof PaperDeckFeature !== 'undefined') PaperDeckFeature.init();
    }

    function bootApp() {
        try {
            init();
        } catch (err) {
            console.error('SciAI Hub startup failed:', err);
            if (document.body) {
                showToast('页面初始化失败，请刷新重试');
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootApp, { once: true });
    } else {
        bootApp();
    }
})();

