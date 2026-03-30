// ============================================
// SciAI Hub - 工具箱功能模块 v1
// 依赖：api.js (SciAPI), D3.js (v7, CDN)
// ============================================
'use strict';

/* ============================================================
   1. 研究图谱  GraphFeature
   ============================================================ */
const GraphFeature = (() => {
    let svg, simulation, currentPaperId = null;
    const W = () => document.getElementById('graphCanvas')?.clientWidth || 800;
    const H = 500;

    // 年份 → 颜色
    function yearColor(year) {
        if (!year) return '#94a3b8';
        if (year >= 2022) return '#f97316';
        if (year >= 2018) return '#22c55e';
        if (year >= 2014) return '#3b82f6';
        return '#8b5cf6';
    }
    // 引用数 → 半径（对数缩放）
    function citeRadius(n) {
        return Math.max(8, Math.min(28, 8 + Math.log1p(n || 0) * 2.5));
    }

    function showDetailPanel(d) {
        const panel = document.getElementById('graphDetailPanel');
        if (!panel) return;
        panel.innerHTML = `
            <h4 class="graph-detail-title">${d.title || '(无标题)'}</h4>
            <div class="graph-detail-meta">
                <span><i class="fas fa-calendar"></i> ${d.year || '—'}</span>
                <span><i class="fas fa-quote-right"></i> ${(d.citationCount || 0).toLocaleString()} 引用</span>
            </div>
            ${d.abstract ? `<p class="graph-detail-abstract">${d.abstract.slice(0, 200)}…</p>` : ''}
            ${d.doi ? `<a class="graph-detail-link" href="https://doi.org/${d.doi}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> 查看原文</a>` : ''}
            ${d.paperId && !d.doi ? `<a class="graph-detail-link" href="https://www.semanticscholar.org/paper/${d.paperId}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Semantic Scholar</a>` : ''}`;
        panel.style.display = 'block';
    }

    function buildGraph(centerNode, relatedNodes, mode) {
        const container = document.getElementById('graphCanvas');
        if (!container || typeof d3 === 'undefined') return;
        container.innerHTML = '';

        const width = W(), height = H;
        const nodes = [centerNode, ...relatedNodes.slice(0, 20)];
        const links = relatedNodes.slice(0, 20).map(r => ({
            source: centerNode.id,
            target: r.id,
            dir: mode   // 'ref' = centerNode引用r, 'cite' = r引用centerNode
        }));

        // Create arrow markers
        svg = d3.select(container).append('svg')
            .attr('width', '100%').attr('height', height);

        const defs = svg.append('defs');
        defs.append('marker').attr('id', 'arrow').attr('viewBox', '0 -5 10 10')
            .attr('refX', 20).attr('refY', 0)
            .attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#94a3b8');

        const zoom = d3.zoom().scaleExtent([0.3, 3])
            .on('zoom', e => g.attr('transform', e.transform));
        svg.call(zoom);

        const g = svg.append('g');

        simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(130).strength(0.6))
            .force('charge', d3.forceManyBody().strength(-280))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => citeRadius(d.citationCount) + 10));

        const link = g.append('g').selectAll('line')
            .data(links).join('line')
            .attr('class', 'graph-link')
            .attr('marker-end', 'url(#arrow)');

        const node = g.append('g').selectAll('g')
            .data(nodes).join('g')
            .attr('class', d => 'graph-node' + (d.isCenter ? ' center' : ''))
            .call(d3.drag()
                .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
                .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
                .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));

        node.append('circle')
            .attr('r', d => citeRadius(d.citationCount))
            .attr('fill', d => d.isCenter ? 'var(--primary)' : yearColor(d.year))
            .attr('stroke', d => d.isCenter ? '#fff' : 'rgba(255,255,255,0.5)')
            .attr('stroke-width', d => d.isCenter ? 3 : 1.5)
            .attr('opacity', 0.92);

        // Tooltip
        const tooltip = d3.select('body').select('.graph-tooltip');
        node.on('mouseover', (e, d) => {
            tooltip.style('opacity', 1)
                .html(`<strong>${(d.title || '').slice(0, 60)}${d.title?.length > 60 ? '…' : ''}</strong><br>${d.year || ''} · ${(d.citationCount || 0).toLocaleString()} 引用`)
                .style('left', (e.pageX + 12) + 'px').style('top', (e.pageY - 28) + 'px');
        }).on('mouseout', () => tooltip.style('opacity', 0))
          .on('click', (e, d) => showDetailPanel(d));

        simulation.on('tick', () => {
            link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // Legend
        const legend = document.getElementById('graphLegend');
        if (legend) legend.innerHTML = `
            <span><span class="legend-dot" style="background:#8b5cf6"></span>2014前</span>
            <span><span class="legend-dot" style="background:#3b82f6"></span>2014-2017</span>
            <span><span class="legend-dot" style="background:#22c55e"></span>2018-2021</span>
            <span><span class="legend-dot" style="background:#f97316"></span>2022+</span>
            <span><span class="legend-dot" style="background:var(--primary)"></span>目标论文</span>`;
    }

    async function generate(mode) {
        const q = document.getElementById('graphInput')?.value.trim();
        if (!q) return;
        setStatus('loading');
        try {
            const paper = await SciAPI.searchPaperByQuery(q);
            if (!paper || paper.error || !paper.paperId) { setStatus('error', '未找到相关论文，请尝试更精确的标题或 DOI'); return; }
            currentPaperId = paper.paperId;

            const related = mode === 'ref'
                ? await SciAPI.getPaperReferences(paper.paperId)
                : await SciAPI.getPaperCitations(paper.paperId);

            const centerNode = { id: paper.paperId, title: paper.title, year: paper.year, citationCount: paper.citationCount, abstract: paper.abstract, doi: paper.doi, isCenter: true };
            const relatedNodes = related.map(r => ({ id: r.paperId, title: r.title, year: r.year, citationCount: r.citationCount }));

            setStatus('done');
            buildGraph(centerNode, relatedNodes, mode);
            showDetailPanel(centerNode);
            document.getElementById('graphStats').textContent = `找到 ${related.length} 篇${mode === 'ref' ? '前序' : '派生'}论文`;
        } catch (e) { setStatus('error', '加载失败：' + e.message); }
    }

    function setStatus(s, msg) {
        const el = document.getElementById('graphStatus');
        if (!el) return;
        if (s === 'loading') el.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在构建图谱...';
        else if (s === 'error') el.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
        else el.innerHTML = '';
    }

    function init() {
        // Ensure tooltip exists
        if (!document.querySelector('.graph-tooltip')) {
            const t = document.createElement('div');
            t.className = 'graph-tooltip';
            document.body.appendChild(t);
        }
        document.getElementById('graphGenBtn')?.addEventListener('click', () => {
            const mode = document.querySelector('.graph-tab.active')?.dataset.mode || 'ref';
            generate(mode);
        });
        document.getElementById('graphInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('graphGenBtn')?.click(); });
        document.querySelectorAll('.graph-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.graph-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (currentPaperId) generate(tab.dataset.mode);
            });
        });
    }

    return { init };
})();

/* ============================================================
   2. 论文检索  SearchFeature
   ============================================================ */
const SearchFeature = (() => {
    let currentPage = 1, currentQuery = '', currentCursor = null;
    let savedPapers = JSON.parse(localStorage.getItem('sciai-saved-papers') || '[]');

    function highlight(text, query) {
        if (!query || !text) return text || '';
        const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(re, '<mark>$1</mark>');
    }

    function isSaved(id) { return savedPapers.some(p => p.id === id); }
    function toggleSave(paper) {
        if (isSaved(paper.id)) { savedPapers = savedPapers.filter(p => p.id !== paper.id); }
        else { savedPapers.unshift(paper); }
        localStorage.setItem('sciai-saved-papers', JSON.stringify(savedPapers.slice(0, 100)));
    }

    function renderResults(data, query) {
        const grid = document.getElementById('searchResultsGrid');
        const info = document.getElementById('searchResultsInfo');
        if (!grid) return;
        if (!data.results?.length) { grid.innerHTML = '<div class="search-empty"><i class="fas fa-search"></i><p>未找到相关文献</p></div>'; if (info) info.textContent = ''; return; }
        if (info) info.textContent = `共 ${data.total?.toLocaleString() || '?'} 条结果`;

        grid.innerHTML = data.results.map(p => `
            <div class="paper-card">
                <div class="paper-card-head">
                    <h4 class="paper-title">${highlight(p.title, query)}</h4>
                    <button class="paper-save-btn ${isSaved(p.id) ? 'saved' : ''}" data-id="${p.id}" onclick="SearchFeature._toggleSaveBtn(this, ${JSON.stringify(p).replace(/"/g, '&quot;')})">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
                <div class="paper-meta">
                    ${p.authors?.length ? `<span><i class="fas fa-user-friends"></i>${p.authors.slice(0,3).join(', ')}${p.authors.length > 3 ? ' 等' : ''}</span>` : ''}
                    ${p.venue ? `<span><i class="fas fa-journal-whills"></i>${p.venue}</span>` : ''}
                    ${p.year ? `<span><i class="fas fa-calendar"></i>${p.year}</span>` : ''}
                    <span><i class="fas fa-quote-right"></i>${(p.citationCount || 0).toLocaleString()} 引用</span>
                </div>
                ${p.abstract ? `<p class="paper-abstract">${highlight(p.abstract.slice(0, 180), query)}…</p>` : ''}
                <div class="paper-card-footer">
                    ${p.doi ? `<a class="paper-doi-link" href="https://doi.org/${p.doi}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> DOI</a>` : ''}
                    ${p.url && !p.doi ? `<a class="paper-doi-link" href="${p.url}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> 查看</a>` : ''}
                </div>
            </div>`).join('');

        // Pagination
        const pg = document.getElementById('searchPagination');
        if (pg) pg.innerHTML = `
            <button class="btn-page" id="searchPrevBtn" ${currentPage <= 1 ? 'disabled' : ''}>← 上一页</button>
            <span class="page-num">第 ${currentPage} 页</span>
            <button class="btn-page" id="searchNextBtn" ${!data.hasMore ? 'disabled' : ''}>下一页 →</button>`;
        document.getElementById('searchPrevBtn')?.addEventListener('click', () => { if (currentPage > 1) { currentPage--; doSearch(); } });
        document.getElementById('searchNextBtn')?.addEventListener('click', () => { if (data.hasMore) { currentPage++; doSearch(); } });
    }

    async function doSearch() {
        const q = document.getElementById('paperSearchInput')?.value.trim();
        if (!q) return;
        currentQuery = q;
        const yearFrom = document.getElementById('yearFrom')?.value;
        const yearTo = document.getElementById('yearTo')?.value;
        const sort = document.getElementById('paperSort')?.value || 'relevance';
        setSearchLoading(true);
        const data = await SciAPI.searchPapers(q, { page: currentPage, yearFrom, yearTo, sort });
        setSearchLoading(false);
        renderResults(data, q);
    }

    function setSearchLoading(v) {
        const el = document.getElementById('searchLoadingBar');
        if (el) el.style.display = v ? 'block' : 'none';
    }

    function init() {
        document.getElementById('paperSearchBtn')?.addEventListener('click', () => { currentPage = 1; doSearch(); });
        document.getElementById('paperSearchInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') { currentPage = 1; doSearch(); } });
    }

    // Exposed for inline onclick
    window.SearchFeature = {
        _toggleSaveBtn(btn, paper) {
            toggleSave(paper);
            btn.classList.toggle('saved', isSaved(paper.id));
        }
    };

    return { init };
})();

/* ============================================================
   3. 选刊助手  JournalFeature
   ============================================================ */
const JournalFeature = (() => {
    let compareList = [];

    function renderJournalCard(j, local) {
        const ifVal = j.impactFactor ? j.impactFactor.toFixed(3) : (local ? local.if_2023 : '—');
        return `
            <div class="journal-card" data-id="${j.id || j.name}">
                <div class="journal-card-header">
                    <div class="journal-card-title">
                        <h4>${j.name}</h4>
                        ${j.isOA ? '<span class="oa-badge">OA</span>' : ''}
                        ${local ? `<span class="cn-badge">${local.category}</span>` : ''}
                    </div>
                    <button class="btn-compare-journal ${compareList.includes(j.id || j.name) ? 'active' : ''}"
                        onclick="JournalFeature._toggleCompare(${JSON.stringify(j).replace(/"/g, '&quot;')}, ${JSON.stringify(local || null).replace(/"/g, '&quot;')})">
                        <i class="fas fa-code-compare"></i> 对比
                    </button>
                </div>
                <div class="journal-stats-grid">
                    <div class="journal-stat"><span class="j-val">${ifVal || '—'}</span><span class="j-lbl">影响因子</span></div>
                    <div class="journal-stat"><span class="j-val">${j.hIndex || '—'}</span><span class="j-lbl">h-index</span></div>
                    <div class="journal-stat"><span class="j-val">${j.worksCount?.toLocaleString() || '—'}</span><span class="j-lbl">收录文章</span></div>
                    <div class="journal-stat"><span class="j-val">${j.citedByCount?.toLocaleString() || '—'}</span><span class="j-lbl">总被引</span></div>
                </div>
                <div class="journal-meta">
                    ${j.publisher ? `<span><i class="fas fa-building"></i>${j.publisher}</span>` : ''}
                    ${j.issn ? `<span><i class="fas fa-barcode"></i>ISSN: ${j.issn}</span>` : ''}
                    ${local ? `<span><i class="fas fa-list"></i>${local.field}</span>` : ''}
                </div>
                ${j.homepage ? `<a class="journal-link" href="${j.homepage}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> 官网</a>` : ''}
            </div>`;
    }

    async function doSearch() {
        const q = document.getElementById('journalInput')?.value.trim();
        if (!q) return;
        const grid = document.getElementById('journalResultsGrid');
        if (grid) grid.innerHTML = '<div class="loading-inline"><i class="fas fa-spinner fa-spin"></i> 搜索中...</div>';

        // 先查本地中文期刊数据
        const local = typeof CHINESE_JOURNALS !== 'undefined'
            ? CHINESE_JOURNALS.filter(j => j.name.includes(q) || j.nameEn?.toLowerCase().includes(q.toLowerCase()) || j.issn === q)
            : [];

        const remote = await SciAPI.searchJournals(q);
        const results = [...local.map(lj => ({ ...lj, id: lj.issn || lj.name, isLocalCN: true })),
                         ...(Array.isArray(remote) ? remote : [])];

        if (!results.length) { if (grid) grid.innerHTML = '<div class="search-empty"><i class="fas fa-journal-whills"></i><p>未找到相关期刊</p></div>'; return; }
        if (grid) grid.innerHTML = results.map(r => renderJournalCard(r, r.isLocalCN ? r : null)).join('');
    }

    function renderCompare() {
        const panel = document.getElementById('journalComparePanel');
        if (!panel) return;
        if (compareList.length < 2) { panel.style.display = 'none'; return; }
        panel.style.display = 'block';
        // compareList stores {journal, local} pairs
        const headers = compareList.map(c => `<th>${c.journal.name}</th>`).join('');
        const rows = [
            ['影响因子', c => (c.journal.impactFactor?.toFixed(3) || c.local?.if_2023 || '—')],
            ['h-index', c => c.journal.hIndex || '—'],
            ['收录文章', c => c.journal.worksCount?.toLocaleString() || '—'],
            ['总被引', c => c.journal.citedByCount?.toLocaleString() || '—'],
            ['分类', c => c.local?.category || '—'],
            ['开放获取', c => c.journal.isOA ? '✅ 是' : '❌ 否'],
        ].map(([label, fn]) => `<tr><td class="compare-label">${label}</td>${compareList.map(fn).map(v => `<td>${v}</td>`).join('')}</tr>`).join('');
        panel.innerHTML = `<h4><i class="fas fa-code-compare"></i> 期刊对比</h4>
            <table class="journal-compare-table"><thead><tr><th>指标</th>${headers}</tr></thead><tbody>${rows}</tbody></table>
            <button class="btn-clear-jcompare" onclick="JournalFeature._clearCompare()"><i class="fas fa-times"></i> 清空对比</button>`;
    }

    window.JournalFeature = {
        _toggleCompare(journal, local) {
            const key = journal.id || journal.name;
            const idx = compareList.findIndex(c => (c.journal.id || c.journal.name) === key);
            if (idx >= 0) { compareList.splice(idx, 1); }
            else { if (compareList.length >= 3) { alert('最多对比3本期刊'); return; } compareList.push({ journal, local }); }
            document.querySelectorAll('.btn-compare-journal').forEach(btn => btn.classList.remove('active'));
            compareList.forEach(c => {
                document.querySelectorAll(`[data-id="${c.journal.id || c.journal.name}"] .btn-compare-journal`).forEach(b => b.classList.add('active'));
            });
            renderCompare();
        },
        _clearCompare() { compareList = []; renderCompare(); }
    };

    function init() {
        document.getElementById('journalSearchBtn')?.addEventListener('click', doSearch);
        document.getElementById('journalInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    }

    return { init };
})();

/* ============================================================
   4. 引文核查  CiteCheckFeature
   ============================================================ */
const CiteCheckFeature = (() => {
    let lastResults = [];

    function parseRefs(text) {
        return text.split('\n').map(l => l.trim()).filter(l => l.length > 10);
    }

    function statusBadge(s) {
        const map = { ok: ['check-circle', '#059669', '正常'], review: ['exclamation-triangle', '#f59e0b', '需复核'], risk: ['times-circle', '#ef4444', '有风险'] };
        const [icon, color, label] = map[s] || map.risk;
        return `<span class="cite-status ${s}"><i class="fas fa-${icon}" style="color:${color}"></i> ${label}</span>`;
    }

    function exportCSV() {
        if (!lastResults.length) return;
        const rows = [['原文', '状态', 'Crossref匹配标题', 'DOI', 'S2匹配标题']];
        lastResults.forEach(r => rows.push([
            `"${r.original.replace(/"/g, '""')}"`,
            r.status,
            `"${(r.crossref?.title || '').replace(/"/g, '""')}"`,
            r.crossref?.doi || '',
            `"${(r.semanticScholar?.title || '').replace(/"/g, '""')}"`
        ]));
        const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = `cite-check-${new Date().toISOString().slice(0,10)}.csv`; a.click();
        URL.revokeObjectURL(a.href);
    }

    async function runCheck() {
        const text = document.getElementById('citeInput')?.value.trim();
        if (!text) return;
        const refs = parseRefs(text);
        if (!refs.length) return;
        const resultsEl = document.getElementById('citeResults');
        const progressEl = document.getElementById('citeProgress');
        const progressBar = document.getElementById('citeProgressBar');
        if (resultsEl) resultsEl.innerHTML = '';
        lastResults = [];

        let done = 0;
        if (progressEl) progressEl.style.display = 'block';

        // Process concurrently with batching (3 at a time to avoid rate limits)
        const BATCH = 3;
        for (let i = 0; i < refs.length; i += BATCH) {
            const batch = refs.slice(i, i + BATCH);
            const batchResults = await Promise.all(batch.map(ref => SciAPI.checkCitation(ref)));
            batchResults.forEach(r => {
                lastResults.push(r);
                done++;
                const pct = Math.round((done / refs.length) * 100);
                if (progressBar) progressBar.style.width = pct + '%';
                if (progressEl) progressEl.querySelector('.cite-progress-text').textContent = `核查中 ${done}/${refs.length}`;
            });
        }
        if (progressEl) progressEl.style.display = 'none';

        // Summary
        const ok = lastResults.filter(r => r.status === 'ok').length;
        const review = lastResults.filter(r => r.status === 'review').length;
        const risk = lastResults.filter(r => r.status === 'risk').length;

        if (resultsEl) resultsEl.innerHTML = `
            <div class="cite-summary">
                <span class="cite-sum ok"><i class="fas fa-check-circle"></i> 正常 ${ok}</span>
                <span class="cite-sum review"><i class="fas fa-exclamation-triangle"></i> 需复核 ${review}</span>
                <span class="cite-sum risk"><i class="fas fa-times-circle"></i> 有风险 ${risk}</span>
                <button class="btn-export-csv" onclick="CiteCheckFeature._exportCSV()"><i class="fas fa-file-csv"></i> 导出报告</button>
            </div>
            <table class="cite-table">
                <thead><tr><th>#</th><th>引文原文</th><th>状态</th><th>匹配标题</th><th>DOI</th></tr></thead>
                <tbody>
                    ${lastResults.map((r, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td class="cite-original" title="${r.original}">${r.original.slice(0, 80)}${r.original.length > 80 ? '…' : ''}</td>
                        <td>${statusBadge(r.status)}</td>
                        <td class="cite-match">${r.crossref?.title || r.semanticScholar?.title || '—'}</td>
                        <td>${r.crossref?.doi ? `<a href="https://doi.org/${r.crossref.doi}" target="_blank" rel="noopener">查看</a>` : '—'}</td>
                    </tr>`).join('')}
                </tbody>
            </table>`;
    }

    window.CiteCheckFeature = { _exportCSV: exportCSV };

    function init() {
        document.getElementById('citeCheckBtn')?.addEventListener('click', runCheck);
        document.getElementById('citeExportBtn')?.addEventListener('click', exportCSV);
    }

    return { init };
})();

/* ============================================================
   5. 论文学习卡片  PaperDeckFeature
   ============================================================ */
const PaperDeckFeature = (() => {
    let deck = [], currentIdx = 0;
    let seenIds = JSON.parse(localStorage.getItem('sciai-deck-seen') || '[]');
    let savedCards = JSON.parse(localStorage.getItem('sciai-deck-saved') || '[]');
    let todayCount = 0;
    const today = new Date().toDateString();
    if (localStorage.getItem('sciai-deck-date') !== today) {
        localStorage.setItem('sciai-deck-date', today);
        localStorage.setItem('sciai-deck-today', '0');
    }
    todayCount = parseInt(localStorage.getItem('sciai-deck-today') || '0');

    function getKeywords() {
        return localStorage.getItem('sciai-deck-keywords') || '';
    }

    function updateProgress() {
        const el = document.getElementById('deckProgress');
        if (el) el.textContent = `已刷 ${seenIds.length} 张 · 今日新增 ${todayCount} 篇`;
    }

    function showCard(idx) {
        if (!deck.length) { renderEmpty(); return; }
        const paper = deck[idx];
        if (!paper) return;
        const card = document.getElementById('deckCard');
        if (!card) return;
        card.innerHTML = `
            <div class="deck-card-inner">
                <div class="deck-card-meta">
                    <span class="deck-venue">${paper.venue || 'Semantic Scholar'}</span>
                    <span class="deck-year">${paper.year || ''}</span>
                    <span class="deck-cites"><i class="fas fa-quote-right"></i> ${(paper.citationCount || 0).toLocaleString()}</span>
                </div>
                <h3 class="deck-title">${paper.title}</h3>
                <p class="deck-abstract">${(paper.abstract || '').slice(0, 250)}${paper.abstract?.length > 250 ? '…' : ''}</p>
                <div class="deck-authors">${(paper.authors || []).slice(0, 3).map(a => a.name || a).join(', ')}</div>
                <div class="deck-actions">
                    <button class="btn-deck skip" onclick="PaperDeckFeature._skip()" title="跳过 ←"><i class="fas fa-forward-step"></i> 跳过</button>
                    <a class="btn-deck view" href="https://www.semanticscholar.org/paper/${paper.paperId}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> 原文</a>
                    <button class="btn-deck save" onclick="PaperDeckFeature._save()" title="收藏 → / Enter"><i class="fas fa-heart"></i> 收藏</button>
                </div>
            </div>`;
        updateProgress();
        document.getElementById('deckCounter').textContent = `${idx + 1} / ${deck.length}`;
    }

    function renderEmpty() {
        const card = document.getElementById('deckCard');
        if (card) card.innerHTML = `<div class="deck-empty"><i class="fas fa-layer-group"></i><p>卡片已刷完</p><button class="btn-reload-deck" onclick="PaperDeckFeature._reload()">换一批推荐</button></div>`;
    }

    async function loadDeck() {
        const keywords = getKeywords();
        if (!keywords) { renderSetup(); return; }
        const card = document.getElementById('deckCard');
        if (card) card.innerHTML = '<div class="deck-loading"><i class="fas fa-spinner fa-spin"></i> 加载推荐中...</div>';
        const papers = await SciAPI.getRecommendations(keywords, seenIds);
        deck = papers;
        currentIdx = 0;
        showCard(0);
    }

    function renderSetup() {
        const wrap = document.getElementById('deckSetupWrap');
        if (wrap) wrap.style.display = 'flex';
        const card = document.getElementById('deckCard');
        if (card) card.style.display = 'none';
    }

    window.PaperDeckFeature = {
        _skip() {
            if (currentIdx >= deck.length - 1) { loadDeck(); return; }
            seenIds.push(deck[currentIdx].paperId);
            localStorage.setItem('sciai-deck-seen', JSON.stringify(seenIds.slice(-500)));
            currentIdx++;
            showCard(currentIdx);
        },
        _save() {
            const paper = deck[currentIdx];
            if (paper) {
                savedCards.unshift(paper);
                localStorage.setItem('sciai-deck-saved', JSON.stringify(savedCards.slice(0, 200)));
                todayCount++;
                localStorage.setItem('sciai-deck-today', String(todayCount));
                seenIds.push(paper.paperId);
                localStorage.setItem('sciai-deck-seen', JSON.stringify(seenIds.slice(-500)));
            }
            if (currentIdx >= deck.length - 1) { loadDeck(); return; }
            currentIdx++;
            showCard(currentIdx);
        },
        _reload() { deck = []; currentIdx = 0; loadDeck(); },
        _savePrefs() {
            const kw = document.getElementById('deckKeywordsInput')?.value.trim();
            if (!kw) return;
            localStorage.setItem('sciai-deck-keywords', kw);
            document.getElementById('deckSetupWrap').style.display = 'none';
            document.getElementById('deckCard').style.display = '';
            loadDeck();
        }
    };

    function init() {
        // Keyboard shortcuts
        document.addEventListener('keydown', e => {
            const section = document.getElementById('paperdeckSection');
            if (!section || section.style.display === 'none') return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowLeft') PaperDeckFeature._skip();
            if (e.key === 'ArrowRight' || e.key === 'Enter') PaperDeckFeature._save();
        });
        document.getElementById('deckSavePrefsBtn')?.addEventListener('click', PaperDeckFeature._savePrefs);
        loadDeck();
    }

    return { init };
})();
