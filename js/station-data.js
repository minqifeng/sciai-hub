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
                status: tool.editorialStatus || 'Manifest',
                reviewedAt: tool.reviewedAt || '',
                reviewNote: tool.reviewNote || '',
                provenance: tool.provenance || null
            }));
        }
        return Array.isArray(deps.featuredTools) ? deps.featuredTools : [];
    }

    function firstText(...values) {
        for (const value of values) {
            if (Array.isArray(value)) {
                const joined = value.map(item => typeof item === 'string' ? item : (item?.title || item?.name || item?.text || item?.summary || item?.desc || item?.value || '')).filter(Boolean).join(' / ');
                if (joined) return joined;
            } else if (value !== undefined && value !== null && String(value).trim()) {
                return String(value).trim();
            }
        }
        return '';
    }

    function dateOnly(value) {
        if (!value) return '';
        return String(value).slice(0, 10);
    }

    function manifestFreshnessDate(manifest) {
        const freshness = manifest?.freshness || {};
        return freshness.snapshotDate || dateOnly(freshness.refreshedAt) || dateOnly(freshness.snapshotTakenAt) || dateOnly(manifest?.validatedAt) || dateOnly(manifest?.sourceFetchedAt);
    }

    function formatRecordCount(value) {
        return Number.isFinite(Number(value)) ? `${Number(value)} records` : '';
    }

    function formatSourceLayer(layer) {
        if (!layer || typeof layer !== 'object') return '';
        return [
            layer.layer,
            layer.role,
            layer.sourceName || layer.key,
            layer.verification
        ].filter(Boolean).join(' / ');
    }

    function buildSourceLayerSummaries(deps, ...sources) {
        return sources
            .flatMap(source => deps.toArray(source?.sourceLayers))
            .map(formatSourceLayer)
            .filter(Boolean);
    }

    function buildSourceProfileSummary(profile) {
        if (!profile || typeof profile !== 'object') return '';
        return [
            profile.trustTier,
            profile.verificationMode,
            profile.liveFetchRequired === false ? 'no-live-fetch' : ''
        ].filter(Boolean).join(' / ');
    }

    function buildVerificationSummary(verified) {
        if (!verified || typeof verified !== 'object') return '';
        return [
            verified.key,
            verified.manifestPresent === true ? 'manifest present' : '',
            verified.mode,
            verified.validatedAt ? `validated ${dateOnly(verified.validatedAt)}` : '',
            verified.checkedAt ? `checked ${dateOnly(verified.checkedAt)}` : ''
        ].filter(Boolean).join(' / ');
    }

    function buildDiffSummary(deps, diff) {
        if (!diff || typeof diff !== 'object') return '';
        const changed = deps.toArray(diff.changed).map(item => {
            if (typeof item === 'string') return item;
            const fields = deps.toArray(item?.changed).join(', ');
            return [item?.key, fields].filter(Boolean).join(': ');
        }).filter(Boolean);
        const created = deps.toArray(diff.new).map(item => typeof item === 'string' ? item : item?.key).filter(Boolean);
        const verified = deps.toArray(diff.verified).map(item => item?.key || item?.mode).filter(Boolean);
        return [
            changed.length ? `changed ${changed.slice(0, 4).join(' / ')}` : '',
            created.length ? `new ${created.slice(0, 3).join(' / ')}` : '',
            verified.length ? `verified ${verified.slice(0, 4).join(' / ')}` : ''
        ].filter(Boolean).join(' | ');
    }

    function getLatestUpdateRecord(deps) {
        return deps.getManifestPrimaryRecords('updates')[0] || null;
    }

    function findUpdateSource(deps, key) {
        const update = getLatestUpdateRecord(deps);
        return deps.toArray(update?.sources).find(source => String(source?.key || '').toLowerCase() === String(key).toLowerCase()) || null;
    }

    function findUpdateDiffEntry(deps, key) {
        const update = getLatestUpdateRecord(deps);
        const changed = deps.toArray(update?.diff?.changed || update?.changed);
        return changed.find(item => String(item?.key || '').toLowerCase() === String(key).toLowerCase()) || null;
    }

    function buildRepoEvidenceSummary(deps, repo) {
        const evidence = repo?.evidence || {};
        return [
            evidence.sourceTier,
            evidence.confidence ? `confidence ${evidence.confidence}` : '',
            evidence.activity,
            evidence.release,
            evidence.starDelta
        ].filter(Boolean).join(' / ');
    }

    function getGithubGenerationStatusCard(deps) {
        const bundle = deps.getManifestBundle('github');
        const manifest = bundle.primary;
        if (!manifest) return null;
        const updateSource = findUpdateSource(deps, 'github');
        const diffEntry = findUpdateDiffEntry(deps, 'github');
        const repos = Array.isArray(manifest.records) ? manifest.records : [];
        const evidence = buildRepoEvidenceSummary(deps, repos.find(repo => repo?.evidence) || {});
        const freshness = updateSource?.freshnessLabel || deps.formatManifestFreshness(manifest);
        return {
            id: 'github-generation-status',
            title: 'GitHub daily generation status',
            desc: [
                `${manifest.sourceName || 'GitHub manifest'}: ${manifest.status || 'manifest'}`,
                freshness,
                formatRecordCount(updateSource?.recordCount ?? manifest.recordCount ?? repos.length),
                updateSource?.sourceProfile?.uiUse || manifest.sourceProfile?.uiUse
            ].filter(Boolean).join(' | '),
            cover: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
            icon: 'fab fa-github',
            views: updateSource?.datasetId || manifest.datasetId || 'github',
            date: manifestFreshnessDate(updateSource || manifest),
            status: updateSource?.status || manifest.status || 'manifest',
            note: [
                buildDiffSummary(deps, { changed: [diffEntry].filter(Boolean), verified: [diffEntry?.verified].filter(Boolean) }),
                evidence ? `Evidence: ${evidence}` : '',
                buildSourceProfileSummary(updateSource?.sourceProfile || manifest.sourceProfile)
            ].filter(Boolean).join(' | '),
            sourceLayers: buildSourceLayerSummaries(deps, updateSource, manifest),
            evidence: repos.slice(0, 3).map(repo => ({
                label: `${repo.owner || ''}/${repo.name || repo.id || ''}`.replace(/^\//, ''),
                detail: buildRepoEvidenceSummary(deps, repo)
            })).filter(item => item.label && item.detail),
            verified: diffEntry?.verified || updateSource?.verified || null,
            url: manifest.sourceUrl || 'https://github.com/trending',
            provenance: buildManifestProvenance(deps, 'github', manifest, 'github')
        };
    }

    function getModelManifestStatusCard(deps) {
        const bundle = deps.getManifestBundle('models');
        const snapshot = bundle.manifests?.find(item => item?.status === 'snapshot') || bundle.primary;
        const live = bundle.manifests?.find(item => item?.status === 'live') || bundle.secondary?.find(item => item?.status === 'live');
        if (!snapshot && !live) return null;
        const updateSource = findUpdateSource(deps, 'models');
        const diffEntry = findUpdateDiffEntry(deps, 'models');
        return {
            id: 'model-manifest-status',
            title: 'Model manifest: live catalog + snapshot',
            desc: [
                snapshot ? `snapshot ${manifestFreshnessDate(snapshot) || 'available'}` : '',
                live ? `live ${manifestFreshnessDate(live) || 'available'}` : '',
                live?.recordCount ? `live catalog ${live.recordCount} models` : '',
                updateSource?.freshnessLabel
            ].filter(Boolean).join(' | '),
            cover: 'linear-gradient(135deg, #0f766e 0%, #2563eb 100%)',
            icon: 'fas fa-brain',
            views: live?.datasetId || snapshot?.datasetId || 'models',
            date: manifestFreshnessDate(live || snapshot || updateSource),
            status: [snapshot?.status, live?.status].filter(Boolean).join(' + ') || 'manifest',
            note: [
                buildDiffSummary(deps, { changed: [diffEntry].filter(Boolean), verified: [diffEntry?.verified].filter(Boolean) }),
                `Primary UI source: ${snapshot?.filePath || 'snapshot manifest'}`,
                live ? `Secondary live source: ${live.filePath || 'live manifest'}` : ''
            ].filter(Boolean).join(' | '),
            sourceLayers: buildSourceLayerSummaries(deps, updateSource, snapshot, live),
            evidence: [
                snapshot ? { label: snapshot.sourceName || 'snapshot', detail: `${snapshot.status || 'snapshot'} / ${deps.formatManifestFreshness(snapshot)}` } : null,
                live ? { label: live.sourceName || 'live catalog', detail: `${live.status || 'live'} / ${formatRecordCount(live.recordCount)}` } : null
            ].filter(Boolean),
            verified: diffEntry?.verified || null,
            url: live?.sourceUrl || snapshot?.sourceUrl || '',
            provenance: buildManifestProvenance(deps, 'models', live || snapshot, 'models')
        };
    }

    function getUpdatesDiffEvidenceCard(deps) {
        const record = getLatestUpdateRecord(deps);
        if (!record?.diff && !record?.changed && !record?.verified) return null;
        const verified = deps.toArray(record.diff?.verified || record.verified);
        return {
            id: 'updates-diff-evidence',
            title: 'Updates diff and evidence trail',
            desc: record.summary || 'Manifest-backed update diff with verification records.',
            cover: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
            icon: 'fas fa-code-compare',
            views: record.kind || 'updates diff',
            date: record.date || dateOnly(record.generatedAt),
            status: record.status || 'verified diff',
            note: buildDiffSummary(deps, record.diff || record),
            sourceLayers: buildSourceLayerSummaries(deps, record),
            evidence: verified.slice(0, 4).map(item => ({
                label: item.key || item.mode || 'verified',
                detail: buildVerificationSummary(item)
            })).filter(item => item.detail),
            verified: verified[0] || null,
            url: '',
            provenance: buildManifestProvenance(deps, 'updates', record, 'updates')
        };
    }

    function getEditorialReviewCard(deps) {
        const manifest = deps.getManifestBundle('curated-tools').primary;
        const records = Array.isArray(manifest?.records) ? manifest.records : [];
        const reviewed = records.filter(record => record.reviewStatus || record.reviewedAt || record.whySelected);
        if (!reviewed.length) return null;
        const latestDate = reviewed.map(record => record.reviewedAt || dateOnly(record.updatedAt)).filter(Boolean).sort().pop();
        return {
            id: 'editorial-review-log',
            title: 'Editorial review records',
            desc: `${reviewed.length}/${records.length || reviewed.length} curated tools carry review status, review date, and why-selected notes.`,
            cover: 'linear-gradient(135deg, #581c87 0%, #be185d 100%)',
            icon: 'fas fa-clipboard-check',
            views: manifest.datasetId || 'curated-tools',
            date: latestDate || manifestFreshnessDate(manifest),
            status: 'editorial-reviewed',
            note: reviewed.slice(0, 3).map(record => `${record.reviewStatus || 'reviewed'} ${record.reviewedAt || ''}: ${record.whySelected || record.positioning || record.id}`).join(' | '),
            sourceLayers: buildSourceLayerSummaries(deps, manifest),
            evidence: reviewed.slice(0, 4).map(record => ({
                label: record.id || String(record.toolId || ''),
                detail: [record.reviewStatus, record.reviewedAt, record.source?.label].filter(Boolean).join(' / ')
            })).filter(item => item.label && item.detail),
            verified: null,
            url: manifest.sourceUrl || '',
            provenance: buildManifestProvenance(deps, 'curated-tools', manifest, 'curated-tools')
        };
    }

    function normalizeTextList(deps, ...values) {
        return values.flatMap(value => deps.toArray(value))
            .map(item => typeof item === 'string' ? item : (item?.title || item?.name || item?.text || item?.desc || item?.summary || ''))
            .map(item => String(item || '').trim())
            .filter(Boolean);
    }

    function inferPlaybookContent(playbook) {
        if (playbook.content) return playbook.content;
        return [
            `Title: ${playbook.title}`,
            playbook.input ? `Input: ${playbook.input}` : '',
            playbook.usage ? `Use case: ${playbook.usage}` : '',
            playbook.steps?.length ? `Steps:\n${playbook.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}` : '',
            playbook.output ? `Expected output: ${playbook.output}` : '',
            playbook.risk ? `Risk check: ${playbook.risk}` : '',
            playbook.nextStep ? `Next step: ${playbook.nextStep}` : ''
        ].filter(Boolean).join('\n\n');
    }

    function normalizeManifestPlaybook(deps, record, index) {
        if (!record || typeof record !== 'object') return null;
        const kind = String(record.entryKind || record.kind || record.type || '').toLowerCase();
        const groupKey = String(record.__manifestGroupKey || '').toLowerCase();
        const looksLikePlaybook = /playbook|script|prompt/.test(kind) || /playbook|script|prompt/.test(groupKey) || record.content || record.prompt || record.template;
        if (!looksLikePlaybook) return null;
        const content = record.content || record.prompt || record.template || record.summary || '';
        const input = firstText(record.input, record.inputs, record.requiredInput, record.materials, record.context, record.inputGuide, record.brief);
        const steps = normalizeTextList(deps, record.steps, record.workflow, record.process, record.tasks, record.instructions, record.checklist);
        const output = firstText(record.output, record.outputs, record.deliverable, record.deliverables, record.result, record.outcome);
        const risk = firstText(record.risk, record.risks, record.caution, record.limitations, record.failureMode, record.guardrail);
        const nextStep = firstText(record.nextStep, record.nextSteps, record.followUp, record.followup, record.afterUse);
        const usage = firstText(record.usage, record.taskLine, record.summary, record.desc, record.description);
        const playbook = {
            ...(record || {}),
            id: record.id || record.refId || `manifest-playbook-${index}`,
            entryKind: 'script',
            title: record.title || record.name || `研究剧本 ${index + 1}`,
            category: record.category || 'review',
            status: record.status || record.phase || 'Manifest',
            usage,
            input,
            steps,
            output,
            risk,
            nextStep,
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
        playbook.content = inferPlaybookContent(playbook);
        return playbook;
    }

    function normalizeStaticPlaybook(deps, record, index) {
        if (!record || typeof record !== 'object') return null;
        const input = firstText(record.input, record.inputs, record.requiredInput, record.materials, record.context, record.inputGuide, record.brief);
        const steps = normalizeTextList(deps, record.steps, record.workflow, record.process, record.tasks, record.instructions, record.checklist);
        const output = firstText(record.output, record.outputs, record.deliverable, record.deliverables, record.result, record.outcome);
        const risk = firstText(record.risk, record.risks, record.caution, record.limitations, record.failureMode, record.guardrail);
        const nextStep = firstText(record.nextStep, record.nextSteps, record.followUp, record.followup, record.afterUse);
        const usage = firstText(record.usage, record.taskLine, record.summary, record.desc, record.description);
        const playbook = {
            ...(record || {}),
            id: record.id || record.refId || `static-playbook-${index}`,
            entryKind: 'script',
            title: record.title || record.name || `Research playbook ${index + 1}`,
            category: record.category || 'review',
            status: record.status || 'Local',
            usage,
            input,
            steps,
            output,
            risk,
            nextStep,
            tools: deps.toArray(record.tools).map(item => typeof item === 'string' ? item : (item?.name || item?.title || '')).filter(Boolean),
            keywords: [...new Set([
                ...deps.toArray(record.keywords).map(String),
                ...deps.toArray(record.aliases).map(String),
                record.category,
                record.status
            ].filter(Boolean))],
            content: String(record.content || record.prompt || record.template || ''),
            provenance: {
                sourceName: 'local playbooks',
                status: record.status || 'local',
                freshness: 'static fallback',
                note: record.usage || record.summary || 'Local fallback playbook'
            }
        };
        playbook.content = inferPlaybookContent(playbook);
        return playbook;
    }

    function getPlaybookCatalog(deps) {
        const manifestPlaybooks = deps.flattenDatasetEntries('academic-entrypoints')
            .map((record, index) => normalizeManifestPlaybook(deps, record, index))
            .filter(Boolean);
        const staticPlaybooks = (Array.isArray(deps.promptsData) ? deps.promptsData : [])
            .map((record, index) => normalizeStaticPlaybook(deps, record, index))
            .filter(Boolean);
        return deps.uniqueBy([...manifestPlaybooks, ...staticPlaybooks], item => `script:${item.id}`);
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
            const manifest = deps.getManifestBundle('ai-daily').primary;
            const sourceLayers = buildSourceLayerSummaries(deps, issue, manifest);
            const sourceProfile = buildSourceProfileSummary(issue.sourceProfile || manifest?.sourceProfile);
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
                sourceLayers,
                sourceProfile,
                reviewStatus: issue.reviewStatus || '',
                coverageWindow: issue.coverageWindow || '',
                provenance: buildManifestProvenance(deps, 'ai-daily', { ...item, __manifestParent: issue }, 'ai-daily'),
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
            sourceLayers: [],
            sourceProfile: '',
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
                input: playbook.input || playbook.usage || 'Use the placeholders in the copied script as the required input.',
                steps: playbook.steps && playbook.steps.length ? playbook.steps : normalizeTextList(deps, playbook.workflow, playbook.process, playbook.tasks).slice(0, 3),
                output: playbook.output || playbook.supporting || 'A structured research artifact you can review, edit, and reuse.',
                risk: playbook.risk || playbook.caution || 'Check sources, assumptions, and any generated evidence before using it in a manuscript.',
                nextStep: playbook.nextStep || 'Copy the script, replace placeholders, then run one verification pass on the result.',
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
            input: entrypoint.usageGuide || entrypoint.desc || 'Open this module with your current research task and constraints.',
            steps: normalizeTextList(deps, entrypoint.steps, entrypoint.workflow, entrypoint.process).slice(0, 3),
            output: entrypoint.outcome || entrypoint.supporting || entrypoint.usageGuide || 'A narrowed method route or module-specific action plan.',
            risk: entrypoint.caution || entrypoint.risk || 'Confirm the recommendation against your field norms before acting on it.',
            nextStep: entrypoint.nextStep || 'Open the module and fill in the task details.',
            status: entrypoint.status || 'Manifest',
            meta: entrypoint.entryKind === 'method' ? '研究模块' : '研究入口',
            icon: entrypoint.icon || 'fas fa-compass',
            color: entrypoint.color || '#2563eb',
            actionLabel: entrypoint.actionLabel || (entrypoint.entryKind === 'method' ? '打开模块' : '打开入口')
        };
    }

    function getHomepagePlaybookCatalog(deps) {
        const playbookCards = getPlaybookCatalog(deps)
            .map((entry, index) => normalizeHomePlaybookCard(deps, entry, `playbook-${index}`))
            .filter(Boolean);
        const entrypointCards = getAcademicEntrypoints(deps)
            .map((entry, index) => normalizeHomePlaybookCard(deps, entry, index))
            .filter(Boolean);
        return deps.uniqueBy([...playbookCards, ...entrypointCards], item => `${item.entryKind}:${item.refId}`).slice(0, 6);
    }

    function buildHomeUpdateStreamCard(deps, stream, parentRecord, index) {
        if (!stream || typeof stream !== 'object') return null;
        const highlights = deps.toArray(stream.highlights).map(String).filter(Boolean);
        const context = deps.toArray(stream.contextSources).map(String).filter(Boolean);
        const changedFields = deps.toArray(stream.changed).map(String).filter(Boolean);
        const evidence = [
            ...deps.toArray(stream.evidence).map(item => typeof item === 'string' ? { label: 'evidence', detail: item } : item),
            stream.verified ? { label: stream.key || stream.title || 'verified', detail: buildVerificationSummary(stream.verified) } : null
        ].filter(Boolean);
        const sourceLabel = stream.badge || stream.label || stream.datasetId || stream.sourceName || stream.key || parentRecord.kind || '站点更新';
        const detailParts = [
            stream.contextNote,
            stream.modelContext,
            stream.freshnessLabel,
            ...highlights.slice(0, 2),
            changedFields.length ? `Changed: ${changedFields.join(', ')}` : '',
            stream.verified ? `Verified: ${buildVerificationSummary(stream.verified)}` : '',
            buildSourceProfileSummary(stream.sourceProfile),
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
            sourceLayers: buildSourceLayerSummaries(deps, stream),
            evidence,
            changedFields,
            verified: stream.verified || null,
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
        const operationalCards = [
            getGithubGenerationStatusCard(deps),
            getModelManifestStatusCard(deps),
            getUpdatesDiffEvidenceCard(deps),
            getEditorialReviewCard(deps)
        ].filter(Boolean);
        if (manifestUpdates.length || operationalCards.length) {
            return deps.uniqueBy([...manifestUpdates, ...operationalCards], item => item.id).slice(0, 8);
        }
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
