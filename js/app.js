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
    const heroSearch      = $('.editorial-hero-search input') || $('#heroSearch');
    const heroSearchBtn   = $('.editorial-hero-search .hero-search-btn') || $('#heroSearchBtn');
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
    const dailyDigestGrid = document.querySelector('#dailyDigestSection .daily-digest-grid');
    const homePlaybooksGrid = document.querySelector('#homePlaybooksSection .playbooks-grid');
    const homeUpdatesGrid = document.querySelector('#homeUpdatesSection .updates-grid');
    const methodQuickGrid = document.querySelector('#toolsSection .method-quick-grid');

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
    const initialModelsRanking = typeof MODELS_RANKING !== 'undefined' && Array.isArray(MODELS_RANKING) ? MODELS_RANKING : [];
    let currentModelsData  = [...initialModelsRanking];
    let currentModelSnapshotDate = '2026-04-09';
    let currentModelLiveUpdatedAt = null;
    let currentModelCatalogCount = 0;
    let currentModelSnapshotTopCount = initialModelsRanking.length;
    let currentArxivUpdatedAt = null;
    let currentNewsUpdatedAt = null;
    let currentNewsFilter = '全部';
    let currentNewsTab = 'static';
    let currentNewsData = typeof NEWS_DATA !== 'undefined' && Array.isArray(NEWS_DATA) ? [...NEWS_DATA] : [];
    let currentGithubUpdatedAt = null;
    let currentHomeFocus = 'home';
    let currentHomeFocusTitle = '今日精选情报';
    let manifestLoadInFlight = null;
    let manifestState = {
        loaded: false,
        loadedAt: null,
        'ai-daily': null,
        'curated-tools': null,
        'academic-entrypoints': null,
        news: null,
        models: null,
        github: null,
        updates: null
    };
    let newsRefreshInFlight = null;
    let hasRequestedLiveNews = false;
    let modelsRefreshInFlight = null;
    let hasRequestedLiveModelRefresh = false;
    let favorites        = loadLS('sciai-favs', []);
    let recentlyViewed   = loadLS('sciai-recent', []);
    let compareList      = [];   // max 3 ids
    let userLikes        = loadLS('sciai-likes', {});
    let sidebarDrawerOpen = loadLS('sciai-sidebar-drawer-open', false);
    let sidebarPinned     = loadLS('sciai-sidebar-pinned', window.innerWidth >= 1200);
    let sidebarCollapsed  = loadLS('sciai-sidebar-collapsed', false);

    // ---- LS 工具 ----
    function loadLS(key, def) {
        try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); }
        catch { return def; }
    }
    function saveLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { console.warn('localStorage write failed:', key, e); } }
    function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
    function showToast(message) {
        const text = String(message || '');
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body?.appendChild(toast);
        }
        toast.textContent = text;
        toast.classList.add('show');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
    }
    function getCategoryLabel(category) {
        const labels = {
            all: '全部',
            writing: '论文写作',
            reading: '文献阅读',
            data: '数据分析',
            search: '论文检索',
            graph: '研究图谱',
            'search-papers': '论文检索',
            journal: '选刊助手',
            'cite-check': '引文核查',
            paperdeck: 'PaperDeck',
            stats: '统计方法',
            prompts: '研究剧本',
            tutorials: '使用说明',
            news: '资讯',
            models: '模型',
            github: 'GitHub',
            usecases: '案例',
            code: '代码工具',
            agents: '智能体',
            llm: '大模型'
        };
        return labels[String(category || '')] || category || '研究任务';
    }
    function parseUsers(value) {
        const text = String(value || '').replace(/,/g, '').trim().toLowerCase();
        const number = parseFloat(text);
        if (Number.isNaN(number)) return 0;
        if (text.includes('亿')) return number * 100000000;
        if (text.includes('万')) return number * 10000;
        if (text.includes('m')) return number * 1000000;
        if (text.includes('k')) return number * 1000;
        return number;
    }
    function closeSidebarDrawer() {
        sidebarDrawerOpen = false;
        saveLS('sciai-sidebar-drawer-open', sidebarDrawerOpen);
        sidebar?.classList.remove('drawer-open', 'open');
        sidebarBackdrop?.classList.remove('show');
        document.body?.classList.remove('sidebar-drawer-open');
    }
    function isMobileSidebar() {
        return window.matchMedia ? window.matchMedia('(max-width: 768px)').matches : window.innerWidth <= 768;
    }
    function openSidebarDrawer() {
        sidebarDrawerOpen = true;
        saveLS('sciai-sidebar-drawer-open', sidebarDrawerOpen);
        applySidebarCollapse();
    }
    function toggleSidebar() {
        if (isMobileSidebar()) {
            sidebarDrawerOpen ? closeSidebarDrawer() : openSidebarDrawer();
            return;
        }
        sidebarCollapsed = !sidebarCollapsed;
        saveLS('sciai-sidebar-collapsed', sidebarCollapsed);
        applySidebarCollapse();
    }
    function getSidebarCollapsedWidth() {
        if (typeof getComputedStyle !== 'function') return '68px';
        const value = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-collapsed-width').trim();
        return value || '68px';
    }
    function setWorkbenchActive(activeItem) {
        $$('.workbench-sidebar-nav .workbench-nav-item').forEach(item => {
            item.classList.toggle('active', item === activeItem);
            if (item === activeItem) item.setAttribute('aria-current', 'page');
            else item.removeAttribute('aria-current');
        });
    }
    function renderNews(items = currentNewsData) {
        if (!newsList) return;
        const entries = Array.isArray(items) ? items : [];
        newsList.innerHTML = entries.slice(0, 12).map(item => `
            <article class="news-item">
                <div class="news-icon"><i class="${item.icon || 'fas fa-newspaper'}"></i></div>
                <div class="news-info">
                    <div class="news-meta">
                        <span class="news-tag">${escapeHtml(item.category || item.source || '资讯')}</span>
                        <span>${escapeHtml(item.date || '')}</span>
                    </div>
                    <h4>${escapeHtml(item.title || '')}</h4>
                    <p>${escapeHtml(item.desc || item.summary || '')}</p>
                </div>
            </article>
        `).join('');
    }
    function fetchLiveNews() {
        return Promise.resolve(currentNewsData);
    }
    function applyModelFilters() {
        return renderModels(currentModelsData);
    }
    function refreshModelsData() {
        applyModelFilters();
        return Promise.resolve(currentModelsData);
    }
    function renderModels(models = currentModelsData) {
        const grid = $('#modelsGrid');
        if (!grid) return;
        const entries = Array.isArray(models) ? models : [];
        grid.innerHTML = entries.slice(0, 20).map(model => `
            <article class="model-card">
                <div class="model-card-head">
                    <div class="model-card-name">${escapeHtml(model.name || model.model || '')}</div>
                    <span class="model-chip strong">${escapeHtml(model.provider || model.source || 'Model')}</span>
                </div>
                <p class="model-feedback-note">${escapeHtml(model.desc || model.summary || model.note || '')}</p>
            </article>
        `).join('');
    }
    function updateModalFavUI(id) {
        $$('.modal-fav-btn, .card-fav-btn').forEach(btn => {
            if (!btn.dataset.id || sameId(btn.dataset.id, id)) btn.classList.toggle('active', favorites.some(item => sameId(item, id)));
        });
    }
    function updateModalCompareUI(id) {
        $$('.modal-compare-btn, .card-compare-cb').forEach(btn => {
            if (!btn.dataset.id || sameId(btn.dataset.id, id)) btn.classList.toggle('active', compareList.some(item => sameId(item, id)));
        });
    }
    function updateModalLikeUI() {}
    function fetchArxivLatest() {
        return Promise.resolve([]);
    }
    function renderUseCases() {
        const grid = $('#usecasesGrid');
        if (!grid) return;
        const entries = typeof USE_CASES_DATA !== 'undefined' && Array.isArray(USE_CASES_DATA) ? USE_CASES_DATA : [];
        grid.innerHTML = entries.slice(0, 8).map(item => `
            <article class="usecase-card">
                <div class="usecase-icon"><i class="${item.icon || 'fas fa-flask'}"></i></div>
                <h4>${escapeHtml(item.title || item.name || '')}</h4>
                <p>${escapeHtml(item.desc || item.summary || '')}</p>
                ${item.impact ? `<span class="usecase-impact">${escapeHtml(item.impact)}</span>` : ''}
            </article>
        `).join('');
    }
    function bindEvents() {
        mobileMenuBtn?.addEventListener('click', openSidebarDrawer);
        sidebarToggle?.addEventListener('click', toggleSidebar);
        sidebarBackdrop?.addEventListener('click', closeSidebarDrawer);
        sidebarPinBtn?.addEventListener('click', () => {
            sidebarPinned = !sidebarPinned;
            saveLS('sciai-sidebar-pinned', sidebarPinned);
            applySidebarCollapse();
        });
        $$('.nav-anchor').forEach(anchor => {
            anchor.addEventListener('click', event => {
                if (anchor.classList.contains('workbench-nav-item')) {
                    event.preventDefault();
                    currentCategory = 'all';
                    currentHomeFocus = 'home';
                    showSection('all');
                    filterTools();
                    applyNavigationProminence();
                    setWorkbenchActive(anchor);
                    const target = anchor.hash ? document.querySelector(anchor.hash) : null;
                    const scrollTarget = () => target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(scrollTarget);
                    else setTimeout(scrollTarget, 0);
                }
                if (isMobileSidebar()) closeSidebarDrawer();
            });
        });
        $$('.workbench-sidebar-nav .workbench-nav-item.nav-item[data-category]').forEach(item => {
            item.addEventListener('click', event => {
                event.preventDefault();
                const category = item.dataset.category || 'all';
                const homeFocus = item.dataset.homeFocus || '';
                if (category === 'all' && homeFocus) {
                    openStationHomeFocus(homeFocus, item.textContent.trim() || '首页总览');
                } else {
                    openMethodTool(category);
                }
                setWorkbenchActive(item);
                if (isMobileSidebar()) closeSidebarDrawer();
            });
        });
        window.addEventListener('resize', applySidebarCollapse);
        heroSearchBtn?.addEventListener('click', () => doSearch(heroSearch?.value || globalSearch?.value || ''));
        heroSearch?.addEventListener('keydown', event => {
            if (event.key === 'Enter') doSearch(heroSearch.value);
        });
        globalSearch?.addEventListener('keydown', event => {
            if (event.key === 'Enter') doSearch(globalSearch.value);
        });
        toolModalClose?.addEventListener('click', () => toolModal?.classList.remove('show'));
        compareModalClose?.addEventListener('click', () => compareModal?.classList.remove('show'));
        resourcesModalClose?.addEventListener('click', () => resourcesModal?.classList.remove('show'));
    }
    function animateStats() {}
    function loadTheme() {
        const theme = loadLS('sciai-theme', 'light');
        document.documentElement?.setAttribute('data-theme', theme);
        themeToggle?.querySelector('i')?.classList.toggle('fa-sun', theme === 'dark');
    }
    function applySidebarCollapse() {
        if (!sidebar) return;
        const mobile = isMobileSidebar();
        const drawerVisible = mobile && !!sidebarDrawerOpen;
        const desktopCollapsed = !mobile && !!sidebarCollapsed;
        const collapsedWidth = getSidebarCollapsedWidth();

        sidebar.classList.toggle('open', drawerVisible);
        sidebar.classList.toggle('drawer-open', drawerVisible);
        sidebar.classList.toggle('collapsed', desktopCollapsed);
        sidebarBackdrop?.classList.toggle('show', drawerVisible);
        document.body?.classList.toggle('sidebar-drawer-open', drawerVisible);
        document.body?.classList.toggle('sidebar-pinned', !mobile && !!sidebarPinned);
        document.body?.classList.toggle('sidebar-collapsed', desktopCollapsed);

        if (mainContent) mainContent.style.marginLeft = mobile ? '0' : (desktopCollapsed ? collapsedWidth : '');
        if (compareBar) compareBar.style.left = mobile ? '0' : (desktopCollapsed ? collapsedWidth : '');
        sidebarToggle?.setAttribute('title', mobile ? (drawerVisible ? '关闭导航' : '打开导航') : (desktopCollapsed ? '展开导航' : '收起导航'));
        sidebarPinBtn?.classList.toggle('active', !mobile && !!sidebarPinned);
        mobileMenuBtn?.setAttribute('aria-expanded', drawerVisible ? 'true' : 'false');
    }
    const CURATED_MANIFEST_KEYS = ['curated-tools', 'academic-entrypoints', 'ai-daily'];
    const METHOD_ENTRYPOINT_IDS = ['journal', 'cite-check', 'paperdeck', 'stats'];
    const PRIMARY_ENTRYPOINT_IDS = ['graph', 'search-papers', ...METHOD_ENTRYPOINT_IDS];
    const HOME_EXTENSION_SECTION_IDS = ['prompts', 'tutorials', 'news', 'models', 'github', 'usecases'];

    function getStationDataDeps() {
        return {
            getManifestBundle,
            formatManifestFreshness,
            flattenDatasetEntries,
            getStaticToolCatalog,
            getManifestPrimaryRecords,
            toArray,
            uniqueBy,
            sameId,
            featuredTools: typeof FEATURED_TOOLS !== 'undefined' ? FEATURED_TOOLS : [],
            promptsData: typeof PROMPTS_DATA !== 'undefined' ? PROMPTS_DATA : [],
            tutorialsData: typeof TUTORIALS_DATA !== 'undefined' ? TUTORIALS_DATA : [],
            aiDailyFallback: typeof AI_DAILY_FALLBACK !== 'undefined' ? AI_DAILY_FALLBACK : [],
            academicEntrypointsFallback: typeof ACADEMIC_ENTRYPOINTS_FALLBACK !== 'undefined' ? ACADEMIC_ENTRYPOINTS_FALLBACK : [],
            methodToolModules: typeof METHOD_TOOL_MODULES !== 'undefined' ? METHOD_TOOL_MODULES : [],
            stationSearchIndex: typeof STATION_SEARCH_INDEX !== 'undefined' ? STATION_SEARCH_INDEX : [],
            methodEntrypointIds: METHOD_ENTRYPOINT_IDS
        };
    }

    function getStationHomeDeps() {
        return {
            query: $,
            queryAll: $$,
            escapeHtml,
            currentCategory: () => currentCategory,
            curatedManifestKeys: CURATED_MANIFEST_KEYS,
            describeManifestBundle,
            getToolTrustMeta,
            renderTrustStatusRow,
            getCategoryLabel,
            handleStationEntryAction,
            openMethodTool,
            openStationHomeFocus,
            findToolById,
            getFeaturedEntries,
            getMethodToolModules,
            dailyDigestGrid,
            homePlaybooksGrid,
            homeUpdatesGrid,
            methodQuickGrid,
            featuredGrid,
            globalSearch,
            emptyState
        };
    }

    function getStationInteractionDeps() {
        return {
            query: $,
            queryAll: $$,
            escapeHtml,
            sameId,
            parseUsers,
            saveLS,
            showToast,
            sections: () => sections,
            pageTitle,
            exportFavsBtn,
            toolsGrid,
            emptyState,
            favCount,
            compareToggle,
            compareBar,
            compareSlots,
            doCompare,
            compareModal,
            statsFeature: StatsFeature,
            syncToolTabsVisibility,
            closeSidebarDrawer,
            scrollCategoryIntoView,
            renderNews,
            fetchLiveNews,
            applyModelFilters,
            refreshModelsData,
            applyCuratedStationCopy,
            openToolModal,
            updateModalFavUI,
            updateModalCompareUI,
            renderTrustStatusRow,
            getToolTrustMeta,
            findPromptScript,
            findToolById,
            getToolCatalog,
            getStationSearchIndex,
            getCurrentCategory: () => currentCategory,
            setCurrentCategory: value => { currentCategory = value; },
            getCurrentPricing: () => currentPricing,
            getCurrentSort: () => currentSort,
            getCurrentHomeFocusTitle: () => currentHomeFocusTitle,
            setCurrentHomeFocus: value => { currentHomeFocus = value; },
            setCurrentHomeFocusTitle: value => { currentHomeFocusTitle = value; },
            getFavorites: () => favorites,
            setFavorites: value => { favorites = value; },
            getRecentlyViewed: () => recentlyViewed,
            setRecentlyViewed: value => { recentlyViewed = value; },
            getCompareList: () => compareList,
            setCompareList: value => { compareList = value; },
            getCurrentToolId: () => currentToolId,
            getCurrentNewsData: () => currentNewsData,
            getHasRequestedLiveNews: () => hasRequestedLiveNews,
            setHasRequestedLiveNews: value => { hasRequestedLiveNews = value; },
            getHasRequestedLiveModelRefresh: () => hasRequestedLiveModelRefresh,
            setHasRequestedLiveModelRefresh: value => { hasRequestedLiveModelRefresh = value; },
            updateFavBadge
        };
    }

    function formatManifestDate(value, includeTime = true) {
        if (!value) return '';
        const raw = String(value);
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
        const date = new Date(raw);
        if (Number.isNaN(date.getTime())) return raw;
        if (!includeTime) {
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    function formatManifestStatusLabel(status) {
        const map = {
            live: '实时目录',
            snapshot: '周榜快照',
            static: '静态种子',
            seed: '种子数据',
            unknown: '未知状态',
            unavailable: '未加载'
        };
        return map[String(status || '').toLowerCase()] || String(status || '未知状态');
    }

    function getManifestBundle(key) {
        return manifestState[key] || {
            loaded: false,
            loadedAt: null,
            key,
            filePaths: [],
            manifests: [],
            primary: null,
            secondary: [],
            available: false
        };
    }

    function formatManifestFreshness(manifest) {
        if (!manifest) return '鲜度未声明';
        const freshness = manifest.freshness || {};
        if (freshness.snapshotDate) return `快照 ${freshness.snapshotDate}`;
        if (freshness.refreshedAt) return `更新于 ${formatManifestDate(freshness.refreshedAt)}`;
        if (manifest.validatedAt) return `校验于 ${formatManifestDate(manifest.validatedAt)}`;
        if (manifest.sourceFetchedAt) return `抓取于 ${formatManifestDate(manifest.sourceFetchedAt)}`;
        return '鲜度未声明';
    }

    function describeManifestBundle(key) {
        const bundle = getManifestBundle(key);
        const manifest = bundle.primary;
        if (!manifest) {
            return {
                available: false,
                status: 'unavailable',
                summary: '本地 manifest 未加载',
                detail: '将回退到 live fetch / 本地精选',
                source: '本地 fallback',
                freshness: '鲜度未声明',
                provenance: '本地 manifest 缺失',
                path: `data/${key}.manifest.json`,
                manifestCount: 0,
                secondary: ''
            };
        }

        const filePath = manifest.filePath || `data/${key}.manifest.json`;
        const sourceName = manifest.sourceName || manifest.datasetId || key;
        const status = manifest.status || 'unknown';
        const freshness = formatManifestFreshness(manifest);
        const provenanceParts = [filePath, sourceName];
        if (manifest.lineage?.mode) provenanceParts.push(manifest.lineage.mode);
        if (manifest.lineage?.generator) provenanceParts.push(manifest.lineage.generator);

        const secondary = (bundle.secondary || [])
            .map(item => item.sourceName || item.datasetId || '')
            .filter(Boolean)
            .join(' / ');

        return {
            available: true,
            status,
            summary: `${formatManifestStatusLabel(status)} · ${freshness} · ${sourceName}`,
            detail: provenanceParts.join(' · '),
            source: sourceName,
            freshness,
            provenance: provenanceParts.join(' · '),
            path: filePath,
            manifestCount: bundle.manifests?.length || 0,
            validated: manifest.validatedAt ? `验证 ${formatManifestDate(manifest.validatedAt)}` : '',
            fetched: manifest.sourceFetchedAt ? `抓取 ${formatManifestDate(manifest.sourceFetchedAt)}` : '',
            secondary
        };
    }

    function getBundleRecords(key) {
        const records = getManifestBundle(key).primary?.records;
        return Array.isArray(records) ? records : [];
    }

    function buildCuratedToolFromRecord(record, index = 0) {
        const toolId = Number(record?.toolId ?? record?.id);
        const base = (typeof TOOL_DIRECTORY_INDEX !== 'undefined' && TOOL_DIRECTORY_INDEX.get(toolId))
            || TOOLS_DATA.find(tool => Number(tool.id) === toolId);
        if (!base) return null;
        const sectionKey = record.stationSection || 'essential';
        const sectionMeta = (typeof CURATED_STATION_SECTIONS !== 'undefined' && CURATED_STATION_SECTIONS[sectionKey])
            || { label: sectionKey === 'weekly' ? '本周精选' : '高频必备' };
        const bestFor = Array.isArray(record.bestFor) ? record.bestFor.join('、') : (record.bestFor || base.bestFor || '');
        const howToUse = Array.isArray(record.howToUse) ? record.howToUse : [];
        const caution = Array.isArray(record.avoidIf) ? record.avoidIf.join(' / ') : (record.caution || base.caution || '');
        const usageGuide = record.usageGuide
            || howToUse.join(' / ')
            || record.positioning
            || base.usageGuide
            || base.desc;
        const reviewNote = record.whySelected || record.reviewNote || base.reviewNote || base.desc;
        const tags = [...new Set([...(base.tags || []), ...(record.tags || []), sectionMeta.label].filter(Boolean))];
        const keywords = [...new Set([
            ...(base.keywords || []),
            ...(record.tags || []),
            ...(Array.isArray(record.bestFor) ? record.bestFor : []),
            ...(Array.isArray(record.avoidIf) ? record.avoidIf : []),
            bestFor,
            sectionMeta.label
        ].filter(Boolean))];

        return {
            ...base,
            sortOrder: record.sortOrder || ((index + 1) * 10),
            stationSection: sectionKey,
            stationSectionLabel: sectionMeta.label,
            editorialStatus: record.reviewStatus || record.editorialStatus || base.editorialStatus || '编辑复核',
            reviewedAt: record.reviewedAt || base.reviewedAt || '',
            reviewNote,
            usageGuide,
            bestFor,
            quickStart: howToUse[0] || record.quickStart || base.quickStart || '',
            caution,
            relatedIds: base.relatedIds || [],
            tags,
            keywords,
            provenance: {
                ...(base.provenance || {}),
                sourceName: 'curated-tools.manifest',
                status: record.reviewStatus || 'reviewed',
                freshness: record.reviewedAt ? `复核 ${record.reviewedAt}` : '已复核',
                note: reviewNote
            }
        };
    }

    function syncCuratedToolsFromManifest() {
        const records = getBundleRecords('curated-tools');
        if (!records.length) return;
        const hydrated = records
            .map((record, index) => buildCuratedToolFromRecord(record, index))
            .filter(Boolean)
            .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
        if (!hydrated.length) return;
        TOOLS_DATA.splice(0, TOOLS_DATA.length, ...hydrated);
    }

    function getAcademicEntrypointsLegacy() {
        const records = getBundleRecords('academic-entrypoints');
        return records.length
            ? records
            : (Array.isArray(ACADEMIC_ENTRYPOINTS_FALLBACK) ? ACADEMIC_ENTRYPOINTS_FALLBACK : []);
    }

    function getDailyDigestCards() {
        const records = getBundleRecords('ai-daily');
        const issue = records.find(record => Array.isArray(record.highlights) && record.highlights.length);
        if (issue) {
            return issue.highlights.slice(0, 4).map((item, index) => ({
                id: item.id || `${issue.id || 'digest'}-${index + 1}`,
                label: item.category || issue.title || '今日精选',
                title: item.headline || item.title || issue.title || '今日精选情报',
                summary: item.summary || issue.summary || '',
                status: item.importance || issue.reviewStatus || '',
                date: issue.date || '',
                sourceRefs: Array.isArray(item.sourceRefs) ? item.sourceRefs : []
            }));
        }
        return (Array.isArray(AI_DAILY_FALLBACK) ? AI_DAILY_FALLBACK : []).slice(0, 4).map(item => ({
            id: item.id,
            label: item.status || '今日精选',
            title: item.title,
            summary: item.desc || item.note || '',
            status: item.views || '',
            date: item.date || '',
            url: item.url || ''
        }));
    }

    function renderDailyDigest(entries) {
        return window.SciAIStationHome.renderDailyDigest(getStationHomeDeps(), entries);
    }

    function renderStationPlaybooks() {
        if (!homePlaybooksGrid) return;
        const entries = getAcademicEntrypoints();
        const priorityEntries = PRIMARY_ENTRYPOINT_IDS
            .map(id => entries.find(entry => String(entry.category || entry.id) === id))
            .filter(Boolean)
            .slice(0, 5);

        homePlaybooksGrid.innerHTML = priorityEntries.map((entry, index) => `
            <article class="playbook-card" data-station-kind="entrypoint" data-station-ref="${escapeHtml(entry.category || entry.id)}">
                <div class="tool-card-header">
                    <div class="tool-icon" style="background:${entry.color || '#0f766e'}">
                        <i class="${entry.icon || 'fas fa-route'}"></i>
                    </div>
                    <div class="tool-card-info">
                        <h4>${escapeHtml(entry.title || entry.name || '研究入口')}</h4>
                        <div class="tool-tags">
                            <span class="tool-tag">${String(index + 1).padStart(2, '0')}</span>
                            ${entry.status ? `<span class="tool-tag">${escapeHtml(entry.status)}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="tool-card-desc">${escapeHtml(entry.desc || entry.summary || '')}</div>
                ${entry.usageGuide ? `<div class="tool-card-desc">${escapeHtml(entry.usageGuide)}</div>` : ''}
                <div class="tool-card-footer">
                    <div class="tool-users"><i class="fas fa-route"></i>${escapeHtml(entry.actionLabel || '打开入口')}</div>
                    <button class="btn-copy station-search-action" data-kind="entrypoint" data-ref="${escapeHtml(entry.category || entry.id)}">${escapeHtml(entry.actionLabel || '打开入口')}</button>
                </div>
            </article>
        `).join('');

        homePlaybooksGrid.querySelectorAll('.station-search-action').forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                handleStationEntryAction(btn.dataset.kind, btn.dataset.ref);
            });
        });
        homePlaybooksGrid.querySelectorAll('[data-station-kind]').forEach(card => {
            card.addEventListener('click', () => handleStationEntryAction(card.dataset.stationKind, card.dataset.stationRef));
        });
    }

    function getToolTrustMeta(tool, variant = 'tool') {
        const provenance = tool?.provenance || {};
        const source = provenance.sourceName || tool?.sourceName || tool?.source || tool?.origin
            || (variant === 'featured' ? '本地精选' : '本地精选');
        const status = provenance.status || tool?.status
            || (tool?.source || tool?.sourceName || tool?.origin || provenance.sourceName ? '已标注来源' : '来源未单独标注');
        const freshness = provenance.freshness
            || (tool?.updatedAt ? `更新于 ${formatManifestDate(tool.updatedAt)}` : '')
            || (tool?.lastUpdatedAt ? `更新于 ${formatManifestDate(tool.lastUpdatedAt)}` : '')
            || '更新时间未单独标注';
        const note = provenance.note
            || (tool?.source || tool?.sourceName || tool?.origin || provenance.sourceName ? '可追溯来源' : '人工整理条目');
        return { source, status, freshness, note };
    }

    function renderTrustStatusRow(meta, compact = false) {
        const chips = [
            `<span class="trust-status-chip">来源：${escapeHtml(meta.source)}</span>`,
            `<span class="trust-status-chip">状态：${escapeHtml(meta.status)}</span>`
        ];
        if (!compact) chips.push(`<span class="trust-status-chip">鲜度：${escapeHtml(meta.freshness)}</span>`);
        return `<div class="trust-status-row">${chips.join('')}</div><div class="trust-status-note">${escapeHtml(meta.note)}</div>`;
    }

    function resolveHomeFocus(label = '', category = '') {
        const text = `${label} ${category}`.replace(/\s+/g, '');
        if (/科研路线|路线|route|roadmap/i.test(text)) return 'route';
        if (/剧本|playbook/i.test(text)) return 'playbooks';
        if (/更新|changelog|update/i.test(text)) return 'updates';
        if (/找工具|工具|tool|search/i.test(text)) return 'tools';
        if (/精选推荐|推荐|featured/i.test(text)) return 'featured';
        if (/首页|home|今日精选|today|briefing|all|overview/i.test(text)) return 'home';
        return 'home';
    }

    function resolveLegacyHomeAlias(label = '', category = '') {
        const text = `${label} ${category}`.replace(/\s+/g, '').toLowerCase();
        if (/全部工具|alltools|tooldirectory|toolindex/.test(text)) {
            return { focus: 'tools', title: '高频学术模块' };
        }
        if (/导航平台|导航站|portal|总站|总览|overview/.test(text)) {
            return { focus: 'home', title: '今日精选情报' };
        }
        return null;
    }

    function resolveNavTarget(item) {
        const rawCategory = String(item?.dataset?.category || '').trim();
        const explicitFocus = String(item?.dataset?.homeFocus || '').trim();
        const label = String(item?.querySelector('span')?.textContent || item?.textContent || '').trim();
        const normalizedLabel = label.replace(/\s+/g, '');
        const legacyAlias = resolveLegacyHomeAlias(label, rawCategory);
        const homeAlias = /^(all|home|homepage|overview|首页|今日精选情报|科研路线|本周精选|研究剧本|高频学术模块|使用说明|全部工具|导航平台|portal|总站|总览)$/i.test(rawCategory)
            || /首页|今日精选情报|科研路线|本周精选|研究剧本|高频学术模块|使用说明|全部工具|导航平台|总站|总览/.test(normalizedLabel)
            || Boolean(legacyAlias);
        if (homeAlias) {
            const focus = explicitFocus || legacyAlias?.focus || resolveHomeFocus(label, rawCategory);
            const titleMap = {
                home: '今日精选情报',
                route: '科研路线',
                playbooks: '研究剧本',
                tools: '高频学术模块',
                featured: '本周精选',
                updates: '使用与更新说明'
            };
            return {
                category: 'all',
                focus,
                title: legacyAlias?.title || titleMap[focus] || label || '今日精选情报'
            };
        }
        return {
            category: rawCategory || 'all',
            focus: null,
            title: label || rawCategory || '精选研究站'
        };
    }

    function getHomeAnchorSelector(focus) {
        if (focus === 'route') return '#researchRouteSection';
        if (focus === 'playbooks') return '#homePlaybooksSection';
        if (focus === 'tools') return '#toolsSection';
        if (focus === 'featured') return '#featuredSection';
        if (focus === 'updates') return '#homeUpdatesSection';
        return '#heroSection';
    }

    function scrollCategoryIntoView(cat, options = {}) {
        if (cat === 'all') {
            const selector = getHomeAnchorSelector(options.focus || currentHomeFocus);
            document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
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

    function renderHomepageTrustSummaryLegacy() {
        const panel = $('.hero-trust-card');
        const newsMeta = describeManifestBundle('news');
        const modelMeta = describeManifestBundle('models');
        const githubMeta = describeManifestBundle('github');
        const loadedCount = [newsMeta, modelMeta, githubMeta].filter(meta => meta.available).length;

        if (panel) {
            panel.innerHTML = `
                <span class="hero-panel-label">Trust Summary</span>
                <h3>${loadedCount}/3 份 manifest 可用，本地清单优先，live fetch 只做回退。</h3>
                <p>首页右侧直接展示来源、鲜度和回退机制，不再用泛化数字包装状态。</p>
                <div class="section-sub">${newsMeta.detail} · ${modelMeta.detail} · ${githubMeta.detail}</div>
            `;
        }

        const slotContent = {
            freshness: {
                title: loadedCount === 3 ? '清单已接入' : `已加载 ${loadedCount}/3`,
                detail: `新闻 ${newsMeta.freshness} · 模型 ${modelMeta.freshness} · GitHub ${githubMeta.freshness}`
            },
            provenance: {
                title: `${newsMeta.source} / ${modelMeta.source} / ${githubMeta.source}`,
                detail: '各数据块优先显示来源说明与校验状态。'
            },
            coverage: {
                title: '路线 · 精选 · 工具',
                detail: '先看任务路径，再看可信推荐，最后进入具体模块。'
            }
        };

        Object.entries(slotContent).forEach(([slot, content]) => {
            const card = document.querySelector(`.hero-status-card[data-status-slot="${slot}"]`);
            if (!card) return;
            const strong = card.querySelector('strong');
            const small = card.querySelector('small');
            if (strong) strong.textContent = content.title;
            if (small) small.textContent = content.detail;
        });

        const trustLines = $$('.hero-trust-line');
        const lineContent = [
            ['首页定位', 'Research workbench'],
            ['数据来源', `${newsMeta.source} / ${modelMeta.source} / ${githubMeta.source}`],
            ['回退机制', 'manifest -> live fetch -> 本地精选']
        ];
        trustLines.forEach((line, idx) => {
            const content = lineContent[idx];
            if (!content) return;
            const span = line.querySelector('span');
            const strong = line.querySelector('strong');
            if (span) span.textContent = content[0];
            if (strong) strong.textContent = content[1];
        });
    }

    function renderQualityStatusBandLegacy() {
        const band = $('#statsSection');
        if (!band) return;
        const newsMeta = describeManifestBundle('news');
        const modelMeta = describeManifestBundle('models');
        const githubMeta = describeManifestBundle('github');
        const overallLoaded = [newsMeta, modelMeta, githubMeta].filter(meta => meta.available).length;
        const headline = band.querySelector('.quality-band-head h3');
        const subline = band.querySelector('.quality-band-head p');
        if (headline) headline.textContent = `${overallLoaded}/3 份 manifest 已接入，状态提示不再覆盖设计结构。`;
        if (subline) subline.textContent = '质量带直接消费 manifest 的鲜度、来源和回退信息，保留首页的新层级表达。';

        const cardContent = {
            catalog: {
                title: `清单 ${overallLoaded}/3`,
                detail: '本地 manifest 优先，缺失时退回 live fetch 或本地精选。'
            },
            freshness: {
                title: modelMeta.freshness,
                detail: `新闻 ${newsMeta.freshness} · GitHub ${githubMeta.freshness}`
            },
            provenance: {
                title: `${newsMeta.source} / ${modelMeta.source}`,
                detail: `${githubMeta.source} · ${modelMeta.provenance}`
            },
            fallback: {
                title: 'Honest defaults',
                detail: '缺少清单时明确显示 fallback，不把静态内容伪装成实时结果。'
            }
        };

        Object.entries(cardContent).forEach(([slot, content]) => {
            const card = band.querySelector(`.quality-card[data-status-slot="${slot}"]`);
            if (!card) return;
            const strong = card.querySelector('strong');
            const small = card.querySelector('small');
            if (strong) strong.textContent = content.title;
            if (small) small.textContent = content.detail;
        });
    }

    async function bootstrapManifestState() {
        if (manifestLoadInFlight) return manifestLoadInFlight;
        if (typeof DataManifestAPI === 'undefined') {
            manifestState = {
                loaded: true,
                loadedAt: new Date().toISOString(),
                'ai-daily': null,
                'curated-tools': null,
                'academic-entrypoints': null,
                news: null,
                models: null,
                github: null,
                updates: null
            };
            return Promise.resolve(manifestState);
        }
        manifestLoadInFlight = (async () => {
            const [aiDaily, curatedTools, academicEntrypoints, news, models, github, updates] = await Promise.all([
                DataManifestAPI.loadDataset('ai-daily'),
                DataManifestAPI.loadDataset('curated-tools'),
                DataManifestAPI.loadDataset('academic-entrypoints'),
                DataManifestAPI.loadDataset('news'),
                DataManifestAPI.loadDataset('models'),
                DataManifestAPI.loadDataset('github'),
                DataManifestAPI.loadDataset('updates')
            ]);
            manifestState = {
                loaded: true,
                loadedAt: new Date().toISOString(),
                'ai-daily': aiDaily,
                'curated-tools': curatedTools,
                'academic-entrypoints': academicEntrypoints,
                news,
                models,
                github,
                updates
            };
            syncCuratedToolsFromManifest();
            renderHomepageAssembly();
            filterTools();
            currentNewsUpdatedAt = news.primary?.validatedAt || news.primary?.sourceFetchedAt || currentNewsUpdatedAt;
            currentModelLiveUpdatedAt = models.primary?.validatedAt || models.primary?.sourceFetchedAt || currentModelLiveUpdatedAt;
            currentGithubUpdatedAt = github.primary?.validatedAt || github.primary?.sourceFetchedAt || currentGithubUpdatedAt;
            currentModelSnapshotDate = models.primary?.freshness?.snapshotDate || currentModelSnapshotDate;
            refreshManifestAwareChrome();
            return manifestState;
        })().finally(() => {
            manifestLoadInFlight = null;
        });
        return manifestLoadInFlight;
    }

    function refreshManifestAwareChromeLegacy() {
        renderHomepageTrustSummary();
        renderQualityStatusBand();
        updateNewsSectionMeta();
        updateModelsSectionMeta();
        updateGithubSectionMeta();
        updateHomeUpdatesSectionMeta();
    }

    function updateModelsSectionMeta() {
        const meta = $('#modelsMetaInfo');
        if (!meta) return;
        const bundle = describeManifestBundle('models');
        const liveLabel = currentModelLiveUpdatedAt ? ` · 目录实时同步 ${formatManifestDate(currentModelLiveUpdatedAt)}` : '';
        const catalogLabel = currentModelCatalogCount ? ` · 官方目录 ${currentModelCatalogCount} 个模型` : '';
        const snapshotLabel = currentModelSnapshotTopCount ? ` · Top ${currentModelSnapshotTopCount} 为快照 ${currentModelSnapshotDate}` : '';
        meta.textContent = `${bundle.summary}${liveLabel}${catalogLabel}${snapshotLabel}`;
    }

    function updateGithubSectionMeta() {
        const el = $('#githubUpdateTime');
        if (!el) return;
        const bundle = describeManifestBundle('github');
        const liveLabel = currentGithubUpdatedAt ? ` · 实时更新 ${formatManifestDate(currentGithubUpdatedAt)}` : '';
        el.textContent = `${bundle.summary}${liveLabel}`;
    }

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

    function normalizeGithubRepo(record, index = 0) {
        if (!record || typeof record !== 'object') return null;
        const name = record.name || record.title;
        const owner = record.owner || record.org || record.sourceOwner || '';
        const url = record.url || record.link || (owner && name ? `https://github.com/${owner}/${name}` : '');
        if (!name || !url) return null;
        return {
            id: record.id || `github-${index}`,
            name,
            owner,
            stars: record.stars || record.starCount || record.metrics?.stars || '精选',
            desc: record.desc || record.summary || record.description || '',
            topics: toArray(record.topics || record.tags || record.keywords).slice(0, 4),
            lang: record.lang || record.language || 'Open source',
            langColor: record.langColor || record.languageColor || '#3572A5',
            url,
            sourceName: record.sourceName || 'GitHub curated seed',
            updatedAt: record.updatedAt || record.reviewedAt || record.date || ''
        };
    }

    function getGithubRecommendationRecords() {
        const manifestRepos = flattenDatasetEntries('github')
            .map((record, index) => normalizeGithubRepo(record, index))
            .filter(Boolean);
        if (manifestRepos.length) return manifestRepos;
        return (typeof GITHUB_REPOS !== 'undefined' && Array.isArray(GITHUB_REPOS) ? GITHUB_REPOS : [])
            .map((record, index) => normalizeGithubRepo(record, index))
            .filter(Boolean);
    }

    function githubTopicMatches(repo, topic) {
        if (!topic || topic === 'all') return true;
        const text = [repo.name, repo.owner, repo.desc, repo.lang, ...(repo.topics || [])].join(' ').toLowerCase();
        const topicMap = {
            llm: ['llm', '大语言', '预训练', 'transformer', 'llama', '模型评测'],
            agent: ['agent', '智能体', '多智能体', 'autogen', 'researcher'],
            rag: ['rag', '检索', '文献', 'researcher', 'chatpaper'],
            multimodal: ['多模态', '语音', '图像', 'whisper', 'segment'],
            'fine-tuning': ['微调', 'fine-tuning', 'transformers', '迁移学习'],
            diffusion: ['diffusion', '扩散', '图像', 'segment'],
            robotics: ['robotics', '具身', 'agent', 'autogen']
        };
        return (topicMap[topic] || [topic]).some(keyword => text.includes(keyword.toLowerCase()));
    }

    function renderGithubRepos(repos = getGithubRecommendationRecords()) {
        const grid = $('#githubGrid');
        if (!grid) return;
        const entries = Array.isArray(repos) ? repos : [];
        if (!entries.length) {
            grid.innerHTML = '<div class="arxiv-loading">暂无 GitHub 推荐项目；请检查 data/github.manifest.json 或 GITHUB_REPOS fallback。</div>';
            return;
        }
        grid.innerHTML = entries.slice(0, 10).map(repo => `
            <a class="github-card" href="${escapeHtml(repo.url)}" target="_blank" rel="noopener">
                <div class="github-card-header">
                    <i class="fab fa-github github-card-icon"></i>
                    <div class="github-card-meta">
                        <div class="github-owner">${escapeHtml(repo.owner || repo.sourceName || 'GitHub')}</div>
                        <div class="github-name">${escapeHtml(repo.name)}</div>
                    </div>
                    <div class="github-stars"><i class="fas fa-star"></i>${escapeHtml(repo.stars)}</div>
                </div>
                <p class="github-desc">${escapeHtml(repo.desc)}</p>
                <div class="github-topics">
                    ${(repo.topics || []).slice(0, 3).map(topic => `<span class="github-topic">${escapeHtml(topic)}</span>`).join('')}
                </div>
                <div class="github-footer">
                    <span class="github-lang"><span class="lang-dot" style="background:${escapeHtml(repo.langColor)}"></span>${escapeHtml(repo.lang)}</span>
                    <span class="github-owner">${repo.updatedAt ? `更新 ${escapeHtml(repo.updatedAt)}` : '静态精选'}</span>
                </div>
            </a>
        `).join('');
    }

    function renderFrontierRising(topic = 'all') {
        const container = $('#frontierRising');
        if (!container) return;
        const allRepos = getGithubRecommendationRecords();
        const matched = allRepos.filter(repo => githubTopicMatches(repo, topic));
        const entries = (matched.length ? matched : allRepos).slice(0, 6);
        if (!entries.length) {
            container.innerHTML = '<div class="arxiv-loading">暂无本周飙升项目。</div>';
            return;
        }
        container.innerHTML = entries.map(repo => `
            <a class="frontier-rising-card" href="${escapeHtml(repo.url)}" target="_blank" rel="noopener">
                <div class="frontier-rising-name">${escapeHtml(repo.name)}</div>
                <div class="frontier-rising-desc">${escapeHtml(repo.desc)}</div>
                <div class="frontier-rising-footer">
                    <span class="frontier-rising-stars"><i class="fas fa-star"></i>${escapeHtml(repo.stars)}</span>
                    <span class="frontier-rising-gain">${escapeHtml(repo.lang)}</span>
                </div>
            </a>
        `).join('');
    }

    function fetchFrontierRising(topic = 'all') {
        renderFrontierRising(topic);
        return Promise.resolve(getGithubRecommendationRecords());
    }

    function fetchGithubTrending() {
        renderGithubRepos();
        renderFrontierRising(document.querySelector('.frontier-topic.active')?.dataset.topic || 'all');
        updateGithubSectionMeta();
        return Promise.resolve(getGithubRecommendationRecords());
    }

    function bindFrontierEvents() {
        $$('.frontier-topic').forEach(btn => {
            if (btn.dataset.bound === 'true') return;
            btn.dataset.bound = 'true';
            btn.addEventListener('click', () => {
                $$('.frontier-topic').forEach(item => item.classList.remove('active'));
                btn.classList.add('active');
                renderFrontierRising(btn.dataset.topic || 'all');
            });
        });
    }

    window._refreshGithub = function() {
        fetchGithubTrending();
        showToast('GitHub 推荐已使用本地精选数据刷新');
    };

    const TOOL_TAB_CATS = new Set();

    function syncToolTabsVisibility(cat) {
        const tabsContainer = $('#toolsCategoryTabs');
        if (!tabsContainer) return;
        const visible = TOOL_TAB_CATS.has(cat);
        tabsContainer.style.display = visible ? 'block' : 'none';
        document.body.classList.toggle('tool-tabs-visible', visible);
    }

    function toArray(value) {
        if (Array.isArray(value)) return value;
        if (value === null || value === undefined) return [];
        return [value];
    }

    function sameId(left, right) {
        return String(left) === String(right);
    }

    function uniqueBy(items, keyFn) {
        const seen = new Set();
        return items.filter(item => {
            const key = keyFn(item);
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function getStaticToolCatalog() {
        if (typeof CURATED_TOOLS_FALLBACK !== 'undefined' && Array.isArray(CURATED_TOOLS_FALLBACK) && CURATED_TOOLS_FALLBACK.length) {
            return CURATED_TOOLS_FALLBACK;
        }
        return typeof TOOLS_DATA !== 'undefined' && Array.isArray(TOOLS_DATA) ? TOOLS_DATA : [];
    }

    function getManifestPrimaryRecords(key) {
        const bundle = getManifestBundle(key);
        return Array.isArray(bundle.primary?.records) ? bundle.primary.records : [];
    }

    function flattenDatasetEntries(key) {
        const nestedKeys = ['items', 'tools', 'entries', 'entrypoints', 'modules', 'playbooks', 'updates', 'cards'];
        return getManifestPrimaryRecords(key).flatMap((record, index) => {
            if (!record || typeof record !== 'object') return [];
            const nested = nestedKeys.flatMap(groupKey => {
                const group = record[groupKey];
                return Array.isArray(group)
                    ? group.map((item, childIndex) => ({
                        ...(item || {}),
                        __manifestParent: record,
                        __manifestGroupKey: groupKey,
                        __manifestIndex: `${index}:${childIndex}`
                    }))
                    : [];
            });
            return nested.length ? nested : [{ ...record, __manifestIndex: `${index}` }];
        });
    }

    function buildManifestProvenance(key, item, fallbackLabel = 'manifest') {
        return window.SciAIStationData.buildManifestProvenance(getStationDataDeps(), key, item, fallbackLabel);
    }

    function findToolById(id) {
        return getToolCatalog().find(tool => sameId(tool.id, id));
    }

    function normalizeManifestTool(record, index) {
        if (!record || typeof record !== 'object') return null;
        const raw = record.tool && typeof record.tool === 'object' ? { ...record.tool, ...record } : record;
        const base = getStaticToolCatalog().find(tool => sameId(tool.id, raw.id ?? raw.toolId ?? raw.refId ?? raw.slug));
        const resolvedId = base?.id ?? raw.id ?? raw.toolId ?? raw.refId ?? `manifest-tool-${index}`;
        const name = raw.name || raw.title || base?.name;
        if (!name) return null;
        const tags = [...new Set([
            ...(base?.tags || []),
            ...(toArray(raw.tags).map(tag => String(tag))),
            raw.stationSectionLabel,
            raw.editorialStatus,
            raw.sectionLabel
        ].filter(Boolean))];
        const keywords = [...new Set([
            ...(base?.keywords || []),
            ...(toArray(raw.keywords).map(keyword => String(keyword))),
            ...(toArray(raw.aliases).map(alias => String(alias))),
            raw.bestFor,
            raw.stationSectionLabel,
            raw.editorialStatus
        ].filter(Boolean))];
        return {
            ...(base || {}),
            ...raw,
            id: resolvedId,
            name,
            entryKind: 'tool',
            desc: raw.desc || raw.summary || raw.description || base?.desc || '',
            logo: raw.logo || raw.image || base?.logo || '',
            icon: raw.icon || base?.icon || 'fas fa-compass',
            color: raw.color || base?.color || '#2563eb',
            tags,
            keywords,
            pricing: raw.pricing || base?.pricing || 'freemium',
            region: raw.region || base?.region || 'foreign',
            rating: Number(raw.rating ?? base?.rating ?? 4.6),
            users: raw.users || base?.users || '编辑精选',
            url: raw.url || raw.link || base?.url || '#',
            hot: raw.hot ?? base?.hot ?? raw.stationSection === 'weekly',
            isNew: raw.isNew ?? base?.isNew ?? false,
            stationSection: raw.stationSection || base?.stationSection || 'essential',
            stationSectionLabel: raw.stationSectionLabel || raw.sectionLabel || base?.stationSectionLabel || '',
            editorialStatus: raw.editorialStatus || raw.status || base?.editorialStatus || '',
            reviewedAt: raw.reviewedAt || raw.date || base?.reviewedAt || '',
            reviewNote: raw.reviewNote || raw.reason || raw.summary || base?.reviewNote || '',
            usageGuide: raw.usageGuide || raw.usage || base?.usageGuide || '',
            bestFor: raw.bestFor || base?.bestFor || '',
            quickStart: raw.quickStart || base?.quickStart || '',
            caution: raw.caution || base?.caution || '',
            relatedIds: Array.isArray(raw.relatedIds) ? raw.relatedIds : (base?.relatedIds || []),
            provenance: {
                ...(base?.provenance || {}),
                ...buildManifestProvenance('curated-tools', raw, 'curated-tools')
            }
        };
    }

    function getToolCatalog() {
        return window.SciAIStationData.getToolCatalog(getStationDataDeps());
    }

    function getFeaturedEntries() {
        return window.SciAIStationData.getFeaturedEntries(getStationDataDeps());
    }

    function normalizeManifestPlaybook(record, index) {
        if (!record || typeof record !== 'object') return null;
        const kind = String(record.entryKind || record.kind || record.type || '').toLowerCase();
        const looksLikePlaybook = /playbook|script|prompt/.test(kind) || record.content || record.prompt || record.template;
        if (!looksLikePlaybook) return null;
        const content = record.content || record.prompt || record.template || record.summary || '';
        return {
            id: record.id || record.refId || `manifest-playbook-${index}`,
            entryKind: 'script',
            title: record.title || record.name || `研究剧本 ${index + 1}`,
            category: record.category || 'review',
            status: record.status || record.phase || 'Manifest',
            usage: record.usage || record.summary || record.desc || record.description || '',
            output: record.output || record.deliverable || record.result || '',
            tools: toArray(record.tools).map(item => typeof item === 'string' ? item : (item?.name || item?.title || '')).filter(Boolean),
            keywords: [...new Set([
                ...(toArray(record.keywords).map(item => String(item))),
                ...(toArray(record.aliases).map(item => String(item))),
                record.category,
                record.status
            ].filter(Boolean))],
            content: String(content || ''),
            provenance: buildManifestProvenance('academic-entrypoints', record, 'academic-entrypoints')
        };
    }

    function getPlaybookCatalog() {
        return window.SciAIStationData.getPlaybookCatalog(getStationDataDeps());
    }

    function normalizeManifestUpdate(record, index, datasetKey) {
        if (!record || typeof record !== 'object') return null;
        const highlights = toArray(record.highlights).map(item => String(item)).join(' · ');
        const title = record.title || record.name;
        if (!title) return null;
        return {
            id: record.id || `manifest-update-${datasetKey}-${index}`,
            title,
            desc: record.desc || record.summary || highlights || record.note || '',
            cover: record.cover || 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
            icon: record.icon || 'fas fa-sparkles',
            views: record.views || record.kind || '数据更新',
            date: record.date || record.generatedAt?.slice(0, 10) || '',
            status: record.status || record.kind || 'Manifest',
            note: record.note || highlights || '',
            url: record.url || record.link || '',
            provenance: buildManifestProvenance(datasetKey, record, datasetKey)
        };
    }

    function getAiDailyCatalog() {
        return window.SciAIStationData.getAiDailyCatalog(getStationDataDeps());
    }

    function normalizeHomePlaybookCard(record, index) {
        if (!record || typeof record !== 'object') return null;

        const playbook = normalizeManifestPlaybook(record, index);
        if (playbook) {
            const toolLabel = (playbook.tools || []).slice(0, 2).join(' 路 ');
            return {
                id: playbook.id,
                entryKind: 'script',
                refId: playbook.id,
                title: playbook.title,
                desc: playbook.usage || '',
                supporting: playbook.output || '',
                status: playbook.status || 'Manifest',
                meta: toolLabel || '研究剧本',
                icon: 'fas fa-scroll',
                color: '#0f766e',
                actionLabel: '复制剧本'
            };
        }

        const entrypoint = normalizeManifestEntrypoint(record, index);
        if (!entrypoint) return null;

        return {
            id: entrypoint.id || entrypoint.category,
            entryKind: entrypoint.entryKind || 'entrypoint',
            refId: entrypoint.category || entrypoint.id,
            title: entrypoint.title,
            desc: entrypoint.desc || '',
            supporting: entrypoint.usageGuide || '',
            status: entrypoint.status || 'Manifest',
            meta: entrypoint.entryKind === 'method' ? '研究模块' : '研究入口',
            icon: entrypoint.icon || 'fas fa-compass',
            color: entrypoint.color || '#2563eb',
            actionLabel: entrypoint.actionLabel || (entrypoint.entryKind === 'method' ? '打开模块' : '打开入口')
        };
    }

    function getHomepagePlaybookCatalog() {
        return window.SciAIStationData.getHomepagePlaybookCatalog(getStationDataDeps());
    }

    function buildHomeUpdateStreamCard(stream, parentRecord, index) {
        if (!stream || typeof stream !== 'object') return null;
        const highlights = toArray(stream.highlights).map(item => String(item)).filter(Boolean);
        const context = toArray(stream.contextSources).map(item => String(item)).filter(Boolean);
        const sourceLabel = stream.badge || stream.label || stream.datasetId || stream.sourceName || stream.key || parentRecord.kind || '站点更新';
        const detailParts = [
            stream.contextNote,
            stream.modelContext,
            stream.freshnessLabel,
            ...highlights.slice(0, 2),
            context.length ? `Context: ${context.join(' / ')}` : ''
        ].filter(Boolean);

        return {
            id: `${parentRecord.id || 'update'}-${stream.key || index}`,
            title: stream.title || stream.name || parentRecord.title || `站点更新 ${index + 1}`,
            desc: stream.summary || stream.desc || parentRecord.summary || '',
            cover: stream.cover || 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
            icon: stream.icon || 'fas fa-sparkles',
            views: sourceLabel,
            date: parentRecord.date || parentRecord.generatedAt?.slice(0, 10) || '',
            status: stream.status || parentRecord.kind || 'Manifest',
            note: detailParts.join(' 路 '),
            url: stream.sourceUrl || stream.url || parentRecord.url || '',
            provenance: buildManifestProvenance('updates', { ...stream, __manifestParent: parentRecord }, 'updates')
        };
    }

    function getHomepageUpdateCatalog() {
        return window.SciAIStationData.getHomepageUpdateCatalog(getStationDataDeps());
    }

    function getHomepageAssembly() {
        return window.SciAIStationData.getHomepageAssembly(getStationDataDeps());
    }

    function normalizeManifestEntrypoint(record, index) {
        if (!record || typeof record !== 'object') return null;
        const kind = String(record.entryKind || record.kind || record.type || '').toLowerCase();
        const category = record.category || record.id || record.refId || record.slug;
        const title = record.title || record.name;
        if (!category || !title) return null;
        const entryKind = METHOD_ENTRYPOINT_IDS.includes(String(category)) || /method|module/.test(kind) ? 'method' : 'entrypoint';
        return {
            id: category,
            entryKind,
            category: String(category),
            title,
            desc: record.desc || record.summary || record.description || '',
            usageGuide: record.usageGuide || record.usage || '',
            status: record.status || record.phase || 'Manifest',
            icon: record.icon || (entryKind === 'method' ? 'fas fa-toolbox' : 'fas fa-compass'),
            color: record.color || (entryKind === 'method' ? '#7c3aed' : '#2563eb'),
            keywords: [...new Set([
                ...(toArray(record.keywords).map(item => String(item))),
                ...(toArray(record.aliases).map(item => String(item))),
                title,
                category
            ].filter(Boolean))],
            actionLabel: record.actionLabel || record.ctaLabel || '打开模块',
            provenance: buildManifestProvenance('academic-entrypoints', record, 'academic-entrypoints')
        };
    }

    function getAcademicEntrypoints() {
        return window.SciAIStationData.getAcademicEntrypoints(getStationDataDeps());
    }

    function getMethodToolModulesLegacy() {
        if (Array.isArray(METHOD_TOOL_MODULES) && METHOD_TOOL_MODULES.length) return METHOD_TOOL_MODULES;
        return [
            { category: 'journal', title: '选刊助手', status: '内置模块', usageGuide: '根据学科和投稿约束筛期刊。', icon: 'fas fa-journal-whills', color: '#2563eb' },
            { category: 'cite-check', title: '引文核查', status: '内置模块', usageGuide: '投稿前集中核查关键引文。', icon: 'fas fa-list-check', color: '#7c3aed' },
            { category: 'paperdeck', title: 'PaperDeck', status: '内置模块', usageGuide: '把精读内容压成可复用卡片。', icon: 'fas fa-layer-group', color: '#059669' },
            { category: 'stats', title: '统计方法库', status: '内置模块', usageGuide: '按研究目标挑方法、图表和实现。', icon: 'fas fa-chart-bar', color: '#f59e0b' }
        ];
    }

    function getStationSearchIndexLegacy() {
        if (Array.isArray(STATION_SEARCH_INDEX) && STATION_SEARCH_INDEX.length) return STATION_SEARCH_INDEX;
        const toolEntries = Array.isArray(TOOLS_DATA) ? TOOLS_DATA.map(tool => ({
            entryKind: 'tool',
            refId: tool.id,
            title: tool.name,
            desc: tool.desc,
            usageGuide: tool.usageGuide || '',
            status: tool.editorialStatus || '',
            icon: tool.icon,
            color: tool.color,
            keywords: [...new Set([...(tool.keywords || []), ...(tool.tags || [])])],
            actionLabel: '查看工具'
        })) : [];
        const scriptEntries = Array.isArray(PROMPTS_DATA) ? PROMPTS_DATA.map(script => ({
            entryKind: 'script',
            refId: script.id,
            title: script.title,
            desc: script.usage || script.content,
            usageGuide: script.output || '',
            status: script.status || '',
            icon: 'fas fa-scroll',
            color: '#0f766e',
            keywords: [...new Set([...(script.keywords || []), ...(script.tools || []), script.category].filter(Boolean))],
            actionLabel: '复制剧本'
        })) : [];
        const methodEntries = getMethodToolModules().map(module => ({
            entryKind: 'method',
            refId: module.category,
            title: module.title,
            desc: module.desc || module.usageGuide,
            usageGuide: module.usageGuide || '',
            status: module.status || '',
            icon: module.icon,
            color: module.color,
            keywords: [...new Set([...(module.keywords || []), module.title, module.status].filter(Boolean))],
            actionLabel: module.ctaLabel || '打开模块'
        }));
        return [...toolEntries, ...scriptEntries, ...methodEntries];
    }

    function getMethodToolModules() {
        return window.SciAIStationData.getMethodToolModules(getStationDataDeps());
    }

    function getStationSearchIndex() {
        return window.SciAIStationData.getStationSearchIndex(getStationDataDeps());
    }

    function findPromptScript(id) {
        return window.SciAIStationData.findPromptScript(getStationDataDeps(), id);
    }

    function activateNavItem(cat, homeFocus = '') {
        return window.SciAIStationInteractions.activateNavItem(getStationInteractionDeps(), cat, homeFocus);
    }

    function openStationHomeFocus(focus = 'tools', title = '') {
        return window.SciAIStationInteractions.openStationHomeFocus(getStationInteractionDeps(), focus, title);
    }

    function copyPromptScript(id) {
        return window.SciAIStationInteractions.copyPromptScript(getStationInteractionDeps(), id);
    }

    function renderHomePlaybooks(prompts) {
        return window.SciAIStationHome.renderHomePlaybooks(getStationHomeDeps(), prompts);
    }

    function renderHomepageAssembly() {
        return window.SciAIStationHome.renderHomepageAssembly(getStationHomeDeps(), getHomepageAssembly());
    }

    function renderMethodQuickModules() {
        return window.SciAIStationHome.renderMethodQuickModules(getStationHomeDeps());
    }

    function openMethodTool(cat) {
        const result = window.SciAIStationInteractions.openMethodTool(getStationInteractionDeps(), cat);
        const item = document.querySelector(`.workbench-sidebar-nav .workbench-nav-item.nav-item[data-category="${String(cat).replace(/"/g, '\\"')}"]`);
        if (item) setWorkbenchActive(item);
        return result;
    }

    function applyCuratedStationCopy() {
        return window.SciAIStationHome.applyCuratedStationCopy(getStationHomeDeps());
    }

    function updateFavBadge() {
        if (!favCount) return;
        favCount.textContent = favorites.length;
        favCount.style.display = favorites.length ? '' : 'none';
    }

    window._removeCompare = function(id) {
        return window.SciAIStationInteractions.removeCompare(getStationInteractionDeps(), id);
    };

    function renderHomeUpdates(updates) {
        return window.SciAIStationHome.renderHomeUpdates(getStationHomeDeps(), updates);
    }

    function renderPrompts(prompts) {
        promptsGrid.innerHTML = prompts.map(p => `
            <div class="prompt-card">
                <h4><i class="fas fa-scroll"></i>${escapeHtml(p.title)}</h4>
                <p>${escapeHtml(p.usage || '')}</p>
                ${p.output ? `<div class="section-sub">${escapeHtml(p.output)}</div>` : ''}
                <div class="prompt-card-footer">
                    <span class="prompt-category">${escapeHtml(p.status || getCategoryLabel(p.category))}</span>
                    <span class="prompt-category">${escapeHtml((p.tools || []).slice(0, 2).join(' 路 ') || '研究剧本')}</span>
                    <button class="btn-copy" data-content="${encodeURIComponent(p.content || '')}"><i class="fas fa-copy"></i> 复制</button>
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

        renderHomePlaybooks(getHomepagePlaybookCatalog());
    }

    function renderTutorials(tutorials) {
        tutorialsGrid.innerHTML = tutorials.map(t => `
            <article class="tutorial-card">
                <div class="tutorial-cover" style="background:${t.cover}"><i class="${t.icon}"></i></div>
                <div class="tutorial-body">
                    <h4>${escapeHtml(t.title)}</h4>
                    <p>${escapeHtml(t.desc)}</p>
                    <div class="tutorial-meta">
                        <span><i class="fas fa-eye"></i> ${escapeHtml(t.views || '')}</span>
                        <span><i class="fas fa-calendar"></i> ${escapeHtml(t.date || '')}</span>
                        ${t.status ? `<span class="tutorial-link"><i class="fas fa-clipboard-check"></i> ${escapeHtml(t.status)}</span>` : ''}
                    </div>
                    ${t.note ? `<div class="section-sub">${escapeHtml(t.note)}</div>` : ''}
                </div>
            </article>`).join('');

        renderHomeUpdates(getHomepageUpdateCatalog());
    }

    function renderTools(tools) {
        return window.SciAIStationInteractions.renderTools(getStationInteractionDeps(), tools);
    }

    function openCompareModal() {
        return window.SciAIStationInteractions.openCompareModal(getStationInteractionDeps());
    }

    function openToolModal(id) {
        return openToolModalLegacy2(id);
    }

    function openToolModalLegacy2(id) {
        const tool = findToolById(id);
        if (!tool) return;
        currentToolId = tool.id;
        addRecent(tool.id);

        const iconEl = $('#toolModalIcon');
        iconEl.style.background = tool.color;
        iconEl.innerHTML = tool.logo
            ? `<img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none'"><i class="${tool.icon}" style="font-size:22px;color:#fff;display:none"></i>`
            : `<i class="${tool.icon}" style="font-size:22px;color:#fff"></i>`;

        $('#toolModalName').textContent = tool.name;
        $('#toolModalTags').innerHTML = (tool.tags || []).map(tag => `<span class="tool-tag">${escapeHtml(tag)}</span>`).join('');
        $('#toolModalDesc').textContent = [tool.desc, tool.reviewNote, tool.quickStart ? `起步：${tool.quickStart}` : ''].filter(Boolean).join(' ');
        $('#toolModalRating').innerHTML = `${'★'.repeat(Math.floor(tool.rating || 0))} ${tool.rating || ''}`;
        $('#toolModalUsers').textContent = tool.users || '';
        $('#toolModalPricing').textContent = { free:'免费', freemium:'免费增值', paid:'付费' }[tool.pricing] || tool.pricing || '';
        $('#toolModalRegion').textContent = tool.region === 'domestic' ? '国产' : '海外';
        $('#toolModalUrl').href = tool.url || '#';
        const docBtn = $('#toolModalDoc');
        const docUrl = typeof TOOL_DOCS !== 'undefined' && TOOL_DOCS[tool.id];
        if (docUrl) { docBtn.href = docUrl; docBtn.style.display = 'flex'; }
        else { docBtn.style.display = 'none'; }
        updateModalFavUI(tool.id);
        updateModalCompareUI(tool.id);
        updateModalLikeUI(tool.id);
        renderRelatedTools(tool);
        toolModal.classList.add('show');
    }

    function getFilteredToolsLegacy2() {
        let list = [...getToolCatalog()];
        if (currentCategory === 'favorites') list = list.filter(tool => isFav(tool.id));
        else if (currentCategory === 'recent') list = recentlyViewed.map(id => list.find(tool => sameId(tool.id, id))).filter(Boolean);
        else if (currentCategory === 'hot') list = list.filter(tool => tool.stationSection === 'weekly' || tool.hot);
        else if (currentCategory === 'new') list = list.filter(tool => String(tool.reviewedAt || '').startsWith('2026-04') || tool.isNew);
        else if (currentCategory !== 'all') list = list.filter(tool => tool.category === currentCategory);

        if (currentPricing === 'domestic' || currentPricing === 'foreign') {
            list = list.filter(tool => tool.region === currentPricing);
        } else if (currentPricing !== 'all') {
            list = list.filter(tool => tool.pricing === currentPricing);
        }

        if (currentSort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        else if (currentSort === 'users') list.sort((a, b) => parseUsers(b.users || '0') - parseUsers(a.users || '0'));
        else if (currentSort === 'name') list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
        else list.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
        return list;
    }

    function handleStationEntryAction(kind, refId) {
        return window.SciAIStationInteractions.handleStationEntryAction(getStationInteractionDeps(), kind, refId);
    }

function getFilteredTools() {
        return window.SciAIStationInteractions.getFilteredTools(getStationInteractionDeps());
    }

    function filterTools() {
        return window.SciAIStationInteractions.filterTools(getStationInteractionDeps());
    }

    function doSearch(query) {
        return window.SciAIStationInteractions.doSearch(getStationInteractionDeps(), query);
    }

    function showSection(cat) {
        return window.SciAIStationInteractions.showSection(getStationInteractionDeps(), cat);
    }

    function renderRelatedTools(tool) {
        return window.SciAIStationInteractions.renderRelatedTools(getStationInteractionDeps(), tool);
    }

    function isFav(id) {
        return window.SciAIStationInteractions.isFav(getStationInteractionDeps(), id);
    }

    function toggleFav(id) {
        return window.SciAIStationInteractions.toggleFav(getStationInteractionDeps(), id);
    }

    function syncFavUI(id) {
        return window.SciAIStationInteractions.syncFavUI(getStationInteractionDeps(), id);
    }

    function addRecent(id) {
        return window.SciAIStationInteractions.addRecent(getStationInteractionDeps(), id);
    }

    function isInCompare(id) {
        return window.SciAIStationInteractions.isInCompare(getStationInteractionDeps(), id);
    }

    function toggleCompare(id) {
        return window.SciAIStationInteractions.toggleCompare(getStationInteractionDeps(), id);
    }

    function updateCompareBar() {
        return window.SciAIStationInteractions.updateCompareBar(getStationInteractionDeps());
    }

    function syncCompareUI(id) {
        return window.SciAIStationInteractions.syncCompareUI(getStationInteractionDeps(), id);
    }
    function refreshManifestAwareChrome() {
        renderHomepageTrustSummary();
        renderQualityStatusBand();
        updateNewsSectionMeta();
        updateModelsSectionMeta();
        updateGithubSectionMeta();
        renderGithubRepos();
        renderFrontierRising(document.querySelector('.frontier-topic.active')?.dataset.topic || 'all');
        updateHomeUpdatesSectionMeta();
        renderHomepageAssembly();
        renderPrompts(getPlaybookCatalog());
        renderTutorials(getHomepageUpdateCatalog());
        const nonToolCats = new Set([...HOME_EXTENSION_SECTION_IDS, 'graph', 'search-papers', 'journal', 'cite-check', 'paperdeck', 'stats']);
        if (!nonToolCats.has(currentCategory)) {
            filterTools();
        }
        applyNavigationProminence();
    }

    function applyNavigationProminence() {
        return window.SciAIStationHome.applyNavigationProminence(getStationHomeDeps());
    }

    function renderHomepageTrustSummary() {
        return window.SciAIStationHome.renderHomepageTrustSummary(getStationHomeDeps());
    }

    function renderQualityStatusBand() {
        return window.SciAIStationHome.renderQualityStatusBand(getStationHomeDeps());
    }

    window.__SCIAI_STATION_DATA = {
        getTools: () => getToolCatalog(),
        getPlaybooks: () => getHomepagePlaybookCatalog(),
        getUpdates: () => getHomepageUpdateCatalog(),
        getEntrypoints: () => getAcademicEntrypoints(),
        getSearchIndex: () => getStationSearchIndex()
    };
    window._stationAction = handleStationEntryAction;
    window._openStationHomeFocus = openStationHomeFocus;

    function updateHomeUpdatesSectionMeta() {
        return window.SciAIStationHome.updateHomeUpdatesSectionMeta(getStationHomeDeps());
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
        const favTools = favorites.map(id => findToolById(id)).filter(Boolean);
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
        renderHomepageAssembly();
        renderTools(getToolCatalog());
        renderPrompts(getPlaybookCatalog());
        renderTutorials(getHomepageUpdateCatalog());
        applyCuratedStationCopy();
        applyNavigationProminence();
        showSection('all');
        renderHomepageTrustSummary();
        renderQualityStatusBand();
        renderNews(currentNewsData);
        fetchLiveNews(false).then(data => {
            if (Array.isArray(data) && data.length) renderNews(data);
        }).catch(() => {});
        renderGithubRepos();
        fetchFrontierRising('all');
        bindFrontierEvents();
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
        bootstrapManifestState().catch(() => {});
        loadTheme();
        updateFavBadge();
        updateCompareBar();
        applySidebarCollapse();
        if (typeof GraphFeature !== 'undefined' && typeof GraphFeature.init === 'function') GraphFeature.init();
        if (typeof SearchFeature !== 'undefined' && typeof SearchFeature.init === 'function') SearchFeature.init();
        if (typeof JournalFeature !== 'undefined' && typeof JournalFeature.init === 'function') JournalFeature.init();
        if (typeof CiteCheckFeature !== 'undefined' && typeof CiteCheckFeature.init === 'function') CiteCheckFeature.init();
        if (typeof PaperDeckFeature !== 'undefined' && typeof PaperDeckFeature.init === 'function') PaperDeckFeature.init();
        if (typeof StatsFeature !== 'undefined' && typeof StatsFeature.init === 'function') StatsFeature.init();
        // ʼʵʱ API Ͷ̬ǩ
        if (typeof initializeRealtimeAPIs !== 'undefined') {
            initializeRealtimeAPIs();
        }
        // ȫ周增长率Ǳ
        const badge = $('#navBadgeAll');
        if (badge) badge.textContent = getFeaturedEntries().length;
        // ָ¼״̬
        updateLoginBtn(getUser());
        // ʼ参数量书ģ
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
