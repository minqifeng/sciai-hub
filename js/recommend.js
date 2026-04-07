// ============================================
// SciAI Hub - 智能推荐引擎
// ============================================

const SCENES = [
    { id: 'writing', label: '写论文',   icon: 'fas fa-pen-fancy',
      keywords: ['论文','写作','摘要','润色','语法','投稿','SCI','academic','英文写作'] },
    { id: 'reading', label: '读文献',   icon: 'fas fa-book-open',
      keywords: ['文献','阅读','综述','PDF','总结','翻译','精读','literature','论文阅读'] },
    { id: 'data',    label: '数据分析', icon: 'fas fa-chart-bar',
      keywords: ['数据','统计','分析','可视化','图表','SPSS','Python','R','数据处理'] },
    { id: 'figure',  label: '科研绘图', icon: 'fas fa-dna',
      keywords: ['绘图','示意图','配图','BioRender','矢量','图标','figure','科研图'] },
    { id: 'code',    label: '写代码',   icon: 'fas fa-code',
      keywords: ['代码','编程','Python','R','调试','Copilot','脚本','coding','开发'] },
    { id: 'search',  label: '找文献',   icon: 'fas fa-search',
      keywords: ['检索','找论文','文献库','arXiv','PubMed','语义','semantic','文献搜索'] },
];

let activeSceneIds = new Set();

function buildReason(tool, query, scenes) {
    if (scenes.length > 0) {
        const labels = scenes.map(s => s.label).join(' + ');
        return `适合「${labels}」场景 · ${tool.desc.slice(0, 35)}...`;
    }
    if (query) return `与「${query}」高度相关 · ${tool.desc.slice(0, 35)}...`;
    return tool.desc.slice(0, 50) + '...';
}

function normalizeScore(score, maxScore) {
    if (!maxScore) return 0;
    return Math.min(Math.round((score / maxScore) * 100), 99);
}

function matchEngine(query, activeScenes) {
    if (typeof TOOLS_DATA === 'undefined') return [];
    const q = (query || '').toLowerCase().trim();

    const scored = TOOLS_DATA.map(tool => {
        let score = 0;
        if (q) {
            if (tool.name.toLowerCase().includes(q)) score += 3;
            (tool.keywords || []).forEach(k => {
                if (k.toLowerCase().includes(q) || q.includes(k.toLowerCase())) score += 2;
            });
            if (tool.desc.toLowerCase().includes(q)) score += 1;
        }
        activeScenes.forEach(scene => {
            if (tool.category === scene.id) score = Math.ceil(score * 1.5) || 3;
            (scene.keywords || []).forEach(k => {
                if ((tool.keywords || []).map(x => x.toLowerCase()).includes(k.toLowerCase())) score += 1;
            });
        });
        return { ...tool, score, reason: buildReason(tool, q, activeScenes) };
    });

    const filtered = scored.filter(t => t.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
    const maxScore = filtered[0]?.score || 1;
    return filtered.map(t => ({ ...t, pct: normalizeScore(t.score, maxScore) }));
}

function renderRecommendResults(results, label) {
    const section  = document.getElementById('recommendResults');
    const titleEl  = document.getElementById('recommendTitle');
    const listEl   = document.getElementById('recommendList');
    if (!section || !titleEl || !listEl) return;

    if (!results.length) {
        titleEl.textContent = '暂时没有完全匹配的工具';
        listEl.innerHTML = `<div class="rec-empty">
            试试其他关键词，或 <button class="rec-view-all" onclick="document.querySelector('.nav-item[data-category=all]').click()">查看全部工具</button>
        </div>`;
        section.style.display = 'block';
        return;
    }

    const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
    titleEl.textContent = label ? `为「${label}」推荐 ${results.length} 款工具` : `推荐 ${results.length} 款工具`;
    listEl.innerHTML = results.map((t, i) => `
        <div class="rec-card">
            <div class="rec-card-left">
                <span class="rec-medal">${medals[i]}</span>
                <div class="rec-tool-icon" style="background:${t.color}">
                    ${t.logo
                        ? `<img src="${t.logo}" alt="${t.name}" onerror="this.style.display='none'"><i class="${t.icon}" style="display:none;color:#fff"></i>`
                        : `<i class="${t.icon}" style="color:#fff"></i>`}
                </div>
                <div class="rec-tool-info">
                    <span class="rec-tool-name">${t.name}</span>
                    <span class="rec-reason">${t.reason}</span>
                </div>
            </div>
            <div class="rec-card-right">
                <div class="rec-bar-wrap">
                    <div class="rec-bar" style="width:${t.pct}%"></div>
                    <span class="rec-pct">${t.pct}%</span>
                </div>
                <div class="rec-actions">
                    <button class="rec-btn-detail" onclick="window._openTool(${t.id})">查看详情</button>
                    <button class="rec-btn-fav ${window._isFav && window._isFav(t.id) ? 'active' : ''}" onclick="window._toggleFav(${t.id});this.classList.toggle('active')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>`).join('');
    section.style.display = 'block';
}

function triggerRecommend(query) {
    const scenes = SCENES.filter(s => activeSceneIds.has(s.id));
    const q = (query || '').trim();
    if (!q && scenes.length === 0) {
        const section = document.getElementById('recommendResults');
        if (section) section.style.display = 'none';
        return;
    }
    const results = matchEngine(q, scenes);
    const label = scenes.length ? scenes.map(s => s.label).join('+') : q;
    renderRecommendResults(results, label);
}

function renderSceneCards() {
    const container = document.getElementById('sceneCards');
    if (!container) return;
    container.innerHTML = SCENES.map(s => `
        <button class="scene-card" data-scene="${s.id}">
            <i class="${s.icon}"></i>
            <span>${s.label}</span>
        </button>`).join('');
}

function bindRecommendEvents() {
    const input   = document.getElementById('recommendInput');
    const btn     = document.getElementById('recommendBtn');
    const cards   = document.getElementById('sceneCards');
    if (!input || !btn || !cards) return;

    cards.addEventListener('click', e => {
        const card = e.target.closest('.scene-card');
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
        debounceTimer = setTimeout(() => triggerRecommend(input.value), 300);
    });

    btn.addEventListener('click', () => triggerRecommend(input.value));
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') triggerRecommend(input.value);
    });
}

function initRecommend() {
    renderSceneCards();
    bindRecommendEvents();
}
