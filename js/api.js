// ============================================
// SciAI Hub - API 层 v1
// 封装 Semantic Scholar / OpenAlex / Crossref
// 全部免费公开 API，支持跨域 (CORS)
// ============================================
const SciAPI = (() => {
    'use strict';
    const S2 = 'https://api.semanticscholar.org/graph/v1';
    const OA = 'https://api.openalex.org';
    const CR = 'https://api.crossref.org';

    function _rebuildAbstract(inv) {
        if (!inv || typeof inv !== 'object') return '';
        const arr = [];
        for (const [word, positions] of Object.entries(inv)) {
            for (const pos of positions) arr[pos] = word;
        }
        return arr.filter(Boolean).join(' ');
    }

    // 1. 论文检索（OpenAlex）
    async function searchPapers(query, { page = 1, perPage = 20, yearFrom, yearTo, sort = 'relevance' } = {}) {
        const sortMap = { relevance: 'relevance_score:desc', citations: 'cited_by_count:desc', year: 'publication_date:desc' };
        let url = `${OA}/works?search=${encodeURIComponent(query)}&per-page=${perPage}&page=${page}&sort=${sortMap[sort] || 'relevance_score:desc'}&select=id,display_name,authorships,primary_location,publication_year,cited_by_count,doi,abstract_inverted_index`;
        const fromYear = Number.parseInt(yearFrom, 10);
        const toYear = Number.parseInt(yearTo, 10);
        const yearFilters = [];
        if (Number.isFinite(fromYear) && Number.isFinite(toYear)) {
            yearFilters.push(`publication_year:${Math.min(fromYear, toYear)}-${Math.max(fromYear, toYear)}`);
        } else if (Number.isFinite(fromYear)) {
            yearFilters.push(`publication_year:>${fromYear - 1}`);
        } else if (Number.isFinite(toYear)) {
            yearFilters.push(`publication_year:<${toYear + 1}`);
        }
        if (yearFilters.length) url += `&filter=${yearFilters.join(',')}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            const results = (data.results || []).map(w => ({
                id: w.id,
                title: w.display_name || '(无标题)',
                authors: (w.authorships || []).slice(0, 3).map(a => a.author?.display_name).filter(Boolean),
                venue: w.primary_location?.source?.display_name || '',
                year: w.publication_year,
                citationCount: w.cited_by_count || 0,
                abstract: _rebuildAbstract(w.abstract_inverted_index),
                doi: w.doi ? w.doi.replace('https://doi.org/', '') : '',
                url: w.primary_location?.landing_page_url || (w.doi || '')
            }));
            return { results, total: data.meta?.count || 0, hasMore: page * perPage < (data.meta?.count || 0) };
        } catch (e) {
            return { error: e.message, results: [], total: 0, hasMore: false };
        }
    }

    // 2. 单篇论文查询（Semantic Scholar）
    async function searchPaperByQuery(query) {
        try {
            const res = await fetch(`${S2}/paper/search?query=${encodeURIComponent(query)}&fields=paperId,title,year,citationCount,abstract,externalIds&limit=1`);
            const data = await res.json();
            const p = data.data?.[0];
            if (!p) return null;
            return { paperId: p.paperId, title: p.title || '', year: p.year, citationCount: p.citationCount || 0, abstract: p.abstract || '', doi: p.externalIds?.DOI || '' };
        } catch (e) { return { error: e.message }; }
    }

    // 3. 前序工作（参考文献）
    async function getPaperReferences(paperId) {
        try {
            const res = await fetch(`${S2}/paper/${encodeURIComponent(paperId)}/references?fields=paperId,title,year,citationCount&limit=25`);
            const data = await res.json();
            return (data.data || []).map(r => ({ paperId: r.citedPaper?.paperId, title: r.citedPaper?.title || '', year: r.citedPaper?.year, citationCount: r.citedPaper?.citationCount || 0 })).filter(r => r.paperId);
        } catch { return []; }
    }

    // 4. 派生工作（被引）
    async function getPaperCitations(paperId) {
        try {
            const res = await fetch(`${S2}/paper/${encodeURIComponent(paperId)}/citations?fields=paperId,title,year,citationCount&limit=25`);
            const data = await res.json();
            return (data.data || []).map(r => ({ paperId: r.citingPaper?.paperId, title: r.citingPaper?.title || '', year: r.citingPaper?.year, citationCount: r.citingPaper?.citationCount || 0 })).filter(r => r.paperId);
        } catch { return []; }
    }

    // 5. 期刊查询（OpenAlex）
    async function searchJournals(query) {
        try {
            const res = await fetch(`${OA}/sources?search=${encodeURIComponent(query)}&per-page=6`);
            const data = await res.json();
            return (data.results || []).map(s => ({
                id: s.id, name: s.display_name || '', issn: s.issn_l || '', issns: s.issn || [],
                publisher: s.host_organization_name || '', worksCount: s.works_count || 0,
                citedByCount: s.cited_by_count || 0, hIndex: s.summary_stats?.h_index || 0,
                impactFactor: s.summary_stats?.['2yr_mean_citedness'] || 0,
                isOA: s.is_oa || false, homepage: s.homepage_url || ''
            }));
        } catch { return []; }
    }

    // 6. 引文核查（Crossref + Semantic Scholar 并发）
    async function checkCitation(refText) {
        const title = refText
            .replace(/^\[?\d+[\]\.]\s*/, '')
            .replace(/^[A-ZÁÉÍÓÚ][^.]{2,60}\.\s*\(\d{4}\)\.\s*/, '')
            .replace(/\s*[,;·]\s*(19|20)\d{2}[,;·\s].*$/, '')
            .replace(/https?:\/\/\S+/g, '')
            .trim().slice(0, 150);

        const [crRes, s2Res] = await Promise.allSettled([
            fetch(`${CR}/works?query.title=${encodeURIComponent(title)}&rows=1&select=DOI,title,score`)
                .then(r => r.json())
                .then(d => { const item = d.message?.items?.[0]; return item ? { found: true, title: Array.isArray(item.title) ? item.title[0] : (item.title || ''), doi: item.DOI || '', score: item.score || 0 } : { found: false }; })
                .catch(() => ({ found: false })),
            fetch(`${S2}/paper/search?query=${encodeURIComponent(title)}&fields=title,year&limit=1`)
                .then(r => r.json())
                .then(d => { const p = d.data?.[0]; return p ? { found: true, title: p.title || '' } : { found: false }; })
                .catch(() => ({ found: false }))
        ]);

        const cr = crRes.status === 'fulfilled' ? crRes.value : { found: false };
        const s2 = s2Res.status === 'fulfilled' ? s2Res.value : { found: false };
        const status = (cr.found && s2.found) ? 'ok' : (cr.found || s2.found) ? 'review' : 'risk';
        return { original: refText, crossref: cr, semanticScholar: s2, status };
    }

    // 7. 论文推荐（Semantic Scholar）
    async function getRecommendations(keywords, seenIds = []) {
        try {
            const res = await fetch(`${S2}/paper/search?query=${encodeURIComponent(keywords)}&fields=paperId,title,abstract,year,citationCount,authors,venue&limit=50`);
            const data = await res.json();
            const seenSet = new Set(seenIds);
            return (data.data || [])
                .filter(p => !seenSet.has(p.paperId) && p.title && p.abstract)
                .map(p => ({ ...p, _score: (p.citationCount || 0) * 0.3 + Math.max(0, Math.min(1, ((p.year || 2015) - 2015) / 10)) * 70 }))
                .sort((a, b) => b._score - a._score)
                .slice(0, 20);
        } catch { return []; }
    }

    return { searchPapers, searchPaperByQuery, getPaperReferences, getPaperCitations, searchJournals, checkCitation, getRecommendations, _rebuildAbstract };
})();

// ============================================
// 数据缓存与实时更新 API
// ============================================

// ---- 缓存管理函数 ----
const CacheManager = (() => {
    function set(key, data, ttl = 3600000) { // 默认1小时
        try {
            localStorage.setItem(`sciai-cache-${key}`, JSON.stringify({
                data,
                expires: Date.now() + ttl,
                timestamp: new Date().toISOString()
            }));
            return true;
        } catch (e) {
            console.warn('缓存存储失败:', e);
            return false;
        }
    }

    function get(key) {
        try {
            const cached = JSON.parse(localStorage.getItem(`sciai-cache-${key}`) || '{}');
            if (cached.expires && cached.expires > Date.now()) {
                return cached.data;
            }
            localStorage.removeItem(`sciai-cache-${key}`);
        } catch (e) {
            console.warn('缓存读取失败:', e);
        }
        return null;
    }

    function remove(key) {
        try {
            localStorage.removeItem(`sciai-cache-${key}`);
            return true;
        } catch (e) {
            console.warn('缓存清除失败:', e);
            return false;
        }
    }

    function clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sciai-cache-')) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.warn('缓存全清失败:', e);
            return false;
        }
    }

    return { set, get, remove, clear };
})();

// ---- OpenRouter 模型榜单实时更新 ----
const ModelRankingAPI = (() => {
    const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';
    const CACHE_KEY = 'openrouter-models-catalog';
    const CACHE_TTL = 30 * 60 * 1000;
    const SNAPSHOT_DATE = '2026-04-09'; // weekly ranking snapshot; catalog is always live
    const TARGET_LEADERBOARD_SIZE = 50;

    function normalizeModelName(name = '') {
        return name
            .toLowerCase()
            .replace(/^[^:]+:\s*/, '')
            .replace(/\(free\)/g, '')
            .replace(/[^a-z0-9]+/g, '');
    }

    function titleCaseProvider(raw = '') {
        const map = {
            openai: 'OpenAI',
            anthropic: 'Anthropic',
            deepseek: 'DeepSeek',
            google: 'Google',
            xiaomi: 'Xiaomi',
            stepfun: 'StepFun',
            minimax: 'MiniMax',
            'z-ai': 'Z.ai',
            'x-ai': 'xAI',
            mistralai: 'Mistral',
            qwen: 'Qwen'
        };
        return map[raw] || raw.replace(/\b\w/g, ch => ch.toUpperCase());
    }

    function formatContextLength(contextLength) {
        if (!contextLength) return '上下文未知';
        if (contextLength >= 1000000) return `${(contextLength / 1000000).toFixed(1).replace(/\.0$/, '')}M ctx`;
        if (contextLength >= 1000) return `${Math.round(contextLength / 1000)}K ctx`;
        return `${contextLength} ctx`;
    }

    function inferModelType(model) {
        const input = model.architecture?.input_modalities || [];
        const output = model.architecture?.output_modalities || [];
        const joined = `${model.name} ${model.description || ''}`.toLowerCase();
        if (input.some(v => ['image', 'audio', 'video'].includes(v)) || output.some(v => ['image', 'audio'].includes(v))) return 'Multimodal';
        if (joined.includes('coder') || joined.includes('coding') || joined.includes('code')) return 'Code-Optimized';
        return 'Text';
    }

    function inferPricing(model) {
        const prompt = Number(model.pricing?.prompt || 0);
        const completion = Number(model.pricing?.completion || 0);
        if (model.id?.endsWith(':free') || /\(free\)/i.test(model.name)) return 'free';
        if (prompt === 0 && completion === 0) return 'free';
        return 'paid';
    }

    function toPricePerMillion(value) {
        const num = Number(value || 0);
        return Number.isFinite(num) ? num * 1000000 : 0;
    }

    function toDateString(created) {
        if (!created) return SNAPSHOT_DATE;
        return new Date(created * 1000).toISOString().slice(0, 10);
    }

    function mapCatalogModel(model) {
        const providerKey = (model.id || '').split('/')[0];
        return {
            liveId: model.id,
            name: (model.name || '').replace(/^[^:]+:\s*/, ''),
            provider: titleCaseProvider(providerKey),
            type: inferModelType(model),
            params: formatContextLength(model.context_length),
            date: toDateString(model.created),
            pricing: inferPricing(model),
            url: model.id ? `https://openrouter.ai/${model.id}` : 'https://openrouter.ai/models',
            description: model.description || '',
            contextLength: model.context_length || 0,
            createdTs: model.created || 0,
            outputModalities: model.architecture?.output_modalities || [],
            inputModalities: model.architecture?.input_modalities || [],
            supportedParameters: model.supported_parameters || [],
            maxCompletionTokens: model.top_provider?.max_completion_tokens || 0,
            promptPricePerM: toPricePerMillion(model.pricing?.prompt),
            completionPricePerM: toPricePerMillion(model.pricing?.completion),
            cacheReadPricePerM: toPricePerMillion(model.pricing?.input_cache_read),
            cacheWritePricePerM: toPricePerMillion(model.pricing?.input_cache_write),
            benchmark: {},
            rankingSource: 'catalog'
        };
    }

    async function fetchCatalog(force = false) {
        if (!force) {
            const cached = CacheManager.get(CACHE_KEY);
            if (cached) return cached;
        }
        const res = await fetch(OPENROUTER_MODELS_URL);
        if (!res.ok) throw new Error(`OpenRouter models API error: ${res.status}`);
        const data = await res.json();
        const models = (data.data || []).map(mapCatalogModel);
        CacheManager.set(CACHE_KEY, models, CACHE_TTL);
        return models;
    }

    function findCatalogMatch(snapshotModel, catalog) {
        if (snapshotModel.liveId) {
            const exact = catalog.find(model => model.liveId === snapshotModel.liveId);
            if (exact) return exact;
        }
        const normalizedName = normalizeModelName(snapshotModel.name);
        const provider = (snapshotModel.provider || '').toLowerCase();
        return catalog.find(model =>
            normalizeModelName(model.name) === normalizedName &&
            model.provider.toLowerCase() === provider
        );
    }

    function enrichSnapshot(snapshot, catalog) {
        return snapshot.map(item => {
            const liveModel = findCatalogMatch(item, catalog);
            if (!liveModel) return { ...item, rankingSource: 'snapshot' };
            return {
                ...liveModel,
                ...item,
                liveId: liveModel.liveId,
                provider: liveModel.provider,
                type: liveModel.type,
                params: liveModel.params,
                date: liveModel.date,
                pricing: item.pricing || liveModel.pricing,
                url: liveModel.url,
                description: liveModel.description || item.description || '',
                contextLength: liveModel.contextLength,
                inputModalities: liveModel.inputModalities,
                outputModalities: liveModel.outputModalities,
                rankingSource: 'snapshot'
            };
        });
    }

    function scoreCatalogModel(model) {
        const recencyDays = model.createdTs
            ? Math.max(0, (Date.now() - model.createdTs * 1000) / (24 * 60 * 60 * 1000))
            : 365;
        const recencyScore = Math.max(0, 180 - Math.min(180, recencyDays)) * 0.35;
        const contextScore = Math.min(180, Math.log10(Math.max(1024, model.contextLength || 1024)) * 38);
        const outputScore = Math.min(80, Math.log10(Math.max(1024, model.maxCompletionTokens || 1024)) * 18);
        const paramsScore = Math.min(40, (model.supportedParameters || []).length * 3);
        const modalityScore = model.type === 'Multimodal' ? 24 : model.type === 'Code-Optimized' ? 16 : 8;
        const priceScore = model.pricing === 'free' ? 18 : 6;
        const providerBonus = ['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'xAI', 'MiniMax', 'Qwen', 'Z.ai'].includes(model.provider) ? 12 : 0;
        return recencyScore + contextScore + outputScore + paramsScore + modalityScore + priceScore + providerBonus;
    }

    function buildSupplementalModels(snapshot, catalog, targetSize = TARGET_LEADERBOARD_SIZE) {
        const existingIds = new Set(
            snapshot.map(model => model.liveId || `${normalizeModelName(model.name)}::${(model.provider || '').toLowerCase()}`)
        );

        return catalog
            .filter(model => {
                const key = model.liveId || `${normalizeModelName(model.name)}::${(model.provider || '').toLowerCase()}`;
                return !existingIds.has(key);
            })
            .sort((a, b) => scoreCatalogModel(b) - scoreCatalogModel(a))
            .slice(0, Math.max(0, targetSize - snapshot.length))
            .map((model, index) => ({
                ...model,
                rank: snapshot.length + index + 1,
                weeklyTokens: '',
                weeklyGrowth: '',
                hot: index < 8 || model.pricing === 'free',
                url: model.url || 'https://openrouter.ai/models',
                benchmark: model.benchmark || {},
                arena: null,
                rankingSource: 'catalog'
            }));
    }

    async function getLeaderboard(force = false) {
        const snapshot = Array.isArray(MODELS_RANKING) ? MODELS_RANKING : [];
        const catalog = await fetchCatalog(force);
        const enrichedSnapshot = enrichSnapshot(snapshot, catalog);
        const supplementalModels = buildSupplementalModels(enrichedSnapshot, catalog);
        return {
            models: [...enrichedSnapshot, ...supplementalModels],
            snapshotDate: SNAPSHOT_DATE,
            refreshedAt: new Date().toISOString(),
            liveCatalogCount: catalog.length,
            snapshotTopCount: enrichedSnapshot.length,
            supplementalCount: supplementalModels.length
        };
    }

    return { getLeaderboard, fetchCatalog, snapshotDate: SNAPSHOT_DATE };
})();

window.ModelRankingAPI = ModelRankingAPI;

// ---- 动态标签生成函数 ----
function generateDynamicTags(tool) {
    const tags = [];
    if (!tool) return tags;

    const desc_lower = (tool.desc + tool.name + (tool.tags || []).join(' ')).toLowerCase();

    // 1. 功能标签
    const functionKeywords = {
        'search': ['搜索', 'search', 'find', 'discover'],
        'writing': ['写作', 'writing', 'compose', '论文'],
        'coding': ['代码', 'coding', 'code', 'program'],
        'design': ['设计', 'design', '绘图', 'visual'],
        'image': ['图像', 'image', '图片', '绘画'],
        'video': ['视频', 'video', 'animation'],
        'audio': ['音频', 'audio', '语音', 'voice'],
        'analytics': ['分析', 'analytics', 'analyze', 'data'],
        'translation': ['翻译', 'translation'],
        'summary': ['总结', 'summary', '摘要']
    };

    Object.entries(functionKeywords).forEach(([tag, keywords]) => {
        if (keywords.some(kw => desc_lower.includes(kw))) {
            tags.push(tag);
        }
    });

    // 2. 分类标签
    const categoryTags = {
        'writing': ['writing', 'text'],
        'code': ['coding', 'text'],
        'figure': ['design', 'visual'],
        'image-ai': ['image', 'design'],
        'voice': ['audio', 'voice'],
        'video': ['video', 'visual'],
        'data': ['analytics', 'data'],
        'llm': ['llm', 'ai'],
    };

    if (tool.category && categoryTags[tool.category]) {
        tags.push(...categoryTags[tool.category]);
    }

    // 3. 开源标签
    if (tool.url && tool.url.includes('github')) {
        tags.push('open-source');
    } else if (desc_lower.includes('开源')) {
        tags.push('open-source');
    }

    // 4. 价格标签
    if (tool.pricing === 'free' || desc_lower.includes('免费')) {
        tags.push('free');
    } else if (tool.pricing === 'freemium') {
        tags.push('freemium');
    } else if (tool.pricing === 'paid' || tool.pricing === 'premium') {
        tags.push('premium');
    }

    // 5. 热门与新品标签
    if (tool.hot) tags.push('trending');
    if (tool.isNew) tags.push('new');

    // 去重
    return [...new Set(tags)];
}

// ---- Product Hunt API 集成 ----
async function fetchProductHuntTools() {
    try {
        const cached = CacheManager.get('producthunt-tools');
        if (cached) {
            console.log('使用缓存的 Product Hunt 数据');
            return cached;
        }

        // 模拟 Product Hunt 数据（实际部署时需配置 API key）
        const mockPhTools = [
            { id: 9001, name: 'Claude Code', tagline: 'AI-Powered Code Editor', votes: 2500 },
            { id: 9002, name: 'GPT-4', tagline: 'Advanced AI Language Model', votes: 3200 },
            { id: 9003, name: 'Midjourney', tagline: 'AI Image Generation', votes: 2100 }
        ];

        const formattedTools = mockPhTools.slice(0, 3).map((post, idx) => ({
            id: 9000 + idx,
            name: post.name,
            desc: post.tagline || '',
            logo: 'fas fa-star',
            icon: 'fas fa-rocket',
            category: 'llm',
            url: 'https://producthunt.com',
            rating: Math.min(5, post.votes / 1000),
            users: `${post.votes}+ votes`,
            pricing: 'free',
            region: 'foreign',
            tags: ['热门工具', 'producthunt'],
            isNew: true,
            source: 'producthunt'
        }));

        CacheManager.set('producthunt-tools', formattedTools, 24 * 60 * 60 * 1000);
        console.log(`已加载 ${formattedTools.length} 个 Product Hunt 工具`);
        return formattedTools;
    } catch (error) {
        console.error('Product Hunt 数据获取失败:', error);
        return [];
    }
}

// ---- Hugging Face Models API 集成 ----
async function fetchHuggingFaceModels() {
    try {
        const cached = CacheManager.get('huggingface-models');
        if (cached) {
            console.log('使用缓存的 Hugging Face 模型');
            return cached;
        }

        const response = await fetch('https://huggingface.co/api/models?limit=6&sort=likes&task=text-generation');
        if (!response.ok) {
            console.warn('Hugging Face API 请求失败');
            return [];
        }

        const models = await response.json();
        const formattedModels = (Array.isArray(models) ? models : []).slice(0, 3).map((model, idx) => ({
            id: 9100 + idx,
            name: model.modelId.split('/')[1] || model.modelId,
            desc: model.tags?.slice(0, 2).join(', ') || 'Hugging Face Model',
            logo: 'fas fa-brain',
            icon: 'fas fa-robot',
            category: 'llm',
            url: `https://huggingface.co/${model.modelId}`,
            rating: Math.min(5, (model.likes / 1000 || 3)),
            users: `${model.downloads || 0}+ downloads`,
            pricing: 'free',
            region: 'foreign',
            tags: ['AI模型', 'huggingface', 'open-source'],
            isNew: true,
            source: 'huggingface'
        }));

        CacheManager.set('huggingface-models', formattedModels, 60 * 60 * 1000);
        console.log(`已加载 ${formattedModels.length} 个 Hugging Face 模型`);
        return formattedModels;
    } catch (error) {
        console.error('Hugging Face 数据获取失败:', error);
        return [];
    }
}

// ---- 更新所有工具标签 ----
function updateAllToolsDynamicTags() {
    if (typeof TOOLS_DATA !== 'undefined') {
        TOOLS_DATA.forEach(tool => {
            tool.dynamicTags = generateDynamicTags(tool);
        });
        console.log('已更新所有工具的动态标签');
    }
}

// ---- 合并外部工具 ----
async function mergeExternalTools() {
    try {
        const [phTools, hfModels] = await Promise.all([
            fetchProductHuntTools(),
            fetchHuggingFaceModels()
        ]);

        if (typeof TOOLS_DATA !== 'undefined') {
            const existingIds = new Set(TOOLS_DATA.map(t => t.id));
            const newTools = [
                ...phTools.filter(t => !existingIds.has(t.id)),
                ...hfModels.filter(t => !existingIds.has(t.id))
            ];

            newTools.forEach(tool => {
                tool.dynamicTags = generateDynamicTags(tool);
            });

            TOOLS_DATA.push(...newTools);
            console.log(`已合并 ${newTools.length} 个外部工具`);
            return newTools.length;
        }
    } catch (error) {
        console.error('外部工具合并失败:', error);
    }
    return 0;
}

// ---- API 初始化函数 ----
function initializeRealtimeAPIs() {
    // 立即更新标签和外部工具
    updateAllToolsDynamicTags();
    mergeExternalTools();

    // Product Hunt: 每24小时更新一次
    if (!window.sciai_ph_interval) {
        window.sciai_ph_interval = setInterval(() => {
            console.log('[定时任务] 更新 Product Hunt 数据...');
            CacheManager.remove('producthunt-tools');
            fetchProductHuntTools();
        }, 24 * 60 * 60 * 1000);
    }

    // Hugging Face: 每小时更新一次
    if (!window.sciai_hf_interval) {
        window.sciai_hf_interval = setInterval(() => {
            console.log('[定时任务] 更新 Hugging Face 模型...');
            CacheManager.remove('huggingface-models');
            fetchHuggingFaceModels();
        }, 60 * 60 * 1000);
    }

    // 标签更新: 每6小时更新一次
    if (!window.sciai_tags_interval) {
        window.sciai_tags_interval = setInterval(() => {
            console.log('[定时任务] 更新动态标签...');
            updateAllToolsDynamicTags();
        }, 6 * 60 * 60 * 1000);
    }

    console.log('✅ API 初始化完成，定时任务已启动');
}
