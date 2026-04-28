// ============================================
// SciAI Hub - 工具箱功能模块 v1
// 依赖：api.js (SciAPI), D3.js (v7, CDN)
// ============================================
'use strict';

/* ============================================================
   Phase 2. 学术模块工作流增强（仅数据/渲染补丁，不改主 UI）
   ============================================================ */
const AcademicWorkflowEnhancer = (() => {
    const categoryLabels = {
        descriptive: '描述性统计',
        visualization: '数据可视化',
        inferential: '推断统计',
        multivariate: '多变量分析',
        spatial: '空间分析',
        timeseries: '时间序列',
        causal: '因果推断',
        bayesian: '贝叶斯分析',
        ml: '机器学习',
        dl: '深度学习'
    };
    const disciplineLabels = {
        general: '通用',
        ecology: '生态学',
        environmental: '环境科学',
        sociology: '社会学',
        economics: '经济学'
    };
    const conditionFallbacks = {
        descriptive: {
            applicable: ['用于理解变量分布、缺失值、异常值与样本构成。', '适合作为建模、检验和可视化前的基线检查。'],
            notApplicable: ['不能单独证明组间差异、因果关系或预测能力。'],
            report: ['样本量与缺失处理', '核心统计量', '分布与异常值说明']
        },
        visualization: {
            applicable: ['用于呈现趋势、结构、空间分布或变量关系。', '适合在正式建模前沟通数据模式。'],
            notApplicable: ['不能用视觉印象替代统计检验或模型诊断。'],
            report: ['图形类型与映射变量', '坐标/尺度/分组说明', '关键模式与限制']
        },
        inferential: {
            applicable: ['研究问题是组间差异、相关或总体参数推断。', '样本独立性、分布或方差假设已被检查。'],
            notApplicable: ['样本设计不支持独立性假设或多重比较未校正时需谨慎。'],
            report: ['检验名称与假设', '样本量与效应量', 'p 值、置信区间与校正方法']
        },
        multivariate: {
            applicable: ['存在多个相关变量，需要降维、分组或解释整体结构。', '变量经过标准化或量纲处理。'],
            notApplicable: ['变量含义不清、缺失严重或样本量明显不足时不宜直接解释。'],
            report: ['变量预处理', '主轴/簇/载荷解释', '稳定性或敏感性检查']
        },
        spatial: {
            applicable: ['数据包含明确空间位置、区域或邻接关系。', '已统一投影、尺度和空间权重定义。'],
            notApplicable: ['坐标精度不足或空间尺度不一致时不宜过度解释。'],
            report: ['坐标系统与空间尺度', '空间权重/邻接定义', '空间自相关或热点结果']
        },
        timeseries: {
            applicable: ['观测有明确时间顺序、频率和潜在趋势/季节性。', '适合预测、分解或动态关系分析。'],
            notApplicable: ['时间间隔混乱、结构突变未处理或序列过短时风险较高。'],
            report: ['时间频率与缺口处理', '平稳性/自相关诊断', '预测区间或残差诊断']
        },
        causal: {
            applicable: ['已有清晰处理变量、结果变量和混杂因素框架。', '研究设计支持识别假设或准实验策略。'],
            notApplicable: ['只有横截面相关关系且无法说明识别假设时不能声称因果。'],
            report: ['识别策略与 DAG/假设', '平衡性或稳健性检查', '主效应与敏感性分析']
        },
        bayesian: {
            applicable: ['需要整合先验知识、不确定性传播或层级结构。', '可解释先验选择并检查采样收敛。'],
            notApplicable: ['先验不可辩护或 MCMC 未收敛时不应报告稳定结论。'],
            report: ['先验与似然', '收敛诊断', '后验区间与预测检查']
        },
        ml: {
            applicable: ['目标是预测、分类、排序或发现非线性模式。', '有独立验证集或交叉验证设计。'],
            notApplicable: ['样本量小、标签泄漏或只追求解释性因果结论时不宜作为主证据。'],
            report: ['数据划分与特征处理', '模型与调参策略', '验证指标与解释性结果']
        },
        dl: {
            applicable: ['数据规模较大，任务包含图像、文本、序列或复杂非线性表示。', '训练、验证和测试流程可复现。'],
            notApplicable: ['数据量不足、算力受限或无法解释错误模式时需降级方案。'],
            report: ['模型结构与训练配置', '验证曲线与过拟合检查', '测试指标与错误案例']
        }
    };

    function valuesToText(value) {
        if (!value) return '';
        if (Array.isArray(value)) return value.map(valuesToText).join(' ');
        if (typeof value === 'object') return Object.values(value).map(valuesToText).join(' ');
        return String(value);
    }

    function searchBlob(method) {
        const disciplines = (method.discipline || []).flatMap(d => [d, disciplineLabels[d]]);
        const resources = (method.resources || []).map(valuesToText);
        return [
            method.desc,
            method.useCase,
            method.category,
            categoryLabels[method.category],
            disciplines.join(' '),
            resources.join(' ')
        ].filter(Boolean).join(' ').toLowerCase();
    }

    function extendToolSearch(method) {
        if (!Array.isArray(method.tools) || method.tools.__statsSearchExtended) return;
        const blob = searchBlob(method);
        if (!blob) return;
        const originalSome = method.tools.some.bind(method.tools);
        Object.defineProperties(method.tools, {
            __statsSearchExtended: { value: true },
            __statsSearchBlob: { value: blob },
            some: {
                value(callback, thisArg) {
                    return originalSome(callback, thisArg) || callback.call(thisArg, blob, this.length, this);
                }
            }
        });
    }

    function ensureFallbackGuide(method) {
        const fallback = conditionFallbacks[method.category] || conditionFallbacks.descriptive;
        method.applicableWhen = method.applicableWhen || method.applicability || fallback.applicable;
        method.notApplicableWhen = method.notApplicableWhen || method.limitations || fallback.notApplicable;
        method.reportChecklist = method.reportChecklist || fallback.report;
    }

    function enhanceStatsMethods() {
        if (typeof STATS_METHODS === 'undefined' || !Array.isArray(STATS_METHODS)) return;
        STATS_METHODS.forEach(method => {
            extendToolSearch(method);
            ensureFallbackGuide(method);
        });
    }

    function renderPills(items) {
        return (items || []).slice(0, 3).map(item => `<span class="stats-visual-chip">${item}</span>`).join('');
    }

    function augmentStatsCards() {
        if (typeof STATS_METHODS === 'undefined' || !Array.isArray(STATS_METHODS)) return;
        document.querySelectorAll('#statsGrid .stats-card[data-method-id]').forEach(card => {
            if (card.querySelector('.stats-workflow-fallback')) return;
            const method = STATS_METHODS.find(m => String(m.id) === String(card.dataset.methodId));
            if (!method) return;
            const body = card.querySelector('.stats-card-body');
            if (!body) return;
            const block = document.createElement('div');
            block.className = 'stats-workflow-fallback';
            block.innerHTML = `
                <div class="stats-card-body-grid">
                    <div class="stats-visual-block"><div class="stats-block-title">适用条件</div><div class="stats-visual-chips">${renderPills(method.applicableWhen)}</div></div>
                    <div class="stats-visual-block"><div class="stats-block-title">不适用条件</div><div class="stats-visual-chips">${renderPills(method.notApplicableWhen)}</div></div>
                </div>
                <div class="stats-impl-block"><div class="stats-block-title">报告清单</div>${(method.reportChecklist || []).slice(0, 4).map(item => `<div class="stats-impl-line">${item}</div>`).join('')}</div>`;
            const caution = body.querySelector('.stats-caution');
            if (caution) body.insertBefore(block, caution);
            else body.appendChild(block);
        });
    }

    function init() {
        enhanceStatsMethods();
        document.addEventListener('DOMContentLoaded', () => {
            augmentStatsCards();
            const grid = document.getElementById('statsGrid');
            if (!grid || typeof MutationObserver === 'undefined') return;
            const observer = new MutationObserver(() => augmentStatsCards());
            observer.observe(grid, { childList: true, subtree: true });
        });
    }

    init();
    return { enhanceStatsMethods, augmentStatsCards };
})();

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

    function statusAction(status) {
        const map = {
            ok: '可保留；最终提交前再抽样复核 DOI 与页码。',
            review: '需要人工核对标题、作者、年份或期刊信息。',
            risk: '建议替换、补 DOI，或回到原文确认该引用是否真实存在。'
        };
        return map[status] || map.risk;
    }

    function exportEvidenceMarkdown() {
        if (!lastResults.length) return;
        const date = new Date().toISOString().slice(0, 10);
        const rows = lastResults.map((r, i) => [
            i + 1,
            (r.status || 'risk').toUpperCase(),
            (r.original || '').replace(/\s+/g, ' ').slice(0, 160),
            r.crossref?.title || '',
            r.semanticScholar?.title || '',
            r.crossref?.doi || '',
            statusAction(r.status)
        ]);
        const lines = [
            '# 引文证据核查矩阵',
            '',
            `> 导出日期：${date} · 条目数：${lastResults.length}`,
            '',
            '| # | 状态 | 原始引用 | Crossref 匹配 | Semantic Scholar 匹配 | DOI | 建议动作 |',
            '|---|---|---|---|---|---|---|',
            ...rows.map(row => `| ${row.map(cell => String(cell || '—').replace(/\|/g, '\\|')).join(' | ')} |`),
            '',
            '## 结构化复核提示',
            '',
            '请基于上表逐条复核参考文献，输出：',
            '1. 可直接保留的引用清单。',
            '2. 需要人工确认的字段：作者、年份、题名、期刊、卷期页码、DOI。',
            '3. 高风险或疑似不存在引用的替换建议。',
            '4. 最终参考文献表的统一格式修订建议。'
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `cite-evidence-matrix-${date}.md`;
        a.click();
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
                <button class="btn-export-csv" onclick="CiteCheckFeature._exportEvidenceMarkdown()"><i class="fas fa-table-list"></i> 证据矩阵</button>
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

    window.CiteCheckFeature = { _exportCSV: exportCSV, _exportEvidenceMarkdown: exportEvidenceMarkdown };

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
            const paper = deck[currentIdx];
            if (paper) {
                seenIds.push(paper.paperId);
                localStorage.setItem('sciai-deck-seen', JSON.stringify(seenIds.slice(-500)));
            }
            if (currentIdx >= deck.length - 1) { loadDeck(); return; }
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

/* ============================================================
   6. Phase 2 research workflow cockpit
   Static/local-state front-end interactions only.
   ============================================================ */
const Phase2ResearchWorkflow = (() => {
    const STORAGE_KEY = 'sciai-phase2-workflow-v1';
    const today = () => new Date().toISOString().slice(0, 10);
    const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));

    const defaults = {
        wizard: {
            title: '',
            field: 'AI / HCI',
            articleType: 'empirical',
            stage: 'drafting',
            targetTier: 'balanced',
            wordCount: '7000',
            notes: ''
        },
        stats: {
            goal: 'compare',
            outcome: 'continuous',
            predictors: 'groups',
            design: 'independent',
            sampleSize: 'medium',
            assumptions: ['normality']
        },
        matrix: [],
        citationEvidence: [],
        shortlist: [],
        exports: []
    };

    let state = loadState();

    const statRules = [
        {
            id: 'ttest',
            title: 't test / Mann-Whitney U',
            when: s => s.goal === 'compare' && s.outcome === 'continuous' && s.predictors === 'groups' && s.design !== 'repeated',
            why: 'Two independent groups with a continuous outcome. Use Mann-Whitney U if distribution assumptions fail.',
            report: 'Report group means/medians, effect size, confidence interval, p value, and assumption checks.'
        },
        {
            id: 'anova',
            title: 'ANOVA / Kruskal-Wallis',
            when: s => s.goal === 'compare' && s.outcome === 'continuous' && s.predictors === 'multiple-groups',
            why: 'Three or more groups with a continuous outcome.',
            report: 'Report omnibus test, post-hoc correction, effect size, and residual diagnostics.'
        },
        {
            id: 'mixed',
            title: 'Linear mixed-effects model',
            when: s => s.design === 'repeated' || s.design === 'nested',
            why: 'Repeated, clustered, or nested observations need random effects rather than plain tests.',
            report: 'Report fixed effects, random structure, variance components, model diagnostics, and sensitivity checks.'
        },
        {
            id: 'logistic',
            title: 'Logistic regression',
            when: s => s.outcome === 'binary',
            why: 'Binary outcome with one or more predictors.',
            report: 'Report odds ratios, confidence intervals, calibration, discrimination, and class balance.'
        },
        {
            id: 'survival',
            title: 'Cox model / Kaplan-Meier',
            when: s => s.outcome === 'time-to-event',
            why: 'Time-to-event outcome with censoring.',
            report: 'Report censoring rules, hazard ratios, proportional hazards checks, and survival curves.'
        },
        {
            id: 'correlation',
            title: 'Correlation / regression',
            when: s => s.goal === 'relationship' && s.outcome === 'continuous',
            why: 'Quantifies association between continuous variables or predictor-outcome relationships.',
            report: 'Report correlation/regression coefficient, interval estimate, scatterplot, and influential points.'
        },
        {
            id: 'classification',
            title: 'Classification model',
            when: s => s.goal === 'predict' && (s.outcome === 'binary' || s.outcome === 'categorical'),
            why: 'Prediction task with categorical labels.',
            report: 'Report train/validation split, leakage controls, AUROC/F1, calibration, and error analysis.'
        },
        {
            id: 'bayesian',
            title: 'Bayesian hierarchical model',
            when: s => s.goal === 'uncertainty' || s.assumptions.includes('prior'),
            why: 'Useful when prior knowledge, small samples, or hierarchical uncertainty are central.',
            report: 'Report priors, posterior intervals, convergence diagnostics, and posterior predictive checks.'
        }
    ];

    const wizardChecklists = {
        empirical: [
            'Confirm research question, contribution claim, and falsifiable hypotheses.',
            'Lock inclusion/exclusion criteria and data provenance.',
            'Prepare methods transparency: preprocessing, model/test choice, robustness checks.',
            'Align abstract, introduction, and conclusion around the same central claim.'
        ],
        review: [
            'Define search strings, databases, time window, and screening rules.',
            'Create evidence extraction schema before reading full texts.',
            'Separate descriptive mapping from argumentative synthesis.',
            'Document limitations and missing literature explicitly.'
        ],
        methods: [
            'State target failure mode of existing methods.',
            'Add baseline comparison, ablation plan, and sensitivity analysis.',
            'Prepare reproducibility package: data, code, seeds, configuration.',
            'Use figures to show mechanism, not only performance.'
        ],
        perspective: [
            'Clarify stance and audience.',
            'Separate evidence-backed claims from speculation.',
            'Add counterarguments and boundary conditions.',
            'End with operational implications or a research agenda.'
        ]
    };

    const journalProfiles = [
        { name: 'Nature Human Behaviour', scope: 'behavior, society, computation', tier: 'ambitious', speed: 'slow', oa: 'hybrid' },
        { name: 'PLOS ONE', scope: 'methodologically sound multidisciplinary work', tier: 'safe', speed: 'medium', oa: 'full' },
        { name: 'Patterns', scope: 'data science, AI systems, scientific workflows', tier: 'balanced', speed: 'medium', oa: 'full' },
        { name: 'Scientific Reports', scope: 'broad empirical science', tier: 'safe', speed: 'medium', oa: 'full' },
        { name: 'ACM CHI', scope: 'human-computer interaction and user studies', tier: 'ambitious', speed: 'deadline', oa: 'conference' }
    ];

    function loadState() {
        try {
            return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
        } catch {
            return structuredClone(defaults);
        }
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function download(filename, content, type = 'text/plain;charset=utf-8') {
        const blob = new Blob([content], { type });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function mount() {
        if (document.getElementById('phase2Workflow')) return;
        const anchor = document.getElementById('toolsSection') || document.querySelector('main') || document.body;
        const panel = document.createElement('section');
        panel.className = 'phase2-workflow';
        panel.id = 'phase2Workflow';
        panel.innerHTML = renderShell();
        if (anchor.id === 'toolsSection') anchor.insertAdjacentElement('afterend', panel);
        else anchor.appendChild(panel);
        bindEvents(panel);
        renderAll();
    }

    function renderShell() {
        return `
            <div class="phase2-head">
                <div>
                    <div class="phase2-kicker">Phase 2 Research Workflow</div>
                    <h3>像研究工作流一样推进论文</h3>
                    <p>把投稿准备、统计路线、文献证据、引文核查、选刊 shortlist 和导出收在一个本地工作台里。所有内容保存在浏览器本地，不需要后端。</p>
                </div>
                <button class="phase2-save" data-phase2-action="save">保存当前工作流</button>
            </div>
            <div class="phase2-tabs" role="tablist">
                ${[
                    ['wizard', '投稿向导'],
                    ['stats', '统计选择器'],
                    ['matrix', 'PaperDeck 文献矩阵'],
                    ['citations', '引文证据核查'],
                    ['journals', '选刊 shortlist'],
                    ['export', '导出']
                ].map(([id, label], i) => `<button class="phase2-tab ${i === 0 ? 'active' : ''}" data-phase2-tab="${id}" type="button">${label}</button>`).join('')}
            </div>
            <div class="phase2-panel active" data-phase2-panel="wizard"></div>
            <div class="phase2-panel" data-phase2-panel="stats"></div>
            <div class="phase2-panel" data-phase2-panel="matrix"></div>
            <div class="phase2-panel" data-phase2-panel="citations"></div>
            <div class="phase2-panel" data-phase2-panel="journals"></div>
            <div class="phase2-panel" data-phase2-panel="export"></div>
        `;
    }

    function renderAll() {
        renderWizard();
        renderStats();
        renderMatrix();
        renderCitations();
        renderJournals();
        renderExport();
    }

    function panel(name) {
        return document.querySelector(`[data-phase2-panel="${name}"]`);
    }

    function renderWizard() {
        const w = state.wizard;
        const checklist = wizardChecklists[w.articleType] || wizardChecklists.empirical;
        const readiness = calculateReadiness();
        panel('wizard').innerHTML = `
            <div class="phase2-grid">
                <div class="phase2-card">
                    <h4>稿件画像</h4>
                    ${field('题目/暂定题', 'wizard.title', w.title, 'input')}
                    ${field('学科/方向', 'wizard.field', w.field, 'input')}
                    <label class="phase2-field">文章类型
                        <select data-phase2-model="wizard.articleType">
                            ${option('empirical', '实证研究', w.articleType)}
                            ${option('review', '综述/系统综述', w.articleType)}
                            ${option('methods', '方法/系统论文', w.articleType)}
                            ${option('perspective', '观点/评论', w.articleType)}
                        </select>
                    </label>
                    <label class="phase2-field">当前阶段
                        <select data-phase2-model="wizard.stage">
                            ${option('planning', '选题/设计', w.stage)}
                            ${option('analysis', '分析中', w.stage)}
                            ${option('drafting', '写作中', w.stage)}
                            ${option('pre-submission', '投稿前', w.stage)}
                            ${option('revision', '返修', w.stage)}
                        </select>
                    </label>
                    <label class="phase2-field">目标策略
                        <select data-phase2-model="wizard.targetTier">
                            ${option('ambitious', '冲刺高影响', w.targetTier)}
                            ${option('balanced', '命中率/影响力平衡', w.targetTier)}
                            ${option('safe', '稳妥发表', w.targetTier)}
                        </select>
                    </label>
                    ${field('预计字数', 'wizard.wordCount', w.wordCount, 'input')}
                    ${field('关键风险/备注', 'wizard.notes', w.notes, 'textarea')}
                </div>
                <div class="phase2-card">
                    <h4>投稿准备度 <span class="phase2-score">${readiness}%</span></h4>
                    <ul class="phase2-list">
                        ${checklist.map(item => `<li>${esc(item)}</li>`).join('')}
                    </ul>
                    <div class="phase2-actions">
                        <button class="phase2-btn" data-phase2-action="seed-journals" type="button">按策略生成 shortlist</button>
                        <button class="phase2-btn secondary" data-phase2-action="seed-matrix" type="button">从收藏卡片生成矩阵</button>
                    </div>
                    <div class="phase2-result" style="margin-top:12px">
                        下一步建议：${esc(nextWizardAction())}
                    </div>
                </div>
            </div>
        `;
    }

    function renderStats() {
        const s = state.stats;
        const recs = recommendStats();
        panel('stats').innerHTML = `
            <div class="phase2-grid">
                <div class="phase2-card">
                    <h4>研究设计输入</h4>
                    <label class="phase2-field">目标
                        <select data-phase2-model="stats.goal">
                            ${option('compare', '比较组间差异', s.goal)}
                            ${option('relationship', '解释变量关系', s.goal)}
                            ${option('predict', '预测/分类', s.goal)}
                            ${option('uncertainty', '不确定性建模', s.goal)}
                        </select>
                    </label>
                    <label class="phase2-field">结果变量
                        <select data-phase2-model="stats.outcome">
                            ${option('continuous', '连续变量', s.outcome)}
                            ${option('binary', '二分类', s.outcome)}
                            ${option('categorical', '多分类', s.outcome)}
                            ${option('count', '计数', s.outcome)}
                            ${option('time-to-event', '生存/时间到事件', s.outcome)}
                        </select>
                    </label>
                    <label class="phase2-field">预测/分组结构
                        <select data-phase2-model="stats.predictors">
                            ${option('groups', '两个组', s.predictors)}
                            ${option('multiple-groups', '三个及以上组', s.predictors)}
                            ${option('continuous', '连续预测变量', s.predictors)}
                            ${option('mixed', '混合变量', s.predictors)}
                        </select>
                    </label>
                    <label class="phase2-field">设计结构
                        <select data-phase2-model="stats.design">
                            ${option('independent', '独立样本', s.design)}
                            ${option('repeated', '重复测量/配对', s.design)}
                            ${option('nested', '嵌套/聚类', s.design)}
                            ${option('observational', '观察性研究', s.design)}
                        </select>
                    </label>
                    <label class="phase2-field">样本量
                        <select data-phase2-model="stats.sampleSize">
                            ${option('small', '< 50', s.sampleSize)}
                            ${option('medium', '50-500', s.sampleSize)}
                            ${option('large', '> 500', s.sampleSize)}
                        </select>
                    </label>
                </div>
                <div class="phase2-card">
                    <h4>推荐路线</h4>
                    <div class="phase2-list">
                        ${recs.map(r => `<div class="phase2-result"><strong>${esc(r.title)}</strong><br>${esc(r.why)}<br><span class="phase2-badge">${esc(r.report)}</span></div>`).join('')}
                    </div>
                    <div class="phase2-actions">
                        <button class="phase2-btn" data-phase2-action="add-stat-to-matrix" type="button">写入文献矩阵行动项</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderMatrix() {
        const rows = state.matrix;
        panel('matrix').innerHTML = `
            <div class="phase2-card">
                <h4>PaperDeck 文献矩阵</h4>
                <div class="phase2-actions">
                    <button class="phase2-btn" data-phase2-action="add-matrix-row" type="button">新增文献</button>
                    <button class="phase2-btn secondary" data-phase2-action="seed-matrix" type="button">导入已收藏 PaperDeck</button>
                    <button class="phase2-btn secondary" data-phase2-action="export-matrix-md" type="button">导出矩阵 Markdown</button>
                </div>
                <div class="phase2-table-wrap" style="margin-top:14px">
                    ${rows.length ? `
                    <table class="phase2-table">
                        <thead><tr><th>文献</th><th>角色</th><th>方法</th><th>关键证据</th><th>限制</th><th>下一步</th><th></th></tr></thead>
                        <tbody>${rows.map(row => renderMatrixRow(row)).join('')}</tbody>
                    </table>` : '<div class="phase2-empty">还没有文献。可以手动新增，或从 PaperDeck 收藏卡片导入。</div>'}
                </div>
            </div>
        `;
    }

    function renderCitations() {
        panel('citations').innerHTML = `
            <div class="phase2-grid">
                <div class="phase2-card">
                    <h4>引文证据核查</h4>
                    <label class="phase2-field">粘贴参考文献，每行一条
                        <textarea id="phase2CitationInput" placeholder="Smith, J. (2024). Title. Journal. DOI..."></textarea>
                    </label>
                    <div class="phase2-actions">
                        <button class="phase2-btn" data-phase2-action="run-citation-evidence" type="button">本地核查</button>
                        <button class="phase2-btn secondary" data-phase2-action="export-citation-md" type="button">导出证据表</button>
                        <button class="phase2-btn danger" data-phase2-action="clear-citations" type="button">清空</button>
                    </div>
                </div>
                <div class="phase2-card">
                    <h4>核查结果</h4>
                    ${renderCitationResults()}
                </div>
            </div>
        `;
    }

    function renderJournals() {
        panel('journals').innerHTML = `
            <div class="phase2-card">
                <h4>选刊 shortlist</h4>
                <div class="phase2-grid three">
                    ${field('期刊/会议名称', 'journal.name', '', 'input', 'phase2JournalName')}
                    ${field('Scope / fit', 'journal.scope', '', 'input', 'phase2JournalScope')}
                    <label class="phase2-field">策略
                        <select id="phase2JournalTier">
                            ${option('ambitious', '冲刺', '')}
                            ${option('balanced', '平衡', '')}
                            ${option('safe', '稳妥', '')}
                        </select>
                    </label>
                </div>
                <div class="phase2-actions">
                    <button class="phase2-btn" data-phase2-action="add-journal" type="button">加入 shortlist</button>
                    <button class="phase2-btn secondary" data-phase2-action="seed-journals" type="button">按投稿策略生成</button>
                    <button class="phase2-btn secondary" data-phase2-action="export-journals-md" type="button">导出 shortlist</button>
                </div>
                <div class="phase2-table-wrap" style="margin-top:14px">
                    ${state.shortlist.length ? `
                    <table class="phase2-table">
                        <thead><tr><th>名称</th><th>Scope</th><th>策略</th><th>匹配分</th><th>备注</th><th></th></tr></thead>
                        <tbody>${state.shortlist.map(j => renderJournalRow(j)).join('')}</tbody>
                    </table>` : '<div class="phase2-empty">还没有 shortlist。可手动添加或自动生成一组候选。</div>'}
                </div>
            </div>
        `;
    }

    function renderExport() {
        const md = buildMarkdown();
        panel('export').innerHTML = `
            <div class="phase2-grid">
                <div class="phase2-card">
                    <h4>一键导出</h4>
                    <div class="phase2-badges">
                        <span class="phase2-badge">矩阵 ${state.matrix.length}</span>
                        <span class="phase2-badge">引文 ${state.citationEvidence.length}</span>
                        <span class="phase2-badge">期刊 ${state.shortlist.length}</span>
                    </div>
                    <div class="phase2-actions">
                        <button class="phase2-btn" data-phase2-action="export-workflow-md" type="button">下载 Markdown</button>
                        <button class="phase2-btn secondary" data-phase2-action="export-workflow-json" type="button">下载 JSON</button>
                        <button class="phase2-btn secondary" data-phase2-action="copy-workflow-md" type="button">复制 Markdown</button>
                    </div>
                    <div class="phase2-result" id="phase2ExportStatus" style="margin-top:12px">导出内容会汇总投稿向导、统计选择、文献矩阵、引文证据和 shortlist。</div>
                </div>
                <div class="phase2-card">
                    <h4>预览</h4>
                    <textarea readonly style="width:100%;min-height:320px;border:1px solid rgba(15,23,42,.12);border-radius:14px;padding:12px;box-sizing:border-box">${esc(md)}</textarea>
                </div>
            </div>
        `;
    }

    function field(label, model, value, type, id = '') {
        const attr = id ? ` id="${id}"` : ` data-phase2-model="${model}"`;
        if (type === 'textarea') {
            return `<label class="phase2-field">${label}<textarea${attr}>${esc(value)}</textarea></label>`;
        }
        return `<label class="phase2-field">${label}<input${attr} value="${esc(value)}"></label>`;
    }

    function option(value, label, selected) {
        return `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(label)}</option>`;
    }

    function renderMatrixRow(row) {
        return `
            <tr data-phase2-row="${esc(row.id)}">
                <td><textarea data-phase2-matrix="title">${esc(row.title)}</textarea></td>
                <td><select data-phase2-matrix="role">
                    ${['背景', '核心证据', '方法参考', '反例/限制', '待读'].map(v => option(v, v, row.role)).join('')}
                </select></td>
                <td><textarea data-phase2-matrix="method">${esc(row.method)}</textarea></td>
                <td><textarea data-phase2-matrix="evidence">${esc(row.evidence)}</textarea></td>
                <td><textarea data-phase2-matrix="limitation">${esc(row.limitation)}</textarea></td>
                <td><textarea data-phase2-matrix="action">${esc(row.action)}</textarea></td>
                <td><button class="phase2-btn danger" data-phase2-action="delete-matrix-row" type="button">删除</button></td>
            </tr>`;
    }

    function renderCitationResults() {
        const rows = state.citationEvidence;
        if (!rows.length) return '<div class="phase2-empty">暂无核查结果。这里会用 DOI、年份、页码、题名长度和疑似占位符做本地启发式检查。</div>';
        return `
            <div class="phase2-table-wrap">
                <table class="phase2-table">
                    <thead><tr><th>#</th><th>状态</th><th>证据</th><th>建议</th></tr></thead>
                    <tbody>
                        ${rows.map((r, i) => `<tr>
                            <td>${i + 1}</td>
                            <td><span class="phase2-score">${esc(r.status)}</span></td>
                            <td>${esc(r.reference)}</td>
                            <td>${esc(r.action)}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
    }

    function renderJournalRow(j) {
        return `
            <tr data-phase2-journal="${esc(j.id)}">
                <td><input data-phase2-journal-field="name" value="${esc(j.name)}"></td>
                <td><textarea data-phase2-journal-field="scope">${esc(j.scope)}</textarea></td>
                <td><select data-phase2-journal-field="tier">
                    ${['ambitious', 'balanced', 'safe'].map(v => option(v, tierLabel(v), j.tier)).join('')}
                </select></td>
                <td><span class="phase2-score">${journalScore(j)}</span></td>
                <td><textarea data-phase2-journal-field="notes">${esc(j.notes || '')}</textarea></td>
                <td><button class="phase2-btn danger" data-phase2-action="delete-journal" type="button">删除</button></td>
            </tr>`;
    }

    function bindEvents(root) {
        root.addEventListener('click', event => {
            const tab = event.target.closest('[data-phase2-tab]');
            if (tab) {
                root.querySelectorAll('[data-phase2-tab]').forEach(btn => btn.classList.toggle('active', btn === tab));
                root.querySelectorAll('[data-phase2-panel]').forEach(p => p.classList.toggle('active', p.dataset.phase2Panel === tab.dataset.phase2Tab));
                return;
            }
            const actionEl = event.target.closest('[data-phase2-action]');
            if (!actionEl) return;
            handleAction(actionEl.dataset.phase2Action, actionEl);
        });

        root.addEventListener('input', event => {
            const model = event.target.dataset.phase2Model;
            if (model) {
                setModel(model, event.target.value);
                saveState();
                return;
            }
            updateEditableRow(event.target);
        });

        root.addEventListener('change', event => {
            const model = event.target.dataset.phase2Model;
            if (model) {
                setModel(model, event.target.value);
                saveState();
                renderAll();
                return;
            }
            updateEditableRow(event.target);
        });
    }

    function handleAction(action, el) {
        if (action === 'save') saveState();
        if (action === 'seed-journals') seedJournals();
        if (action === 'seed-matrix') seedMatrixFromDeck();
        if (action === 'add-stat-to-matrix') addStatsActionToMatrix();
        if (action === 'add-matrix-row') state.matrix.unshift(blankMatrixRow());
        if (action === 'delete-matrix-row') state.matrix = state.matrix.filter(row => row.id !== el.closest('[data-phase2-row]')?.dataset.phase2Row);
        if (action === 'run-citation-evidence') runCitationEvidence();
        if (action === 'clear-citations') state.citationEvidence = [];
        if (action === 'add-journal') addJournalFromForm();
        if (action === 'delete-journal') state.shortlist = state.shortlist.filter(j => j.id !== el.closest('[data-phase2-journal]')?.dataset.phase2Journal);
        if (action === 'export-matrix-md') download(`paperdeck-matrix-${today()}.md`, buildMatrixMarkdown(), 'text/markdown;charset=utf-8');
        if (action === 'export-citation-md') download(`citation-evidence-${today()}.md`, buildCitationMarkdown(), 'text/markdown;charset=utf-8');
        if (action === 'export-journals-md') download(`journal-shortlist-${today()}.md`, buildJournalMarkdown(), 'text/markdown;charset=utf-8');
        if (action === 'export-workflow-md') download(`research-workflow-${today()}.md`, buildMarkdown(), 'text/markdown;charset=utf-8');
        if (action === 'export-workflow-json') download(`research-workflow-${today()}.json`, JSON.stringify(state, null, 2), 'application/json;charset=utf-8');
        if (action === 'copy-workflow-md') copyMarkdown();
        saveState();
        renderAll();
    }

    function setModel(path, value) {
        const [group, key] = path.split('.');
        if (!state[group]) state[group] = {};
        state[group][key] = value;
    }

    function updateEditableRow(target) {
        const matrixField = target.dataset.phase2Matrix;
        const matrixRow = target.closest?.('[data-phase2-row]');
        if (matrixField && matrixRow) {
            const row = state.matrix.find(item => item.id === matrixRow.dataset.phase2Row);
            if (row) row[matrixField] = target.value;
            saveState();
        }

        const journalField = target.dataset.phase2JournalField;
        const journalRow = target.closest?.('[data-phase2-journal]');
        if (journalField && journalRow) {
            const row = state.shortlist.find(item => item.id === journalRow.dataset.phase2Journal);
            if (row) row[journalField] = target.value;
            saveState();
            if (journalField === 'tier' || journalField === 'scope') renderJournals();
        }
    }

    function calculateReadiness() {
        const w = state.wizard;
        let score = 20;
        if (w.title.length > 12) score += 15;
        if (state.matrix.length >= 5) score += 20;
        if (state.citationEvidence.length >= 3) score += 15;
        if (state.shortlist.length >= 3) score += 15;
        if (w.notes.length > 20) score += 10;
        if (w.stage === 'pre-submission' || w.stage === 'revision') score += 5;
        return Math.min(score, 100);
    }

    function nextWizardAction() {
        if (!state.matrix.length) return '先建立 5-8 篇核心文献矩阵，明确每篇文献在论证中的角色。';
        if (!state.citationEvidence.length) return '把参考文献粘贴到引文证据核查，先排除明显缺 DOI、年份或页码的问题。';
        if (state.shortlist.length < 3) return '至少准备 3 个候选期刊/会议，并写明 fit、风险和备选策略。';
        return '进入投稿前检查：统一摘要、cover letter、图表标题、数据/代码可用性声明。';
    }

    function recommendStats() {
        const recs = statRules.filter(rule => rule.when(state.stats));
        return recs.length ? recs : [{
            title: 'Descriptive analysis + design review',
            why: 'Current combination is broad. Start with distribution, missingness, and design diagnostics before choosing a confirmatory test.',
            report: 'Report sample flow, missingness, descriptive table, visualization, and explicit model decision.'
        }];
    }

    function blankMatrixRow(seed = {}) {
        return {
            id: uid('paper'),
            title: seed.title || '',
            role: seed.role || '待读',
            method: seed.method || '',
            evidence: seed.evidence || '',
            limitation: seed.limitation || '',
            action: seed.action || '阅读全文并补证据'
        };
    }

    function seedMatrixFromDeck() {
        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem('sciai-deck-saved') || '[]');
        } catch {
            saved = [];
        }
        const additions = saved.slice(0, 12).filter(p => !state.matrix.some(row => row.title === p.title)).map(p => blankMatrixRow({
            title: `${p.title || 'Untitled'}${p.year ? ` (${p.year})` : ''}`,
            role: '待读',
            method: p.venue || '',
            evidence: (p.abstract || '').slice(0, 180),
            action: '判断是否进入核心证据链'
        }));
        if (!additions.length) additions.push(blankMatrixRow({ title: '手动补充核心文献', action: '从检索结果或 Zotero 中补齐' }));
        state.matrix = [...additions, ...state.matrix].slice(0, 60);
    }

    function addStatsActionToMatrix() {
        const recs = recommendStats();
        state.matrix.unshift(blankMatrixRow({
            title: `统计路线备忘：${recs.map(r => r.title).join(' / ')}`,
            role: '方法参考',
            method: recs[0]?.title || '',
            evidence: recs[0]?.why || '',
            limitation: '需要根据真实数据分布和研究设计复核。',
            action: recs[0]?.report || '补充报告清单。'
        }));
    }

    function runCitationEvidence() {
        const input = document.getElementById('phase2CitationInput');
        const refs = (input?.value || '').split(/\n+/).map(s => s.trim()).filter(s => s.length > 8);
        state.citationEvidence = refs.map(reference => {
            const hasDoi = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i.test(reference);
            const hasYear = /\b(19|20)\d{2}\b/.test(reference);
            const suspicious = /\b(lorem|placeholder|unknown|ai generated|journal of advanced research studies)\b/i.test(reference);
            const hasPages = /\b\d{1,4}\s*[-–]\s*\d{1,4}\b/.test(reference);
            let status = 'ok';
            let action = '可保留，投稿前抽样核对原文页面和 DOI。';
            if (suspicious || (!hasDoi && !hasYear)) {
                status = 'risk';
                action = '高风险：回到原文或数据库确认是否真实存在，必要时替换。';
            } else if (!hasDoi || !hasPages) {
                status = 'review';
                action = '需人工复核 DOI、卷期页码或出版社页面。';
            }
            return { id: uid('cite'), reference, status, hasDoi, hasYear, hasPages, action };
        });
    }

    function seedJournals() {
        const wanted = state.wizard.targetTier;
        const profiles = journalProfiles
            .filter(j => wanted === 'balanced' ? true : j.tier === wanted)
            .map(j => ({ ...j, id: uid('journal'), notes: 'Auto-generated candidate. Verify fit, fees, indexing, and recent aims/scope before submission.' }));
        const merged = [...state.shortlist];
        profiles.forEach(j => {
            if (!merged.some(item => item.name === j.name)) merged.push(j);
        });
        state.shortlist = merged.slice(0, 12);
    }

    function addJournalFromForm() {
        const name = document.getElementById('phase2JournalName')?.value.trim();
        if (!name) return;
        state.shortlist.unshift({
            id: uid('journal'),
            name,
            scope: document.getElementById('phase2JournalScope')?.value.trim() || state.wizard.field,
            tier: document.getElementById('phase2JournalTier')?.value || 'balanced',
            speed: '',
            oa: '',
            notes: ''
        });
    }

    function tierLabel(value) {
        return ({ ambitious: '冲刺', balanced: '平衡', safe: '稳妥' })[value] || value;
    }

    function journalScore(journal) {
        const text = `${journal.name} ${journal.scope} ${state.wizard.field}`.toLowerCase();
        let score = 55;
        if (journal.tier === state.wizard.targetTier) score += 15;
        state.wizard.field.toLowerCase().split(/[,\s/]+/).filter(Boolean).forEach(token => {
            if (text.includes(token)) score += 5;
        });
        if (journal.oa === 'full') score += 5;
        return Math.min(score, 95);
    }

    function buildMatrixMarkdown() {
        const rows = state.matrix.map(r => `| ${[r.title, r.role, r.method, r.evidence, r.limitation, r.action].map(mdCell).join(' | ')} |`);
        return ['# PaperDeck literature matrix', '', '| Paper | Role | Method | Evidence | Limitation | Action |', '|---|---|---|---|---|---|', ...rows].join('\n');
    }

    function buildCitationMarkdown() {
        const rows = state.citationEvidence.map(r => `| ${[r.status, r.reference, r.action].map(mdCell).join(' | ')} |`);
        return ['# Citation evidence check', '', '| Status | Reference | Action |', '|---|---|---|', ...rows].join('\n');
    }

    function buildJournalMarkdown() {
        const rows = state.shortlist.map(j => `| ${[j.name, j.scope, tierLabel(j.tier), journalScore(j), j.notes || ''].map(mdCell).join(' | ')} |`);
        return ['# Journal shortlist', '', '| Journal | Scope | Strategy | Fit score | Notes |', '|---|---|---|---|---|', ...rows].join('\n');
    }

    function buildMarkdown() {
        const w = state.wizard;
        return [
            '# Research workflow export',
            '',
            `Generated: ${today()}`,
            '',
            '## Submission wizard',
            '',
            `- Title: ${w.title || 'Untitled'}`,
            `- Field: ${w.field}`,
            `- Article type: ${w.articleType}`,
            `- Stage: ${w.stage}`,
            `- Target strategy: ${w.targetTier}`,
            `- Readiness: ${calculateReadiness()}%`,
            `- Next action: ${nextWizardAction()}`,
            '',
            '## Statistical route',
            '',
            ...recommendStats().map(r => `- ${r.title}: ${r.why} Report: ${r.report}`),
            '',
            buildMatrixMarkdown(),
            '',
            buildCitationMarkdown(),
            '',
            buildJournalMarkdown()
        ].join('\n');
    }

    function mdCell(value) {
        return String(value || '-').replace(/\|/g, '\\|').replace(/\n+/g, ' ');
    }

    async function copyMarkdown() {
        const status = document.getElementById('phase2ExportStatus');
        try {
            await navigator.clipboard.writeText(buildMarkdown());
            if (status) status.textContent = '已复制到剪贴板。';
        } catch {
            if (status) status.textContent = '复制失败，请使用下载 Markdown。';
        }
    }

    function init() {
        mount();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    window.Phase2ResearchWorkflow = { init, getState: () => state };
    return { init };
})();
