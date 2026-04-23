// ============================================
// SciAI Hub - Curated station recommendation
// ============================================

const SCENES = Array.isArray(typeof STATION_RECOMMEND_SCENES !== 'undefined' ? STATION_RECOMMEND_SCENES : null)
    ? STATION_RECOMMEND_SCENES
    : [
        {
            id: 'lit-map',
            label: '文献摸排',
            icon: 'fas fa-compass',
            keywords: ['文献', '综述', '检索', 'gap', '证据表']
        },
        {
            id: 'drafting',
            label: '成稿重写',
            icon: 'fas fa-pen-fancy',
            keywords: ['摘要', '引言', '讨论', '重写', '润色']
        },
        {
            id: 'methods',
            label: '方法确认',
            icon: 'fas fa-square-poll-vertical',
            keywords: ['统计', '回归', '检验', '建模', '分析']
        },
        {
            id: 'submission',
            label: '投稿检查',
            icon: 'fas fa-paper-plane',
            keywords: ['投稿', '期刊', '审稿', 'rebuttal', '引用']
        }
    ];

let activeSceneIds = new Set();

function dedupeEntries(entries) {
    const seen = new Set();
    return entries.filter(entry => {
        const key = `${entry.entryKind}:${entry.refId}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function buildToolEntry(tool) {
    return {
        entryKind: 'tool',
        refId: tool.id,
        title: tool.name,
        desc: tool.reviewNote || tool.desc || '',
        usageGuide: tool.usageGuide || '',
        status: tool.editorialStatus || tool.status || '',
        icon: tool.icon || 'fas fa-toolbox',
        color: tool.color || '#0f766e',
        keywords: [...new Set([...(tool.keywords || []), ...(tool.tags || []), tool.bestFor].filter(Boolean))],
        actionLabel: '查看工具'
    };
}

function buildScriptEntry(script) {
    return {
        entryKind: script.entryKind || 'script',
        refId: script.refId || script.id,
        title: script.title,
        desc: script.desc || script.usage || '',
        usageGuide: script.usageGuide || script.output || '',
        status: script.status || '',
        icon: script.icon || 'fas fa-scroll',
        color: script.color || '#0f766e',
        keywords: [...new Set([...(script.keywords || []), ...(script.tools || []), script.category, script.meta].filter(Boolean))],
        actionLabel: script.actionLabel || '复制剧本'
    };
}

function buildEntrypointEntry(entry) {
    return {
        entryKind: entry.entryKind || 'method',
        refId: entry.refId || entry.category || entry.id,
        title: entry.title,
        desc: entry.desc || entry.usageGuide || '',
        usageGuide: entry.usageGuide || '',
        status: entry.status || '',
        icon: entry.icon || 'fas fa-flask-vial',
        color: entry.color || '#1d4ed8',
        keywords: [...new Set([...(entry.keywords || []), entry.title, entry.category].filter(Boolean))],
        actionLabel: entry.actionLabel || entry.ctaLabel || '打开模块'
    };
}

function getFallbackStationIndex() {
    const tools = Array.isArray(typeof TOOLS_DATA !== 'undefined' ? TOOLS_DATA : null)
        ? TOOLS_DATA.map(buildToolEntry)
        : [];
    const scripts = Array.isArray(typeof PROMPTS_DATA !== 'undefined' ? PROMPTS_DATA : null)
        ? PROMPTS_DATA.map(buildScriptEntry)
        : [];
    const methods = Array.isArray(typeof METHOD_TOOL_MODULES !== 'undefined' ? METHOD_TOOL_MODULES : null)
        ? METHOD_TOOL_MODULES.map(buildEntrypointEntry)
        : [];
    return dedupeEntries([...tools, ...scripts, ...methods]);
}

function getStationIndex() {
    const stationData = window.__SCIAI_STATION_DATA;
    if (stationData && typeof stationData.getSearchIndex === 'function') {
        const entries = stationData.getSearchIndex();
        if (Array.isArray(entries) && entries.length) return dedupeEntries(entries);
    }
    if (Array.isArray(typeof STATION_SEARCH_INDEX !== 'undefined' ? STATION_SEARCH_INDEX : null) && STATION_SEARCH_INDEX.length) {
        return dedupeEntries(STATION_SEARCH_INDEX);
    }
    return getFallbackStationIndex();
}

function buildReason(entry, query, scenes) {
    if (scenes.length > 0) {
        return `匹配场景：${scenes.map(scene => scene.label).join(' / ')} · ${entry.desc || entry.usageGuide || ''}`.slice(0, 70);
    }
    if (query) {
        return `与你的任务“${query}”相关 · ${(entry.desc || entry.usageGuide || '').slice(0, 50)}`;
    }
    return (entry.desc || entry.usageGuide || entry.title || '').slice(0, 70);
}

function normalizeScore(score, maxScore) {
    if (!maxScore) return 0;
    return Math.min(Math.round((score / maxScore) * 100), 99);
}

function matchEngine(query, activeScenes) {
    const q = String(query || '').trim().toLowerCase();
    const index = getStationIndex();
    const scored = index.map(entry => {
        let score = 0;
        const text = [entry.title, entry.desc, entry.usageGuide, entry.status].join(' ').toLowerCase();
        if (q) {
            if (text.includes(q)) score += 3;
            if (String(entry.title || '').toLowerCase().includes(q)) score += 2;
            (entry.keywords || []).forEach(keyword => {
                const value = String(keyword).toLowerCase();
                if (value.includes(q) || q.includes(value)) score += 2;
            });
        }
        activeScenes.forEach(scene => {
            (scene.keywords || []).forEach(keyword => {
                const value = String(keyword).toLowerCase();
                if (text.includes(value) || (entry.keywords || []).some(item => String(item).toLowerCase().includes(value))) {
                    score += 2;
                }
            });
            if (entry.entryKind === 'method' && scene.id === 'methods') score += 2;
            if (entry.entryKind === 'script' && ['lit-map', 'drafting', 'submission'].includes(scene.id)) score += 1;
        });
        return { ...entry, score, reason: buildReason(entry, q, activeScenes) };
    });

    const filtered = scored.filter(entry => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
    const maxScore = filtered[0]?.score || 1;
    return filtered.map(entry => ({ ...entry, pct: normalizeScore(entry.score, maxScore) }));
}

function getActionMarkup(entry) {
    const actionLabel = entry.actionLabel || (entry.entryKind === 'tool' ? '查看工具' : entry.entryKind === 'script' ? '复制剧本' : '打开模块');
    if (entry.entryKind === 'tool') {
        const ref = String(entry.refId).replace(/'/g, "\\'");
        return `<button class="rec-btn-detail" onclick="window._openTool('${ref}')">${actionLabel}</button>`;
    }
    return `<button class="rec-btn-detail" onclick="window._stationAction && window._stationAction('${entry.entryKind}', '${String(entry.refId).replace(/'/g, "\\'")}')">${actionLabel}</button>`;
}

function renderRecommendResults(results, label) {
    const section = document.getElementById('recommendResults');
    const titleEl = document.getElementById('recommendTitle');
    const listEl = document.getElementById('recommendList');
    if (!section || !titleEl || !listEl) return;

    if (!results.length) {
        titleEl.textContent = '没有找到足够贴近当前研究任务的条目';
        listEl.innerHTML = `<div class="rec-empty">
            试试换成研究任务、目标产出或方法名，例如“开题综述”“审稿回复”“混合效应模型”。
        </div>`;
        section.style.display = 'block';
        return;
    }

    const medals = ['1', '2', '3', '4', '5'];
    titleEl.textContent = label ? `围绕“${label}”的优先建议` : `优先建议 ${results.length} 项`;
    listEl.innerHTML = results.map((entry, index) => `
        <div class="rec-card">
            <div class="rec-card-left">
                <span class="rec-medal">${medals[index]}</span>
                <div class="rec-tool-icon" style="background:${entry.color || '#334155'}">
                    <i class="${entry.icon || 'fas fa-compass'}" style="color:#fff"></i>
                </div>
                <div class="rec-tool-info">
                    <span class="rec-tool-name">${entry.title}</span>
                    <span class="rec-reason">${entry.reason}</span>
                    ${entry.status ? `<span class="rec-reason">${entry.status}</span>` : ''}
                </div>
            </div>
            <div class="rec-card-right">
                <div class="rec-bar-wrap">
                    <div class="rec-bar" style="width:${entry.pct}%"></div>
                    <span class="rec-pct">${entry.pct}%</span>
                </div>
                <div class="rec-actions">
                    ${getActionMarkup(entry)}
                    ${entry.entryKind === 'tool'
                        ? `<button class="rec-btn-fav ${window._isFav && window._isFav(entry.refId) ? 'active' : ''}" onclick="window._toggleFav('${String(entry.refId).replace(/'/g, "\\'")}');this.classList.toggle('active')"><i class="fas fa-heart"></i></button>`
                        : ''}
                </div>
            </div>
        </div>
    `).join('');
    section.style.display = 'block';
}

function triggerRecommend(query) {
    const scenes = SCENES.filter(scene => activeSceneIds.has(scene.id));
    const q = String(query || '').trim();
    if (!q && scenes.length === 0) {
        const section = document.getElementById('recommendResults');
        if (section) section.style.display = 'none';
        return;
    }
    const results = matchEngine(q, scenes);
    const label = scenes.length ? scenes.map(scene => scene.label).join(' + ') : q;
    renderRecommendResults(results, label);
}

function renderSceneCards() {
    const container = document.getElementById('sceneCards');
    if (!container) return;
    container.innerHTML = SCENES.map(scene => `
        <button class="scene-card" data-scene="${scene.id}">
            <i class="${scene.icon}"></i>
            <span>${scene.label}</span>
        </button>
    `).join('');
}

function bindRecommendEvents() {
    const input = document.getElementById('recommendInput');
    const btn = document.getElementById('recommendBtn');
    const cards = document.getElementById('sceneCards');
    if (!input || !btn || !cards) return;

    cards.addEventListener('click', event => {
        const card = event.target.closest('.scene-card');
        if (!card) return;
        const id = card.dataset.scene;
        if (activeSceneIds.has(id)) {
            activeSceneIds.delete(id);
            card.classList.remove('active');
        } else {
            activeSceneIds.add(id);
            card.classList.add('active');
        }
        triggerRecommend(input.value);
    });

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => triggerRecommend(input.value), 250);
    });

    btn.addEventListener('click', () => triggerRecommend(input.value));
    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') triggerRecommend(input.value);
    });
}

function initRecommend() {
    renderSceneCards();
    bindRecommendEvents();
}
