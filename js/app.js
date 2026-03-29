// ============================================
// SciAI Hub - 应用逻辑
// ============================================

(function () {
    'use strict';

    // ---- DOM 引用 ----
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const sidebar = $('#sidebar');
    const mainContent = $('#mainContent');
    const mobileMenuBtn = $('#mobileMenuBtn');
    const globalSearch = $('#globalSearch');
    const themeToggle = $('#themeToggle');
    const loginBtn = $('#loginBtn');
    const loginModal = $('#loginModal');
    const modalClose = $('#modalClose');
    const toolsGrid = $('#toolsGrid');
    const promptsGrid = $('#promptsGrid');
    const tutorialsGrid = $('#tutorialsGrid');
    const newsList = $('#newsList');
    const pageTitle = $('#pageTitle');

    // 板块引用
    const sections = {
        tools: $('#toolsSection'),
        stats: $('#statsSection'),
        prompts: $('#promptsSection'),
        tutorials: $('#tutorialsSection'),
        news: $('#newsSection'),
    };

    // ---- 状态 ----
    let currentCategory = 'all';
    let currentPricing = 'all';

    // ---- 初始化 ----
    function init() {
        renderTools(TOOLS_DATA);
        renderPrompts(PROMPTS_DATA);
        renderTutorials(TUTORIALS_DATA);
        renderNews(NEWS_DATA);
        bindEvents();
        animateStats();
        loadTheme();
    }

    // ---- 渲染工具卡片 ----
    function renderTools(tools) {
        toolsGrid.innerHTML = tools.map(tool => `
            <div class="tool-card" data-category="${tool.category}" data-pricing="${tool.pricing}" data-region="${tool.region}" onclick="window.open('${tool.url}', '_blank')">
                <div class="tool-card-header">
                    <div class="tool-icon" style="background:${tool.color}">
                        <i class="${tool.icon}"></i>
                    </div>
                    <div class="tool-card-info">
                        <h4>${tool.name}</h4>
                        <div class="tool-tags">
                            ${tool.tags.map(t => `<span class="tool-tag">${t}</span>`).join('')}
                            ${tool.pricing === 'free' ? '<span class="tool-tag free">免费</span>' : ''}
                            ${tool.pricing === 'paid' ? '<span class="tool-tag paid">付费</span>' : ''}
                            ${tool.isNew ? '<span class="tool-tag new">NEW</span>' : ''}
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
    }

    // ---- 渲染提示词卡片 ----
    function renderPrompts(prompts) {
        promptsGrid.innerHTML = prompts.map(p => `
            <div class="prompt-card">
                <h4><i class="fas fa-lightbulb"></i>${p.title}</h4>
                <p>${p.content}</p>
                <div class="prompt-card-footer">
                    <span class="prompt-category">${getCategoryLabel(p.category)}</span>
                    <button class="btn-copy" onclick="copyPrompt(this, \`${p.content.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`)">
                        <i class="fas fa-copy"></i> 复制
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ---- 渲染教程卡片 ----
    function renderTutorials(tutorials) {
        tutorialsGrid.innerHTML = tutorials.map(t => `
            <div class="tutorial-card">
                <div class="tutorial-cover" style="background:${t.cover}">
                    <i class="${t.icon}"></i>
                </div>
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

    // ---- 渲染资讯列表 ----
    function renderNews(news) {
        newsList.innerHTML = news.map(n => {
            const d = new Date(n.date);
            return `
            <div class="news-item">
                <div class="news-date">
                    <span class="day">${d.getDate()}</span>
                    <span class="month">${d.getMonth() + 1}月</span>
                </div>
                <div class="news-info">
                    <h4>${n.title}</h4>
                    <p>${n.desc}</p>
                </div>
                <span class="news-tag" style="background:${n.tagColor}15;color:${n.tagColor}">${n.tag}</span>
            </div>`;
        }).join('');
    }

    // ---- 工具分类标签映射 ----
    function getCategoryLabel(cat) {
        const map = {
            writing: '论文写作', review: '文献综述',
            analysis: '数据分析', translate: '翻译润色',
        };
        return map[cat] || cat;
    }

    // ---- 过滤工具 ----
    function filterTools() {
        let filtered = TOOLS_DATA;

        // 按分类过滤
        if (currentCategory !== 'all' && currentCategory !== 'hot' && currentCategory !== 'new') {
            filtered = filtered.filter(t => t.category === currentCategory);
        }
        if (currentCategory === 'hot') {
            filtered = filtered.filter(t => t.hot);
        }
        if (currentCategory === 'new') {
            filtered = filtered.filter(t => t.isNew);
        }

        // 按价格过滤
        if (currentPricing !== 'all') {
            if (currentPricing === 'domestic' || currentPricing === 'foreign') {
                filtered = filtered.filter(t => t.region === currentPricing);
            } else {
                filtered = filtered.filter(t => t.pricing === currentPricing);
            }
        }

        renderTools(filtered);
    }

    // ---- 搜索 ----
    function searchTools(query) {
        if (!query.trim()) {
            filterTools();
            return;
        }
        const q = query.toLowerCase();
        const filtered = TOOLS_DATA.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q) ||
            t.tags.some(tag => tag.toLowerCase().includes(q))
        );
        renderTools(filtered);
    }

    // ---- 显示对应板块 ----
    function showSection(category) {
        // 判断当前应该展示哪些板块
        const isResource = ['prompts', 'tutorials', 'news'].includes(category);

        // 先隐藏所有板块
        Object.values(sections).forEach(s => { if (s) s.style.display = 'none'; });

        if (category === 'prompts') {
            sections.prompts.style.display = 'block';
            pageTitle.textContent = '科研提示词库';
        } else if (category === 'tutorials') {
            sections.tutorials.style.display = 'block';
            pageTitle.textContent = '学习教程';
        } else if (category === 'news') {
            sections.news.style.display = 'block';
            pageTitle.textContent = '行业资讯';
        } else {
            // 显示工具和统计
            sections.stats.style.display = '';
            sections.tools.style.display = '';
            // 设置标题
            const titleMap = {
                all: '全部工具', hot: '热门推荐', new: '最新上线',
                writing: '论文写作', reading: '文献阅读', data: '数据分析',
                figure: '科研绘图', code: '代码助手', experiment: '实验设计',
                llm: '大语言模型', 'image-ai': 'AI绘画', voice: '语音合成', video: 'AI视频',
            };
            pageTitle.textContent = titleMap[category] || '全部工具';
        }
    }

    // ---- 数字动画 ----
    function animateStats() {
        $$('.stats-value').forEach(el => {
            const target = parseInt(el.dataset.target);
            const duration = 1500;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const current = Math.floor(eased * target);
                el.textContent = current.toLocaleString();
                if (progress < 1) requestAnimationFrame(update);
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
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('sciai-theme', next);
        updateThemeIcon(next);
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ---- 绑定事件 ----
    function bindEvents() {
        // 侧边栏导航
        $$('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const category = item.dataset.category;
                currentCategory = category;
                currentPricing = 'all';
                // 重置筛选标签
                $$('.filter-tags .tag').forEach(t => t.classList.remove('active'));
                const allTag = document.querySelector('.filter-tags .tag[data-filter="all"]');
                if (allTag) allTag.classList.add('active');

                showSection(category);
                if (!['prompts', 'tutorials', 'news'].includes(category)) {
                    filterTools();
                }

                // 移动端关闭侧边栏
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
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
                const filtered = filter === 'all'
                    ? PROMPTS_DATA
                    : PROMPTS_DATA.filter(p => p.category === filter);
                renderPrompts(filtered);
            });
        });

        // 搜索
        let searchTimer;
        globalSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                // 切换到工具视图
                showSection('all');
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                document.querySelector('.nav-item[data-category="all"]').classList.add('active');
                currentCategory = 'all';
                searchTools(e.target.value);
            }, 300);
        });

        // 主题切换
        themeToggle.addEventListener('click', toggleTheme);

        // 移动端菜单
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // 点击外部关闭侧边栏
        mainContent.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });

        // 登录弹窗
        loginBtn.addEventListener('click', () => loginModal.classList.add('show'));
        modalClose.addEventListener('click', () => loginModal.classList.remove('show'));
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) loginModal.classList.remove('show');
        });
    }

    // ---- 全局方法 ----
    window.copyPrompt = function (btn, text) {
        navigator.clipboard.writeText(text).then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
            btn.style.color = '#059669';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.color = '';
            }, 1500);
        });
    };

    // 启动
    init();
})();
