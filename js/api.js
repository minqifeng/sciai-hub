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
        if (yearFrom || yearTo) url += `&filter=publication_year:${yearFrom || ''}-${yearTo || ''}`;
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
