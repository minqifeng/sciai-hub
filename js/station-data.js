window.SciAIStationData = (() => {
    'use strict';

    const FALLBACK_METHOD_MODULES = [
        { category: 'journal', title: 'Journal', status: '内置模块', usageGuide: '根据学科和投稿约束筛期刊。', icon: 'fas fa-journal-whills', color: '#2563eb' },
        { category: 'cite-check', title: 'Cite Check', status: '内置模块', usageGuide: '投稿前集中核查关键引文。', icon: 'fas fa-list-check', color: '#7c3aed' },
        { category: 'paperdeck', title: 'PaperDeck', status: '内置模块', usageGuide: '把精读内容压成可复用卡片。', icon: 'fas fa-layer-group', color: '#059669' },
        { category: 'stats', title: 'Stats', status: '内置模块', usageGuide: '按研究目标挑方法、图表和实现。', icon: 'fas fa-chart-bar', color: '#f59e0b' }
    ];

    function buildManifestProvenance(deps, key, item, fallbackLabel = 'manifest') {
        const bundle = deps.getManifestBundle(key);
        const manifest = bundle.primary;
        const parent = item?.__manifestParent || {};
        const note = item?.reviewNote || item?.note || item?.summary || parent.summary || parent.note || '';
        return {
            sourceName: manifest?.sourceName || parent.sourceName || fallbackLabel,
            status: item?.status || parent.status || manifest?.status || 'manifest',
            freshness: deps.formatManifestFreshness(manifest),
            note: String(note || 'Manifest-backed record')
        };
    }

    function normalizeManifestTool(deps, record, index) {
        if (!record || typeof record !== 'object') return null;
        const raw = record.tool && typeof record.tool === 'object' ? { ...record.tool, ...record } : record;
        const base = deps.getStaticToolCatalog().find(tool => deps.sameId(tool.id, raw.id ?? raw.toolId ?? raw.refId ?? raw.slug));
        const resolvedId = base?.id ?? raw.id ?? raw.toolId ?? raw.refId ?? `manifest-tool-${index}`;
        const name = raw.name || raw.title || base?.name;
        if (!name) return null;

        const tags = [...new Set([
            ...(base?.tags || []),
            ...deps.toArray(raw.tags).map(String),
            raw.stationSectionLabel,
            raw.editorialStatus,
            raw.sectionLabel
        ].filter(Boolean))];

        const keywords = [...new Set([
            ...(base?.keywords || []),
            ...deps.toArray(raw.keywords).map(String),
            ...deps.toArray(raw.aliases).map(String),
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
                ...buildManifestProvenance(deps, 'curated-tools', raw, 'curated-tools')
            }
        };
    }

    function getToolCatalog(deps) {
        const manifestTools = deps.flattenDatasetEntries('curated-tools')
            .map((record, index) => normalizeManifestTool(deps, record, index))
            .filter(Boolean)
            .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
        if (manifestTools.length) return manifestTools;
        return deps.getStaticToolCatalog();
    }

    function getFeaturedEntries(deps) {
        const toolCatalog = getToolCatalog(deps);
        const manifestBacked = deps.getManifestBundle('curated-tools').available;
        if (manifestBacked && toolCatalog.length) {
            return toolCatalog.slice(0, 4).map(tool => ({
                id: tool.id,
                kicker: tool.stationSectionLabel || tool.editorialStatus || '精选',
                reason: tool.reviewNote || tool.bestFor || tool.desc || '',
                usage: tool.usageGuide || '',
                status: tool.editorialStatus || 'Manifest'
            }));
        }
        return Array.isArray(deps.featuredTools) ? deps.featuredTools : [];
    }

    function normalizeManifestPlaybook(deps, record, index) {
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
            tools: deps.toArray(record.tools).map(item => typeof item === 'string' ? item : (item?.name || item?.title || '')).filter(Boolean),
            keywords: [...new Set([
                ...deps.toArray(record.keywords).map(String),
                ...deps.toArray(record.aliases).map(String),
                record.category,
                record.status
            ].filter(Boolean))],
            content: String(content || ''),
            provenance: buildManifestProvenance(deps, 'academic-entrypoints', record, 'academic-entrypoints')
        };
    }

    function getPlaybookCatalog(deps) {
        const manifestPlaybooks = deps.flattenDatasetEntries('academic-entrypoints')
            .map((record, index) => normalizeManifestPlaybook(deps, record, index))
            .filter(Boolean);
        if (manifestPlaybooks.length) return manifestPlaybooks;
        return Array.isArray(deps.promptsData) ? deps.promptsData : [];
    }

    function normalizeManifestUpdate(deps, record, index, datasetKey) {
        if (!record || typeof record !== 'object') return null;
        const highlights = deps.toArray(record.highlights).map(String).join(' 路 ');
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
            provenance: buildManifestProvenance(deps, datasetKey, record, datasetKey)
        };
    }

    function getAiDailyCatalog(deps) {
        const aiDaily = deps.flattenDatasetEntries('ai-daily')
            .map((record, index) => normalizeManifestUpdate(deps, record, index, 'ai-daily'))
            .filter(Boolean);
        if (aiDaily.length) return aiDaily;
        if (Array.isArray(deps.aiDailyFallback) && deps.aiDailyFallback.length) return deps.aiDailyFallback;
        return Array.isArray(deps.tutorialsData) ? deps.tutorialsData : [];
    }

    function getDailyDigestCards(deps) {
        const records = deps.getManifestPrimaryRecords('ai-daily');
        const issue = records.find(record => Array.isArray(record?.highlights) && record.highlights.length);
        if (issue) {
            return issue.highlights.slice(0, 4).map((item, index) => ({
                id: item.id || `${issue.id || 'digest'}-${index + 1}`,
                label: item.category || issue.title || '今日精选',
                title: item.headline || item.title || issue.title || '今日精选情报',
                summary: item.summary || issue.summary || '',
                status: item.importance || issue.reviewStatus || '',
                date: issue.date || '',
                issueTitle: issue.title || '',
                issueSummary: issue.summary || '',
                editorialTheme: issue.editorialTheme || '',
                takeaways: deps.toArray(issue.takeaways).slice(0, 3),
                sourceRefs: Array.isArray(item.sourceRefs) ? item.sourceRefs : [],
                url: item.url || ''
            }));
        }

        return (Array.isArray(deps.aiDailyFallback) ? deps.aiDailyFallback : []).slice(0, 4).map(item => ({
            id: item.id,
            label: item.status || '今日精选',
            title: item.title,
            summary: item.desc || item.note || '',
            status: item.views || '',
            date: item.date || '',
            url: item.url || ''
        }));
    }

    function normalizeManifestEntrypoint(deps, record, index) {
        if (!record || typeof record !== 'object') return null;
        const kind = String(record.entryKind || record.kind || record.type || '').toLowerCase();
        const category = record.category || record.id || record.refId || record.slug;
        const title = record.title || record.name;
        if (!category || !title) return null;
        const entryKind = deps.methodEntrypointIds.includes(String(category)) || /method|module/.test(kind) ? 'method' : 'entrypoint';
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
                ...deps.toArray(record.keywords).map(String),
                ...deps.toArray(record.aliases).map(String),
                title,
                category
            ].filter(Boolean))],
            actionLabel: record.actionLabel || record.ctaLabel || '打开模块',
            provenance: buildManifestProvenance(deps, 'academic-entrypoints', record, 'academic-entrypoints')
        };
    }

    function getAcademicEntrypoints(deps) {
        const manifestItems = deps.flattenDatasetEntries('academic-entrypoints')
            .map((record, index) => normalizeManifestEntrypoint(deps, record, index))
            .filter(Boolean);
        if (manifestItems.length) return deps.uniqueBy(manifestItems, item => item.category);
        if (Array.isArray(deps.academicEntrypointsFallback) && deps.academicEntrypointsFallback.length) return deps.academicEntrypointsFallback;
        return [];
    }

    function getMethodToolModules(deps) {
        const manifestModules = getAcademicEntrypoints(deps)
            .filter(item => deps.methodEntrypointIds.includes(String(item.category)))
            .map(item => ({
                id: item.id || item.category,
                entryKind: 'method',
                category: item.category,
                title: item.title,
                icon: item.icon,
                color: item.color,
                status: item.status,
                usageGuide: item.usageGuide,
                desc: item.desc,
                keywords: item.keywords,
                ctaLabel: item.actionLabel || '打开模块'
            }));
        if (manifestModules.length) return manifestModules;
        if (Array.isArray(deps.methodToolModules) && deps.methodToolModules.length) return deps.methodToolModules;
        return FALLBACK_METHOD_MODULES;
    }

    function findPromptScript(deps, id) {
        return getPlaybookCatalog(deps).find(item => String(item.id) === String(id));
    }

    function getStationSearchIndex(deps) {
        const toolEntries = getToolCatalog(deps).map(tool => ({
            entryKind: 'tool',
            refId: tool.id,
            title: tool.name,
            desc: tool.reviewNote || tool.desc,
            usageGuide: tool.usageGuide || '',
            status: tool.editorialStatus || tool.stationSectionLabel || '',
            icon: tool.icon,
            color: tool.color,
            keywords: [...new Set([...(tool.keywords || []), ...(tool.tags || []), tool.bestFor, tool.stationSectionLabel].filter(Boolean))],
            actionLabel: '查看工具'
        }));
        const scriptEntries = getPlaybookCatalog(deps).map(script => ({
            entryKind: 'script',
            refId: script.id,
            title: script.title,
            desc: script.usage || script.content || '',
            usageGuide: script.output || '',
            status: script.status || '',
            icon: 'fas fa-scroll',
            color: '#0f766e',
            keywords: [...new Set([...(script.keywords || []), ...(script.tools || []), script.category, script.status].filter(Boolean))],
            actionLabel: '复制剧本'
        }));
        const entrypointEntries = getAcademicEntrypoints(deps).map(item => ({
            entryKind: item.entryKind || 'entrypoint',
            refId: item.category,
            title: item.title,
            desc: item.desc || item.usageGuide || '',
            usageGuide: item.usageGuide || '',
            status: item.status || '',
            icon: item.icon,
            color: item.color,
            keywords: [...new Set([...(item.keywords || []), item.title, item.status].filter(Boolean))],
            actionLabel: item.actionLabel || '打开模块'
        }));
        const fallbackStatic = Array.isArray(deps.stationSearchIndex) ? deps.stationSearchIndex : [];
        return deps.uniqueBy([...toolEntries, ...scriptEntries, ...entrypointEntries, ...fallbackStatic], item => `${item.entryKind}:${item.refId}`);
    }

    function normalizeHomePlaybookCard(deps, record, index) {
        const playbook = normalizeManifestPlaybook(deps, record, index);
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

        const entrypoint = normalizeManifestEntrypoint(deps, record, index);
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

    function getHomepagePlaybookCatalog(deps) {
        const manifestEntries = deps.flattenDatasetEntries('academic-entrypoints')
            .map((record, index) => normalizeHomePlaybookCard(deps, record, index))
            .filter(Boolean);
        if (manifestEntries.length) {
            return deps.uniqueBy(manifestEntries, item => `${item.entryKind}:${item.refId}`).slice(0, 6);
        }

        const fallbackEntrypoints = getAcademicEntrypoints(deps)
            .map((entry, index) => normalizeHomePlaybookCard(deps, entry, index))
            .filter(Boolean);
        const fallbackPlaybooks = getPlaybookCatalog(deps)
            .map((entry, index) => normalizeHomePlaybookCard(deps, entry, `fallback-${index}`))
            .filter(Boolean);
        return deps.uniqueBy([...fallbackEntrypoints, ...fallbackPlaybooks], item => `${item.entryKind}:${item.refId}`).slice(0, 6);
    }

    function buildHomeUpdateStreamCard(deps, stream, parentRecord, index) {
        if (!stream || typeof stream !== 'object') return null;
        const highlights = deps.toArray(stream.highlights).map(String).filter(Boolean);
        const context = deps.toArray(stream.contextSources).map(String).filter(Boolean);
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
            provenance: buildManifestProvenance(deps, 'updates', { ...stream, __manifestParent: parentRecord }, 'updates')
        };
    }

    function getHomepageUpdateCatalog(deps) {
        const manifestUpdates = deps.getManifestPrimaryRecords('updates').flatMap((record, index) => {
            const streamCards = deps.toArray(record.contentStreams || record.streams)
                .map((stream, streamIndex) => buildHomeUpdateStreamCard(deps, stream, record, `${index}-${streamIndex}`))
                .filter(Boolean);
            if (streamCards.length) return streamCards;
            const fallbackCard = normalizeManifestUpdate(deps, record, index, 'updates');
            return fallbackCard ? [fallbackCard] : [];
        });
        if (manifestUpdates.length) return manifestUpdates.slice(0, 6);
        return getAiDailyCatalog(deps).slice(0, 6);
    }

    function getHomepageAssembly(deps) {
        return {
            dailyDigest: getDailyDigestCards(deps),
            featured: getFeaturedEntries(deps),
            playbooks: getHomepagePlaybookCatalog(deps),
            updates: getHomepageUpdateCatalog(deps),
            methodModules: getMethodToolModules(deps)
        };
    }

    return {
        buildManifestProvenance,
        getDailyDigestCards,
        getToolCatalog,
        getFeaturedEntries,
        getPlaybookCatalog,
        getAiDailyCatalog,
        getHomepagePlaybookCatalog,
        getHomepageUpdateCatalog,
        getHomepageAssembly,
        getAcademicEntrypoints,
        getMethodToolModules,
        getStationSearchIndex,
        findPromptScript
    };
})();
