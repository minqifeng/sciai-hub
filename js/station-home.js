window.SciAIStationHome = (() => {
    'use strict';

    function renderTagList(deps, items, limit = 3) {
        const list = Array.isArray(items) ? items.filter(Boolean).slice(0, limit) : [];
        return list.map(item => `<span class="tool-tag">${deps.escapeHtml(String(item))}</span>`).join('');
    }

    function renderEvidenceList(deps, evidence, limit = 3) {
        const list = Array.isArray(evidence) ? evidence.filter(Boolean).slice(0, limit) : [];
        if (!list.length) return '';
        return `
            <div class="tool-card-desc">
                ${list.map(item => {
                    const label = typeof item === 'string' ? 'Evidence' : (item.label || item.key || 'Evidence');
                    const detail = typeof item === 'string' ? item : (item.detail || item.summary || item.mode || '');
                    return `<div><strong>${deps.escapeHtml(label)}: </strong>${deps.escapeHtml(detail)}</div>`;
                }).join('')}
            </div>
        `;
    }

    function renderDailyDigest(deps, entries) {
        const grid = deps.dailyDigestGrid;
        if (!grid) return;
        const brief = document.getElementById('dailyDigestBrief');
        const lead = Array.isArray(entries) ? entries[0] : null;
        if (brief && lead) {
            const takeaways = Array.isArray(lead.takeaways) ? lead.takeaways : [];
            const layerTags = renderTagList(deps, lead.sourceLayers, 3);
            brief.innerHTML = `
                <div class="daily-brief-main">
                    <span class="section-chip">${deps.escapeHtml(lead.date || 'Daily brief')}</span>
                    <h4>${deps.escapeHtml(lead.issueTitle || '每日 AI+科研日报')}</h4>
                    <p>${deps.escapeHtml(lead.issueSummary || '把今天值得研究者关注的模型、工具、论文工作流和开源变化压缩成可执行摘要。')}</p>
                    ${lead.sourceProfile ? `<p class="section-sub">Source profile: ${deps.escapeHtml(lead.sourceProfile)}</p>` : ''}
                    ${layerTags ? `<div class="tool-tags">${layerTags}</div>` : ''}
                </div>
                <div class="daily-brief-actions">
                    ${takeaways.map(item => `<span>${deps.escapeHtml(item)}</span>`).join('')}
                </div>
            `;
        }
        grid.innerHTML = entries.map(entry => {
            const source = Array.isArray(entry.sourceRefs) ? entry.sourceRefs[0] : null;
            const sourceLink = entry.url || source?.url || '';
            const extraSources = Array.isArray(entry.sourceRefs) ? entry.sourceRefs.slice(0, 2) : [];
            const sourceLabel = source?.label || (sourceLink ? '查看来源' : '');
            return `
                <article class="digest-card">
                    <span class="digest-card-label">${deps.escapeHtml(entry.label || '今日精选')}</span>
                    <h4>${deps.escapeHtml(entry.title || '今日精选情报')}</h4>
                    <p>${deps.escapeHtml(entry.summary || '围绕今天最值得关注的研究、工具与开源变化做压缩摘要。')}</p>
                    <div class="digest-card-meta">
                        ${entry.date ? `<span class="tool-tag">${deps.escapeHtml(entry.date)}</span>` : ''}
                        ${entry.status ? `<span class="tool-tag">${deps.escapeHtml(entry.status)}</span>` : ''}
                        ${entry.reviewStatus ? `<span class="tool-tag">${deps.escapeHtml(entry.reviewStatus)}</span>` : ''}
                    </div>
                    ${entry.sourceLayers?.length ? `<div class="tool-tags">${renderTagList(deps, entry.sourceLayers, 2)}</div>` : ''}
                    ${extraSources.length ? `<div class="tool-card-desc">${extraSources.map(ref => `<div><strong>${deps.escapeHtml(ref.label || 'Source')}: </strong>${ref.url ? `<a href="${deps.escapeHtml(ref.url)}" target="_blank" rel="noopener">${deps.escapeHtml(ref.url)}</a>` : ''}</div>`).join('')}</div>` : ''}
                    ${sourceLink ? `<a class="digest-card-source" href="${deps.escapeHtml(sourceLink)}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i>${deps.escapeHtml(sourceLabel || '原始来源')}</a>` : ''}
                </article>
            `;
        }).join('');
    }

    function renderHomePlaybooks(deps, prompts) {
        const grid = deps.homePlaybooksGrid;
        if (!grid) return;
        const entries = Array.isArray(prompts) ? prompts : [];
        const renderField = (label, value) => `
            <div class="tool-card-desc"><strong>${deps.escapeHtml(label)}：</strong>${deps.escapeHtml(value || '')}</div>
        `;
        const buildStepsOutput = prompt => {
            const steps = Array.isArray(prompt.steps) ? prompt.steps.filter(Boolean).slice(0, 3) : [];
            const stepText = steps.length ? steps.map((step, idx) => `${idx + 1}. ${step}`).join(' / ') : '';
            return [stepText, prompt.output || prompt.supporting || '生成一份可复核、可继续修改的研究产出。'].filter(Boolean).join('；');
        };
        grid.innerHTML = entries.map((prompt, index) => {
            const input = prompt.input || prompt.desc || prompt.usage || '替换复制剧本里的占位符，补充研究主题、材料和限制条件。';
            const stepsOutput = buildStepsOutput(prompt);
            const riskNext = [
                prompt.risk || '核查引用、事实和方法假设，不把模型输出直接当作证据。',
                prompt.nextStep || (prompt.entryKind === 'script' ? '复制剧本后先跑小样本，再整理成正式版本。' : '打开模块后按当前任务填写约束。')
            ].filter(Boolean).join(' 下一步：');
            return `
            <article class="playbook-card" data-station-kind="${deps.escapeHtml(prompt.entryKind || 'script')}" data-station-ref="${deps.escapeHtml(prompt.refId || prompt.id || '')}">
                <div class="tool-card-header">
                    <div class="tool-icon" style="background:${prompt.color || '#0f766e'}">
                        <i class="${prompt.icon || 'fas fa-scroll'}"></i>
                    </div>
                    <div class="tool-card-info">
                        <h4>${deps.escapeHtml(prompt.title)}</h4>
                        <div class="tool-tags">
                            <span class="tool-tag">${String(index + 1).padStart(2, '0')}</span>
                            <span class="tool-tag">${deps.escapeHtml(prompt.status || deps.getCategoryLabel(prompt.category))}</span>
                        </div>
                    </div>
                </div>
                <div class="tool-card-desc">${deps.escapeHtml(prompt.desc || prompt.usage || '')}</div>
                ${renderField('输入', input)}
                ${renderField('步骤/产出', stepsOutput)}
                ${renderField('风险/下一步', riskNext)}
                <div class="tool-card-footer">
                    <div class="tool-users"><i class="fas fa-toolbox"></i>${deps.escapeHtml(prompt.meta || (prompt.tools || []).slice(0, 2).join(' 路 ') || '研究剧本')}</div>
                    <button class="btn-copy station-search-action" data-kind="${deps.escapeHtml(prompt.entryKind || 'script')}" data-ref="${deps.escapeHtml(prompt.refId || prompt.id || '')}">${deps.escapeHtml(prompt.actionLabel || '复制剧本')}</button>
                </div>
            </article>
        `;
        }).join('');

        grid.querySelectorAll('.station-search-action').forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                deps.handleStationEntryAction(btn.dataset.kind, btn.dataset.ref);
            });
        });
        grid.querySelectorAll('[data-station-kind]').forEach(card => {
            card.addEventListener('click', () => deps.handleStationEntryAction(card.dataset.stationKind, card.dataset.stationRef));
        });
    }

    function renderHomeUpdates(deps, updates) {
        const grid = deps.homeUpdatesGrid;
        if (!grid) return;
        const entries = Array.isArray(updates) ? updates : [];
        grid.innerHTML = entries.slice(0, 3).map(update => `
            <article class="update-card">
                <span class="update-date">${deps.escapeHtml(update.date || '')}</span>
                <h4>${deps.escapeHtml(update.title)}</h4>
                <p>${deps.escapeHtml(update.desc || '')}</p>
                ${update.url ? `<a class="digest-card-source" href="${deps.escapeHtml(update.url)}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i>Source</a>` : ''}
            </article>
        `).join('');
    }

    function renderMethodQuickModules(deps) {
        const grid = deps.methodQuickGrid;
        if (!grid) return;
        const modules = deps.getMethodToolModules();
        grid.innerHTML = modules.map(module => `
            <button class="hero-flow-step method-quick-card" type="button" data-category="${deps.escapeHtml(module.category)}">
                <span class="hero-flow-index">Module</span>
                <strong>${deps.escapeHtml(module.title)}</strong>
                <small>${deps.escapeHtml(module.desc || module.usageGuide || '')}</small>
            </button>
        `).join('');

        grid.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', () => deps.openMethodTool(btn.dataset.category));
        });
    }

    function renderHomepageAssembly(deps, assembly) {
        const data = assembly && typeof assembly === 'object' ? assembly : {};
        renderDailyDigest(deps, Array.isArray(data.dailyDigest) ? data.dailyDigest : []);
        renderHomePlaybooks(deps, Array.isArray(data.playbooks) ? data.playbooks : []);
        renderHomeUpdates(deps, Array.isArray(data.updates) ? data.updates : []);
        renderMethodQuickModules({
            ...deps,
            getMethodToolModules: () => Array.isArray(data.methodModules) ? data.methodModules : deps.getMethodToolModules()
        });
        renderFeatured({
            ...deps,
            getFeaturedEntries: () => Array.isArray(data.featured) ? data.featured : deps.getFeaturedEntries()
        });
    }

    function renderFeatured(deps) {
        const grid = deps.featuredGrid;
        if (!grid) return;
        grid.innerHTML = deps.getFeaturedEntries().map(item => {
            const tool = deps.findToolById(item.id);
            if (!tool) return '';
            return `
                <div class="featured-card" style="--card-color:${tool.color}" onclick="window._openTool('${String(tool.id).replace(/'/g, "\\'")}')">
                    <div class="featured-icon" style="background:${tool.color}">
                        ${tool.logo ? `<img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none'">` : `<i class="${tool.icon}" style="color:#fff;font-size:18px"></i>`}
                    </div>
                    <div class="featured-info">
                        <h4>${deps.escapeHtml(tool.name)}</h4>
                        <div class="featured-reason">${deps.escapeHtml(item.kicker || item.status || '本周精选')}</div>
                        <div class="featured-reason">${deps.escapeHtml(item.reason || tool.reviewNote || '')}</div>
                        ${(item.reviewedAt || tool.reviewedAt) ? `<div class="tool-card-desc"><strong>Review: </strong>${deps.escapeHtml(item.status || tool.editorialStatus || 'reviewed')} / ${deps.escapeHtml(item.reviewedAt || tool.reviewedAt || '')}</div>` : ''}
                        ${(item.reviewNote && item.reviewNote !== item.reason) ? `<div class="tool-card-desc">${deps.escapeHtml(item.reviewNote)}</div>` : ''}
                        ${item.usage ? `<div class="section-sub">${deps.escapeHtml(item.usage)}</div>` : ''}
                        ${deps.renderTrustStatusRow(deps.getToolTrustMeta(tool, 'featured'), true)}
                        <div class="featured-rating">${'★'.repeat(Math.floor(tool.rating || 0))} ${tool.rating}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderHomepageTrustSummary(deps) {
        const panel = deps.query('.hero-trust-card');
        const curatedMeta = deps.describeManifestBundle('curated-tools');
        const entryMeta = deps.describeManifestBundle('academic-entrypoints');
        const dailyMeta = deps.describeManifestBundle('ai-daily');
        const githubMeta = deps.describeManifestBundle('github');
        const modelMeta = deps.describeManifestBundle('models');
        const updatesMeta = deps.describeManifestBundle('updates');
        const trustedMetas = [curatedMeta, entryMeta, dailyMeta, githubMeta, modelMeta, updatesMeta];
        const loadedCount = trustedMetas.filter(meta => meta.available).length;

        if (panel) {
            panel.innerHTML = `
                <span class="hero-panel-label">Curated Station</span>
                <h3>${loadedCount}/${deps.curatedManifestKeys.length} 份精选站 manifest 可用，首页优先吃 curated 数据，静态数组只做 fallback。</h3>
                <p>优先渲染 curated-tools、academic-entrypoints、ai-daily；旧的 news/models/github 继续保留为模块级能力。</p>
                <div class="section-sub">${curatedMeta.detail} 路 ${entryMeta.detail} 路 ${dailyMeta.detail}</div>
            `;
        }

        if (panel) {
            panel.innerHTML = `
                <span class="hero-panel-label">Trusted Frontier Station</span>
                <h3>${loadedCount}/${trustedMetas.length} manifests available: daily digest, GitHub, models, updates, tools, and entrypoints.</h3>
                <p>Homepage rendering now prefers manifest-backed evidence: AI daily source layers, GitHub generation status, model live+snapshot state, update diffs, and editorial review records.</p>
                <div class="section-sub">${dailyMeta.detail} / ${githubMeta.detail} / ${modelMeta.detail} / ${updatesMeta.detail}</div>
            `;
        }

        const slotContent = {
            freshness: {
                title: loadedCount === deps.curatedManifestKeys.length ? '精选站已接 manifest' : `已接入 ${loadedCount}/${deps.curatedManifestKeys.length}`,
                detail: `工具 ${curatedMeta.freshness} 路 入口 ${entryMeta.freshness} 路 每日 ${dailyMeta.freshness}`
            },
            provenance: {
                title: `${curatedMeta.source} / ${entryMeta.source} / ${dailyMeta.source}`,
                detail: '首页和搜索优先消费精选 manifest，旧模块仍保留独立入口。'
            },
            coverage: {
                title: '入口 路 工具 路 每日',
                detail: '先看 academic-entrypoints，再看 curated-tools，最后同步 ai-daily 更新。'
            }
        };

        slotContent.freshness = {
            title: `Trusted manifests ${loadedCount}/${trustedMetas.length}`,
            detail: `Daily ${dailyMeta.freshness} / GitHub ${githubMeta.freshness} / Models ${modelMeta.freshness} / Updates ${updatesMeta.freshness}`
        };
        slotContent.provenance = {
            title: `${dailyMeta.source} / ${githubMeta.source} / ${modelMeta.source}`,
            detail: `Updates diff: ${updatesMeta.source} / curated review: ${curatedMeta.source}`
        };
        slotContent.coverage = {
            title: 'Daily / GitHub / Models / Reviews',
            detail: 'Homepage renders source layers, generated status, live+snapshot model manifests, update diffs, and editorial review notes.'
        };

        Object.entries(slotContent).forEach(([slot, content]) => {
            const card = document.querySelector(`.hero-status-card[data-status-slot="${slot}"]`);
            if (!card) return;
            const strong = card.querySelector('strong');
            const small = card.querySelector('small');
            if (strong) strong.textContent = content.title;
            if (small) small.textContent = content.detail;
        });

        const trustLines = deps.queryAll('.hero-trust-line');
        const lineContent = [
            ['首页定位', 'Curated station first'],
            ['数据来源', `${curatedMeta.source} / ${entryMeta.source} / ${dailyMeta.source}`],
            ['回退机制', 'manifest -> curated static fallback']
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

    function renderQualityStatusBand(deps) {
        const band = deps.query('#statsSection');
        if (!band) return;
        const modules = deps.getMethodToolModules();
        const newsMeta = deps.describeManifestBundle('news');
        const kicker = band.querySelector('.quality-band-kicker');
        const headline = band.querySelector('.quality-band-head h3');
        const subline = band.querySelector('.quality-band-head p');
        if (kicker) kicker.textContent = 'Method tools';
        if (headline) headline.textContent = '方法工具';
        if (subline) {
            subline.textContent = newsMeta.available
                ? '把 journal / cite-check / paperdeck / stats 保留为首页可直达的内置模块。'
                : '当前未读到 manifest，仍回退到本地说明，保证方法模块可继续使用。';
        }

        ['catalog', 'freshness', 'provenance', 'fallback'].forEach((slot, index) => {
            const card = band.querySelector(`.quality-card[data-status-slot="${slot}"]`);
            const module = modules[index];
            if (!card || !module) return;
            const strong = card.querySelector('strong');
            const small = card.querySelector('small');
            if (strong) strong.textContent = module.title;
            if (small) small.textContent = `${module.status} 路 ${module.usageGuide}`;
            card.style.cursor = 'pointer';
            card.onclick = () => deps.openMethodTool(module.category);
        });
    }

    function updateHomeUpdatesSectionMeta(deps) {
        const el = document.querySelector('#homeUpdatesSection .section-sub');
        if (!el) return;
        const aiDailyMeta = deps.describeManifestBundle('ai-daily');
        const curatedMeta = deps.describeManifestBundle('curated-tools');
        const entryMeta = deps.describeManifestBundle('academic-entrypoints');
        const updatesMeta = deps.describeManifestBundle('updates');
        const githubMeta = deps.describeManifestBundle('github');
        const modelMeta = deps.describeManifestBundle('models');
        if (updatesMeta.available) {
            el.textContent = `Updates ${updatesMeta.freshness} / AI Daily ${aiDailyMeta.freshness} / GitHub ${githubMeta.freshness} / Models ${modelMeta.freshness} / editorial review ${curatedMeta.freshness}`;
            return;
            el.textContent = `站内说明优先来自 updates，串联 daily-digest / curated-picks / academic-portal：${updatesMeta.freshness} 路 日报 ${aiDailyMeta.freshness} 路 工具 ${curatedMeta.freshness} 路 入口 ${entryMeta.freshness}`;
            return;
        }
        el.textContent = `updates 缺失时回退到 ai-daily 与站内静态说明卡片；日报 ${aiDailyMeta.freshness} 路 工具 ${curatedMeta.freshness} 路 入口 ${entryMeta.freshness}`;
    }
    function applyNavigationProminence(deps) {
        const downgradeCategories = new Set(['news', 'models', 'github', 'usecases', 'prompts', 'tutorials']);
        deps.queryAll('.nav-item').forEach(item => {
            const category = String(item.dataset.category || '');
            const label = item.querySelector('span');
            if (!downgradeCategories.has(category)) return;
            item.style.order = '30';
            item.style.opacity = '0.72';
            item.style.filter = 'saturate(0.85)';
            item.style.transform = 'scale(0.98)';
            if (label && !label.dataset.secondaryPatched) {
                label.dataset.secondaryPatched = 'true';
                label.textContent = `扩展 路 ${label.textContent}`;
            }
        });
    }

    function applyCuratedStationCopy(deps) {
        const featuredTitle = document.querySelector('#featuredSection .section-header h3');
        if (featuredTitle) featuredTitle.innerHTML = '<i class="fas fa-crown"></i> 本周精选';
        const promptsTitle = document.querySelector('#promptsSection .section-header h3');
        if (promptsTitle) promptsTitle.textContent = '研究剧本';
        const tutorialsTitle = document.querySelector('#tutorialsSection .section-header h3');
        if (tutorialsTitle) tutorialsTitle.textContent = '本站使用与更新说明';
        const toolsTitle = deps.query('#toolsSectionTitle');
        if (toolsTitle && deps.currentCategory() === 'all') toolsTitle.textContent = '精选工作台补充入口';
        if (deps.globalSearch) deps.globalSearch.placeholder = '搜索精选工具、研究剧本或方法模块... (按 / 聚焦)';

        const featuredViewAll = document.querySelector('#featuredSection .view-all');
        if (featuredViewAll) featuredViewAll.style.display = 'none';

        const promptFilters = document.querySelector('#promptsSection .filter-tags');
        if (promptFilters) promptFilters.style.display = 'none';

        const toolTabs = deps.query('#toolsCategoryTabs');
        if (toolTabs) toolTabs.style.display = 'none';

        const recFallbackBtn = document.querySelector('.rec-view-all-btn');
        if (recFallbackBtn) {
            recFallbackBtn.textContent = '回到高频必备';
            recFallbackBtn.onclick = () => {
                deps.openStationHomeFocus('tools', '高频学术模块');
                const recommendResults = document.getElementById('recommendResults');
                if (recommendResults) recommendResults.style.display = 'none';
            };
        }

        const emptyText = deps.emptyState?.querySelector('p');
        if (emptyText) emptyText.textContent = '未找到匹配的精选工具、研究剧本或方法模块';
    }

    return {
        renderDailyDigest,
        renderHomePlaybooks,
        renderHomeUpdates,
        renderMethodQuickModules,
        renderHomepageAssembly,
        renderFeatured,
        renderHomepageTrustSummary,
        renderQualityStatusBand,
        updateHomeUpdatesSectionMeta,
        applyNavigationProminence,
        applyCuratedStationCopy
    };
})();
