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
    let favorites        = loadLS('sciai-favs', []);
    let recentlyViewed   = loadLS('sciai-recent', []);
    let compareList      = [];   // max 3 ids
    let userLikes        = loadLS('sciai-likes', {});
    let sidebarCollapsed = loadLS('sciai-sidebar-collapsed', false);

    // ---- LS 工具 ----
    function loadLS(key, def) {
        try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); }
        catch { return def; }
    }
    function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

    // ---- 收藏 ----
    function isFav(id)    { return favorites.includes(id); }
    function toggleFav(id) {
        favorites = isFav(id) ? favorites.filter(f => f !== id) : [...favorites, id];
        saveLS('sciai-favs', favorites);
        updateFavBadge();
        syncFavUI(id);
        showToast(isFav(id) ? '已加入收藏 ❤️' : '已取消收藏');
    }
    function syncFavUI(id) {
        $$('.card-fav-btn').forEach(b => { if (+b.dataset.id === id) b.classList.toggle('active', isFav(id)); });
        if (currentToolId === id) updateModalFavUI(id);
    }
    function updateFavBadge() {
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
            if (compareList.length >= 3) { showToast('最多对比 3 个工具'); return; }
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
            ['评分', t => `<td><span class="compare-stars">${'★'.repeat(Math.floor(t.rating))}${'☆'.repeat(5-Math.floor(t.rating))}</span> ${t.rating}</td>`],
            ['用户数', t => `<td>${t.users}</td>`],
            ['价格', t => `<td><span class="pricing-badge ${t.pricing}">${{free:'免费',freemium:'免费增值',paid:'付费'}[t.pricing]}</span></td>`],
            ['地区', t => `<td>${t.region === 'domestic' ? '🇨🇳 国产' : '🌐 海外'}</td>`],
            ['分类', t => `<td>${t.tags.join(', ')}</td>`],
            ['官网', t => `<td><a href="${t.url}" target="_blank" style="color:var(--primary);text-decoration:none">访问 →</a></td>`],
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
        grid.innerHTML = GITHUB_REPOS.map(r => `
            <a class="github-card" href="${r.url}" target="_blank" rel="noopener">
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

    // ---- 实时 GitHub Trending（GitHub Search API）----
    function fetchGithubTrending() {
        const grid = $('#githubGrid');
        const timeEl = $('#githubUpdateTime');
        if (!grid) return;
        grid.innerHTML = '<div class="arxiv-loading"><i class="fas fa-spinner fa-spin"></i> 正在拉取 GitHub 实时高星项目...</div>';
        const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const url = `https://api.github.com/search/repositories?q=(topic:llm+OR+topic:ai+OR+topic:machine-learning+OR+topic:deep-learning)+pushed:>${since}+stars:>200&sort=stars&order=desc&per_page=9`;
        fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } })
            .then(r => { if (!r.ok) throw new Error('api error ' + r.status); return r.json(); })
            .then(data => {
                const items = data.items || [];
                if (!items.length) throw new Error('empty');
                const langColors = { Python:'#3572A5', JavaScript:'#f1e05a', TypeScript:'#2b7489', Rust:'#dea584', Go:'#00ADD8', 'C++':'#f34b7d', Java:'#b07219', Shell:'#89e051' };
                grid.innerHTML = items.map(r => {
                    const stars = r.stargazers_count >= 1000 ? (r.stargazers_count / 1000).toFixed(1) + 'k' : r.stargazers_count;
                    const langColor = langColors[r.language] || '#8b949e';
                    const topics = (r.topics || []).slice(0, 3);
                    const owner = r.full_name.split('/')[0];
                    const desc = (r.description || '暂无描述').slice(0, 80);
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
                if (timeEl) timeEl.textContent = '更新于 ' + new Date().toLocaleTimeString('zh-CN', { hour:'2-digit', minute:'2-digit' });
            })
            .catch(() => {
                renderGithubRepos();
                if (timeEl) timeEl.textContent = '已显示精选推荐（API 限流）';
            });
    }
    window._refreshGithub = fetchGithubTrending;

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
        container.innerHTML = '<div class="arxiv-loading"><i class="fas fa-spinner fa-spin"></i> 正在加载 arXiv 最新论文...</div>';
        fetch('https://export.arxiv.org/api/query?search_query=(cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL)&sortBy=submittedDate&sortOrder=descending&max_results=6')
            .then(r => r.text())
            .then(xml => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, 'application/xml');
                const entries = [...doc.querySelectorAll('entry')].slice(0, 6);
                if (!entries.length) throw new Error('no entries');
                container.innerHTML = entries.map(e => {
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
            })
            .catch(() => {
                container.innerHTML = '<div class="arxiv-error"><i class="fas fa-exclamation-circle"></i> 加载失败，请<button onclick="fetchArxivLatest()">重试</button>或访问 <a href="https://arxiv.org" target="_blank">arxiv.org</a></div>';
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
        $('#toolModalFavText').textContent = fav ? '已收藏' : '收藏工具';
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

    function renderNews(news) {
        // 静态资讯
        const newsList = $('#newsList');
        if (!newsList) return;
        newsList.innerHTML = `
            <div class="news-tabs">
                <button class="news-tab active" data-tab="static">精选资讯</button>
                <button class="news-tab" data-tab="arxiv"><i class="fas fa-rss"></i> arXiv 实时 <span class="live-dot"></span></button>
            </div>
            <div id="staticNewsList">
                ${news.map(n => {
                    const d = new Date(n.date);
                    return `<a class="news-item" href="${n.url || '#'}" target="_blank" rel="noopener">
                        <div class="news-date"><span class="day">${d.getDate()}</span><span class="month">${d.getMonth()+1}月</span></div>
                        <div class="news-info"><h4>${n.title}</h4><p>${n.desc}</p></div>
                        <span class="news-tag" style="background:#3b82f618;color:#3b82f6">${n.category}</span>
                    </a>`;
                }).join('')}
            </div>
            <div id="arxivList" style="display:none;"></div>`;

        // 资讯 tab 切换
        newsList.querySelectorAll('.news-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                newsList.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const t = tab.dataset.tab;
                $('#staticNewsList').style.display = t === 'static' ? '' : 'none';
                $('#arxivList').style.display       = t === 'arxiv'  ? '' : 'none';
                if (t === 'arxiv' && $('#arxivList').innerHTML === '') fetchArxivLatest();
            });
        });
    }

    function renderModels(models) {
        // 渲染大模型排名表格
        const tbody = $('#modelsTableBody');
        if (!tbody) return;
        tbody.innerHTML = models.map(m => `
            <tr>
                <td style="text-align:center;font-weight:bold;">#${m.rank}</td>
                <td><strong>${m.name}</strong>${m.hot ? ' <i class="fas fa-fire" style="color:#ff6b35;"></i>' : ''}</td>
                <td>${m.provider}</td>
                <td><span style="font-size:12px;padding:4px 8px;background:#e5e7eb;border-radius:4px;">${m.type}</span></td>
                <td style="color:#3b82f6;font-weight:bold;">${m.elo}</td>
                <td>${m.benchmark.mmlu.toFixed(1)}%</td>
                <td>${m.benchmark.code.toFixed(1)}%</td>
                <td><span style="font-size:12px;${m.pricing === 'free' ? 'color:#10b981' : 'color:#f59e0b'}">${m.pricing === 'free' ? '免费' : m.pricing}</span></td>
            </tr>
        `).join('');
    }

    // 模型筛选函数
    window.filterModels = function(type) {
        const buttons = $$('.filter-btn');
        buttons.forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');

        const filtered = type === 'all' ? MODELS_RANKING : MODELS_RANKING.filter(m => m.type === type);
        renderModels(filtered);
    };

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
    }

    // ---- 显示板块 ----
    function showSection(cat) {
        Object.values(sections).forEach(s => { if (s) s.style.display = 'none'; });
        const titleMap = {
            all:'全部工具', hot:'热门推荐', new:'最新上线', favorites:'我的收藏', recent:'最近浏览',
            writing:'论文写作', reading:'文献阅读', data:'数据分析',
            figure:'科研绘图', code:'代码助手', experiment:'实验设计',
            llm:'大语言模型', 'image-ai':'AI绘画', voice:'语音合成', video:'AI视频',
            prompts:'科研提示词库', tutorials:'学习教程', news:'行业资讯', models:'大模型排名',
            github:'GitHub 推荐', usecases:'科研 AI 应用示例',
            aisoft:'AI 软件推荐', agents:'智能体管理', cli:'CLI 工具',
            graph:'研究图谱', 'search-papers':'论文检索', journal:'选刊助手',
            'cite-check':'引文核查', paperdeck:'PaperDeck 论文学习卡片',
            stats:'统计与可视化方法库',
        };
        pageTitle.textContent = titleMap[cat] || cat;
        const toolboxCats = ['graph', 'search-papers', 'journal', 'cite-check', 'paperdeck'];

        // Tab 栏显示/隐藏逻辑
        const NON_TOOL_CATS = ['prompts','tutorials','news','models','github','usecases','graph','search-papers','journal','cite-check','paperdeck','stats'];
        const tabsContainer = $('#toolsCategoryTabs');
        if (NON_TOOL_CATS.includes(cat)) {
            if (tabsContainer) tabsContainer.style.display = 'none';
        } else {
            if (tabsContainer) tabsContainer.style.display = 'block';
            // 同步 Tab 的 active 状态
            $$('.tab-item').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tab-item[data-category="${cat}"]`);
            if (activeTab) activeTab.classList.add('active');
        }

        if      (cat === 'prompts')        sections.prompts.style.display = 'block';
        else if (cat === 'tutorials')      sections.tutorials.style.display = 'block';
        else if (cat === 'news')           { sections.news.style.display = 'block'; renderNews(NEWS_DATA || []); }
        else if (cat === 'models')         { sections.models.style.display = 'block'; renderModels(MODELS_RANKING || []); }
        else if (cat === 'github')         sections.github.style.display = 'block';
        else if (cat === 'usecases')       sections.usecases.style.display = 'block';
        else if (cat === 'graph')          sections.graph.style.display = 'block';
        else if (cat === 'search-papers')  sections.searchPapers.style.display = 'block';
        else if (cat === 'journal')        sections.journal.style.display = 'block';
        else if (cat === 'cite-check')     sections.citeCheck.style.display = 'block';
        else if (cat === 'paperdeck')      sections.paperdeck.style.display = 'block';
        else if (cat === 'stats')          { if (sections.statMethods) sections.statMethods.style.display = 'block'; StatsFeature.render(); }
        else {
            sections.hero.style.display     = cat === 'all' ? '' : 'none';
            sections.featured.style.display = cat === 'all' ? '' : 'none';
            sections.stats.style.display  = '';
            sections.tools.style.display  = '';
        }
        // 收藏视图显示导出按钮
        if (exportFavsBtn) exportFavsBtn.style.display = cat === 'favorites' ? 'flex' : 'none';

        // GitHub 板块：加载实时数据
        if (cat === 'github') fetchGithubTrending();
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
        // 侧边栏导航
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
                const NON_TOOL_CATS = ['prompts','tutorials','news','github','usecases','graph','search-papers','journal','cite-check','paperdeck','stats'];
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
                showSection(cat); filterTools();
                sections.stats.scrollIntoView({ behavior:'smooth' });
            });
        });

        // 顶部 Tab 栏导航
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
                filterTools();
                // 滚动 Tab 到可见区域
                tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            });
        });

        // 筛选标签
        $$('.tag[data-filter]').forEach(tag => {
            tag.addEventListener('click', () => {
                $$('.tag[data-filter]').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                currentPricing = tag.dataset.filter;
                filterTools();
            });
        });

        // 提示词筛选
        $$('.tag[data-prompt-filter]').forEach(tag => {
            tag.addEventListener('click', () => {
                $$('.tag[data-prompt-filter]').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                const f = tag.dataset.promptFilter;
                renderPrompts(f === 'all' ? PROMPTS_DATA : PROMPTS_DATA.filter(p => p.category === f));
            });
        });

        // 排序
        sortSelect.addEventListener('change', () => { currentSort = sortSelect.value; filterTools(); });

        // 搜索
        let st;
        globalSearch.addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => doSearch(e.target.value), 300); });
        heroSearch.addEventListener('input', e => {
            clearTimeout(st);
            st = setTimeout(() => {
                if (e.target.value) { globalSearch.value = e.target.value; doSearch(e.target.value); sections.stats.scrollIntoView({ behavior:'smooth' }); }
            }, 300);
        });
        heroSearchBtn.addEventListener('click', () => {
            const q = heroSearch.value;
            if (q) { globalSearch.value = q; doSearch(q); sections.stats.scrollIntoView({ behavior:'smooth' }); }
        });

        // 主题
        themeToggle.addEventListener('click', toggleTheme);

        // 移动端
        mobileMenuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        mainContent.addEventListener('click', () => { if (window.innerWidth <= 768) sidebar.classList.remove('open'); });

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
            currentCategory = cat; showSection(cat); filterTools();
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

        // 侧边栏折叠
        sidebarToggle?.addEventListener('click', toggleSidebar);

        // 快捷键帮助
        shortcutHelpBtn?.addEventListener('click', () => shortcutsModal?.classList.toggle('show'));
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

    // ---- 侧边栏折叠 ----
    function applySidebarCollapse() {
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
        const icon = sidebarToggle ? sidebarToggle.querySelector('i') : null;
        if (icon) icon.style.transform = sidebarCollapsed ? 'rotate(180deg)' : '';
    }
    function toggleSidebar() {
        sidebarCollapsed = !sidebarCollapsed;
        saveLS('sciai-sidebar-collapsed', sidebarCollapsed);
        applySidebarCollapse();
    }

    // ---- 用户点赞 ----
    function isLiked(id)    { return !!userLikes[String(id)]; }
    function toggleLike(id) {
        const key = String(id);
        userLikes[key] = userLikes[key] ? 0 : 1;
        saveLS('sciai-likes', userLikes);
        updateModalLikeUI(id);
        showToast(userLikes[key] ? '已点赞 👍' : '已取消点赞');
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
                <span class="related-chip-rating">${t.rating}★</span>
            </button>`).join('');
    }

    // ---- 统计与可视化方法库 ----
    const StatsFeature = (() => {
        let activeStage = 'all', activeDisc = 'all', searchQuery = '';
        const stageBg = {descriptive:'#3b82f6',visualization:'#8b5cf6',inferential:'#10b981',multivariate:'#f59e0b',spatial:'#06b6d4',timeseries:'#ec4899',causal:'#ef4444',bayesian:'#a855f7',ml:'#22c55e',dl:'#f97316'};
        const stageLbl = {descriptive:'描述性统计',visualization:'数据可视化',inferential:'推断统计',multivariate:'多变量分析',spatial:'空间分析',timeseries:'时间序列',causal:'因果推断',bayesian:'贝叶斯分析',ml:'机器学习',dl:'深度学习'};
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
            if (info) info.textContent = '共 ' + list.length + ' 种方法';
            if (!list.length) { grid.innerHTML = '<div class="stats-empty"><i class="fas fa-search"></i><p>未找到匹配方法</p></div>'; return; }
            grid.innerHTML = list.map(m => {
                const bg = stageBg[m.category] || '#6366f1';
                const lbl = stageLbl[m.category] || m.category;
                const discs = (m.discipline||[]).map(d => '<span class="stats-disc-chip ' + d + '">' + (discLbl[d]||d) + '</span>').join('');
                const tools = (m.tools||[]).slice(0,3).map(t => '<span class="stats-tool-chip">' + t.split(':')[0] + '</span>').join('');
                const hasResources = m.resources && m.resources.length > 0;
                return '<div class="stats-card">'
                    + '<div class="stats-card-head"><div class="stats-card-icon" style="background:' + bg + '"><i class="' + (m.icon||'fas fa-chart-bar') + '"></i></div>'
                    + '<div class="stats-card-title"><div class="stats-card-name">' + m.name + '</div>'
                    + '<div class="stats-card-name-en">' + m.nameEn + '</div>'
                    + '<span class="stats-stage-badge" style="background:' + bg + '">' + lbl + '</span></div></div>'
                    + '<p class="stats-card-desc">' + m.desc + '</p>'
                    + '<div class="stats-card-usecase"><i class="fas fa-flask" style="margin-right:4px;opacity:.6"></i>' + m.useCase + '</div>'
                    + '<div class="stats-card-footer"><div class="stats-tools">' + tools + '</div>'
                    + '<div class="stats-difficulty"><span class="stats-difficulty-label">难度</span>' + dots(m.difficulty||1) + '</div></div>'
                    + (hasResources ? '<div class="stats-card-resources"><button class="btn-resources-small" data-method-id="' + m.id + '"><i class="fas fa-graduation-cap"></i> 查看资源</button></div>' : '')
                    + '<div class="stats-disc-chips">' + discs + '</div></div>';
            }).join('');
            // 绑定资源按钮事件
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

    // ---- 登录系统（localStorage 模拟）----
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
            $('#userEmailDisplay').textContent = user.email || '（未填写邮箱）';
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
        showToast(`欢迎，${name}！已本地登录 ✅`);
    }
    function doLogout() {
        localStorage.removeItem('sciai-user');
        updateLoginBtn(null);
        loginModal.classList.remove('show');
        showToast('已退出登录');
    }

    // ---- 收藏导出 Markdown ----
    function exportFavoritesMarkdown() {
        const favTools = favorites.map(id => TOOLS_DATA.find(t => t.id === id)).filter(Boolean);
        if (!favTools.length) { showToast('暂无收藏工具'); return; }
        const catNames = {
            writing:'论文写作', reading:'文献阅读', data:'数据分析',
            figure:'科研绘图', code:'代码助手', experiment:'实验设计',
            llm:'大语言模型', 'image-ai':'AI绘画', voice:'语音合成',
            video:'AI视频', aisoft:'AI软件', agents:'智能体管理', cli:'CLI工具'
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
                lines.push(`- **评分**: ${t.rating} / 5.0 · **用户数**: ${t.users} · **价格**: ${pricingMap[t.pricing] || t.pricing}`);
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
        showToast('收藏已导出 ✅');
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

        title.textContent = `${method.name} — 学习资源`;

        // 按类型分组资源
        const grouped = {};
        method.resources.forEach(r => {
            if (!grouped[r.type]) grouped[r.type] = [];
            grouped[r.type].push(r);
        });

        const typeLabels = {docs: '官方文档', course: '在线课程', paper: '论文资源'};
        const typeOrder = ['docs', 'course', 'paper'];

        container.innerHTML = typeOrder
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
        renderNews(NEWS_DATA);
        renderGithubRepos();
        fetchGithubTrending();
        setInterval(fetchGithubTrending, 10 * 60 * 1000);
        renderUseCases();
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
        // 初始化实时 API 和动态标签
        if (typeof initializeRealtimeAPIs !== 'undefined') {
            initializeRealtimeAPIs();
        }
        // 更新全部工具数量角标
        const badge = $('#navBadgeAll');
        if (badge) badge.textContent = TOOLS_DATA.length;
        // 恢复登录状态
        updateLoginBtn(getUser());
        // 初始化工具箱功能模块
        if (typeof GraphFeature !== 'undefined')     GraphFeature.init();
        if (typeof SearchFeature !== 'undefined')    SearchFeature.init();
        if (typeof JournalFeature !== 'undefined')   JournalFeature.init();
        if (typeof CiteCheckFeature !== 'undefined') CiteCheckFeature.init();
        if (typeof PaperDeckFeature !== 'undefined') PaperDeckFeature.init();
    }

    init();
})();
