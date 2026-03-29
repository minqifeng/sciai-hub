// ============================================
// SciAI Hub - 数据层
// ============================================

const TOOLS_DATA = [
    // ---- 论文写作 ----
    {
        id: 1, name: "ChatGPT", category: "writing",
        desc: "OpenAI 旗舰模型，支持论文写作、文献分析、代码生成等多种科研场景，学术能力强大。",
        icon: "fas fa-robot", color: "#10a37f",
        tags: ["大模型", "论文写作"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "50万+", url: "https://chat.openai.com", hot: true
    },
    {
        id: 2, name: "Claude", category: "writing",
        desc: "Anthropic 出品的AI助手，擅长长文本理解和学术写作，支持上传PDF直接分析论文。",
        icon: "fas fa-feather", color: "#7c5cfc",
        tags: ["大模型", "长文本"], pricing: "freemium", region: "foreign",
        rating: 4.7, users: "30万+", url: "https://claude.ai", hot: true
    },
    {
        id: 3, name: "Paperpal", category: "writing",
        desc: "专业学术写作AI，提供论文语法检查、润色、改写和学术语言优化。",
        icon: "fas fa-pen-nib", color: "#e74c3c",
        tags: ["论文润色", "语法检查"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "12万+", url: "https://paperpal.com", isNew: true
    },
    {
        id: 4, name: "秘塔写作猫", category: "writing",
        desc: "国产AI写作助手，支持论文大纲生成、自动续写、学术翻译和查重降重。",
        icon: "fas fa-cat", color: "#ff6b35",
        tags: ["论文写作", "国产"], pricing: "free", region: "domestic",
        rating: 4.3, users: "25万+", url: "https://xiezuocat.com"
    },
    {
        id: 5, name: "Writefull", category: "writing",
        desc: "基于学术语料训练的AI写作工具，提供语言校对、释义改写和标题生成功能。",
        icon: "fas fa-spell-check", color: "#2563eb",
        tags: ["学术校对", "释义改写"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "8万+", url: "https://writefull.com"
    },

    // ---- 文献阅读 ----
    {
        id: 6, name: "SciSpace", category: "reading",
        desc: "AI驱动的学术论文阅读助手，支持论文翻译、概念解释、公式解析和对话式文献探索。",
        icon: "fas fa-satellite", color: "#8b5cf6",
        tags: ["论文阅读", "文献理解"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "20万+", url: "https://typeset.io", hot: true
    },
    {
        id: 7, name: "Elicit", category: "reading",
        desc: "AI研究助手，自动搜索相关论文、提取关键发现、对比研究方法，加速文献综述。",
        icon: "fas fa-magnifying-glass-chart", color: "#059669",
        tags: ["文献检索", "系统综述"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "15万+", url: "https://elicit.com", hot: true
    },
    {
        id: 8, name: "Connected Papers", category: "reading",
        desc: "可视化论文引用网络，快速发现相关研究，构建完整的文献地图。",
        icon: "fas fa-diagram-project", color: "#0ea5e9",
        tags: ["文献图谱", "引用分析"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "18万+", url: "https://connectedpapers.com"
    },
    {
        id: 9, name: "ReadPaper", category: "reading",
        desc: "国产论文阅读平台，支持AI翻译、笔记标注、论文管理和学术社交。",
        icon: "fas fa-book-reader", color: "#f43f5e",
        tags: ["论文阅读", "国产"], pricing: "free", region: "domestic",
        rating: 4.3, users: "30万+", url: "https://readpaper.com"
    },
    {
        id: 10, name: "Consensus", category: "reading",
        desc: "基于学术论文的AI搜索引擎，从2亿+论文中提取科学共识和研究结论。",
        icon: "fas fa-check-double", color: "#6366f1",
        tags: ["学术搜索", "证据合成"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "10万+", url: "https://consensus.app", isNew: true
    },

    // ---- 数据分析 ----
    {
        id: 11, name: "Julius AI", category: "data",
        desc: "AI数据分析助手，上传数据即可自动生成图表、执行统计分析和建模。",
        icon: "fas fa-chart-pie", color: "#f97316",
        tags: ["数据分析", "可视化"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "8万+", url: "https://julius.ai", isNew: true
    },
    {
        id: 12, name: "Noteable", category: "data",
        desc: "AI增强的Notebook平台，支持自然语言驱动的数据分析、可视化和机器学习。",
        icon: "fas fa-laptop-code", color: "#8b5cf6",
        tags: ["Notebook", "数据科学"], pricing: "freemium", region: "foreign",
        rating: 4.3, users: "5万+", url: "https://noteable.io"
    },
    {
        id: 13, name: "通义千问", category: "data",
        desc: "阿里云大模型，支持数据分析、代码生成、学术问答，中文表现优异。",
        icon: "fas fa-cloud", color: "#4f6ef7",
        tags: ["大模型", "国产"], pricing: "free", region: "domestic",
        rating: 4.4, users: "100万+", url: "https://tongyi.aliyun.com", hot: true
    },

    // ---- 科研绘图 ----
    {
        id: 14, name: "BioRender", category: "figure",
        desc: "专业科学示意图绘制平台，提供数千个生物医学图标和模板，快速创建论文配图。",
        icon: "fas fa-dna", color: "#059669",
        tags: ["科学插图", "生物医学"], pricing: "paid", region: "foreign",
        rating: 4.7, users: "25万+", url: "https://biorender.com", hot: true
    },
    {
        id: 15, name: "SciDraw", category: "figure",
        desc: "免费科学绘图资源库，涵盖生物、化学、物理等领域的矢量科学图标。",
        icon: "fas fa-palette", color: "#d946ef",
        tags: ["矢量图标", "免费"], pricing: "free", region: "foreign",
        rating: 4.2, users: "6万+", url: "https://scidraw.io"
    },
    {
        id: 16, name: "Diagrams.net", category: "figure",
        desc: "免费开源绘图工具，支持流程图、架构图、科研示意图，可嵌入多种平台。",
        icon: "fas fa-sitemap", color: "#f97316",
        tags: ["流程图", "免费"], pricing: "free", region: "foreign",
        rating: 4.5, users: "40万+", url: "https://app.diagrams.net"
    },

    // ---- 代码助手 ----
    {
        id: 17, name: "GitHub Copilot", category: "code",
        desc: "AI代码补全工具，支持Python、R等科研常用语言，大幅提升编程效率。",
        icon: "fab fa-github", color: "#333",
        tags: ["代码补全", "AI编程"], pricing: "paid", region: "foreign",
        rating: 4.6, users: "100万+", url: "https://github.com/features/copilot"
    },
    {
        id: 18, name: "Cursor", category: "code",
        desc: "AI-first代码编辑器，内置AI助手支持代码生成、调试和重构，科研编程利器。",
        icon: "fas fa-terminal", color: "#000",
        tags: ["IDE", "AI编程"], pricing: "freemium", region: "foreign",
        rating: 4.7, users: "30万+", url: "https://cursor.sh", hot: true
    },

    // ---- 实验设计 ----
    {
        id: 19, name: "Benchling", category: "experiment",
        desc: "云端生物实验平台，支持序列设计、实验记录、样品管理和协作研发。",
        icon: "fas fa-flask-vial", color: "#2563eb",
        tags: ["实验管理", "生物"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "10万+", url: "https://benchling.com"
    },
    {
        id: 20, name: "Protocols.io", category: "experiment",
        desc: "实验方案分享平台，浏览和发布标准实验流程，提高科研可重复性。",
        icon: "fas fa-list-check", color: "#059669",
        tags: ["实验方案", "开放科学"], pricing: "free", region: "foreign",
        rating: 4.3, users: "8万+", url: "https://protocols.io"
    },

    // ---- 大语言模型 ----
    {
        id: 21, name: "DeepSeek", category: "llm",
        desc: "国产开源大模型，代码和数学推理能力出色，科研编程和数据分析的理想选择。",
        icon: "fas fa-dragon", color: "#4f6ef7",
        tags: ["开源", "国产"], pricing: "free", region: "domestic",
        rating: 4.6, users: "80万+", url: "https://chat.deepseek.com", hot: true, isNew: true
    },
    {
        id: 22, name: "Gemini", category: "llm",
        desc: "Google最新多模态大模型，支持文本、图像、代码等多种输入，学术能力优秀。",
        icon: "fas fa-gem", color: "#4285f4",
        tags: ["多模态", "Google"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "40万+", url: "https://gemini.google.com"
    },
    {
        id: 23, name: "Kimi", category: "llm",
        desc: "月之暗面出品，超长上下文大模型，支持20万字长文档理解，文献阅读首选。",
        icon: "fas fa-moon", color: "#1a1a2e",
        tags: ["长上下文", "国产"], pricing: "free", region: "domestic",
        rating: 4.5, users: "60万+", url: "https://kimi.moonshot.cn", hot: true
    },

    // ---- AI绘画 ----
    {
        id: 24, name: "Midjourney", category: "image-ai",
        desc: "顶级AI绘画工具，生成高质量艺术图像，可用于论文封面和报告配图。",
        icon: "fas fa-paintbrush", color: "#e74c3c",
        tags: ["AI绘画", "图像生成"], pricing: "paid", region: "foreign",
        rating: 4.8, users: "80万+", url: "https://midjourney.com"
    },
    {
        id: 25, name: "DALL-E 3", category: "image-ai",
        desc: "OpenAI图像生成模型，集成于ChatGPT中，支持通过自然语言创建精确图像。",
        icon: "fas fa-image", color: "#10a37f",
        tags: ["图像生成", "OpenAI"], pricing: "paid", region: "foreign",
        rating: 4.6, users: "50万+", url: "https://openai.com/dall-e-3"
    },

    // ---- 语音合成 ----
    {
        id: 26, name: "ElevenLabs", category: "voice",
        desc: "高品质AI语音合成平台，可用于学术报告配音和科研内容音频化。",
        icon: "fas fa-volume-high", color: "#000",
        tags: ["语音合成", "配音"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "15万+", url: "https://elevenlabs.io"
    },

    // ---- AI视频 ----
    {
        id: 27, name: "Sora", category: "video",
        desc: "OpenAI视频生成模型，可根据文字描述生成高质量视频，适用于科研演示。",
        icon: "fas fa-film", color: "#10a37f",
        tags: ["视频生成", "OpenAI"], pricing: "paid", region: "foreign",
        rating: 4.4, users: "20万+", url: "https://openai.com/sora", isNew: true
    },
    {
        id: 28, name: "Semantic Scholar", category: "reading",
        desc: "AI驱动的免费学术搜索引擎，提供论文摘要、引用分析和研究趋势洞察。",
        icon: "fas fa-graduation-cap", color: "#1857b6",
        tags: ["学术搜索", "免费"], pricing: "free", region: "foreign",
        rating: 4.6, users: "35万+", url: "https://semanticscholar.org", hot: true
    },
    {
        id: 29, name: "Perplexity", category: "llm",
        desc: "AI搜索引擎，实时检索网页和学术论文，带引用来源的学术问答助手。",
        icon: "fas fa-globe", color: "#20808d",
        tags: ["AI搜索", "学术问答"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "35万+", url: "https://perplexity.ai", hot: true
    },
    {
        id: 30, name: "文心一言", category: "llm",
        desc: "百度大模型，支持中文学术写作、知识问答和代码辅助，中文理解能力强。",
        icon: "fas fa-comments", color: "#2932e1",
        tags: ["大模型", "国产"], pricing: "free", region: "domestic",
        rating: 4.3, users: "90万+", url: "https://yiyan.baidu.com"
    },
];

const PROMPTS_DATA = [
    {
        id: 1, title: "论文摘要生成", category: "writing",
        content: "请根据以下研究内容生成一段学术论文摘要（约250词），包含研究背景、方法、主要结果和结论。要求语言学术化、逻辑清晰。\n\n研究内容：[在此粘贴你的研究概述]"
    },
    {
        id: 2, title: "文献综述框架", category: "review",
        content: "我正在撰写关于[主题]的文献综述，请帮我：\n1. 提出合理的综述框架和逻辑结构\n2. 建议按什么维度分类已有研究\n3. 指出该领域的主要争议和研究空白\n4. 给出写作建议"
    },
    {
        id: 3, title: "统计方法选择", category: "analysis",
        content: "我的研究数据具有以下特征：\n- 样本量：[N]\n- 自变量：[描述]\n- 因变量：[描述]\n- 数据分布：[正态/非正态]\n\n请推荐合适的统计方法，并解释选择理由和前提假设。"
    },
    {
        id: 4, title: "论文翻译润色", category: "translate",
        content: "请将以下中文学术段落翻译为英文，要求：\n1. 使用学术英语写作规范\n2. 确保专业术语准确\n3. 句式多样化，避免重复\n4. 符合SCI论文写作风格\n\n原文：[粘贴中文段落]"
    },
    {
        id: 5, title: "实验方案设计", category: "writing",
        content: "请帮我设计一个关于[研究主题]的实验方案，包括：\n1. 实验假设\n2. 实验组与对照组设置\n3. 变量控制方法\n4. 样本量估算依据\n5. 数据收集方法\n6. 预期统计分析方法"
    },
    {
        id: 6, title: "论文回复审稿意见", category: "writing",
        content: "请帮我回复以下审稿意见，要求语气礼貌、专业，逐条回应，并说明修改内容或提供合理解释。\n\n审稿意见：[粘贴审稿意见]\n\n我的修改/解释：[简述你的回应要点]"
    },
    {
        id: 7, title: "R/Python代码生成", category: "analysis",
        content: "请用[R/Python]编写以下数据分析代码：\n1. 数据描述：[描述数据结构]\n2. 分析目标：[描述分析目标]\n3. 需要的图表：[描述可视化需求]\n\n要求：代码有注释，结果有解释。"
    },
    {
        id: 8, title: "论文引言撰写", category: "writing",
        content: "请帮我撰写关于[研究主题]的论文引言，需要包含：\n1. 研究领域的大背景介绍\n2. 现有研究的主要发现和不足\n3. 本研究的必要性和创新点\n4. 研究目的和假设\n\n要求：逻辑递进，从宏观到微观。"
    },
];

const TUTORIALS_DATA = [
    {
        id: 1, title: "ChatGPT 科研写作完全指南",
        desc: "从零开始学习如何利用ChatGPT辅助学术论文写作，涵盖选题、文献综述、实验设计到论文润色的全流程。",
        cover: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: "fas fa-pen-fancy",
        views: "2.3万", date: "2026-03-15"
    },
    {
        id: 2, title: "AI辅助数据分析：从入门到实战",
        desc: "使用AI工具进行科研数据分析的实用教程，包含Python/R代码生成、统计方法选择和结果可视化。",
        cover: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        icon: "fas fa-chart-bar",
        views: "1.8万", date: "2026-03-10"
    },
    {
        id: 3, title: "用AI工具加速文献综述",
        desc: "详解如何使用Elicit、Consensus等AI工具快速筛选文献、提取关键信息并构建文献综述框架。",
        cover: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        icon: "fas fa-book-open",
        views: "1.5万", date: "2026-03-05"
    },
    {
        id: 4, title: "BioRender 科研绘图实战",
        desc: "学习使用BioRender创建专业的科学示意图、实验流程图和细胞通路图，提升论文图片质量。",
        cover: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        icon: "fas fa-dna",
        views: "1.2万", date: "2026-02-28"
    },
    {
        id: 5, title: "Prompt Engineering：科研提示词进阶",
        desc: "深入学习如何编写高效的科研提示词，让AI输出更精准、更学术的内容。",
        cover: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        icon: "fas fa-lightbulb",
        views: "9800", date: "2026-02-20"
    },
    {
        id: 6, title: "DeepSeek 编程助手使用技巧",
        desc: "如何利用DeepSeek进行科研编程、数据处理和算法实现，附带实战案例和代码模板。",
        cover: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        icon: "fas fa-code",
        views: "8500", date: "2026-02-15"
    },
];

const NEWS_DATA = [
    {
        id: 1, title: "OpenAI 发布 GPT-5，科研推理能力大幅提升",
        desc: "GPT-5 在学术写作、数学推理和代码生成方面取得突破性进展，已有多所高校开始将其纳入科研流程。",
        date: "2026-03-28", tag: "重磅", tagColor: "#ef4444"
    },
    {
        id: 2, title: "Nature 发文讨论AI在科研中的伦理边界",
        desc: "Nature 编辑部发表社论，探讨AI工具在学术研究中的使用规范和伦理准则。",
        date: "2026-03-25", tag: "学术", tagColor: "#8b5cf6"
    },
    {
        id: 3, title: "DeepSeek-V3 开源发布，性能比肩GPT-4o",
        desc: "深度求索发布新一代开源大模型，在科研编程和学术问答基准测试中表现出色。",
        date: "2026-03-22", tag: "开源", tagColor: "#059669"
    },
    {
        id: 4, title: "Elicit 获得5000万美元B轮融资",
        desc: "AI科研助手Elicit完成新一轮融资，将用于扩展系统综述和证据合成功能。",
        date: "2026-03-20", tag: "融资", tagColor: "#f97316"
    },
    {
        id: 5, title: "中科院发布《科研AI工具使用指南》",
        desc: "中科院正式发布科研领域AI工具使用规范，为研究人员提供明确的使用框架和最佳实践。",
        date: "2026-03-18", tag: "政策", tagColor: "#2563eb"
    },
    {
        id: 6, title: "Google Scholar 整合 Gemini AI 搜索功能",
        desc: "Google Scholar 引入 Gemini AI 辅助学术搜索，支持自然语言检索和论文摘要生成。",
        date: "2026-03-15", tag: "产品", tagColor: "#4f6ef7"
    },
];
