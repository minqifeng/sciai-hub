// ============================================
// SciAI Hub - 数据层（真实工具数据）
// ============================================

// 使用 Google Favicon 服务获取真实 logo
const favicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const TOOLS_DATA = [
    // ---- 论文写作 ----
    {
        id: 1, name: "ChatGPT", category: "writing",
        desc: "OpenAI 旗舰对话模型，擅长论文润色、摘要撰写、文献分析，支持上传 PDF 直接提问。GPT-4o 在学术基准测试中名列前茅。",
        logo: favicon("chat.openai.com"),
        icon: "fas fa-robot", color: "#10a37f",
        tags: ["大模型", "论文写作"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "5000万+", url: "https://chat.openai.com", hot: true
    },
    {
        id: 2, name: "Claude", category: "writing",
        desc: "Anthropic 出品，支持 200K 上下文，可一次性上传整篇论文深度分析。学术写作逻辑严谨，指令遵循能力业界领先。",
        logo: favicon("claude.ai"),
        icon: "fas fa-feather", color: "#7c5cfc",
        tags: ["大模型", "长文本"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "1000万+", url: "https://claude.ai", hot: true
    },
    {
        id: 3, name: "Paperpal", category: "writing",
        desc: "专为学术写作设计的 AI 助手，提供实时语法纠错、学术表达建议、投稿前检查，支持直接在 Word 中使用。",
        logo: favicon("paperpal.com"),
        icon: "fas fa-pen-nib", color: "#e74c3c",
        tags: ["论文润色", "语法检查"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "100万+", url: "https://paperpal.com", isNew: true
    },
    {
        id: 4, name: "秘塔写作猫", category: "writing",
        desc: "国内领先的 AI 写作平台，论文大纲一键生成，内置中文查重和降重功能，支持英文学术翻译。",
        logo: favicon("xiezuocat.com"),
        icon: "fas fa-cat", color: "#ff6b35",
        tags: ["论文写作", "国产"], pricing: "freemium", region: "domestic",
        rating: 4.3, users: "200万+", url: "https://xiezuocat.com"
    },
    {
        id: 5, name: "Writefull", category: "writing",
        desc: "基于数十亿学术论文语料训练，提供语言校对、释义改写、标题/摘要自动生成，深度集成 Overleaf。",
        logo: favicon("writefull.com"),
        icon: "fas fa-spell-check", color: "#2563eb",
        tags: ["学术校对", "Overleaf"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "50万+", url: "https://writefull.com"
    },
    {
        id: 6, name: "Jenni AI", category: "writing",
        desc: "专为研究人员打造的 AI 写作助手，支持引用文献自动插入、段落续写和研究报告生成，格式符合学术规范。",
        logo: favicon("jenni.ai"),
        icon: "fas fa-pencil", color: "#6366f1",
        tags: ["论文写作", "引用管理"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "80万+", url: "https://jenni.ai", isNew: true
    },

    // ---- 文献阅读 ----
    {
        id: 7, name: "SciSpace", category: "reading",
        desc: "AI 学术助手，上传任意论文可对话式提问，自动解释专业术语、数学公式，支持跨语言理解，内置 2 亿篇论文库。",
        logo: favicon("typeset.io"),
        icon: "fas fa-satellite", color: "#8b5cf6",
        tags: ["论文阅读", "文献理解"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "500万+", url: "https://typeset.io", hot: true
    },
    {
        id: 8, name: "Elicit", category: "reading",
        desc: "AI 系统综述工具，输入研究问题自动检索相关论文，提取样本量、方法、结论等关键字段，大幅加速文献综述。",
        logo: favicon("elicit.com"),
        icon: "fas fa-magnifying-glass-chart", color: "#059669",
        tags: ["文献检索", "系统综述"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "100万+", url: "https://elicit.com", hot: true
    },
    {
        id: 9, name: "Connected Papers", category: "reading",
        desc: "可视化论文引用关系图，输入一篇论文自动构建相关研究网络，快速发现领域奠基性工作和最新进展。",
        logo: favicon("connectedpapers.com"),
        icon: "fas fa-diagram-project", color: "#0ea5e9",
        tags: ["文献图谱", "引用分析"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "200万+", url: "https://connectedpapers.com"
    },
    {
        id: 10, name: "ReadPaper", category: "reading",
        desc: "国产学术阅读平台，支持 AI 翻译、双语对照、段落笔记、论文管理和学术社交，针对中文用户深度优化。",
        logo: favicon("readpaper.com"),
        icon: "fas fa-book-reader", color: "#f43f5e",
        tags: ["论文阅读", "国产"], pricing: "free", region: "domestic",
        rating: 4.4, users: "300万+", url: "https://readpaper.com"
    },
    {
        id: 11, name: "Consensus", category: "reading",
        desc: "从 2 亿篇论文中提取科学共识，搜索问题即可获得基于证据的答案，并附带参考文献来源，适合快速了解领域现状。",
        logo: favicon("consensus.app"),
        icon: "fas fa-check-double", color: "#6366f1",
        tags: ["学术搜索", "证据合成"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "150万+", url: "https://consensus.app", isNew: true
    },
    {
        id: 12, name: "Semantic Scholar", category: "reading",
        desc: "艾伦人工智能研究所出品，免费 AI 学术搜索引擎，提供论文摘要、引用分析、作者影响力评估，覆盖 2 亿篇文献。",
        logo: favicon("semanticscholar.org"),
        icon: "fas fa-graduation-cap", color: "#1857b6",
        tags: ["学术搜索", "免费"], pricing: "free", region: "foreign",
        rating: 4.6, users: "1000万+", url: "https://semanticscholar.org", hot: true
    },
    {
        id: 13, name: "Kimi", category: "reading",
        desc: "月之暗面出品，支持 200 万字超长上下文，可同时上传多篇论文对比分析，中文学术理解能力国内领先。",
        logo: favicon("kimi.moonshot.cn"),
        icon: "fas fa-moon", color: "#1a1a2e",
        tags: ["长上下文", "国产"], pricing: "free", region: "domestic",
        rating: 4.6, users: "2000万+", url: "https://kimi.moonshot.cn", hot: true
    },

    // ---- 数据分析 ----
    {
        id: 14, name: "Julius AI", category: "data",
        desc: "上传 Excel/CSV/数据库文件，用自然语言描述分析需求，AI 自动执行 Python 代码并生成可视化图表，无需编程基础。",
        logo: favicon("julius.ai"),
        icon: "fas fa-chart-pie", color: "#f97316",
        tags: ["数据分析", "可视化"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "30万+", url: "https://julius.ai", isNew: true
    },
    {
        id: 15, name: "通义千问", category: "data",
        desc: "阿里云旗舰大模型，代码生成和数学推理能力强，支持数据分析、统计建模，中文理解准确，完全免费使用。",
        logo: favicon("tongyi.aliyun.com"),
        icon: "fas fa-cloud", color: "#4f6ef7",
        tags: ["大模型", "国产"], pricing: "free", region: "domestic",
        rating: 4.5, users: "5000万+", url: "https://tongyi.aliyun.com", hot: true
    },
    {
        id: 16, name: "DeepSeek", category: "data",
        desc: "国产开源大模型，数学推理和代码能力比肩 GPT-4o，科研编程首选。R/Python 数据分析代码生成质量极高，完全免费。",
        logo: favicon("chat.deepseek.com"),
        icon: "fas fa-dragon", color: "#4f6ef7",
        tags: ["开源", "国产", "代码"], pricing: "free", region: "domestic",
        rating: 4.7, users: "3000万+", url: "https://chat.deepseek.com", hot: true, isNew: true
    },
    {
        id: 17, name: "SPSS Statistics", category: "data",
        desc: "IBM 出品的专业统计软件，社会科学研究标配，支持回归分析、方差分析、因子分析等，有大量学术教程资源。",
        logo: favicon("ibm.com"),
        icon: "fas fa-calculator", color: "#054ada",
        tags: ["统计软件", "社科"], pricing: "paid", region: "foreign",
        rating: 4.3, users: "500万+", url: "https://www.ibm.com/spss"
    },

    // ---- 科研绘图 ----
    {
        id: 18, name: "BioRender", category: "figure",
        desc: "全球最流行的科学示意图工具，内置 5 万+ 生物医学专业图标，支持细胞通路图、实验流程图，已发表于 Nature/Science 等顶刊。",
        logo: favicon("biorender.com"),
        icon: "fas fa-dna", color: "#059669",
        tags: ["科学插图", "生物医学"], pricing: "paid", region: "foreign",
        rating: 4.8, users: "300万+", url: "https://biorender.com", hot: true
    },
    {
        id: 19, name: "GraphPad Prism", category: "figure",
        desc: "生物医学研究必备绘图软件，集统计分析与专业图表于一体，支持生存曲线、剂量效应曲线等科研专用图形。",
        logo: favicon("graphpad.com"),
        icon: "fas fa-chart-line", color: "#e74c3c",
        tags: ["统计绘图", "生物医学"], pricing: "paid", region: "foreign",
        rating: 4.7, users: "400万+", url: "https://www.graphpad.com", hot: true
    },
    {
        id: 20, name: "Adobe Illustrator", category: "figure",
        desc: "专业矢量绘图软件，科研人员用于制作高分辨率论文配图和封面，支持精确控制颜色和排版，输出印刷级质量。",
        logo: favicon("adobe.com"),
        icon: "fas fa-bezier-curve", color: "#ff9a00",
        tags: ["矢量绘图", "专业设计"], pricing: "paid", region: "foreign",
        rating: 4.5, users: "2000万+", url: "https://www.adobe.com/illustrator"
    },
    {
        id: 21, name: "Diagrams.net", category: "figure",
        desc: "免费开源在线绘图工具，支持流程图、架构图、科研示意图，可存储至 Google Drive，适合绘制实验设计和研究框架图。",
        logo: favicon("app.diagrams.net"),
        icon: "fas fa-sitemap", color: "#f97316",
        tags: ["流程图", "免费"], pricing: "free", region: "foreign",
        rating: 4.5, users: "2000万+", url: "https://app.diagrams.net"
    },
    {
        id: 22, name: "Origin", category: "figure",
        desc: "理工科研究的标准绘图和数据分析软件，支持 100+ 图形类型，内置完整统计工具，输出符合期刊要求的高质量图表。",
        logo: favicon("originlab.com"),
        icon: "fas fa-wave-square", color: "#2a7ae4",
        tags: ["科学绘图", "数据分析"], pricing: "paid", region: "foreign",
        rating: 4.6, users: "300万+", url: "https://www.originlab.com"
    },

    // ---- 代码助手 ----
    {
        id: 23, name: "GitHub Copilot", category: "code",
        desc: "基于数十亿代码训练，支持 Python/R/MATLAB 等科研常用语言，行级代码补全准确率业界最高，VSCode 深度集成。",
        logo: favicon("github.com"),
        icon: "fab fa-github", color: "#333",
        tags: ["代码补全", "AI编程"], pricing: "paid", region: "foreign",
        rating: 4.7, users: "1500万+", url: "https://github.com/features/copilot"
    },
    {
        id: 24, name: "Cursor", category: "code",
        desc: "AI-first 代码编辑器，内置 Claude/GPT-4 支持整个代码库级别的对话，可理解项目上下文进行重构，科研编程利器。",
        logo: favicon("cursor.sh"),
        icon: "fas fa-terminal", color: "#000",
        tags: ["IDE", "AI编程"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "200万+", url: "https://cursor.sh", hot: true
    },
    {
        id: 25, name: "Google Colab", category: "code",
        desc: "免费云端 Jupyter Notebook，提供免费 GPU/TPU 资源，预装深度学习框架，适合机器学习科研和数据分析，无需配置环境。",
        logo: favicon("colab.research.google.com"),
        icon: "fab fa-google", color: "#f9ab00",
        tags: ["云端GPU", "免费"], pricing: "free", region: "foreign",
        rating: 4.6, users: "1000万+", url: "https://colab.research.google.com", hot: true
    },

    // ---- 实验设计 ----
    {
        id: 26, name: "Benchling", category: "experiment",
        desc: "生命科学研发云平台，集序列设计、CRISPR 工具、实验记录、样品管理于一体，支持团队协作，全球数千家实验室在用。",
        logo: favicon("benchling.com"),
        icon: "fas fa-flask-vial", color: "#2563eb",
        tags: ["实验管理", "生命科学"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "30万+", url: "https://benchling.com"
    },
    {
        id: 27, name: "Protocols.io", category: "experiment",
        desc: "全球最大实验方案分享社区，超过 100 万个经验证的实验流程可免费获取，支持版本控制和团队协作，提升科研可重复性。",
        logo: favicon("protocols.io"),
        icon: "fas fa-list-check", color: "#059669",
        tags: ["实验方案", "开放科学"], pricing: "free", region: "foreign",
        rating: 4.4, users: "100万+", url: "https://protocols.io"
    },

    // ---- 大语言模型 ----
    {
        id: 28, name: "Gemini", category: "llm",
        desc: "Google 最新多模态大模型，可分析论文图表、阅读 PDF、执行数据推理，与 Google 学术/Drive 深度整合，适合学术研究。",
        logo: favicon("gemini.google.com"),
        icon: "fas fa-gem", color: "#4285f4",
        tags: ["多模态", "Google"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "5000万+", url: "https://gemini.google.com"
    },
    {
        id: 29, name: "Perplexity", category: "llm",
        desc: "AI 搜索引擎，实时检索网页和 arXiv/PubMed 论文，每条回答附带引用来源，是替代传统学术搜索的高效工具。",
        logo: favicon("perplexity.ai"),
        icon: "fas fa-globe", color: "#20808d",
        tags: ["AI搜索", "带引用"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "1000万+", url: "https://perplexity.ai", hot: true
    },
    {
        id: 30, name: "文心一言", category: "llm",
        desc: "百度文心大模型，中文语义理解和生成能力强，支持学术问答、报告撰写和文献摘要，国内访问速度快，完全免费。",
        logo: favicon("yiyan.baidu.com"),
        icon: "fas fa-comments", color: "#2932e1",
        tags: ["大模型", "国产"], pricing: "free", region: "domestic",
        rating: 4.3, users: "1亿+", url: "https://yiyan.baidu.com"
    },

    // ---- AI绘画 ----
    {
        id: 31, name: "Midjourney", category: "image-ai",
        desc: "顶级 AI 图像生成工具，画面质量业界最高，可用于学术海报、期刊封面设计、科普插图创作，通过 Discord 使用。",
        logo: favicon("midjourney.com"),
        icon: "fas fa-paintbrush", color: "#e74c3c",
        tags: ["AI绘画", "高质量"], pricing: "paid", region: "foreign",
        rating: 4.8, users: "2000万+", url: "https://midjourney.com"
    },
    {
        id: 32, name: "Stable Diffusion", category: "image-ai",
        desc: "最流行的开源图像生成模型，可本地部署，支持精确控制生成内容，有大量科学可视化专用模型，完全免费。",
        logo: favicon("stability.ai"),
        icon: "fas fa-image", color: "#7c3aed",
        tags: ["开源", "本地部署"], pricing: "free", region: "foreign",
        rating: 4.5, users: "5000万+", url: "https://stability.ai", hot: true
    },

    // ---- 语音合成 ----
    {
        id: 33, name: "ElevenLabs", category: "voice",
        desc: "最逼真的 AI 语音合成平台，支持克隆声音，可用于学术报告配音、科研内容音频化，多语言支持效果出色。",
        logo: favicon("elevenlabs.io"),
        icon: "fas fa-volume-high", color: "#000",
        tags: ["语音合成", "声音克隆"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "100万+", url: "https://elevenlabs.io"
    },

    // ---- AI视频 ----
    {
        id: 34, name: "Sora", category: "video",
        desc: "OpenAI 视频生成模型，可根据文字描述生成高质量视频，适用于科研实验过程演示和科普内容制作。",
        logo: favicon("openai.com"),
        icon: "fas fa-film", color: "#10a37f",
        tags: ["视频生成", "OpenAI"], pricing: "paid", region: "foreign",
        rating: 4.4, users: "100万+", url: "https://sora.com", isNew: true
    },
    {
        id: 35, name: "Runway", category: "video",
        desc: "专业 AI 视频生成和编辑平台，支持文字转视频、图片转视频，研究成果展示和学术汇报演示的理想工具。",
        logo: favicon("runwayml.com"),
        icon: "fas fa-clapperboard", color: "#6366f1",
        tags: ["AI视频", "视频编辑"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "300万+", url: "https://runwayml.com"
    },
];

    // ---- 文献管理 ----
    {
        id: 36, name: "Zotero", category: "reading",
        desc: "免费开源文献管理工具，支持一键抓取网页论文、自动生成引用格式，与 Word/LaTeX 深度集成，科研必备神器。",
        logo: favicon("zotero.org"),
        icon: "fas fa-book", color: "#cc2936",
        tags: ["文献管理", "免费"], pricing: "free", region: "foreign",
        rating: 4.7, users: "1000万+", url: "https://zotero.org", hot: true
    },
    {
        id: 37, name: "Mendeley", category: "reading",
        desc: "Elsevier 出品的文献管理和学术社交平台，支持 PDF 注释、引用生成，内置学术社交网络，可发现相关研究者。",
        logo: favicon("mendeley.com"),
        icon: "fas fa-book-bookmark", color: "#9b0000",
        tags: ["文献管理", "学术社交"], pricing: "free", region: "foreign",
        rating: 4.4, users: "800万+", url: "https://mendeley.com"
    },
    {
        id: 38, name: "Litmaps", category: "reading",
        desc: "可视化文献发现工具，以种子论文为起点构建动态引用地图，持续追踪领域新论文，自动推送相关文献。",
        logo: favicon("litmaps.com"),
        icon: "fas fa-map", color: "#2d6a4f",
        tags: ["文献地图", "自动追踪"], pricing: "freemium", region: "foreign",
        rating: 4.3, users: "20万+", url: "https://litmaps.com", isNew: true
    },

    // ---- 写作辅助 ----
    {
        id: 39, name: "Overleaf", category: "writing",
        desc: "全球最流行的在线 LaTeX 编辑器，支持实时协作编写学术论文，内置数千个期刊模板，与 Zotero/Mendeley 无缝集成。",
        logo: favicon("overleaf.com"),
        icon: "fas fa-leaf", color: "#4cae4f",
        tags: ["LaTeX", "协作写作"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "1500万+", url: "https://overleaf.com", hot: true
    },
    {
        id: 40, name: "Grammarly", category: "writing",
        desc: "AI 英文写作助手，提供语法纠错、风格优化、学术语调调整，支持浏览器插件和 Word 集成，论文投稿前必用。",
        logo: favicon("grammarly.com"),
        icon: "fas fa-check-circle", color: "#15c39a",
        tags: ["语法检查", "英文写作"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "3000万+", url: "https://grammarly.com", hot: true
    },
    {
        id: 41, name: "QuillBot", category: "writing",
        desc: "AI 改写和润色工具，提供多种改写模式（学术/简洁/创意），内置语法检查和引用生成器，深受科研人员喜爱。",
        logo: favicon("quillbot.com"),
        icon: "fas fa-feather-alt", color: "#6ab04c",
        tags: ["改写润色", "引用生成"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "2000万+", url: "https://quillbot.com"
    },

    // ---- 数据分析 ----
    {
        id: 42, name: "JASP", category: "data",
        desc: "免费开源统计软件，界面友好，支持频率统计和贝叶斯统计，是 SPSS 的最佳免费替代品，专为心理学和社科研究设计。",
        logo: favicon("jasp-stats.org"),
        icon: "fas fa-chart-bar", color: "#0073b7",
        tags: ["统计分析", "免费"], pricing: "free", region: "foreign",
        rating: 4.5, users: "50万+", url: "https://jasp-stats.org"
    },
    {
        id: 43, name: "R Studio", category: "data",
        desc: "R 语言最流行的 IDE，统计分析和科学可视化的标准工具，拥有数万个科研专用扩展包，学术界广泛使用。",
        logo: favicon("posit.co"),
        icon: "fas fa-registered", color: "#75aadb",
        tags: ["R语言", "统计分析"], pricing: "free", region: "foreign",
        rating: 4.7, users: "500万+", url: "https://posit.co/products/open-source/rstudio/", hot: true
    },
    {
        id: 44, name: "Tableau", category: "data",
        desc: "业界领先的数据可视化平台，拖拽操作即可创建专业图表，高校免费授权，适合展示复杂科研数据。",
        logo: favicon("tableau.com"),
        icon: "fas fa-chart-area", color: "#e8762b",
        tags: ["数据可视化", "拖拽操作"], pricing: "paid", region: "foreign",
        rating: 4.5, users: "1500万+", url: "https://tableau.com"
    },

    // ---- 科研绘图 ----
    {
        id: 45, name: "Figma", category: "figure",
        desc: "专业协作设计工具，支持矢量绘图和原型设计，研究人员用于制作高质量论文配图、学术海报和汇报幻灯片。",
        logo: favicon("figma.com"),
        icon: "fab fa-figma", color: "#f24e1e",
        tags: ["矢量设计", "协作"], pricing: "freemium", region: "foreign",
        rating: 4.7, users: "4000万+", url: "https://figma.com", hot: true
    },
    {
        id: 46, name: "Inkscape", category: "figure",
        desc: "免费开源矢量绘图软件，功能堪比 Adobe Illustrator，可编辑 SVG 格式图形，制作高分辨率论文配图的免费选择。",
        logo: favicon("inkscape.org"),
        icon: "fas fa-vector-square", color: "#000",
        tags: ["矢量绘图", "免费开源"], pricing: "free", region: "foreign",
        rating: 4.3, users: "200万+", url: "https://inkscape.org"
    },

    // ---- 代码助手 ----
    {
        id: 47, name: "Jupyter Notebook", category: "code",
        desc: "交互式计算笔记本，科研数据分析标准工具，支持 Python/R/Julia，代码、结果、可视化和文本混排，易于分享复现。",
        logo: favicon("jupyter.org"),
        icon: "fas fa-book-open", color: "#f37626",
        tags: ["交互式计算", "数据科学"], pricing: "free", region: "foreign",
        rating: 4.8, users: "2000万+", url: "https://jupyter.org", hot: true
    },
    {
        id: 48, name: "VS Code", category: "code",
        desc: "微软出品的免费开源代码编辑器，支持所有科研编程语言，丰富的 AI 插件生态（GitHub Copilot/Continue/Codeium），科研编程首选。",
        logo: favicon("code.visualstudio.com"),
        icon: "fas fa-code", color: "#007acc",
        tags: ["代码编辑器", "免费"], pricing: "free", region: "foreign",
        rating: 4.9, users: "1亿+", url: "https://code.visualstudio.com", hot: true
    },

    // ---- AI 搜索/问答 ----
    {
        id: 49, name: "ResearchRabbit", category: "reading",
        desc: "号称学术界的 Spotify，输入论文后自动推荐相关文献，可视化作者合作网络，支持与 Zotero 同步，完全免费。",
        logo: favicon("researchrabbit.ai"),
        icon: "fas fa-rabbit", color: "#ff6b6b",
        tags: ["文献推荐", "免费"], pricing: "free", region: "foreign",
        rating: 4.5, users: "60万+", url: "https://researchrabbit.ai", isNew: true
    },
    {
        id: 50, name: "Scite.ai", category: "reading",
        desc: "智能引用分析平台，显示论文被引用时是「支持」还是「反驳」，帮助快速评估研究可靠性和学术争议。",
        logo: favicon("scite.ai"),
        icon: "fas fa-quote-right", color: "#5e35b1",
        tags: ["引用分析", "可信度评估"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "30万+", url: "https://scite.ai", isNew: true
    },
    {
        id: 51, name: "Scholarcy", category: "reading",
        desc: "AI 论文摘要工具，自动将长篇论文提炼为结构化摘要卡片，提取关键贡献、方法、数据，快速筛选文献必备。",
        logo: favicon("scholarcy.com"),
        icon: "fas fa-id-card", color: "#1565c0",
        tags: ["自动摘要", "论文提炼"], pricing: "freemium", region: "foreign",
        rating: 4.3, users: "15万+", url: "https://scholarcy.com"
    },

    // ---- 国产 AI ----
    {
        id: 52, name: "智谱清言", category: "llm",
        desc: "清华大学技术加持的大模型，学术理解和推理能力突出，支持长文档分析和学术问答，有免费 API 供科研使用。",
        logo: favicon("chatglm.cn"),
        icon: "fas fa-brain", color: "#2a5ae0",
        tags: ["大模型", "国产"], pricing: "free", region: "domestic",
        rating: 4.4, users: "500万+", url: "https://chatglm.cn"
    },
    {
        id: 53, name: "MiniMax", category: "llm",
        desc: "国产多模态大模型，支持文本、图像和语音，长上下文表现优异，有完整 API 接口，适合科研项目二次开发。",
        logo: favicon("minimaxi.com"),
        icon: "fas fa-microchip", color: "#6200ea",
        tags: ["多模态", "国产API"], pricing: "freemium", region: "domestic",
        rating: 4.3, users: "200万+", url: "https://minimaxi.com", isNew: true
    },

    // ---- 实验设计 ----
    {
        id: 54, name: "LabArchives", category: "experiment",
        desc: "云端电子实验记录本，支持实验数据安全存储、版本控制和团队协作，符合 FDA/GLP 合规要求，已被数千家机构采用。",
        logo: favicon("labarchives.com"),
        icon: "fas fa-clipboard-list", color: "#0277bd",
        tags: ["实验记录", "合规管理"], pricing: "paid", region: "foreign",
        rating: 4.3, users: "50万+", url: "https://labarchives.com"
    },
    {
        id: 55, name: "Notion", category: "experiment",
        desc: "全能型知识管理工具，科研人员用于实验记录、文献笔记、项目管理和团队协作，AI 功能支持智能总结和问答。",
        logo: favicon("notion.so"),
        icon: "fas fa-sticky-note", color: "#000",
        tags: ["知识管理", "AI助手"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "3000万+", url: "https://notion.so", hot: true
    },
];

// ---- 精选工具（首页 Spotlight） ----
const FEATURED_TOOLS = [
    { id: 2,  reason: "200K 超长上下文，整篇论文一次读完" },
    { id: 8,  reason: "系统综述效率提升 10 倍" },
    { id: 18, reason: "5万+ 生物医学图标，顶刊御用绘图工具" },
    { id: 16, reason: "免费开源，代码推理超越 GPT-4o" },
    { id: 39, reason: "全球 1500万+ 科研人员在用的 LaTeX 编辑器" },
    { id: 47, reason: "科研数据分析标准工具，支持多语言内核" },
];

const PROMPTS_DATA = [
    {
        id: 1, title: "论文摘要生成", category: "writing",
        content: `请根据以下研究内容，生成一段符合国际期刊规范的英文摘要（约250词）。
结构要求：
1. Background（研究背景与问题）
2. Methods（研究方法）
3. Results（主要结果，包含具体数据）
4. Conclusions（结论与意义）

研究内容：[在此粘贴你的研究概述]`
    },
    {
        id: 2, title: "文献综述框架构建", category: "review",
        content: `我正在撰写关于「[研究主题]」的文献综述，请帮我：
1. 提出合理的综述逻辑框架（建议分几个层次）
2. 推荐核心关键词用于 Web of Science/PubMed 检索
3. 梳理该领域的研究脉络和主要争议点
4. 指出现有研究的不足和未来方向
5. 给出写作注意事项`
    },
    {
        id: 3, title: "统计方法选择指南", category: "analysis",
        content: `请根据我的研究数据特征推荐统计方法：
- 研究设计：[横断面/纵向/实验性研究]
- 样本量：[N = ?]
- 因变量：[连续/分类/计数] - [描述]
- 自变量：[连续/分类] - [描述]
- 数据分布：[已检验/未检验]
- 研究目的：[比较组间差异/探索相关性/预测/建模]

请推荐合适的统计方法，解释选择依据，并给出 SPSS/R/Python 实现代码片段。`
    },
    {
        id: 4, title: "英文论文润色（学术级）", category: "translate",
        content: `请对以下学术文本进行专业润色，要求：
1. 保持原意不变，仅优化语言表达
2. 使用 SCI 论文正式学术语体
3. 避免冗余表达，追求简洁精准
4. 确保专业术语使用规范
5. 标注修改处并简要说明修改理由

原文：
[粘贴英文段落]`
    },
    {
        id: 5, title: "实验方案设计", category: "writing",
        content: `请为以下研究问题设计一套完整实验方案：

研究问题：[描述你的科学问题]
研究领域：[如：分子生物学/材料科学/心理学等]

方案需包含：
1. 研究假设（零假设 + 备择假设）
2. 实验组 vs 对照组设置及理由
3. 关键变量的操作化定义
4. 样本量计算依据（效应量/检验效能）
5. 主要技术方法和设备
6. 数据收集和统计分析计划
7. 潜在偏倚及控制措施`
    },
    {
        id: 6, title: "审稿意见回复模板", category: "writing",
        content: `请帮我专业回复以下审稿意见，要求：
- 语气礼貌、谦逊，表达感谢
- 逐条回应，每条格式：【审稿意见】→【作者回复】→【修改内容】
- 对合理意见说明如何修改
- 对有异议的意见提供有力的学术依据反驳

审稿意见：
[粘贴审稿人意见]

我的初步想法：
[简述你的回应思路]`
    },
    {
        id: 7, title: "Python 数据分析代码", category: "analysis",
        content: `请用 Python 编写以下数据分析代码：

数据描述：
- 数据格式：[CSV/Excel/数据库]
- 主要字段：[描述关键变量]
- 数据量：[约几行几列]

分析需求：
1. [描述分析目标，如：比较不同组的均值差异]
2. [描述可视化需求，如：绘制箱线图+散点图]
3. [描述统计检验需求，如：t检验/ANOVA]

要求：代码有详细注释，包含结果解读说明。`
    },
    {
        id: 8, title: "论文引言写作框架", category: "writing",
        content: `请帮我构建「[研究主题]」论文引言的写作框架，采用经典的漏斗式结构：

1. 第一段：宏观背景（该领域的重要性和现实意义）
2. 第二段：研究现状（现有研究的主要发现，引用方向）
3. 第三段：研究缺口（现有研究的局限性和不足）
4. 第四段：本研究（研究目的、假设、创新点）
5. 第五段：论文结构（各章节简介，可选）

请给出每段的核心论点、建议引用方向和过渡句示例。`
    },
    {
        id: 9, title: "中译英学术翻译", category: "translate",
        content: `请将以下中文学术段落翻译为英文，要求：
1. 符合目标期刊（[如：Nature/PLOS ONE/领域顶刊]）的写作风格
2. 专业术语使用国际通用表达
3. 句式多样化，避免重复句型
4. 被动语态与主动语态合理搭配
5. 翻译后附上3-5个可能用到的关键词

中文原文：
[粘贴中文段落]`
    },
    {
        id: 10, title: "研究创新点提炼", category: "writing",
        content: `请根据以下研究描述，帮我提炼和表述本研究的创新点：

研究概述：[描述你的研究内容和主要发现]

请从以下维度分析创新性：
1. 理论创新（是否填补了理论空白）
2. 方法创新（是否使用了新方法或改进了现有方法）
3. 应用创新（是否解决了实际问题或有新的应用场景）
4. 数据创新（是否使用了新的数据集或独特数据）

并给出适合写在论文 Introduction 中的创新点表述语句（英文）。`
    },
];

const TUTORIALS_DATA = [
    {
        id: 1, title: "ChatGPT 科研写作完全指南",
        desc: "从零开始学习如何利用 ChatGPT 辅助学术论文写作，涵盖选题优化、文献综述、实验设计到论文润色的全流程，附带真实案例。",
        cover: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: "fas fa-pen-fancy",
        views: "5.2万", date: "2026-03-20"
    },
    {
        id: 2, title: "DeepSeek 科研编程实战：Python/R 数据分析",
        desc: "使用 DeepSeek 自动生成数据分析代码，涵盖统计检验、机器学习建模和科研可视化，从提问技巧到代码调试全流程。",
        cover: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        icon: "fas fa-code",
        views: "3.8万", date: "2026-03-15"
    },
    {
        id: 3, title: "用 Elicit + SciSpace 加速系统综述",
        desc: "详解如何用 AI 工具完成 PRISMA 标准的系统综述：文献检索、筛选、数据提取到偏倚评估，效率提升 10 倍的实操教程。",
        cover: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        icon: "fas fa-book-open",
        views: "2.9万", date: "2026-03-10"
    },
    {
        id: 4, title: "BioRender + AI 制作顶刊级科研配图",
        desc: "结合 BioRender 和 AI 工具制作达到 Nature/Science 级别的科研示意图，包含配色方案、排版规范和常见图型模板。",
        cover: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        icon: "fas fa-dna",
        views: "2.1万", date: "2026-03-05"
    },
    {
        id: 5, title: "科研 Prompt Engineering 进阶指南",
        desc: "如何设计高效的科研提示词？从角色设定、结构化指令到思维链技巧，让 AI 输出更精准、更学术化的内容。",
        cover: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        icon: "fas fa-lightbulb",
        views: "1.8万", date: "2026-02-28"
    },
    {
        id: 6, title: "免费工具替代方案：零成本科研工具箱",
        desc: "盘点每个付费科研工具的高质量免费替代品：SPSS→JASP、Endnote→Zotero、GraphPad→R ggplot2，附详细使用教程。",
        cover: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        icon: "fas fa-tools",
        views: "4.5万", date: "2026-02-20"
    },
    {
        id: 7, title: "Kimi 长文本阅读：一次性读懂 100 篇论文",
        desc: "利用 Kimi 超长上下文批量阅读文献，快速提取研究方法、关键结论，构建文献矩阵，大幅压缩文献调研时间。",
        cover: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
        icon: "fas fa-moon",
        views: "3.2万", date: "2026-02-15"
    },
    {
        id: 8, title: "Google Colab 科研机器学习入门",
        desc: "从零开始在 Google Colab 上运行机器学习实验，免费 GPU 环境配置、常用数据集加载、模型训练和结果可视化全教程。",
        cover: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
        icon: "fas fa-robot",
        views: "2.6万", date: "2026-02-10"
    },
];

const NEWS_DATA = [
    {
        id: 1, title: "Claude 4 发布：200K 上下文支持整本博士论文分析",
        desc: "Anthropic 发布 Claude 4，支持 200K token 超长上下文，可一次性读取并分析整本博士论文，学术能力评测超越 GPT-4o。",
        date: "2026-03-28", tag: "重磅", tagColor: "#ef4444"
    },
    {
        id: 2, title: "Nature 正式发布 AI 辅助科研使用规范",
        desc: "Nature 出版集团更新投稿政策，明确规定作者须申报 AI 工具使用情况，原创性仍由人类研究者负责。",
        date: "2026-03-25", tag: "政策", tagColor: "#8b5cf6"
    },
    {
        id: 3, title: "DeepSeek-V3 在 MATH/HumanEval 基准超越 GPT-4o",
        desc: "深度求索最新评测报告显示，DeepSeek-V3 在数学推理和代码生成基准上全面超越 GPT-4o，且完全开源免费。",
        date: "2026-03-22", tag: "评测", tagColor: "#059669"
    },
    {
        id: 4, title: "arXiv 日均投稿突破 1 万篇，AI 论文占比 35%",
        desc: "arXiv 最新统计显示，2026 年 Q1 日均新增预印本首次超过 1 万篇，其中 AI/ML 相关论文占比达 35%。",
        date: "2026-03-20", tag: "数据", tagColor: "#f97316"
    },
    {
        id: 5, title: "Elicit 推出自动 Meta 分析功能，覆盖 2 亿篇文献",
        desc: "AI 科研助手 Elicit 上线自动 Meta 分析工具，输入 PICO 研究问题可自动筛选文献、提取数据并生成森林图。",
        date: "2026-03-18", tag: "新功能", tagColor: "#2563eb"
    },
    {
        id: 6, title: "中国 AI 论文数量首次超越美国，连续三年增速第一",
        desc: "最新报告显示，2025 年中国 AI 领域高引用论文数量首次超越美国，顶会投稿接收率显著提升。",
        date: "2026-03-15", tag: "报告", tagColor: "#4f6ef7"
    },
    {
        id: 7, title: "Google Scholar 接入 Gemini，支持论文智能摘要",
        desc: "Google Scholar 全面整合 Gemini AI，用户可对任意论文一键生成结构化摘要和研究贡献分析，支持中英双语。",
        date: "2026-03-12", tag: "产品", tagColor: "#10a37f"
    },
    {
        id: 8, title: "BioRender 新增 AI 图表生成功能，描述即可成图",
        desc: "BioRender 推出 AI 辅助绘图功能，用户只需用自然语言描述细胞通路或实验流程，AI 自动选择合适图标完成图表。",
        date: "2026-03-10", tag: "新功能", tagColor: "#059669"
    },
];
