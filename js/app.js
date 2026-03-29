// ============================================
// SciAI Hub - 应用逻辑 v2
// ============================================

(function () {
    'use strict';

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ---- DOM ----
    const sidebar        = $('#sidebar');
    const mainContent    = $('#mainContent');
    const mobileMenuBtn  = $('#mobileMenuBtn');
    const globalSearch   = $('#globalSearch');
    const heroSearch     = $('#heroSearch');
    const themeToggle    = $('#themeToggle');
    const loginBtn       = $('#loginBtn');
    const loginModal     = $('#loginModal');
    const modalClose     = $('#modalClose');
    const toolsGrid      = $('#toolsGrid');
    const promptsGrid    = $('#promptsGrid');
    const tutorialsGrid  = $('#tutorialsGrid');
    const newsList       = $('#newsList');
    const pageTitle      = $('#pageTitle');
    const sortSelect     = $('#sortSelect');
    const backToTop      = $('#backToTop');
    const emptyState     = $('#emptyState');
    const toolModal      = $('#toolModal');
    const toolModalClose = $('#toolModalClose');
    const favCount       = $('#favCount');

    const sections = {
        hero:      $('#heroSection'),
        tools:     $('#toolsSection'),
        stats:     $('#statsSection'),
        prompts:   $('#promptsSection'),
        tutorials: $('#tutorialsSection'),
        news:      $('#newsSection'),
    };

    // ---- 状态 ----
    let currentCategory = 'all';
    let currentPricing  = 'all';
    let currentSort     = 'default';
    let currentToolId   = null;
    let favorites       = loadFavorites();

    // ---- 初始化 ----
    function init() {
        renderTools(TOOLS_DATA);
        renderPrompts(PROMPTS_DATA);
        renderTutorials(TUTORIALS_DATA);
        renderNews(NEWS_DATA);
        bindEvents();
        animateStats();
        loadTheme();
        updateFavBadge();
    }

    // ---- 收藏持久化 ----
    function loadFavorites() {
        try { return JSON.parse(localStorage.getItem('sciai-favs') || '[]'); }
        catch { return []; }
    }
    function saveFavorites() {
        localStorage.setItem('sciai-favs', JSON.stringify(favorites));
        updateFavBadge();
    }
    function isFav(id) { return favorites.includes(id); }
    function toggleFav(id) {
        if (isFav(id)) {
            favorites = favorites.filter(f => f !== id);
            showToast('已取消收藏');
        } else {
            favorites.push(id);
            showToast('已加入收藏 ❤️');
        }
        saveFavorites();
        // 同步卡片和弹窗状态
        syncFavUI(id);
    }
    function syncFavUI(id) {
        // 卡片按钮
        $$('.card-fav-btn').forEach(btn => {
            if (parseInt(btn.dataset.id) === id) {
                btn.classList.toggle('active', isFav(id));
            }
        });
        // 弹窗按钮
        if (currentToolId === id) updateModalFavUI(id);
    }
    function updateFavBadge() {
        const n = favorites.length;
        favCount.textContent = n;
        favCount.style.display = n > 0 ? '' : 'none';
    }

    // ---- 渲染工具卡片 ----
    function renderTools(tools) {
        if (!tools.length) {
            toolsGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        toolsGrid.innerHTML = tools.map(tool => `
            <div class="tool-card" data-id="${tool.id}">
                <button class="card-fav-btn ${isFav(tool.id) ? 'active' : ''}" data-id="${tool.id}" title="收藏" onclick="event.stopPropagation(); handleFav(${tool.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="tool-card-header">
                    <div class="tool-icon" style="background:${tool.color}">
                        ${tool.logo
                            ? `<img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
                            + `<span class="icon-fallback" style="display:none"><i class="${tool.icon}"></i></span>`
                            : `<i class="${tool.icon}"></i>`}
                    </div>
                    <div class="tool-card-info">
                        <h4>${tool.name}</h4>
                        <div class="tool-tags">
                            ${tool.tags.map(t => `<span class="tool-tag">${t}</span>`).join('')}
                            ${tool.pricing === 'free'     ? '<span class="tool-tag free">免费</span>' : ''}
                            ${tool.pricing === 'paid'     ? '<span class="tool-tag paid">付费</span>' : ''}
                            ${tool.isNew                  ? '<span class="tool-tag new">NEW</span>'   : ''}
                        </div>
                    </div>
                </div>
                <div class="tool-card-desc">${tool.desc}</div>
                <div class="tool-card-footer">
                    <div class="tool-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(tool.rating))}
                        <span>${tool.rating}</span>
                    </div>
                    <div class="tool-users"><i class="fas fa-user"></i>${tool.users}</div>
                </div>
            </div>
        `).join('');

        // 卡片点击 → 详情弹窗
        $$('.tool-card').forEach(card => {
            card.addEventListener('click', () => openToolModal(parseInt(card.dataset.id)));
        });
    }

    // ---- 工具详情弹窗 ----
    function openToolModal(id) {
        const tool = TOOLS_DATA.find(t => t.id === id);
        if (!tool) return;
        currentToolId = id;

        // 填充内容
        const iconEl = $('#toolModalIcon');
        iconEl.style.background = tool.color;
        iconEl.innerHTML = tool.logo
            ? `<img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none'">`
            + `<i class="${tool.icon}" style="font-size:22px;color:#fff"></i>`
            : `<i class="${tool.icon}" style="font-size:22px;color:#fff"></i>`;

        $('#toolModalName').textContent = tool.name;
        $('#toolModalTags').innerHTML = tool.tags.map(t => `<span class="tool-tag">${t}</span>`).join('');
        $('#toolModalDesc').textContent = tool.desc;
        $('#toolModalRating').innerHTML = `${'★'.repeat(Math.floor(tool.rating))} ${tool.rating}`;
        $('#toolModalUsers').textContent = tool.users;
        $('#toolModalPricing').textContent = { free: '免费', freemium: '免费增值', paid: '付费' }[tool.pricing] || tool.pricing;
        $('#toolModalRegion').textContent = tool.region === 'domestic' ? '🇨🇳 国产' : '🌐 海外';
        $('#toolModalUrl').href = tool.url;

        updateModalFavUI(id);
        toolModal.classList.add('show');
    }

    function updateModalFavUI(id) {
        const btn = $('#toolModalFavBtn');
        const fav = isFav(id);
        btn.classList.toggle('active', fav);
        $('#toolModalFavText').textContent = fav ? '已收藏' : '收藏工具';
        const topBtn = $('#toolModalFav');
        if (topBtn) topBtn.classList.toggle('active', fav);
    }

    function closeToolModal() {
        toolModal.classList.remove('show');
        currentToolId = null;
    }

    // ---- 渲染提示词 ----
    function renderPrompts(prompts) {
        promptsGrid.innerHTML = prompts.map(p => `
            <div class="prompt-card">
                <h4><i class="fas fa-lightbulb"></i>${p.title}</h4>
                <p>${p.content}</p>
                <div class="prompt-card-footer">
                    <span class="prompt-category">${getCategoryLabel(p.category)}</span>
                    <button class="btn-copy" data-content="${encodeURIComponent(p.content)}">
                        <i class="fas fa-copy"></i> 复制
                    </button>
                </div>
            </div>
        `).join('');

        $$('.btn-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = decodeURIComponent(btn.dataset.content);
                navigator.clipboard.writeText(text).then(() => {
                    const orig = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
                    btn.style.color = '#059669';
                    setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1500);
                });
            });
        });
    }

    // ---- 渲染教程 ----
    function renderTutorials(tutorials) {
        tutorialsGrid.innerHTML = tutorials.map(t => `
            <div class="tutorial-card">
                <div class="tutorial-cover" style="background:${t.cover}"><i class="${t.icon}"></i></div>
                <div class="tutorial-body">
                    <h4>${t.title}</h4>
                    <p>${t.desc}</p>
                    <div class="tutorial-meta">
                        <span><i class="fas fa-eye"></i> ${t.views}</span>
                        <span><i class="fas fa-calendar"></i> ${t.date}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ---- 渲染资讯 ----
    function renderNews(news) {
        newsList.innerHTML = news.map(n => {
            const d = new Date(n.date);
            return `
            <div class="news-item">
                <div class="news-date">
                    <span class="day">${d.getDate()}</span>
                    <span class="month">${d.getMonth()+1}月</span>
                </div>
                <div class="news-info">
                    <h4>${n.title}</h4>
                    <p>${n.desc}</p>
                </div>
                <span class="news-tag" style="background:${n.tagColor}18;color:${n.tagColor}">${n.tag}</span>
            </div>`;
        }).join('');
    }

    function getCategoryLabel(cat) {
        return { writing:'论文写作', review:'文献综述', analysis:'数据分析', translate:'翻译润色' }[cat] || cat;
    }

    // ---- 过滤 + 排序 ----
    function getFilteredTools() {
        let list = [...TOOLS_DATA];

        if (currentCategory === 'favorites') {
            list = list.filter(t => isFav(t.id));
        } else if (currentCategory === 'hot') {
            list = list.filter(t => t.hot);
        } else if (currentCategory === 'new') {
            list = list.filter(t => t.isNew);
        } else if (currentCategory !== 'all') {
            list = list.filter(t => t.category === currentCategory);
        }

        if (currentPricing !== 'all') {
            if (currentPricing === 'domestic' || currentPricing === 'foreign') {
                list = list.filter(t => t.region === currentPricing);
            } else {
                list = list.filter(t => t.pricing === currentPricing);
            }
        }

        // 排序
        if (currentSort === 'rating') list.sort((a,b) => b.rating - a.rating);
        else if (currentSort === 'users') list.sort((a,b) => parseUsers(b.users) - parseUsers(a.users));
        else if (currentSort === 'name')  list.sort((a,b) => a.name.localeCompare(b.name));

        return list;
    }

    function parseUsers(str) {
        const n = parseFloat(str.replace(/[^\d.]/g, ''));
        if (str.includes('亿')) return n * 100000000;
        if (str.includes('万')) return n * 10000;
        return n;
    }

    function filterTools() { renderTools(getFilteredTools()); }

    // ---- 搜索 ----
    function doSearch(query) {
        showSection('all');
        $$('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector('.nav-item[data-category="all"]').classList.add('active');
        currentCategory = 'all';

        if (!query.trim()) { filterTools(); return; }
        const q = query.toLowerCase();
        const filtered = TOOLS_DATA.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q) ||
            t.tags.some(tag => tag.toLowerCase().includes(q))
        );
        renderTools(filtered);
    }

    // ---- 显示板块 ----
    function showSection(category) {
        Object.values(sections).forEach(s => { if (s) s.style.display = 'none'; });

        const titleMap = {
            all:'全部工具', hot:'热门推荐', new:'最新上线', favorites:'我的收藏',
            writing:'论文写作', reading:'文献阅读', data:'数据分析',
            figure:'科研绘图', code:'代码助手', experiment:'实验设计',
            llm:'大语言模型', 'image-ai':'AI绘画', voice:'语音合成', video:'AI视频',
            prompts:'科研提示词库', tutorials:'学习教程', news:'行业资讯',
        };
        pageTitle.textContent = titleMap[category] || category;

        if (category === 'prompts') {
            sections.prompts.style.display = 'block';
        } else if (category === 'tutorials') {
            sections.tutorials.style.display = 'block';
        } else if (category === 'news') {
            sections.news.style.display = 'block';
        } else {
            // 首页显示 hero，其他分类隐藏
            sections.hero.style.display = category === 'all' ? '' : 'none';
            sections.stats.style.display = '';
            sections.tools.style.display = '';
        }
    }

    // ---- 数字动画 ----
    function animateStats() {
        $$('.stats-value').forEach(el => {
            const target = parseInt(el.dataset.target);
            const start = performance.now();
            const duration = 1500;
            function update(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(eased * target).toLocaleString();
                if (p < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ---- 主题 ----
    function loadTheme() {
        const theme = localStorage.getItem('sciai-theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
    function toggleTheme() {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('sciai-theme', next);
        updateThemeIcon(next);
    }
    function updateThemeIcon(theme) {
        themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ---- Toast ----
    let toastTimer;
    function showToast(msg) {
        let toast = $('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // ---- 全局收藏入口 ----
    window.handleFav = function(id) { toggleFav(id); };

    // ---- 回到顶部 ----
    function initBackToTop() {
        mainContent.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', mainContent.scrollTop > 400);
        });
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- 键盘快捷键 ----
    function initKeyboard() {
        document.addEventListener('keydown', (e) => {
            // / 聚焦搜索框
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                globalSearch.focus();
            }
            // Esc 关闭弹窗
            if (e.key === 'Escape') {
                closeToolModal();
                loginModal.classList.remove('show');
            }
        });
    }

    // ---- 绑定事件 ----
    function bindEvents() {
        initBackToTop();
        initKeyboard();

        // 侧边栏导航
        $$('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const category = item.dataset.category;
                currentCategory = category;
                currentPricing = 'all';
                $$('.filter-tags .tag[data-filter]').forEach(t => t.classList.remove('active'));
                const allTag = document.querySelector('.filter-tags .tag[data-filter="all"]');
                if (allTag) allTag.classList.add('active');

                showSection(category);
                if (!['prompts','tutorials','news'].includes(category)) filterTools();
                if (window.innerWidth <= 768) sidebar.classList.remove('open');
            });
        });

        // Hero 分类标签
        $$('.hero-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const cat = tag.dataset.category;
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                const navItem = document.querySelector(`.nav-item[data-category="${cat}"]`);
                if (navItem) navItem.classList.add('active');
                currentCategory = cat;
                showSection(cat);
                filterTools();
                window.scrollTo({ top: sections.stats.offsetTop - 20, behavior: 'smooth' });
            });
        });

        // 价格/区域筛选
        $$('.filter-tags .tag[data-filter]').forEach(tag => {
            tag.addEventListener('click', () => {
                $$('.filter-tags .tag[data-filter]').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                currentPricing = tag.dataset.filter;
                filterTools();
            });
        });

        // 提示词筛选
        $$('.tag[data-prompt-filter]').forEach(tag => {
            tag.addEventListener('click', () => {
                $$('.tag[data-prompt-filter]').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                const filter = tag.dataset.promptFilter;
                renderPrompts(filter === 'all' ? PROMPTS_DATA : PROMPTS_DATA.filter(p => p.category === filter));
            });
        });

        // 排序
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            filterTools();
        });

        // 搜索框（侧边栏）
        let searchTimer;
        globalSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => doSearch(e.target.value), 300);
        });

        // Hero 搜索框
        heroSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                if (e.target.value) {
                    globalSearch.value = e.target.value;
                    doSearch(e.target.value);
                    window.scrollTo({ top: sections.stats.offsetTop, behavior: 'smooth' });
                }
            }, 300);
        });
        $('#heroSection').querySelector('.hero-search-btn').addEventListener('click', () => {
            const q = heroSearch.value;
            if (q) { globalSearch.value = q; doSearch(q); }
        });

        // 主题切换
        themeToggle.addEventListener('click', toggleTheme);

        // 移动端菜单
        mobileMenuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        mainContent.addEventListener('click', () => {
            if (window.innerWidth <= 768) sidebar.classList.remove('open');
        });

        // 工具详情弹窗
        toolModalClose.addEventListener('click', closeToolModal);
        toolModal.addEventListener('click', (e) => { if (e.target === toolModal) closeToolModal(); });
        $('#toolModalFav').addEventListener('click', () => { if (currentToolId) toggleFav(currentToolId); });
        $('#toolModalFavBtn').addEventListener('click', () => { if (currentToolId) toggleFav(currentToolId); });

        // 登录弹窗
        loginBtn.addEventListener('click', () => loginModal.classList.add('show'));
        modalClose.addEventListener('click', () => loginModal.classList.remove('show'));
        loginModal.addEventListener('click', (e) => { if (e.target === loginModal) loginModal.classList.remove('show'); });
    }

    init();
})();
