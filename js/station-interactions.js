window.SciAIStationInteractions = (() => {
    'use strict';

    function activateNavItem(deps, cat, homeFocus = '') {
        deps.queryAll('.nav-item').forEach(item => item.classList.remove('active'));
        const selector = homeFocus
            ? `.nav-item[data-category="${cat}"][data-home-focus="${homeFocus}"]`
            : `.nav-item[data-category="${cat}"]`;
        document.querySelector(selector)?.classList.add('active');
    }

    function openStationHomeFocus(deps, focus = 'tools', title = '') {
        deps.setCurrentCategory('all');
        deps.setCurrentHomeFocus(focus);
        if (title) deps.setCurrentHomeFocusTitle(title);
        activateNavItem(deps, 'all', focus);
        showSection(deps, 'all');
        filterTools(deps);
        deps.scrollCategoryIntoView('all', { focus });
    }

    function copyPromptScript(deps, id) {
        const prompt = deps.findPromptScript(id);
        if (!prompt) {
            deps.showToast('研究剧本暂不可用');
            return;
        }
        navigator.clipboard.writeText(prompt.content).then(() => {
            deps.showToast('研究剧本已复制');
        }).catch(() => {
            deps.showToast('复制失败，请稍后再试');
        });
    }

    function openMethodTool(deps, cat) {
        activateNavItem(deps, cat);
        deps.setCurrentCategory(cat);
        showSection(deps, cat);
        deps.scrollCategoryIntoView(cat);
    }

    function getFilteredTools(deps) {
        let list = [...deps.getToolCatalog()];
        const currentCategory = deps.getCurrentCategory();
        const currentPricing = deps.getCurrentPricing();
        const currentSort = deps.getCurrentSort();
        const recentlyViewed = deps.getRecentlyViewed();

        if (currentCategory === 'favorites') list = list.filter(tool => isFav(deps, tool.id));
        else if (currentCategory === 'recent') list = recentlyViewed.map(id => list.find(tool => deps.sameId(tool.id, id))).filter(Boolean);
        else if (currentCategory === 'hot') list = list.filter(tool => tool.stationSection === 'weekly' || tool.hot);
        else if (currentCategory === 'new') list = list.filter(tool => String(tool.reviewedAt || '').startsWith('2026-04') || tool.isNew);
        else if (currentCategory !== 'all') list = list.filter(tool => tool.category === currentCategory);

        if (currentPricing === 'domestic' || currentPricing === 'foreign') {
            list = list.filter(tool => tool.region === currentPricing);
        } else if (currentPricing !== 'all') {
            list = list.filter(tool => tool.pricing === currentPricing);
        }

        if (currentSort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        else if (currentSort === 'users') list.sort((a, b) => deps.parseUsers(b.users || '0') - deps.parseUsers(a.users || '0'));
        else if (currentSort === 'name') list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
        else list.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));

        return list;
    }

    function filterTools(deps) {
        renderTools(deps, getFilteredTools(deps));
    }

    function doSearch(deps, query) {
        deps.setCurrentHomeFocus('tools');
        deps.setCurrentHomeFocusTitle('工具评测');
        showSection(deps, 'all');
        activateNavItem(deps, 'all', 'tools');
        deps.setCurrentCategory('all');

        const q = String(query || '').trim().toLowerCase();
        if (!q) {
            filterTools(deps);
            return;
        }

        const results = deps.getStationSearchIndex().map(entry => {
            let score = 0;
            const haystack = [entry.title, entry.desc, entry.usageGuide, entry.status].join(' ').toLowerCase();
            if (haystack.includes(q)) score += 3;
            if (String(entry.title || '').toLowerCase().includes(q)) score += 2;
            (entry.keywords || []).forEach(keyword => {
                const value = String(keyword).toLowerCase();
                if (value.includes(q) || q.includes(value)) score += 2;
            });
            return { ...entry, score };
        }).filter(entry => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        if (!results.length) {
            deps.toolsGrid.innerHTML = '';
            deps.emptyState.style.display = 'block';
            document.getElementById('toolsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        deps.emptyState.style.display = 'none';
        deps.toolsGrid.innerHTML = results.map(entry => `
            <article class="tool-card" data-station-kind="${entry.entryKind}" data-station-ref="${entry.refId}">
                <div class="tool-card-header">
                    <div class="tool-icon" style="background:${entry.color || '#334155'}">
                        <i class="${entry.icon || 'fas fa-compass'}"></i>
                    </div>
                    <div class="tool-card-info">
                        <h4>${deps.escapeHtml(entry.title)}</h4>
                        <div class="tool-tags">
                            <span class="tool-tag">${deps.escapeHtml(entry.entryKind === 'tool' ? '精选工具' : entry.entryKind === 'script' ? '研究剧本' : '方法工具')}</span>
                            ${entry.status ? `<span class="tool-tag">${deps.escapeHtml(entry.status)}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="tool-card-desc">${deps.escapeHtml(entry.desc || '')}</div>
                ${entry.usageGuide ? `<div class="tool-card-desc">${deps.escapeHtml(entry.usageGuide)}</div>` : ''}
                <div class="tool-card-footer">
                    <div class="tool-users"><i class="fas fa-compass"></i>${deps.escapeHtml(entry.actionLabel || '打开')}</div>
                    <button class="btn-copy station-search-action" data-kind="${entry.entryKind}" data-ref="${entry.refId}">${deps.escapeHtml(entry.actionLabel || '打开')}</button>
                </div>
            </article>
        `).join('');

        deps.toolsGrid.querySelectorAll('.station-search-action').forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                handleStationEntryAction(deps, btn.dataset.kind, btn.dataset.ref);
            });
        });
        deps.toolsGrid.querySelectorAll('[data-station-kind]').forEach(card => {
            card.addEventListener('click', () => handleStationEntryAction(deps, card.dataset.stationKind, card.dataset.stationRef));
        });
        document.getElementById('toolsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showSection(deps, cat) {
        const sections = deps.sections();
        Object.values(sections).forEach(section => { if (section) section.style.display = 'none'; });

        const titleMap = {
            all: '首页',
            hot: '本周精选',
            new: '最近更新',
            favorites: '我的收藏',
            recent: '最近浏览',
            prompts: '研究剧本',
            tutorials: '更新记录',
            news: '行业资讯',
            models: '大模型排行',
            github: 'GitHub 推荐',
            usecases: '应用示例',
            graph: '科研路线',
            'search-papers': '论文检索',
            journal: '选刊助手',
            'cite-check': '引文核查',
            paperdeck: 'PaperDeck',
            stats: '统计方法库'
        };

        if (deps.pageTitle) {
            deps.pageTitle.textContent = titleMap[cat] || deps.getCurrentHomeFocusTitle() || cat;
        }

        deps.closeSidebarDrawer();
        deps.syncToolTabsVisibility(cat);
        const recSec = document.getElementById('recommendSection');

        if (cat === 'prompts') sections.prompts.style.display = 'block';
        else if (cat === 'tutorials') sections.tutorials.style.display = 'block';
        else if (cat === 'news') {
            sections.news.style.display = 'block';
            deps.renderNews(deps.getCurrentNewsData() || []);
            if (!deps.getHasRequestedLiveNews()) {
                deps.setHasRequestedLiveNews(true);
                deps.fetchLiveNews(false).then(data => deps.renderNews(data || deps.getCurrentNewsData())).catch(() => deps.renderNews(deps.getCurrentNewsData() || []));
            }
        } else if (cat === 'models') {
            sections.models.style.display = 'block';
            deps.applyModelFilters();
            if (!deps.getHasRequestedLiveModelRefresh()) {
                deps.setHasRequestedLiveModelRefresh(true);
                deps.refreshModelsData(false, true);
            }
        } else if (cat === 'github') sections.github.style.display = 'block';
        else if (cat === 'usecases') sections.usecases.style.display = 'block';
        else if (cat === 'graph') sections.graph.style.display = 'block';
        else if (cat === 'search-papers') sections.searchPapers.style.display = 'block';
        else if (cat === 'journal') sections.journal.style.display = 'block';
        else if (cat === 'citeCheck' || cat === 'cite-check') sections.citeCheck.style.display = 'block';
        else if (cat === 'paperdeck') sections.paperdeck.style.display = 'block';
        else if (cat === 'stats') {
            if (sections.statMethods) {
                sections.statMethods.style.display = 'block';
                sections.statMethods.style.width = '100%';
                sections.statMethods.style.maxWidth = 'none';
                sections.statMethods.style.marginLeft = '0';
                sections.statMethods.style.marginRight = '0';
                sections.statMethods.style.alignSelf = 'stretch';
                sections.statMethods.style.clear = 'both';
                sections.statMethods.style.position = 'relative';
                deps.statsFeature.render();
                sections.statMethods.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                deps.statsFeature.render();
            }
        } else {
            const isHome = cat === 'all';
            if (sections.hero) sections.hero.style.display = isHome ? '' : 'none';
            if (sections.featured) sections.featured.style.display = '';
            if (sections.stats) sections.stats.style.display = 'none';
            if (sections.tools) sections.tools.style.display = '';
            if (sections.prompts) sections.prompts.style.display = cat === 'prompts' ? '' : 'none';
            if (sections.tutorials) sections.tutorials.style.display = cat === 'tutorials' ? '' : 'none';
            if (recSec) recSec.style.display = isHome ? '' : 'none';
            const toolsTitle = deps.query('#toolsSectionTitle');
            if (toolsTitle) {
                if (cat === 'hot') toolsTitle.textContent = '本周精选候选';
                else if (cat === 'favorites') toolsTitle.textContent = '我的收藏';
                else if (cat === 'recent') toolsTitle.textContent = '最近浏览';
                else if (cat === 'new') toolsTitle.textContent = '最近更新工具';
                else toolsTitle.textContent = '精选工具评测';
            }
        }

        if (deps.exportFavsBtn) deps.exportFavsBtn.style.display = cat === 'favorites' ? 'flex' : 'none';
        deps.applyCuratedStationCopy();
    }

    function renderRelatedTools(deps, tool) {
        const section = deps.query('#relatedToolsSection');
        const list = deps.query('#relatedToolsList');
        if (!section || !list) return;

        const catalog = deps.getToolCatalog();
        const relatedIds = Array.isArray(tool.relatedIds) && tool.relatedIds.length
            ? tool.relatedIds
            : catalog.filter(item => !deps.sameId(item.id, tool.id) && item.category === tool.category).map(item => item.id);
        const related = relatedIds.map(id => deps.findToolById(id)).filter(Boolean).slice(0, 4);

        if (!related.length) {
            section.style.display = 'none';
            return;
        }

        section.style.display = '';
        list.innerHTML = related.map(item => `
            <button class="related-tool-chip" onclick="window._openTool('${String(item.id).replace(/'/g, "\\'")}')">
                <div class="related-tool-chip-icon" style="background:${item.color}">
                    ${item.logo ? `<img src="${item.logo}" alt="${item.name}" onerror="this.style.display='none'">` : `<i class="${item.icon}"></i>`}
                </div>
                <span>${deps.escapeHtml(item.name)}</span>
                <span class="related-chip-rating">${item.rating}</span>
            </button>
        `).join('');
    }

    function isFav(deps, id) {
        return deps.getFavorites().some(item => deps.sameId(item, id));
    }

    function toggleFav(deps, id) {
        const nextFav = !isFav(deps, id);
        const favorites = nextFav
            ? [...deps.getFavorites(), id]
            : deps.getFavorites().filter(item => !deps.sameId(item, id));
        deps.setFavorites(favorites);
        deps.saveLS('sciai-favs', favorites);
        deps.updateFavBadge();
        syncFavUI(deps, id);
        deps.showToast(nextFav ? '已加入收藏' : '已取消收藏');
    }

    function syncFavUI(deps, id) {
        deps.queryAll('.card-fav-btn').forEach(btn => {
            if (deps.sameId(btn.dataset.id, id)) btn.classList.toggle('active', isFav(deps, id));
        });
        if (deps.getCurrentToolId() !== null && deps.sameId(deps.getCurrentToolId(), id)) {
            deps.updateModalFavUI(id);
        }
    }

    function addRecent(deps, id) {
        const nextRecent = [id, ...deps.getRecentlyViewed().filter(item => !deps.sameId(item, id))].slice(0, 12);
        deps.setRecentlyViewed(nextRecent);
        deps.saveLS('sciai-recent', nextRecent);
    }

    function isInCompare(deps, id) {
        return deps.getCompareList().some(item => deps.sameId(item, id));
    }

    function toggleCompare(deps, id) {
        const compareList = [...deps.getCompareList()];
        if (isInCompare(deps, id)) {
            deps.setCompareList(compareList.filter(item => !deps.sameId(item, id)));
        } else {
            if (compareList.length >= 3) {
                deps.showToast('对比已满 3 个工具');
                return;
            }
            compareList.push(id);
            deps.setCompareList(compareList);
        }
        updateCompareBar(deps);
        syncCompareUI(deps, id);
    }

    function removeCompare(deps, id) {
        deps.setCompareList(deps.getCompareList().filter(item => !deps.sameId(item, id)));
        updateCompareBar(deps);
        syncCompareUI(deps, id);
    }

    function updateCompareBar(deps) {
        const compareList = deps.getCompareList();
        const count = compareList.length;
        if (!deps.compareToggle || !deps.compareBar || !deps.compareSlots || !deps.doCompare) return;

        deps.compareToggle.style.display = count ? 'flex' : 'none';
        const compareCount = deps.query('#compareCount');
        if (compareCount) compareCount.textContent = count;
        deps.compareBar.classList.toggle('show', count > 0);
        deps.doCompare.disabled = count < 2;

        deps.compareSlots.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'compare-slot' + (compareList[i] ? ' filled' : '');
            if (compareList[i]) {
                const tool = deps.findToolById(compareList[i]);
                slot.innerHTML = `<span class="compare-slot-name">${tool ? deps.escapeHtml(tool.name) : ''}</span>
                    <button class="compare-slot-remove" onclick="window._removeCompare('${String(compareList[i]).replace(/'/g, "\\'")}')">×</button>`;
            } else {
                slot.innerHTML = '<span style="font-size:11px;color:var(--text-muted)">+ 添加工具</span>';
            }
            deps.compareSlots.appendChild(slot);
        }
    }

    function syncCompareUI(deps, id) {
        deps.queryAll('.card-compare-cb').forEach(btn => {
            if (deps.sameId(btn.dataset.id, id)) btn.classList.toggle('active', isInCompare(deps, id));
        });
        if (deps.getCurrentToolId() !== null && deps.sameId(deps.getCurrentToolId(), id)) {
            deps.updateModalCompareUI(id);
        }
    }

    function renderTools(deps, tools) {
        if (!tools.length) {
            deps.toolsGrid.innerHTML = '';
            deps.emptyState.style.display = 'block';
            return;
        }

        deps.emptyState.style.display = 'none';
        deps.toolsGrid.innerHTML = tools.map(tool => `
            <div class="tool-card ${tool.hot ? 'is-hot' : ''}" data-id="${deps.escapeHtml(tool.id)}">
                <button class="card-fav-btn ${isFav(deps, tool.id) ? 'active' : ''}" data-id="${deps.escapeHtml(tool.id)}" title="收藏">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="card-compare-cb ${isInCompare(deps, tool.id) ? 'active' : ''}" data-id="${deps.escapeHtml(tool.id)}" title="加入对比">
                    <i class="fas fa-code-compare"></i>
                </button>
                <div class="tool-card-header">
                    <div class="tool-icon" style="background:${tool.color}">
                        ${tool.logo
                            ? `<img src="${tool.logo}" alt="${deps.escapeHtml(tool.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="icon-fallback" style="display:none"><i class="${tool.icon}"></i></span>`
                            : `<i class="${tool.icon}"></i>`}
                    </div>
                    <div class="tool-card-info">
                        <h4>${deps.escapeHtml(tool.name)}</h4>
                        <div class="tool-tags">
                            ${(tool.tags || []).map(tag => `<span class="tool-tag">${deps.escapeHtml(tag)}</span>`).join('')}
                            ${tool.pricing === 'free' ? '<span class="tool-tag free">免费</span>' : ''}
                            ${tool.pricing === 'paid' ? '<span class="tool-tag paid">付费</span>' : ''}
                            ${tool.isNew ? '<span class="tool-tag new">NEW</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="tool-card-desc">${deps.escapeHtml(tool.desc || '')}</div>
                <div class="tool-card-desc">${deps.escapeHtml(tool.reviewNote || tool.usageGuide || '')}</div>
                <div class="tool-tags">
                    ${tool.stationSectionLabel ? `<span class="tool-tag">${deps.escapeHtml(tool.stationSectionLabel)}</span>` : ''}
                    ${tool.editorialStatus ? `<span class="tool-tag">${deps.escapeHtml(tool.editorialStatus)}</span>` : ''}
                    ${tool.bestFor ? `<span class="tool-tag">${deps.escapeHtml(tool.bestFor)}</span>` : ''}
                </div>
                ${deps.renderTrustStatusRow(deps.getToolTrustMeta(tool), false)}
                <div class="tool-card-footer">
                    <div class="tool-rating">${'<i class="fas fa-star"></i>'.repeat(Math.floor(tool.rating || 0))}<span>${tool.rating || ''}</span></div>
                    <div class="tool-users"><i class="fas fa-user"></i>${deps.escapeHtml(tool.users || '')}</div>
                </div>
            </div>
        `).join('');

        deps.toolsGrid.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => deps.openToolModal(card.dataset.id));
        });
        deps.toolsGrid.querySelectorAll('.card-fav-btn').forEach(btn => {
            btn.addEventListener('click', event => {
                event.stopPropagation();
                toggleFav(deps, btn.dataset.id);
            });
        });
        deps.toolsGrid.querySelectorAll('.card-compare-cb').forEach(btn => {
            btn.addEventListener('click', event => {
                event.stopPropagation();
                toggleCompare(deps, btn.dataset.id);
            });
        });
    }

    function openCompareModal(deps) {
        const tools = deps.getCompareList().map(id => deps.findToolById(id)).filter(Boolean);
        if (tools.length < 2) return;

        const rows = [
            ['描述', tool => `<td>${deps.escapeHtml(tool.desc || '')}</td>`],
            ['评分', tool => `<td><span class="compare-stars">${'★'.repeat(Math.floor(tool.rating || 0))}${'☆'.repeat(Math.max(0, 5 - Math.floor(tool.rating || 0)))}</span> ${tool.rating || ''}</td>`],
            ['用户', tool => `<td>${deps.escapeHtml(tool.users || '')}</td>`],
            ['价格', tool => `<td><span class="pricing-badge ${tool.pricing}">${{ free: '免费', freemium: '免费增值', paid: '付费' }[tool.pricing] || deps.escapeHtml(tool.pricing || '')}</span></td>`],
            ['地区', tool => `<td>${tool.region === 'domestic' ? '国产' : '海外'}</td>`],
            ['标签', tool => `<td>${deps.escapeHtml((tool.tags || []).join(', '))}</td>`],
            ['链接', tool => `<td><a href="${tool.url}" target="_blank" style="color:var(--primary);text-decoration:none">查看外链</a></td>`]
        ];

        const headerCells = tools.map(tool => `
            <th>
                <div class="compare-tool-header">
                    <div class="compare-tool-icon" style="background:${tool.color}">
                        ${tool.logo ? `<img src="${tool.logo}" alt="${tool.name}">` : `<i class="${tool.icon}"></i>`}
                    </div>
                    <span>${deps.escapeHtml(tool.name)}</span>
                </div>
            </th>
        `).join('');

        const bodyRows = rows.map(([label, renderCell]) => `
            <tr>
                <td>${label}</td>
                ${tools.map(renderCell).join('')}
            </tr>
        `).join('');

        const compareModalBody = deps.query('#compareModalBody');
        if (!compareModalBody) return;
        compareModalBody.innerHTML = `
            <table class="compare-table">
                <thead><tr><th>对比项</th>${headerCells}</tr></thead>
                <tbody>${bodyRows}</tbody>
            </table>
        `;
        deps.compareModal?.classList.add('show');
    }

    function handleStationEntryAction(deps, kind, refId) {
        if (kind === 'tool') {
            deps.openToolModal(refId);
            return;
        }
        if (kind === 'script') {
            copyPromptScript(deps, refId);
            openStationHomeFocus(deps, 'playbooks', '研究剧本');
            document.getElementById('homePlaybooksSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        if (kind === 'method' || kind === 'entrypoint') {
            openMethodTool(deps, String(refId));
        }
    }

    return {
        activateNavItem,
        openStationHomeFocus,
        copyPromptScript,
        openMethodTool,
        getFilteredTools,
        filterTools,
        doSearch,
        showSection,
        renderRelatedTools,
        isFav,
        toggleFav,
        syncFavUI,
        addRecent,
        isInCompare,
        toggleCompare,
        removeCompare,
        updateCompareBar,
        syncCompareUI,
        renderTools,
        openCompareModal,
        handleStationEntryAction
    };
})();
