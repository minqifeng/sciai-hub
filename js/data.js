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
        rating: 4.8, users: "5000万+", url: "https://chat.openai.com", hot: true,
        keywords: ['论文写作','摘要','润色','代码','翻译','问答','长文本','GPT','OpenAI']
    },
    {
        id: 2, name: "Claude", category: "writing",
        desc: "Anthropic 出品，支持 200K 上下文，可一次性上传整篇论文深度分析。学术写作逻辑严谨，指令遵循能力业界领先。",
        logo: favicon("claude.ai"),
        icon: "fas fa-feather", color: "#7c5cfc",
        tags: ["大模型", "长文本"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "1000万+", url: "https://claude.ai", hot: true,
        keywords: ['论文写作','长文本','学术','润色','分析','摘要','academic','Anthropic','200K']
    },
    {
        id: 3, name: "Paperpal", category: "writing",
        desc: "专为学术写作设计的 AI 助手，提供实时语法纠错、学术表达建议、投稿前检查，支持直接在 Word 中使用。",
        logo: favicon("paperpal.com"),
        icon: "fas fa-pen-nib", color: "#e74c3c",
        tags: ["论文润色", "语法检查"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "100万+", url: "https://paperpal.com", isNew: true,
        keywords: ['论文润色','语法检查','学术写作','Word','投稿','SCI','英文写作']
    },
    {
        id: 4, name: "秘塔写作猫", category: "writing",
        desc: "国内领先的 AI 写作平台，论文大纲一键生成，内置中文查重和降重功能，支持英文学术翻译。",
        logo: favicon("xiezuocat.com"),
        icon: "fas fa-cat", color: "#ff6b35",
        tags: ["论文写作", "国产"], pricing: "freemium", region: "domestic",
        rating: 4.3, users: "200万+", url: "https://xiezuocat.com",
        keywords: ['论文写作','大纲','查重','降重','中文','翻译','国产']
    },
    {
        id: 5, name: "Writefull", category: "writing",
        desc: "基于数十亿学术论文语料训练，提供语言校对、释义改写、标题/摘要自动生成，深度集成 Overleaf。",
        logo: favicon("writefull.com"),
        icon: "fas fa-spell-check", color: "#2563eb",
        tags: ["学术校对", "Overleaf"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "50万+", url: "https://writefull.com",
        keywords: ['学术校对','Overleaf','LaTeX','语言润色','英文写作','释义','投稿']
    },
    {
        id: 6, name: "Jenni AI", category: "writing",
        desc: "专为研究人员打造的 AI 写作助手，支持引用文献自动插入、段落续写和研究报告生成，格式符合学术规范。",
        logo: favicon("jenni.ai"),
        icon: "fas fa-pencil", color: "#6366f1",
        tags: ["论文写作", "引用管理"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "80万+", url: "https://jenni.ai", isNew: true,
        keywords: ['论文写作','引用管理','段落续写','学术写作','研究报告','文献引用']
    },

    // ---- 文献阅读 ----
    {
        id: 7, name: "SciSpace", category: "reading",
        desc: "AI 学术助手，上传任意论文可对话式提问，自动解释专业术语、数学公式，支持跨语言理解，内置 2 亿篇论文库。",
        logo: favicon("typeset.io"),
        icon: "fas fa-satellite", color: "#8b5cf6",
        tags: ["论文阅读", "文献理解"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "500万+", url: "https://typeset.io", hot: true,
        keywords: ['文献阅读','PDF','论文解读','学术','文献总结','英文阅读']
    },
    {
        id: 8, name: "Elicit", category: "reading",
        desc: "AI 系统综述工具，输入研究问题自动检索相关论文，提取样本量、方法、结论等关键字段，大幅加速文献综述。",
        logo: favicon("elicit.com"),
        icon: "fas fa-magnifying-glass-chart", color: "#059669",
        tags: ["文献检索", "系统综述"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "100万+", url: "https://elicit.com", hot: true,
        keywords: ['文献综述','系统综述','文献检索','Meta分析','文献筛选','PICO','阅读']
    },
    {
        id: 9, name: "Connected Papers", category: "reading",
        desc: "可视化论文引用关系图，输入一篇论文自动构建相关研究网络，快速发现领域奠基性工作和最新进展。",
        logo: favicon("connectedpapers.com"),
        icon: "fas fa-diagram-project", color: "#0ea5e9",
        tags: ["文献图谱", "引用分析"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "200万+", url: "https://connectedpapers.com",
        keywords: ['文献关系','引用关系','文献图谱','相关论文','文献发现','可视化']
    },
    {
        id: 10, name: "ReadPaper", category: "reading",
        desc: "国产学术阅读平台，支持 AI 翻译、双语对照、段落笔记、论文管理和学术社交，针对中文用户深度优化。",
        logo: favicon("readpaper.com"),
        icon: "fas fa-book-reader", color: "#f43f5e",
        tags: ["论文阅读", "国产"], pricing: "free", region: "domestic",
        rating: 4.4, users: "300万+", url: "https://readpaper.com",
        keywords: ['文献阅读','PDF','论文解读','学术','文献总结','国产','中文','翻译']
    },
    {
        id: 11, name: "Consensus", category: "reading",
        desc: "从 2 亿篇论文中提取科学共识，搜索问题即可获得基于证据的答案，并附带参考文献来源，适合快速了解领域现状。",
        logo: favicon("consensus.app"),
        icon: "fas fa-check-double", color: "#6366f1",
        tags: ["学术搜索", "证据合成"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "150万+", url: "https://consensus.app", isNew: true,
        keywords: ['文献追踪','文献发现','引用关系','文献网络','推荐论文','学术搜索','证据合成']
    },
    {
        id: 12, name: "Semantic Scholar", category: "reading",
        desc: "艾伦人工智能研究所出品，免费 AI 学术搜索引擎，提供论文摘要、引用分析、作者影响力评估，覆盖 2 亿篇文献。",
        logo: favicon("semanticscholar.org"),
        icon: "fas fa-graduation-cap", color: "#1857b6",
        tags: ["学术搜索", "免费"], pricing: "free", region: "foreign",
        rating: 4.6, users: "1000万+", url: "https://semanticscholar.org", hot: true,
        keywords: ['文献检索','论文搜索','引用分析','学术搜索','影响因子','开放获取']
    },
    {
        id: 13, name: "Kimi", category: "reading",
        desc: "月之暗面出品，支持 200 万字超长上下文，可同时上传多篇论文对比分析，中文学术理解能力国内领先。",
        logo: favicon("kimi.moonshot.cn"),
        icon: "fas fa-moon", color: "#1a1a2e",
        tags: ["长上下文", "国产"], pricing: "free", region: "domestic",
        rating: 4.6, users: "2000万+", url: "https://kimi.moonshot.cn", hot: true,
        keywords: ['长文本','PDF','文献阅读','论文','问答','国产','中文','摘要']
    },

    // ---- 数据分析 ----
    {
        id: 14, name: "Julius AI", category: "data",
        desc: "上传 Excel/CSV/数据库文件，用自然语言描述分析需求，AI 自动执行 Python 代码并生成可视化图表，无需编程基础。",
        logo: favicon("julius.ai"),
        icon: "fas fa-chart-pie", color: "#f97316",
        tags: ["数据分析", "可视化"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "30万+", url: "https://julius.ai", isNew: true,
        keywords: ['数据分析','可视化','Excel','CSV','Python','图表','AI分析']
    },
    {
        id: 15, name: "通义千问", category: "data",
        desc: "阿里云旗舰大模型，代码生成和数学推理能力强，支持数据分析、统计建模，中文理解准确，完全免费使用。",
        logo: favicon("tongyi.aliyun.com"),
        icon: "fas fa-cloud", color: "#4f6ef7",
        tags: ["大模型", "国产"], pricing: "free", region: "domestic",
        rating: 4.5, users: "5000万+", url: "https://tongyi.aliyun.com", hot: true,
        keywords: ['数据分析','代码','数学推理','问答','翻译','国产','免费','阿里云']
    },
    {
        id: 16, name: "DeepSeek", category: "data",
        desc: "国产开源大模型，数学推理和代码能力比肩 GPT-4o，科研编程首选。R/Python 数据分析代码生成质量极高，完全免费。",
        logo: favicon("chat.deepseek.com"),
        icon: "fas fa-dragon", color: "#4f6ef7",
        tags: ["开源", "国产", "代码"], pricing: "free", region: "domestic",
        rating: 4.7, users: "3000万+", url: "https://chat.deepseek.com", hot: true, isNew: true,
        keywords: ['代码','论文写作','数学推理','问答','翻译','开源','国产','免费']
    },
    {
        id: 17, name: "SPSS Statistics", category: "data",
        desc: "IBM 出品的专业统计软件，社会科学研究标配，支持回归分析、方差分析、因子分析等，有大量学术教程资源。",
        logo: favicon("ibm.com"),
        icon: "fas fa-calculator", color: "#054ada",
        tags: ["统计软件", "社科"], pricing: "paid", region: "foreign",
        rating: 4.3, users: "500万+", url: "https://www.ibm.com/spss",
        keywords: ['统计分析','数据分析','SPSS','社科','问卷','回归','方差分析']
    },

    // ---- 科研绘图 ----
    {
        id: 18, name: "BioRender", category: "figure",
        desc: "全球最流行的科学示意图工具，内置 5 万+ 生物医学专业图标，支持细胞通路图、实验流程图，已发表于 Nature/Science 等顶刊。",
        logo: favicon("biorender.com"),
        icon: "fas fa-dna", color: "#059669",
        tags: ["科学插图", "生物医学"], pricing: "paid", region: "foreign",
        rating: 4.8, users: "300万+", url: "https://biorender.com", hot: true,
        keywords: ['科研绘图','示意图','生物医学','配图','图标','细胞','通路','figure']
    },
    {
        id: 19, name: "GraphPad Prism", category: "figure",
        desc: "生物医学研究必备绘图软件，集统计分析与专业图表于一体，支持生存曲线、剂量效应曲线等科研专用图形。",
        logo: favicon("graphpad.com"),
        icon: "fas fa-chart-line", color: "#e74c3c",
        tags: ["统计绘图", "生物医学"], pricing: "paid", region: "foreign",
        rating: 4.7, users: "400万+", url: "https://www.graphpad.com", hot: true,
        keywords: ['数据分析','统计','绘图','科研图表','可视化','生物统计','实验数据']
    },
    {
        id: 20, name: "Adobe Illustrator", category: "figure",
        desc: "专业矢量绘图软件，科研人员用于制作高分辨率论文配图和封面，支持精确控制颜色和排版，输出印刷级质量。",
        logo: favicon("adobe.com"),
        icon: "fas fa-bezier-curve", color: "#ff9a00",
        tags: ["矢量绘图", "专业设计"], pricing: "paid", region: "foreign",
        rating: 4.5, users: "2000万+", url: "https://www.adobe.com/illustrator",
        keywords: ['矢量图','科研绘图','配图','SVG','示意图','Illustrator','排版','印刷']
    },
    {
        id: 21, name: "Diagrams.net", category: "figure",
        desc: "免费开源在线绘图工具，支持流程图、架构图、科研示意图，可存储至 Google Drive，适合绘制实验设计和研究框架图。",
        logo: favicon("app.diagrams.net"),
        icon: "fas fa-sitemap", color: "#f97316",
        tags: ["流程图", "免费"], pricing: "free", region: "foreign",
        rating: 4.5, users: "2000万+", url: "https://app.diagrams.net",
        keywords: ['统计分析','数据分析','回归','方差分析','流程图','架构图','免费']
    },
    {
        id: 22, name: "Origin", category: "figure",
        desc: "理工科研究的标准绘图和数据分析软件，支持 100+ 图形类型，内置完整统计工具，输出符合期刊要求的高质量图表。",
        logo: favicon("originlab.com"),
        icon: "fas fa-wave-square", color: "#2a7ae4",
        tags: ["科学绘图", "数据分析"], pricing: "paid", region: "foreign",
        rating: 4.6, users: "300万+", url: "https://www.originlab.com",
        keywords: ['数据分析','绘图','科研图表','可视化','统计','实验数据','物理']
    },

    // ---- 代码助手 ----
    {
        id: 23, name: "GitHub Copilot", category: "code",
        desc: "基于数十亿代码训练，支持 Python/R/MATLAB 等科研常用语言，行级代码补全准确率业界最高，VSCode 深度集成。",
        logo: favicon("github.com"),
        icon: "fab fa-github", color: "#333",
        tags: ["代码补全", "AI编程"], pricing: "paid", region: "foreign",
        rating: 4.7, users: "1500万+", url: "https://github.com/features/copilot",
        keywords: ['代码','编程','自动补全','Python','JavaScript','开发','调试']
    },
    {
        id: 24, name: "Cursor", category: "code",
        desc: "AI-first 代码编辑器，内置 Claude/GPT-4 支持整个代码库级别的对话，可理解项目上下文进行重构，科研编程利器。",
        logo: favicon("cursor.sh"),
        icon: "fas fa-terminal", color: "#000",
        tags: ["IDE", "AI编程"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "200万+", url: "https://cursor.sh", hot: true,
        keywords: ['代码','编程','AI编辑器','Python','重构','调试','开发']
    },
    {
        id: 25, name: "Google Colab", category: "code",
        desc: "免费云端 Jupyter Notebook，提供免费 GPU/TPU 资源，预装深度学习框架，适合机器学习科研和数据分析，无需配置环境。",
        logo: favicon("colab.research.google.com"),
        icon: "fab fa-google", color: "#f9ab00",
        tags: ["云端GPU", "免费"], pricing: "free", region: "foreign",
        rating: 4.6, users: "1000万+", url: "https://colab.research.google.com", hot: true,
        keywords: ['数据分析','Python','机器学习','GPU','深度学习','免费','代码']
    },

    // ---- 实验设计 ----
    {
        id: 26, name: "Benchling", category: "experiment",
        desc: "生命科学研发云平台，集序列设计、CRISPR 工具、实验记录、样品管理于一体，支持团队协作，全球数千家实验室在用。",
        logo: favicon("benchling.com"),
        icon: "fas fa-flask-vial", color: "#2563eb",
        tags: ["实验管理", "生命科学"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "30万+", url: "https://benchling.com",
        keywords: ['实验记录','生命科学','CRISPR','样品管理','团队协作','实验设计']
    },
    {
        id: 27, name: "Protocols.io", category: "experiment",
        desc: "全球最大实验方案分享社区，超过 100 万个经验证的实验流程可免费获取，支持版本控制和团队协作，提升科研可重复性。",
        logo: favicon("protocols.io"),
        icon: "fas fa-list-check", color: "#059669",
        tags: ["实验方案", "开放科学"], pricing: "free", region: "foreign",
        rating: 4.4, users: "100万+", url: "https://protocols.io",
        keywords: ['实验方案','开放科学','可重复','实验流程','团队协作','免费']
    },

    // ---- 大语言模型 ----
    {
        id: 28, name: "Gemini", category: "llm",
        desc: "Google 最新多模态大模型，可分析论文图表、阅读 PDF、执行数据推理，与 Google 学术/Drive 深度整合，适合学术研究。",
        logo: favicon("gemini.google.com"),
        icon: "fas fa-gem", color: "#4285f4",
        tags: ["多模态", "Google"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "5000万+", url: "https://gemini.google.com",
        keywords: ['多模态','论文写作','搜索','问答','摘要','翻译','PDF','Google']
    },
    {
        id: 29, name: "Perplexity", category: "llm",
        desc: "AI 搜索引擎，实时检索网页和 arXiv/PubMed 论文，每条回答附带引用来源，是替代传统学术搜索的高效工具。",
        logo: favicon("perplexity.ai"),
        icon: "fas fa-globe", color: "#20808d",
        tags: ["AI搜索", "带引用"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "1000万+", url: "https://perplexity.ai", hot: true,
        keywords: ['AI搜索','学术搜索','带引用','arXiv','PubMed','问答','实时检索']
    },
    {
        id: 30, name: "文心一言", category: "llm",
        desc: "百度文心大模型，中文语义理解和生成能力强，支持学术问答、报告撰写和文献摘要，国内访问速度快，完全免费。",
        logo: favicon("yiyan.baidu.com"),
        icon: "fas fa-comments", color: "#2932e1",
        tags: ["大模型", "国产"], pricing: "free", region: "domestic",
        rating: 4.3, users: "1亿+", url: "https://yiyan.baidu.com",
        keywords: ['论文写作','问答','国产','中文','摘要','翻译','百度','免费']
    },

    // ---- AI绘画 ----
    {
        id: 31, name: "Midjourney", category: "image-ai",
        desc: "顶级 AI 图像生成工具，画面质量业界最高，可用于学术海报、期刊封面设计、科普插图创作，通过 Discord 使用。",
        logo: favicon("midjourney.com"),
        icon: "fas fa-paintbrush", color: "#e74c3c",
        tags: ["AI绘画", "高质量"], pricing: "paid", region: "foreign",
        rating: 4.8, users: "2000万+", url: "https://midjourney.com",
        keywords: ['AI绘画','图像生成','学术海报','封面设计','科普插图','可视化']
    },
    {
        id: 32, name: "Stable Diffusion", category: "image-ai",
        desc: "最流行的开源图像生成模型，可本地部署，支持精确控制生成内容，有大量科学可视化专用模型，完全免费。",
        logo: favicon("stability.ai"),
        icon: "fas fa-image", color: "#7c3aed",
        tags: ["开源", "本地部署"], pricing: "free", region: "foreign",
        rating: 4.5, users: "5000万+", url: "https://stability.ai", hot: true,
        keywords: ['AI绘画','图像生成','开源','本地部署','科学可视化','免费']
    },

    // ---- 语音合成 ----
    {
        id: 33, name: "ElevenLabs", category: "voice",
        desc: "最逼真的 AI 语音合成平台，支持克隆声音，可用于学术报告配音、科研内容音频化，多语言支持效果出色。",
        logo: favicon("elevenlabs.io"),
        icon: "fas fa-volume-high", color: "#000",
        tags: ["语音合成", "声音克隆"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "100万+", url: "https://elevenlabs.io",
        keywords: ['语音合成','声音克隆','配音','语音','多语言','学术报告']
    },

    // ---- AI视频 ----
    {
        id: 34, name: "Sora", category: "video",
        desc: "OpenAI 视频生成模型，可根据文字描述生成高质量视频，适用于科研实验过程演示和科普内容制作。",
        logo: favicon("openai.com"),
        icon: "fas fa-film", color: "#10a37f",
        tags: ["视频生成", "OpenAI"], pricing: "paid", region: "foreign",
        rating: 4.4, users: "100万+", url: "https://sora.com", isNew: true,
        keywords: ['视频生成','AI视频','科研演示','科普','OpenAI','实验过程']
    },
    {
        id: 35, name: "Runway", category: "video",
        desc: "专业 AI 视频生成和编辑平台，支持文字转视频、图片转视频，研究成果展示和学术汇报演示的理想工具。",
        logo: favicon("runwayml.com"),
        icon: "fas fa-clapperboard", color: "#6366f1",
        tags: ["AI视频", "视频编辑"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "300万+", url: "https://runwayml.com",
        keywords: ['AI视频','视频编辑','视频生成','学术汇报','演示','图片转视频']
    },
    // ---- 文献管理 ----
    {
        id: 36, name: "Zotero", category: "reading",
        desc: "免费开源文献管理工具，支持一键抓取网页论文、自动生成引用格式，与 Word/LaTeX 深度集成，科研必备神器。",
        logo: favicon("zotero.org"),
        icon: "fas fa-book", color: "#cc2936",
        tags: ["文献管理", "免费"], pricing: "free", region: "foreign",
        rating: 4.7, users: "1000万+", url: "https://zotero.org", hot: true,
        keywords: ['文献管理','参考文献','引用','文献库','PDF','书目','免费']
    },
    {
        id: 37, name: "Mendeley", category: "reading",
        desc: "Elsevier 出品的文献管理和学术社交平台，支持 PDF 注释、引用生成，内置学术社交网络，可发现相关研究者。",
        logo: favicon("mendeley.com"),
        icon: "fas fa-book-bookmark", color: "#9b0000",
        tags: ["文献管理", "学术社交"], pricing: "free", region: "foreign",
        rating: 4.4, users: "800万+", url: "https://mendeley.com",
        keywords: ['文献管理','参考文献','引用','PDF','注释','协作','书目']
    },
    {
        id: 38, name: "Litmaps", category: "reading",
        desc: "可视化文献发现工具，以种子论文为起点构建动态引用地图，持续追踪领域新论文，自动推送相关文献。",
        logo: favicon("litmaps.com"),
        icon: "fas fa-map", color: "#2d6a4f",
        tags: ["文献地图", "自动追踪"], pricing: "freemium", region: "foreign",
        rating: 4.3, users: "20万+", url: "https://litmaps.com", isNew: true,
        keywords: ['文献图谱','引用关系','文献发现','可视化','文献追踪','种子论文']
    },

    // ---- 写作辅助 ----
    {
        id: 39, name: "Overleaf", category: "writing",
        desc: "全球最流行的在线 LaTeX 编辑器，支持实时协作编写学术论文，内置数千个期刊模板，与 Zotero/Mendeley 无缝集成。",
        logo: favicon("overleaf.com"),
        icon: "fas fa-leaf", color: "#4cae4f",
        tags: ["LaTeX", "协作写作"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "1500万+", url: "https://overleaf.com", hot: true,
        keywords: ['LaTeX','论文写作','协作','学术排版','期刊模板','数学公式']
    },
    {
        id: 40, name: "Grammarly", category: "writing",
        desc: "AI 英文写作助手，提供语法纠错、风格优化、学术语调调整，支持浏览器插件和 Word 集成，论文投稿前必用。",
        logo: favicon("grammarly.com"),
        icon: "fas fa-check-circle", color: "#15c39a",
        tags: ["语法检查", "英文写作"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "3000万+", url: "https://grammarly.com", hot: true,
        keywords: ['语法检查','英文写作','润色','学术写作','语言纠错','论文']
    },
    {
        id: 41, name: "QuillBot", category: "writing",
        desc: "AI 改写和润色工具，提供多种改写模式（学术/简洁/创意），内置语法检查和引用生成器，深受科研人员喜爱。",
        logo: favicon("quillbot.com"),
        icon: "fas fa-feather-alt", color: "#6ab04c",
        tags: ["改写润色", "引用生成"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "2000万+", url: "https://quillbot.com",
        keywords: ['改写','释义','英文写作','润色','摘要','语法检查','论文']
    },

    // ---- 数据分析 ----
    {
        id: 42, name: "JASP", category: "data",
        desc: "免费开源统计软件，界面友好，支持频率统计和贝叶斯统计，是 SPSS 的最佳免费替代品，专为心理学和社科研究设计。",
        logo: favicon("jasp-stats.org"),
        icon: "fas fa-chart-bar", color: "#0073b7",
        tags: ["统计分析", "免费"], pricing: "free", region: "foreign",
        rating: 4.5, users: "50万+", url: "https://jasp-stats.org",
        keywords: ['统计分析','贝叶斯','数据分析','免费','SPSS替代','方差分析']
    },
    {
        id: 43, name: "R Studio", category: "data",
        desc: "R 语言最流行的 IDE，统计分析和科学可视化的标准工具，拥有数万个科研专用扩展包，学术界广泛使用。",
        logo: favicon("posit.co"),
        icon: "fas fa-registered", color: "#75aadb",
        tags: ["R语言", "统计分析"], pricing: "free", region: "foreign",
        rating: 4.7, users: "500万+", url: "https://posit.co/products/open-source/rstudio/", hot: true,
        keywords: ['数据分析','统计','R语言','可视化','ggplot2','免费','编程']
    },
    {
        id: 44, name: "Tableau", category: "data",
        desc: "业界领先的数据可视化平台，拖拽操作即可创建专业图表，高校免费授权，适合展示复杂科研数据。",
        logo: favicon("tableau.com"),
        icon: "fas fa-chart-area", color: "#e8762b",
        tags: ["数据可视化", "拖拽操作"], pricing: "paid", region: "foreign",
        rating: 4.5, users: "1500万+", url: "https://tableau.com",
        keywords: ['数据可视化','图表','仪表盘','商业分析','数据分析','交互']
    },

    // ---- 科研绘图 ----
    {
        id: 45, name: "Figma", category: "figure",
        desc: "专业协作设计工具，支持矢量绘图和原型设计，研究人员用于制作高质量论文配图、学术海报和汇报幻灯片。",
        logo: favicon("figma.com"),
        icon: "fab fa-figma", color: "#f24e1e",
        tags: ["矢量设计", "协作"], pricing: "freemium", region: "foreign",
        rating: 4.7, users: "4000万+", url: "https://figma.com", hot: true,
        keywords: ['设计','原型','UI','示意图','协作','图形设计','可视化']
    },
    {
        id: 46, name: "Inkscape", category: "figure",
        desc: "免费开源矢量绘图软件，功能堪比 Adobe Illustrator，可编辑 SVG 格式图形，制作高分辨率论文配图的免费选择。",
        logo: favicon("inkscape.org"),
        icon: "fas fa-vector-square", color: "#000",
        tags: ["矢量绘图", "免费开源"], pricing: "free", region: "foreign",
        rating: 4.3, users: "200万+", url: "https://inkscape.org",
        keywords: ['矢量图','科研绘图','图标','SVG','免费','示意图','Illustrator替代']
    },

    // ---- 代码助手 ----
    {
        id: 47, name: "Jupyter Notebook", category: "code",
        desc: "交互式计算笔记本，科研数据分析标准工具，支持 Python/R/Julia，代码、结果、可视化和文本混排，易于分享复现。",
        logo: favicon("jupyter.org"),
        icon: "fas fa-book-open", color: "#f37626",
        tags: ["交互式计算", "数据科学"], pricing: "free", region: "foreign",
        rating: 4.8, users: "2000万+", url: "https://jupyter.org", hot: true,
        keywords: ['数据分析','Python','R','可视化','交互式','代码','科学计算']
    },
    {
        id: 48, name: "VS Code", category: "code",
        desc: "微软出品的免费开源代码编辑器，支持所有科研编程语言，丰富的 AI 插件生态（GitHub Copilot/Continue/Codeium），科研编程首选。",
        logo: favicon("code.visualstudio.com"),
        icon: "fas fa-code", color: "#007acc",
        tags: ["代码编辑器", "免费"], pricing: "free", region: "foreign",
        rating: 4.9, users: "1亿+", url: "https://code.visualstudio.com", hot: true,
        keywords: ['代码','编程','编辑器','Python','插件','调试','免费']
    },

    // ---- AI 搜索/问答 ----
    {
        id: 49, name: "ResearchRabbit", category: "reading",
        desc: "号称学术界的 Spotify，输入论文后自动推荐相关文献，可视化作者合作网络，支持与 Zotero 同步，完全免费。",
        logo: favicon("researchrabbit.ai"),
        icon: "fas fa-rabbit", color: "#ff6b6b",
        tags: ["文献推荐", "免费"], pricing: "free", region: "foreign",
        rating: 4.5, users: "60万+", url: "https://researchrabbit.ai", isNew: true,
        keywords: ['文献追踪','文献发现','推荐论文','文献网络','阅读','引用']
    },
    {
        id: 50, name: "Scite.ai", category: "reading",
        desc: "智能引用分析平台，显示论文被引用时是「支持」还是「反驳」，帮助快速评估研究可靠性和学术争议。",
        logo: favicon("scite.ai"),
        icon: "fas fa-quote-right", color: "#5e35b1",
        tags: ["引用分析", "可信度评估"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "30万+", url: "https://scite.ai", isNew: true,
        keywords: ['引用分析','文献可靠性','支持引用','反驳引用','学术评估','论文']
    },
    {
        id: 51, name: "Scholarcy", category: "reading",
        desc: "AI 论文摘要工具，自动将长篇论文提炼为结构化摘要卡片，提取关键贡献、方法、数据，快速筛选文献必备。",
        logo: favicon("scholarcy.com"),
        icon: "fas fa-id-card", color: "#1565c0",
        tags: ["自动摘要", "论文提炼"], pricing: "freemium", region: "foreign",
        rating: 4.3, users: "15万+", url: "https://scholarcy.com",
        keywords: ['文献总结','论文摘要','自动摘要','阅读','文献提取','PDF']
    },

    // ---- 国产 AI ----
    {
        id: 52, name: "智谱清言", category: "llm",
        desc: "清华大学技术加持的大模型，学术理解和推理能力突出，支持长文档分析和学术问答，有免费 API 供科研使用。",
        logo: favicon("chatglm.cn"),
        icon: "fas fa-brain", color: "#2a5ae0",
        tags: ["大模型", "国产"], pricing: "free", region: "domestic",
        rating: 4.4, users: "500万+", url: "https://chatglm.cn",
        keywords: ['论文写作','问答','国产','中文','摘要','翻译','代码','免费']
    },
    {
        id: 53, name: "MiniMax", category: "llm",
        desc: "国产多模态大模型，支持文本、图像和语音，长上下文表现优异，有完整 API 接口，适合科研项目二次开发。",
        logo: favicon("minimaxi.com"),
        icon: "fas fa-microchip", color: "#6200ea",
        tags: ["多模态", "国产API"], pricing: "freemium", region: "domestic",
        rating: 4.3, users: "200万+", url: "https://minimaxi.com", isNew: true,
        keywords: ['多模态','问答','国产','中文','API','语音','图像']
    },

    // ---- 实验设计 ----
    {
        id: 54, name: "LabArchives", category: "experiment",
        desc: "云端电子实验记录本，支持实验数据安全存储、版本控制和团队协作，符合 FDA/GLP 合规要求，已被数千家机构采用。",
        logo: favicon("labarchives.com"),
        icon: "fas fa-clipboard-list", color: "#0277bd",
        tags: ["实验记录", "合规管理"], pricing: "paid", region: "foreign",
        rating: 4.3, users: "50万+", url: "https://labarchives.com",
        keywords: ['实验记录','电子实验本','合规','团队协作','数据存储','实验设计']
    },
    {
        id: 55, name: "Notion", category: "experiment",
        desc: "全能型知识管理工具，科研人员用于实验记录、文献笔记、项目管理和团队协作，AI 功能支持智能总结和问答。",
        logo: favicon("notion.so"),
        icon: "fas fa-sticky-note", color: "#000",
        tags: ["知识管理", "AI助手"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "3000万+", url: "https://notion.so", hot: true,
        keywords: ['知识管理','实验记录','笔记','项目管理','协作','AI助手','文献笔记']
    },

    // ---- AI 软件推荐 ----
    {
        id: 56, name: "Microsoft 365 Copilot", category: "aisoft",
        desc: "微软将 GPT-4 深度集成进 Word/Excel/PPT/Teams，支持一键生成报告、自动分析表格、智能会议总结，是最成熟的 AI 办公套件。",
        logo: favicon("microsoft.com"),
        icon: "fab fa-microsoft", color: "#0078d4",
        tags: ["办公 AI", "生产力"], pricing: "paid", region: "foreign",
        rating: 4.5, users: "5000万+", url: "https://copilot.microsoft.com", hot: true
    },
    {
        id: 57, name: "Gamma", category: "aisoft",
        desc: "AI 驱动的演示文稿生成工具，输入主题自动生成精美幻灯片，支持科研汇报、论文答辩等场景，比 PowerPoint 快 10 倍。",
        logo: favicon("gamma.app"),
        icon: "fas fa-presentation-screen", color: "#7c3aed",
        tags: ["演示文稿", "AI生成"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "300万+", url: "https://gamma.app", isNew: true
    },
    {
        id: 58, name: "Otter.ai", category: "aisoft",
        desc: "AI 会议录音转文字工具，实时转写学术讲座、组会讨论，自动生成摘要和待办事项，支持中英文混合识别。",
        logo: favicon("otter.ai"),
        icon: "fas fa-microphone-lines", color: "#2dd4bf",
        tags: ["会议记录", "语音转文字"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "500万+", url: "https://otter.ai"
    },
    {
        id: 59, name: "Canva AI", category: "aisoft",
        desc: "在线设计平台，内置 Magic Design AI，一键生成科研海报、学术墙报、论文配图，拥有海量学术模板，无设计基础即可上手。",
        logo: favicon("canva.com"),
        icon: "fas fa-palette", color: "#00c4cc",
        tags: ["设计工具", "海报制作"], pricing: "freemium", region: "foreign",
        rating: 4.6, users: "1.5亿+", url: "https://canva.com", hot: true
    },
    {
        id: 60, name: "Adobe Firefly", category: "aisoft",
        desc: "Adobe 旗下 AI 图像生成工具，商用版权安全，可生成高质量科研插图、实验示意图，与 Photoshop/Illustrator 深度集成。",
        logo: favicon("adobe.com"),
        icon: "fas fa-fire-flame-curved", color: "#ff0000",
        tags: ["AI绘图", "商用安全"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "1000万+", url: "https://firefly.adobe.com"
    },
    {
        id: 61, name: "WPS AI", category: "aisoft",
        desc: "金山出品的国产 AI 办公套件，深度融合文档写作、表格分析和演示生成，对中文学术写作支持完善，高校用户免费。",
        logo: favicon("wps.cn"),
        icon: "fas fa-file-word", color: "#c0392b",
        tags: ["国产", "办公 AI"], pricing: "freemium", region: "domestic",
        rating: 4.3, users: "3000万+", url: "https://ai.wps.cn", isNew: true
    },

    // ---- 智能体管理 ----
    {
        id: 62, name: "Dify", category: "agents",
        desc: "开源 LLM 应用开发平台，可视化编排 AI 工作流，内置 RAG 知识库和 Agent 框架，科研团队快速搭建专属 AI 助手的首选。",
        logo: favicon("dify.ai"),
        icon: "fas fa-diagram-project", color: "#2055d8",
        tags: ["开源", "工作流编排"], pricing: "freemium", region: "foreign",
        rating: 4.7, users: "50万+", url: "https://dify.ai", hot: true, isNew: true
    },
    {
        id: 63, name: "Coze", category: "agents",
        desc: "字节跳动出品的 AI Bot 构建平台，无代码搭建多工具调用 Agent，支持发布到微信/飞书/Discord，国内访问流畅。",
        logo: favicon("coze.cn"),
        icon: "fas fa-robot", color: "#1d4ed8",
        tags: ["无代码", "国产"], pricing: "free", region: "domestic",
        rating: 4.5, users: "100万+", url: "https://www.coze.cn", hot: true
    },
    {
        id: 64, name: "AutoGen", category: "agents",
        desc: "微软开源的多智能体对话框架，可构建 AI 科研 pipeline：文献检索 → 代码生成 → 实验分析 → 报告撰写全自动化，支持人机混合协作。",
        logo: favicon("microsoft.com"),
        icon: "fas fa-network-wired", color: "#0078d4",
        tags: ["开源", "多智能体"], pricing: "free", region: "foreign",
        rating: 4.5, users: "20万+", url: "https://microsoft.github.io/autogen/", isNew: true
    },
    {
        id: 65, name: "CrewAI", category: "agents",
        desc: "基于角色的多 Agent 协作框架，为每个 AI 智能体分配专属角色（研究员/分析师/写作者），高效完成复杂科研任务分解与并行执行。",
        logo: favicon("crewai.com"),
        icon: "fas fa-users-gear", color: "#dc2626",
        tags: ["多角色", "任务分解"], pricing: "freemium", region: "foreign",
        rating: 4.4, users: "10万+", url: "https://crewai.com", isNew: true
    },
    {
        id: 66, name: "FastGPT", category: "agents",
        desc: "国产开源 AI 知识库问答平台，支持上传论文/教材构建私有知识库，提供 API 接口供科研系统集成，部署简便。",
        logo: favicon("fastgpt.in"),
        icon: "fas fa-bolt", color: "#f59e0b",
        tags: ["知识库", "国产开源"], pricing: "freemium", region: "domestic",
        rating: 4.4, users: "30万+", url: "https://fastgpt.in", hot: true
    },
    {
        id: 67, name: "n8n AI", category: "agents",
        desc: "开源工作流自动化平台，内置 AI Agent 节点，可将 LLM 与数据库/API/文件系统连接，构建科研数据采集和分析自动化流水线。",
        logo: favicon("n8n.io"),
        icon: "fas fa-arrows-spin", color: "#ea4b71",
        tags: ["工作流", "自动化"], pricing: "freemium", region: "foreign",
        rating: 4.5, users: "30万+", url: "https://n8n.io"
    },
    {
        id: 68, name: "LangChain", category: "agents",
        desc: "最流行的 LLM 应用开发框架，提供 Chain/Agent/RAG 等核心组件，是构建科研 AI 工具的基础设施，拥有庞大的集成生态。",
        logo: favicon("langchain.com"),
        icon: "fas fa-link", color: "#1c7c54",
        tags: ["开源框架", "RAG"], pricing: "free", region: "foreign",
        rating: 4.6, users: "100万+", url: "https://langchain.com", hot: true
    },

    // ---- CLI 工具 ----
    {
        id: 69, name: "Claude Code", category: "cli",
        desc: "Anthropic 官方 CLI，在终端中直接使用 Claude 进行代码编写、调试、重构，支持读取整个代码库上下文，科研编程的终极 CLI 助手。",
        logo: favicon("anthropic.com"),
        icon: "fas fa-terminal", color: "#7c5cfc",
        tags: ["CLI", "代码编程"], pricing: "freemium", region: "foreign",
        rating: 4.8, users: "50万+", url: "https://docs.anthropic.com/claude-code", hot: true, isNew: true
    },
    {
        id: 70, name: "Aider", category: "cli",
        desc: "终端 AI 结对编程工具，可与 Git 仓库协作，自动理解代码上下文、生成提交，支持 GPT-4/Claude/DeepSeek，科研代码开发效率利器。",
        logo: favicon("aider.chat"),
        icon: "fas fa-code-branch", color: "#059669",
        tags: ["CLI", "结对编程"], pricing: "free", region: "foreign",
        rating: 4.6, users: "10万+", url: "https://aider.chat", isNew: true
    },
    {
        id: 71, name: "Ollama", category: "cli",
        desc: "本地大模型运行工具，一条命令下载并运行 Llama3/Mistral/DeepSeek 等模型，无需 GPU 可用 CPU 推理，数据完全本地保护隐私。",
        logo: favicon("ollama.com"),
        icon: "fas fa-cube", color: "#333",
        tags: ["本地模型", "隐私保护"], pricing: "free", region: "foreign",
        rating: 4.7, users: "100万+", url: "https://ollama.com", hot: true, isNew: true
    },
    {
        id: 72, name: "Shell GPT (sgpt)", category: "cli",
        desc: "命令行 AI 工具，直接在终端询问 AI、生成 shell 命令、执行代码，支持管道操作，将 AI 融入日常科研 Linux/Mac 工作流。",
        logo: favicon("github.com"),
        icon: "fas fa-hashtag", color: "#6b7280",
        tags: ["Shell", "命令生成"], pricing: "free", region: "foreign",
        rating: 4.4, users: "5万+", url: "https://github.com/TheR1D/shell_gpt"
    },
    {
        id: 73, name: "LLM (CLI)", category: "cli",
        desc: "Simon Willison 出品的 LLM 命令行工具，支持调用 100+ 模型 API，内置日志、模板、插件系统，科研脚本批量调用 AI 的最佳工具。",
        logo: favicon("llm.datasette.io"),
        icon: "fas fa-terminal", color: "#4f6ef7",
        tags: ["多模型", "批量调用"], pricing: "free", region: "foreign",
        rating: 4.5, users: "3万+", url: "https://llm.datasette.io", isNew: true
    },
    {
        id: 74, name: "GitHub Copilot CLI", category: "cli",
        desc: "GitHub Copilot 的命令行版本，用自然语言描述需求自动生成 shell/git/gh 命令，支持解释和调试复杂命令，降低 CLI 学习门槛。",
        logo: favicon("github.com"),
        icon: "fab fa-github", color: "#333",
        tags: ["CLI", "命令生成"], pricing: "paid", region: "foreign",
        rating: 4.5, users: "100万+", url: "https://docs.github.com/en/copilot/github-copilot-in-the-cli"
    },

    // ---- 论文写作增强 (75-80) ----
    { id: 75, name: "Quillbot", category: "writing", desc: "AI 改写工具，支持论文语句优化、学术表达提升、避免抄袭检查，支持多种学术写作风格。", logo: favicon("quillbot.com"), icon: "fas fa-edit", color: "#0066cc", tags: ["改写", "降重"], pricing: "freemium", region: "foreign", rating: 4.4, users: "500万+", url: "https://quillbot.com" },
    { id: 76, name: "DeepL Write", category: "writing", desc: "DeepL 推出的学术写作增强工具，提供语法改正、措辞建议和流畅性优化，支持多语言学术写作。", logo: favicon("deepl.com"), icon: "fas fa-language", color: "#002e7d", tags: ["翻译", "润色"], pricing: "freemium", region: "foreign", rating: 4.6, users: "300万+", url: "https://www.deepl.com/write", isNew: true },
    { id: 77, name: "Grammarly", category: "writing", desc: "全球最受欢迎的语法检查工具，支持学术写作模式，提供实时拼写、语法、标点和风格建议。", logo: favicon("grammarly.com"), icon: "fas fa-check", color: "#15c39a", tags: ["语法检查", "写作助手"], pricing: "freemium", region: "foreign", rating: 4.7, users: "1000万+", url: "https://www.grammarly.com" },
    { id: 78, name: "Turnitin", category: "writing", desc: "学术查重和论文提交系统，识别引用不当和可能的抄袭，被全球高校广泛采用。", logo: favicon("turnitin.com"), icon: "fas fa-shield-alt", color: "#cc0000", tags: ["查重", "反抄袭"], pricing: "paid", region: "foreign", rating: 4.5, users: "200万+", url: "https://www.turnitin.com" },
    { id: 79, name: "Copyscape", category: "writing", desc: "强大的抄袭检测工具，扫描互联网中的重复内容，确保论文原创性。", logo: favicon("copyscape.com"), icon: "fas fa-copy", color: "#4267b2", tags: ["查重", "原创性"], pricing: "freemium", region: "foreign", rating: 4.3, users: "50万+", url: "https://www.copyscape.com" },
    { id: 80, name: "Wordtune", category: "writing", desc: "AI 驱动的句式改写工具，一键优化学术表达，支持保留原意基础上提升专业性。", logo: favicon("wordtune.com"), icon: "fas fa-wand-magic-sparkles", color: "#6c5ce7", tags: ["改写", "AI写作"], pricing: "freemium", region: "foreign", rating: 4.5, users: "100万+", url: "https://www.wordtune.com" },

    // ---- 文献阅读增强 (81-85) ----
    { id: 81, name: "Semantic Scholar", category: "reading", desc: "AI 驱动的学术搜索引擎，从海量论文中推荐相关工作，支持引用智能排序和影响力分析。", logo: favicon("semanticscholar.org"), icon: "fas fa-brain", color: "#4c6ef5", tags: ["文献检索", "引用分析"], pricing: "free", region: "foreign", rating: 4.6, users: "500万+", url: "https://www.semanticscholar.org" },
    { id: 82, name: "Zotero", category: "reading", desc: "开源文献管理工具，支持自动标签、全文搜索、团队协作，深度集成 Word 和 Google Docs。", logo: favicon("zotero.org"), icon: "fas fa-folder-open", color: "#cc2927", tags: ["文献管理", "开源"], pricing: "free", region: "foreign", rating: 4.7, users: "200万+", url: "https://www.zotero.org" },
    { id: 83, name: "Mendeley", category: "reading", desc: "Elsevier 旗下文献管理平台，支持 PDF 标注、合作阅读、云端同步和发现相关论文推荐。", logo: favicon("mendeley.com"), icon: "fas fa-book-bookmark", color: "#b71c1c", tags: ["文献管理", "云端同步"], pricing: "freemium", region: "foreign", rating: 4.5, users: "300万+", url: "https://www.mendeley.com" },
    { id: 84, name: "Notion AI", category: "reading", desc: "Notion 内置 AI，支持在笔记中提问、总结论文要点、自动分类整理阅读记录。", logo: favicon("notion.so"), icon: "fas fa-lightbulb", color: "#000000", tags: ["笔记管理", "AI助手"], pricing: "freemium", region: "foreign", rating: 4.5, users: "500万+", url: "https://www.notion.so" },
    { id: 85, name: "PubMed", category: "reading", desc: "NIH 维护的生物医学文献免费数据库，包含 3000+ 万条记录，支持高级搜索和 AI 引导检索。", logo: favicon("pubmed.ncbi.nlm.nih.gov"), icon: "fas fa-flask", color: "#0072b5", tags: ["文献检索", "生物医学"], pricing: "free", region: "foreign", rating: 4.6, users: "1000万+", url: "https://pubmed.ncbi.nlm.nih.gov" },

    // ---- 数据分析工具增强 (86-95) ----
    { id: 86, name: "Google Colab", category: "data", desc: "免费云端 Jupyter 环境，提供 GPU/TPU 加速，集成 GitHub 导入和 Google Drive 联动，无需本地配置。", logo: favicon("colab.research.google.com"), icon: "fab fa-google", color: "#4285f4", tags: ["数据分析", "云计算"], pricing: "free", region: "foreign", rating: 4.7, users: "500万+", url: "https://colab.research.google.com", hot: true },
    { id: 87, name: "Kaggle", category: "data", desc: "数据科学竞赛平台，汇聚数据集、笔记本和讨论，支持协作竞赛和技能展示。", logo: favicon("kaggle.com"), icon: "fas fa-chart-bar", color: "#20beff", tags: ["数据竞赛", "数据集"], pricing: "free", region: "foreign", rating: 4.5, users: "300万+", url: "https://www.kaggle.com" },
    { id: 88, name: "Plotly", category: "data", desc: "交互式可视化库，支持 Python/R/JavaScript，生成出版级质量的图表和仪表板。", logo: favicon("plotly.com"), icon: "fas fa-chart-line", color: "#003fff", tags: ["数据可视化", "交互图表"], pricing: "freemium", region: "foreign", rating: 4.6, users: "200万+", url: "https://plotly.com" },
    { id: 89, name: "Tableau", category: "data", desc: "企业级 BI 工具，支持自助式数据分析和交互式仪表板，无需编程即可生成专业图表。", logo: favicon("tableau.com"), icon: "fas fa-chart-pie", color: "#ffb81c", tags: ["BI分析", "数据可视化"], pricing: "paid", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.tableau.com" },
    { id: 90, name: "Power BI", category: "data", desc: "微软 BI 解决方案，与 Excel 无缝集成，支持实时数据刷新和协作报告共享。", logo: favicon("powerbi.microsoft.com"), icon: "fab fa-microsoft", color: "#f25022", tags: ["BI分析", "Excel集成"], pricing: "paid", region: "foreign", rating: 4.5, users: "150万+", url: "https://powerbi.microsoft.com" },
    { id: 91, name: "Apache Spark", category: "data", desc: "大数据分析框架，支持分布式计算和机器学习，性能远超 Hadoop MapReduce。", logo: favicon("spark.apache.org"), icon: "fas fa-fire", color: "#e35a31", tags: ["大数据", "分布式"], pricing: "free", region: "foreign", rating: 4.6, users: "50万+", url: "https://spark.apache.org" },
    { id: 92, name: "Pandas Profiling", category: "data", desc: "一行代码生成 EDA 报告，自动分析缺失值、相关性和离群点，提供交互式 HTML 报告。", logo: favicon("pandas-profiling.ydata.ai"), icon: "fas fa-magnifying-glass", color: "#150458", tags: ["数据探索", "EDA"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://pandas-profiling.ydata.ai" },
    { id: 93, name: "Apache Superset", category: "data", desc: "开源数据可视化和 BI 工具，支持多数据库连接和实时刷新，可视化操作无需代码。", logo: favicon("superset.apache.org"), icon: "fas fa-database", color: "#20a0b0", tags: ["BI分析", "开源"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://superset.apache.org" },
    { id: 94, name: "Metabase", category: "data", desc: "简单易用的开源 BI 工具，一分钟连接数据库并创建仪表板，零代码查询。", logo: favicon("metabase.com"), icon: "fas fa-chart-pie", color: "#509ee3", tags: ["BI分析", "开源"], pricing: "freemium", region: "foreign", rating: 4.5, users: "100万+", url: "https://www.metabase.com" },
    { id: 95, name: "Orange Data Mining", category: "data", desc: "可视化数据挖掘工具，拖拽式工作流，支持机器学习和统计分析，免费开源。", logo: favicon("orange.readthedocs.io"), icon: "fas fa-apple", color: "#ff8c00", tags: ["数据挖掘", "可视化"], pricing: "free", region: "foreign", rating: 4.4, users: "30万+", url: "https://orange.readthedocs.io" },

    // ---- 科研绘图增强 (96-105) ----
    { id: 96, name: "Matplotlib", category: "figure", desc: "Python 绘图库，生成出版级质量静态图表，是数据可视化的基础工具。", logo: favicon("matplotlib.org"), icon: "fas fa-chart-area", color: "#1f77b4", tags: ["Python绘图", "开源"], pricing: "free", region: "foreign", rating: 4.5, users: "200万+", url: "https://matplotlib.org" },
    { id: 97, name: "Seaborn", category: "figure", desc: "基于 Matplotlib 的高级绘图库，提供统计图表模板和配色方案，与 Pandas 深度集成。", logo: favicon("seaborn.pydata.org"), icon: "fas fa-palette", color: "#13adc7", tags: ["Python绘图", "统计图"], pricing: "free", region: "foreign", rating: 4.6, users: "150万+", url: "https://seaborn.pydata.org" },
    { id: 98, name: "Graphviz", category: "figure", desc: "图表可视化工具，支持流程图、组织结构图、网络拓扑等，广泛用于科研文档。", logo: favicon("graphviz.org"), icon: "fas fa-diagram-project", color: "#244c5a", tags: ["图表绘制", "开源"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://graphviz.org" },
    { id: 99, name: "Inkscape", category: "figure", desc: "开源矢量图编辑器，用于创建和编辑矢量图形、流程图和科学插图。", logo: favicon("inkscape.org"), icon: "fas fa-pen-fancy", color: "#000000", tags: ["矢量图", "开源"], pricing: "free", region: "foreign", rating: 4.4, users: "100万+", url: "https://inkscape.org" },
    { id: 100, name: "OmniGraffle", category: "figure", desc: "专业图表设计工具，支持流程图、线框图和思维导图，Mac 端最佳绘图软件。", logo: favicon("omnigraffle.com"), icon: "fas fa-shapes", color: "#2a4078", tags: ["专业绘图", "思维导图"], pricing: "paid", region: "foreign", rating: 4.6, users: "30万+", url: "https://www.omnigraffle.com" },
    { id: 101, name: "Adobe Illustrator", category: "figure", desc: "行业标准矢量图设计工具，功能强大，用于创建科学插图和专业图形。", logo: favicon("adobe.com"), icon: "fab fa-adobe", color: "#ff0000", tags: ["专业设计", "付费"], pricing: "paid", region: "foreign", rating: 4.7, users: "500万+", url: "https://www.adobe.com/products/illustrator" },
    { id: 102, name: "ImageMagick", category: "figure", desc: "命令行图像处理工具，支持格式转换、特效处理和批处理，脚本友好。", logo: favicon("imagemagick.org"), icon: "fas fa-image", color: "#52b3d9", tags: ["图像处理", "开源"], pricing: "free", region: "foreign", rating: 4.5, users: "50万+", url: "https://imagemagick.org" },
    { id: 103, name: "Canva", category: "figure", desc: "在线设计工具，提供海量模板和素材，支持快速设计海报、信息图和学术演示。", logo: favicon("canva.com"), icon: "fas fa-magic", color: "#00c4cc", tags: ["在线设计", "模板"], pricing: "freemium", region: "foreign", rating: 4.5, users: "1000万+", url: "https://www.canva.com" },
    { id: 104, name: "Figma", category: "figure", desc: "云端协作设计工具，支持实时协作、原型设计和设计系统管理，越来越多科研小组采用。", logo: favicon("figma.com"), icon: "fas fa-pen-tool", color: "#2c3e50", tags: ["设计工具", "协作"], pricing: "freemium", region: "foreign", rating: 4.6, users: "300万+", url: "https://www.figma.com" },
    { id: 105, name: "Miro", category: "figure", desc: "在线白板工具，支持思维导图、流程图、故事板等，适合团队头脑风暴和项目规划。", logo: favicon("miro.com"), icon: "fas fa-sticky-note", color: "#ffd700", tags: ["白板", "协作"], pricing: "freemium", region: "foreign", rating: 4.5, users: "200万+", url: "https://www.miro.com" },

    // ---- 代码助手增强 (106-120) ----
    { id: 106, name: "GitHub Copilot", category: "code", desc: "AI 代码补全工具，由 OpenAI Codex 驱动，支持 VS Code、Vim 等编辑器，大幅提高编码效率。", logo: favicon("github.com"), icon: "fab fa-github", color: "#333", tags: ["代码补全", "GitHub"], pricing: "paid", region: "foreign", rating: 4.7, users: "100万+", url: "https://github.com/features/copilot", hot: true },
    { id: 107, name: "CodeBERT", category: "code", desc: "微软开源的代码理解模型，支持代码搜索、克隆检测和代码标签预测。", logo: favicon("microsoft.com"), icon: "fab fa-microsoft", color: "#0078d4", tags: ["代码分析", "开源"], pricing: "free", region: "foreign", rating: 4.5, users: "20万+", url: "https://github.com/microsoft/CodeBERT" },
    { id: 108, name: "Tabnine", category: "code", desc: "AI 代码补全工具，支持多种编程语言和编辑器，可离线使用专业版。", logo: favicon("tabnine.com"), icon: "fas fa-code", color: "#1976d2", tags: ["代码补全", "多语言"], pricing: "freemium", region: "foreign", rating: 4.4, users: "50万+", url: "https://www.tabnine.com" },
    { id: 109, name: "Codeium", category: "code", desc: "免费 AI 代码补全工具，不逊于付费工具，支持 70+ 编程语言和 40+ 编辑器。", logo: favicon("codeium.com"), icon: "fas fa-laptop-code", color: "#06b6d4", tags: ["代码补全", "免费"], pricing: "freemium", region: "foreign", rating: 4.5, users: "100万+", url: "https://codeium.com" },
    { id: 110, name: "Copilot Chat", category: "code", desc: "GitHub Copilot 的对话式编码助手，实时代码解释、生成和修复建议。", logo: favicon("github.com"), icon: "fab fa-github", color: "#333", tags: ["代码助手", "对话"], pricing: "paid", region: "foreign", rating: 4.6, users: "50万+", url: "https://github.com/features/copilot" },
    { id: 111, name: "AWS CodeWhisperer", category: "code", desc: "亚马逊推出的 AI 代码生成器，免费个人使用，支持 15+ 编程语言。", logo: favicon("aws.amazon.com"), icon: "fab fa-aws", color: "#ff9900", tags: ["代码补全", "云服务"], pricing: "freemium", region: "foreign", rating: 4.4, users: "30万+", url: "https://aws.amazon.com/codewhisperer/", isNew: true },
    { id: 112, name: "StackBlitz", category: "code", desc: "在线 IDE，支持 Node.js、Angular、React 等，无需本地安装即可开发和分享代码。", logo: favicon("stackblitz.com"), icon: "fas fa-bolt", color: "#00c0ff", tags: ["在线IDE", "Web开发"], pricing: "freemium", region: "foreign", rating: 4.5, users: "50万+", url: "https://stackblitz.com" },
    { id: 113, name: "Repl.it", category: "code", desc: "在线编程环境，支持 50+ 编程语言，适合学习和快速原型开发。", logo: favicon("replit.com"), icon: "fas fa-terminal", color: "#ff0000", tags: ["在线IDE", "学习平台"], pricing: "freemium", region: "foreign", rating: 4.4, users: "100万+", url: "https://replit.com" },
    { id: 114, name: "Visual Studio Code", category: "code", desc: "微软开源代码编辑器，轻量级但功能强大，支持众多扩展，是研究人员的首选。", logo: favicon("code.visualstudio.com"), icon: "fas fa-code", color: "#0078d4", tags: ["编辑器", "开源"], pricing: "free", region: "foreign", rating: 4.8, users: "500万+", url: "https://code.visualstudio.com" },
    { id: 115, name: "JetBrains IDEs", category: "code", desc: "专业集成开发环境，包括 PyCharm、IntelliJ 等，提供强大的代码分析和重构工具。", logo: favicon("jetbrains.com"), icon: "fas fa-hammer", color: "#21d4fd", tags: ["IDE", "专业开发"], pricing: "paid", region: "foreign", rating: 4.7, users: "200万+", url: "https://www.jetbrains.com" },
    { id: 116, name: "Vim", category: "code", desc: "高效文本编辑器，学习曲线陡但生产力高，被全球开发者广泛使用。", logo: favicon("vim.org"), icon: "fas fa-edit", color: "#019833", tags: ["编辑器", "开源"], pricing: "free", region: "foreign", rating: 4.6, users: "200万+", url: "https://www.vim.org" },
    { id: 117, name: "Neovim", category: "code", desc: "Vim 的现代化分支，改进了可扩展性和用户体验，支持 Lua 脚本和异步处理。", logo: favicon("neovim.io"), icon: "fas fa-terminal", color: "#57a143", tags: ["编辑器", "开源"], pricing: "free", region: "foreign", rating: 4.5, users: "50万+", url: "https://neovim.io" },
    { id: 118, name: "GitKraken", category: "code", desc: "可视化 Git 客户端，简化版本控制操作，支持 GitHub、GitLab、Bitbucket。", logo: favicon("gitkraken.com"), icon: "fas fa-code-branch", color: "#179287", tags: ["版本控制", "Git"], pricing: "freemium", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.gitkraken.com" },
    { id: 119, name: "GitPod", category: "code", desc: "云端开发环境，一键启动预配置的开发容器，无需本地配置即可编码。", logo: favicon("gitpod.io"), icon: "fas fa-cloud", color: "#ffb45b", tags: ["云IDE", "DevOps"], pricing: "freemium", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.gitpod.io" },
    { id: 120, name: "Docker", category: "code", desc: "容器化技术，打包应用环境确保跨机器一致性，是现代科研计算的基础。", logo: favicon("docker.com"), icon: "fab fa-docker", color: "#2496ed", tags: ["容器化", "DevOps"], pricing: "freemium", region: "foreign", rating: 4.7, users: "300万+", url: "https://www.docker.com" },

    // ---- 大语言模型增强 (121-135) ----
    { id: 121, name: "GPT-4", category: "llm", desc: "OpenAI 最强大模型，支持图像输入和 128K 上下文，推理能力业界领先。", logo: favicon("openai.com"), icon: "fas fa-wand-magic-sparkles", color: "#10a37f", tags: ["大模型", "多模态"], pricing: "paid", region: "foreign", rating: 4.9, users: "100万+", url: "https://openai.com", hot: true },
    { id: 122, name: "Gemini Pro", category: "llm", desc: "Google 推出的多模态大模型，免费使用，在推理和编码方面表现出色。", logo: favicon("gemini.google.com"), icon: "fab fa-google", color: "#4285f4", tags: ["大模型", "多模态"], pricing: "freemium", region: "foreign", rating: 4.7, users: "500万+", url: "https://gemini.google.com", hot: true },
    { id: 123, name: "Llama 2", category: "llm", desc: "Meta 开源大模型，可本地部署，性能接近 ChatGPT，社区活跃。", logo: favicon("meta.com"), icon: "fas fa-code", color: "#0084ff", tags: ["开源模型", "本地部署"], pricing: "free", region: "foreign", rating: 4.5, users: "200万+", url: "https://github.com/facebookresearch/llama" },
    { id: 124, name: "Mistral 7B", category: "llm", desc: "高效开源模型，性能超 Llama 2，资源占用少，适合边缘计算场景。", logo: favicon("mistral.ai"), icon: "fas fa-rocket", color: "#ff6b6b", tags: ["开源模型", "高效"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://mistral.ai" },
    { id: 125, name: "Bing Chat", category: "llm", desc: "微软整合 ChatGPT 的搜索引擎，提供实时网络信息和源引用，免费使用。", logo: favicon("bing.com"), icon: "fab fa-windows", color: "#0078d4", tags: ["搜索+AI", "实时信息"], pricing: "free", region: "foreign", rating: 4.5, users: "1000万+", url: "https://www.bing.com/chat" },
    { id: 126, name: "Perplexity AI", category: "llm", desc: "AI 搜索引擎，整合网络实时信息，提供带源引用的答案，适合学术信息查询。", logo: favicon("perplexity.ai"), icon: "fas fa-magnifying-glass", color: "#00d4ff", tags: ["AI搜索", "学术"], pricing: "freemium", region: "foreign", rating: 4.6, users: "500万+", url: "https://www.perplexity.ai", hot: true },
    { id: 127, name: "PyTorch", category: "llm", desc: "深度学习框架，动态计算图设计，支持分布式训练，学术研究首选。", logo: favicon("pytorch.org"), icon: "fas fa-brain", color: "#ee4c2c", tags: ["深度学习", "开源"], pricing: "free", region: "foreign", rating: 4.7, users: "300万+", url: "https://pytorch.org" },
    { id: 128, name: "TensorFlow", category: "llm", desc: "Google 开源深度学习框架，功能完整，支持从研究到生产的全流程。", logo: favicon("tensorflow.org"), icon: "fab fa-google", color: "#ff6f00", tags: ["深度学习", "开源"], pricing: "free", region: "foreign", rating: 4.6, users: "200万+", url: "https://www.tensorflow.org" },
    { id: 129, name: "Hugging Face", category: "llm", desc: "AI 模型库和社区，汇聚数千个预训练模型，是 NLP 研究的中心。", logo: favicon("huggingface.co"), icon: "fas fa-faces-smile", color: "#000000", tags: ["模型库", "社区"], pricing: "freemium", region: "foreign", rating: 4.8, users: "500万+", url: "https://huggingface.co", hot: true },
    { id: 130, name: "Replicate", category: "llm", desc: "无服务器 AI 模型部署平台，支持 API 调用数千个开源模型，按使用次数计费。", logo: favicon("replicate.com"), icon: "fas fa-cloud", color: "#ffffff", tags: ["模型部署", "API"], pricing: "paid", region: "foreign", rating: 4.5, users: "50万+", url: "https://replicate.com", isNew: true },
    { id: 131, name: "Ollama", category: "llm", desc: "本地运行大模型的工具，支持 Llama 2、Mistral 等，简化离线部署流程。", logo: favicon("ollama.ai"), icon: "fas fa-server", color: "#ffffff", tags: ["本地部署", "离线"], pricing: "free", region: "foreign", rating: 4.5, users: "50万+", url: "https://ollama.ai", isNew: true },
    { id: 132, name: "LangChain", category: "llm", desc: "大模型应用开发框架，简化 LLM 链式调用、记忆管理和工具集成。", logo: favicon("langchain.com"), icon: "fas fa-link", color: "#1c3144", tags: ["框架", "LLM应用"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.langchain.com" },
    { id: 133, name: "DeepSeek", category: "llm", desc: "国产顶尖大模型，代码推理能力超 GPT-4o，支持免费 API 调用。", logo: favicon("deepseek.com"), icon: "fas fa-robot", color: "#0055ff", tags: ["国产模型", "代码推理"], pricing: "free", region: "domestic", rating: 4.7, users: "100万+", url: "https://chat.deepseek.com", hot: true },
    { id: 134, name: "通义千问", category: "llm", desc: "阿里开源大模型，支持长文本理解，可本地部署。", logo: favicon("tongyi.aliyun.com"), icon: "fas fa-adn", color: "#ff6600", tags: ["国产模型", "开源"], pricing: "free", region: "domestic", rating: 4.5, users: "200万+", url: "https://tongyi.aliyun.com" },
    { id: 135, name: "文心一言", category: "llm", desc: "百度大模型，支持文本和图像理解，在搜索增强方面优势明显。", logo: favicon("yiyan.baidu.com"), icon: "fab fa-baidu", color: "#2932e1", tags: ["国产模型", "搜索增强"], pricing: "free", region: "domestic", rating: 4.4, users: "300万+", url: "https://yiyan.baidu.com" },

    // ---- AI 图像生成 (136-145) ----
    { id: 136, name: "Midjourney", category: "image-ai", desc: "最先进的 AI 绘画工具，通过文字描述生成高质量图像，支持风格迁移和细节控制。", logo: favicon("midjourney.com"), icon: "fas fa-image", color: "#9333ea", tags: ["AI绘画", "高质量"], pricing: "paid", region: "foreign", rating: 4.8, users: "200万+", url: "https://www.midjourney.com", hot: true },
    { id: 137, name: "DALL-E 3", category: "image-ai", desc: "OpenAI 图像生成模型，集成于 ChatGPT，支持多风格生成和编辑功能。", logo: favicon("openai.com"), icon: "fas fa-wand-magic-sparkles", color: "#10a37f", tags: ["AI绘画", "集成ChatGPT"], pricing: "paid", region: "foreign", rating: 4.7, users: "100万+", url: "https://openai.com" },
    { id: 138, name: "Stable Diffusion", category: "image-ai", desc: "开源图像生成模型，可本地部署，支持自定义训练，社区活跃。", logo: favicon("stability.ai"), icon: "fas fa-palette", color: "#ffffff", tags: ["开源模型", "本地部署"], pricing: "free", region: "foreign", rating: 4.6, users: "300万+", url: "https://stability.ai" },
    { id: 139, name: "Adobe Firefly", category: "image-ai", desc: "Adobe 推出的生成式 AI，集成 Photoshop 和 Express，支持创意编辑。", logo: favicon("adobe.com"), icon: "fab fa-adobe", color: "#ff0000", tags: ["AI编辑", "Adobe集成"], pricing: "freemium", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.adobe.com/products/firefly" },
    { id: 140, name: "Fotor AI", category: "image-ai", desc: "免费在线 AI 图像生成工具，支持图像增强、背景移除和风格转换。", logo: favicon("fotor.com"), icon: "fas fa-magic", color: "#0099ff", tags: ["在线工具", "免费"], pricing: "freemium", region: "foreign", rating: 4.4, users: "100万+", url: "https://www.fotor.com" },
    { id: 141, name: "Lexica", category: "image-ai", desc: "Stable Diffusion 图像搜索和生成平台，提供丰富的提示词库和示例。", logo: favicon("lexica.art"), icon: "fas fa-images", color: "#000000", tags: ["图像搜索", "提示词库"], pricing: "free", region: "foreign", rating: 4.5, users: "50万+", url: "https://lexica.art" },
    { id: 142, name: "RunwayML", category: "image-ai", desc: "多模态 AI 创意工具，支持图像生成、视频编辑和动画制作。", logo: favicon("runwayml.com"), icon: "fas fa-film", color: "#000000", tags: ["多模态", "视频编辑"], pricing: "freemium", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.runwayml.com", isNew: true },
    { id: 143, name: "Imagine API", category: "image-ai", desc: "通用 AI 图像生成 API，支持集成到应用中，按请求计费。", logo: favicon("imagine.art"), icon: "fas fa-code", color: "#0066cc", tags: ["API", "开发者"], pricing: "paid", region: "foreign", rating: 4.4, users: "20万+", url: "https://www.imagine.art" },
    { id: 144, name: "Leonardo.AI", category: "image-ai", desc: "专业级 AI 图像生成工具，支持细节控制、模型训练和商业使用。", logo: favicon("leonardo.ai"), icon: "fas fa-paintbrush", color: "#000000", tags: ["专业工具", "商业使用"], pricing: "freemium", region: "foreign", rating: 4.6, users: "50万+", url: "https://leonardo.ai", isNew: true },
    { id: 145, name: "Pixlr AI", category: "image-ai", desc: "集成 AI 的在线图像编辑工具，支持背景移除、超分辨率和智能修复。", logo: favicon("pixlr.com"), icon: "fas fa-expand", color: "#0099ff", tags: ["在线编辑", "AI修复"], pricing: "freemium", region: "foreign", rating: 4.4, users: "100万+", url: "https://pixlr.com" },

    // ---- 视频生成与编辑 (146-155) ----
    { id: 146, name: "Synthesia", category: "video", desc: "AI 视频生成平台，支持虚拟形象、多语言配音，适合教学视频和营销内容。", logo: favicon("synthesia.io"), icon: "fas fa-video", color: "#6366f1", tags: ["视频生成", "虚拟形象"], pricing: "paid", region: "foreign", rating: 4.6, users: "50万+", url: "https://www.synthesia.io", hot: true },
    { id: 147, name: "D-ID", category: "video", desc: "AI 数字人视频生成工具，支持从文本或图像生成会说话的虚拟人物。", logo: favicon("d-id.com"), icon: "fas fa-person-circle-plus", color: "#000000", tags: ["数字人", "视频生成"], pricing: "freemium", region: "foreign", rating: 4.5, users: "30万+", url: "https://www.d-id.com" },
    { id: 148, name: "HeyGen", category: "video", desc: "AI 视频生成助手，支持多种真人形象和语言，适合快速制作宣传视频。", logo: favicon("heygen.com"), icon: "fas fa-clapperboard", color: "#0055ff", tags: ["视频生成", "真人形象"], pricing: "freemium", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.heygen.com", isNew: true },
    { id: 149, name: "Descript", category: "video", desc: "基于文本的视频编辑工具，支持自动转录、剪辑和字幕生成。", logo: favicon("descript.com"), icon: "fas fa-scissors", color: "#2563eb", tags: ["视频编辑", "转录"], pricing: "freemium", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.descript.com" },
    { id: 150, name: "Adobe Premiere Pro", category: "video", desc: "专业视频编辑软件，支持 4K 编辑、效果合成和动态图形，行业标准。", logo: favicon("adobe.com"), icon: "fab fa-adobe", color: "#ff0000", tags: ["专业编辑", "4K"], pricing: "paid", region: "foreign", rating: 4.7, users: "200万+", url: "https://www.adobe.com/products/premiere" },
    { id: 151, name: "DaVinci Resolve", category: "video", desc: "免费专业级视频编辑软件，支持色彩分级、动画和音频处理。", logo: favicon("blackmagicdesign.com"), icon: "fas fa-film", color: "#000000", tags: ["免费编辑", "专业"], pricing: "freemium", region: "foreign", rating: 4.7, users: "100万+", url: "https://www.blackmagicdesign.com/products/davinciresolve" },
    { id: 152, name: "Final Cut Pro", category: "video", desc: "Mac 平台专业视频编辑工具，性能优异，支持 8K 编辑。", logo: favicon("apple.com"), icon: "fab fa-apple", color: "#000000", tags: ["Mac专属", "8K编辑"], pricing: "paid", region: "foreign", rating: 4.6, users: "50万+", url: "https://www.apple.com/final-cut-pro" },
    { id: 153, name: "CapCut", category: "video", desc: "全能视频编辑 App，支持特效、字幕、音乐库，在创意工作者中广受欢迎。", logo: favicon("capcut.com"), icon: "fas fa-mobile", color: "#000000", tags: ["移动应用", "特效"], pricing: "free", region: "foreign", rating: 4.7, users: "1000万+", url: "https://www.capcut.com" },
    { id: 154, name: "OpusClip", category: "video", desc: "AI 长视频短视频分割工具，自动识别精彩片段并优化社交媒体格式。", logo: favicon("opusclip.com"), icon: "fas fa-video", color: "#ff6b35", tags: ["AI剪辑", "短视频"], pricing: "freemium", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.opusclip.com", isNew: true },
    { id: 155, name: "Runway Gen-2", category: "video", desc: "AI 视频生成模型，支持从文本或图像生成视频内容。", logo: favicon("runwayml.com"), icon: "fas fa-sparkles", color: "#000000", tags: ["AI视频生成", "文本到视频"], pricing: "paid", region: "foreign", rating: 4.6, users: "50万+", url: "https://www.runwayml.com" },

    // ---- 语音与翻译 (156-165) ----
    { id: 156, name: "ElevenLabs", category: "voice", desc: "最自然的 AI 语音合成平台，支持多种语言和音色，适合有声书和视频配音。", logo: favicon("elevenlabs.io"), icon: "fas fa-volume-high", color: "#1f81ff", tags: ["语音合成", "配音"], pricing: "freemium", region: "foreign", rating: 4.7, users: "100万+", url: "https://elevenlabs.io", hot: true },
    { id: 157, name: "Google Translate", category: "voice", desc: "谷歌翻译，支持 100+ 语言实时翻译，支持语音输入和输出。", logo: favicon("google.com"), icon: "fas fa-language", color: "#4285f4", tags: ["翻译", "多语言"], pricing: "free", region: "foreign", rating: 4.6, users: "5000万+", url: "https://translate.google.com" },
    { id: 158, name: "DeepL", category: "voice", desc: "专业翻译工具，翻译质量超谷歌，支持 26 种语言和多种格式。", logo: favicon("deepl.com"), icon: "fas fa-book", color: "#002e7d", tags: ["翻译", "专业"], pricing: "freemium", region: "foreign", rating: 4.7, users: "500万+", url: "https://www.deepl.com" },
    { id: 159, name: "Whisper", category: "voice", desc: "OpenAI 开源语音识别模型，支持 99 种语言，准确率行业领先。", logo: favicon("openai.com"), icon: "fas fa-microphone", color: "#10a37f", tags: ["语音识别", "开源"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://openai.com/research/whisper" },
    { id: 160, name: "Descript Audio", category: "voice", desc: "AI 音频编辑工具，支持自动转录、降噪和音声合成。", logo: favicon("descript.com"), icon: "fas fa-microphone-slash", color: "#2563eb", tags: ["音频编辑", "转录"], pricing: "freemium", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.descript.com" },
    { id: 161, name: "Murf AI", category: "voice", desc: "AI 语音生成平台，支持 120+ 真人音色和多语言配音。", logo: favicon("murf.ai"), icon: "fas fa-headphones", color: "#ff6600", tags: ["语音合成", "配音"], pricing: "freemium", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.murf.ai", isNew: true },
    { id: 162, name: "Papago", category: "voice", desc: "Naver 翻译工具，亚洲语言支持优秀，支持语音和图像翻译。", logo: favicon("papago.naver.com"), icon: "fas fa-globe", color: "#1ec800", tags: ["翻译", "亚洲语言"], pricing: "free", region: "foreign", rating: 4.5, users: "200万+", url: "https://papago.naver.com" },
    { id: 163, name: "Microsoft Translator", category: "voice", desc: "微软翻译工具，支持 100+ 语言和实时对话翻译。", logo: favicon("microsoft.com"), icon: "fab fa-microsoft", color: "#0078d4", tags: ["翻译", "对话翻译"], pricing: "free", region: "foreign", rating: 4.4, users: "100万+", url: "https://www.microsoft.com/en-us/translator" },
    { id: 164, name: "Amazon Transcribe", category: "voice", desc: "AWS 云端语音识别服务，支持自定义词汇和行业特定术语。", logo: favicon("aws.amazon.com"), icon: "fab fa-aws", color: "#ff9900", tags: ["语音识别", "云服务"], pricing: "paid", region: "foreign", rating: 4.5, users: "30万+", url: "https://aws.amazon.com/transcribe/" },
    { id: 165, name: "NotebookLM Audio Overview", category: "voice", desc: "Google NotebookLM 推出的音频概览功能，将文档转换为对话式音频。", logo: favicon("notebooklm.google.com"), icon: "fas fa-podcast", color: "#4285f4", tags: ["音频生成", "文档转换"], pricing: "free", region: "foreign", rating: 4.5, users: "50万+", url: "https://notebooklm.google.com", isNew: true },

    // ---- 知识管理与笔记 (166-175) ----
    { id: 166, name: "Obsidian", category: "data", desc: "本地 Markdown 笔记工具，支持双向链接、图谱视图，知识管理利器。", logo: favicon("obsidian.md"), icon: "fas fa-brain", color: "#483699", tags: ["笔记", "知识管理"], pricing: "freemium", region: "foreign", rating: 4.7, users: "200万+", url: "https://obsidian.md" },
    { id: 167, name: "Roam Research", category: "data", desc: "块级笔记工具，支持双向链接和网络视图，适合研究人员组织思想。", logo: favicon("roamresearch.com"), icon: "fas fa-map", color: "#5551ff", tags: ["笔记", "思维导图"], pricing: "paid", region: "foreign", rating: 4.5, users: "50万+", url: "https://roamresearch.com" },
    { id: 168, name: "Logseq", category: "data", desc: "开源块级笔记工具，支持 Markdown 和双向链接，免费且隐私优先。", logo: favicon("logseq.com"), icon: "fas fa-pen-clip", color: "#1890ff", tags: ["笔记", "开源"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://logseq.com" },
    { id: 169, name: "OneNote", category: "data", desc: "微软云端笔记工具，支持多设备同步、协作和丰富的格式。", logo: favicon("onenote.com"), icon: "fab fa-microsoft", color: "#0078d4", tags: ["笔记", "云端同步"], pricing: "free", region: "foreign", rating: 4.4, users: "500万+", url: "https://www.onenote.com" },
    { id: 170, name: "Evernote", category: "data", desc: "功能丰富的笔记应用，支持网页剪辑、OCR 和团队协作。", logo: favicon("evernote.com"), icon: "fas fa-leaf", color: "#00a82e", tags: ["笔记", "网页剪辑"], pricing: "freemium", region: "foreign", rating: 4.3, users: "300万+", url: "https://evernote.com" },
    { id: 171, name: "Slite", category: "data", desc: "团队知识库工具，支持智能搜索和内容组织，适合科研团队。", logo: favicon("slite.com"), icon: "fas fa-book", color: "#5551ff", tags: ["知识库", "团队"], pricing: "paid", region: "foreign", rating: 4.5, users: "20万+", url: "https://www.slite.com" },
    { id: 172, name: "Confluence", category: "data", desc: "Atlassian 企业级知识库，支持团队协作、版本控制和权限管理。", logo: favicon("atlassian.com"), icon: "fas fa-book-open", color: "#0052cc", tags: ["知识库", "企业"], pricing: "paid", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.atlassian.com/software/confluence" },
    { id: 173, name: "Gitbook", category: "data", desc: "在线文档编辑和发布平台，支持 Git 集成和团队协作。", logo: favicon("gitbook.com"), icon: "fas fa-code-branch", color: "#3884ff", tags: ["文档", "Git"], pricing: "freemium", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.gitbook.com" },
    { id: 174, name: "Notion Advanced", category: "data", desc: "Notion 进阶模板和插件，用户社区贡献的各类学术研究模板。", logo: favicon("notion.so"), icon: "fas fa-star", color: "#000000", tags: ["Notion模板", "社区"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://notion.so" },
    { id: 175, name: "Bear", category: "data", desc: "轻量级 Markdown 笔记 App，设计精美，支持标签和任务管理。", logo: favicon("bear.app"), icon: "fas fa-paw", color: "#7d4e2d", tags: ["笔记", "Mac"], pricing: "paid", region: "foreign", rating: 4.6, users: "50万+", url: "https://bear.app" },

    // ---- AI 助手与智能体 (176-195) ----
    { id: 176, name: "AutoGPT", category: "agents", desc: "自主 AI 代理，可自主规划和执行任务，无需人工干预。", logo: favicon("github.com"), icon: "fas fa-robot", color: "#333", tags: ["AI代理", "自主"], pricing: "free", region: "foreign", rating: 4.4, users: "100万+", url: "https://github.com/Significant-Gravitas/Auto-GPT" },
    { id: 177, name: "BabyAGI", category: "agents", desc: "极简 AI 任务管理系统，支持任务列表、优先级排序和执行。", logo: favicon("github.com"), icon: "fas fa-tasks", color: "#333", tags: ["AI代理", "开源"], pricing: "free", region: "foreign", rating: 4.3, users: "50万+", url: "https://github.com/yoheinakajima/babyagi" },
    { id: 178, name: "AgentGPT", category: "agents", desc: "浏览器中运行的 AI 代理，支持设置目标和观察结果，无需编程。", logo: favicon("agentgpt.reworkd.ai"), icon: "fas fa-laptop", color: "#4f46e5", tags: ["AI代理", "无代码"], pricing: "free", region: "foreign", rating: 4.3, users: "50万+", url: "https://agentgpt.reworkd.ai" },
    { id: 179, name: "MetaGPT", category: "agents", desc: "多代理协作框架，支持角色分配和工作流自动化。", logo: favicon("github.com"), icon: "fas fa-people-group", color: "#333", tags: ["多代理", "协作"], pricing: "free", region: "foreign", rating: 4.3, users: "50万+", url: "https://github.com/geekan/MetaGPT" },
    { id: 180, name: "TaskWeaver", category: "agents", desc: "微软 AI 协作框架，支持代码执行和任务规划。", logo: favicon("microsoft.com"), icon: "fab fa-microsoft", color: "#0078d4", tags: ["框架", "任务规划"], pricing: "free", region: "foreign", rating: 4.4, users: "30万+", url: "https://github.com/microsoft/TaskWeaver" },
    { id: 181, name: "Dify", category: "agents", desc: "开源 LLM 应用开发平台，支持可视化工作流和代理编排。", logo: favicon("dify.ai"), icon: "fas fa-diagram-project", color: "#624bfb", tags: ["开发平台", "无代码"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://dify.ai", isNew: true },
    { id: 182, name: "Flowise", category: "agents", desc: "拖拽式 LLM 应用构建器，支持集成各种 AI 模型和工具。", logo: favicon("flowiseai.com"), icon: "fas fa-cube", color: "#3b82f6", tags: ["可视化", "无代码"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://flowiseai.com" },
    { id: 183, name: "Pydantic AI", category: "agents", desc: "Python AI 框架，支持类型检查和验证的 AI 应用开发。", logo: favicon("pydantic-ai.jina.ai"), icon: "fab fa-python", color: "#3776ab", tags: ["框架", "Python"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://pydantic-ai.jina.ai", isNew: true },
    { id: 184, name: "Crew AI", category: "agents", desc: "AI 代理团队框架，支持角色定义和任务分配。", logo: favicon("crewai.io"), icon: "fas fa-people", color: "#ff6b6b", tags: ["多代理", "框架"], pricing: "free", region: "foreign", rating: 4.3, users: "50万+", url: "https://crewai.io", isNew: true },
    { id: 185, name: "Anthropic Prompt Caching", category: "agents", desc: "Claude 的提示缓存功能，减少 API 成本和延迟。", logo: favicon("anthropic.com"), icon: "fas fa-bolt", color: "#7c5cfc", tags: ["优化", "成本"], pricing: "included", region: "foreign", rating: 4.6, users: "50万+", url: "https://anthropic.com" },
    { id: 186, name: "OpenRouter", category: "agents", desc: "统一 LLM API 网关，支持切换多个模型提供商。", logo: favicon("openrouter.ai"), icon: "fas fa-code", color: "#34d399", tags: ["API", "多模型"], pricing: "paid", region: "foreign", rating: 4.5, users: "50万+", url: "https://openrouter.ai" },
    { id: 187, name: "Together AI", category: "agents", desc: "开源模型 API 平台，支持快速部署和细微调整。", logo: favicon("together.ai"), icon: "fas fa-link", color: "#000000", tags: ["API", "开源"], pricing: "paid", region: "foreign", rating: 4.4, users: "30万+", url: "https://together.ai" },
    { id: 188, name: "Modal", category: "agents", desc: "云端函数计算平台，支持快速部署 ML 模型和 API。", logo: favicon("modal.com"), icon: "fas fa-cloud", color: "#ffffff", tags: ["云计算", "API"], pricing: "paid", region: "foreign", rating: 4.4, users: "30万+", url: "https://modal.com" },
    { id: 189, name: "Temporal", category: "agents", desc: "工作流编排框架，支持复杂任务流程和重试逻辑。", logo: favicon("temporal.io"), icon: "fas fa-hourglass", color: "#1589ee", tags: ["工作流", "编排"], pricing: "free", region: "foreign", rating: 4.5, users: "50万+", url: "https://temporal.io" },
    { id: 190, name: "Airflow", category: "agents", desc: "Apache 数据流编排工具，支持 DAG 定义和监控。", logo: favicon("airflow.apache.org"), icon: "fas fa-stream", color: "#017cee", tags: ["工作流", "大数据"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://airflow.apache.org" },

    // ---- 研究工具进阶 (191-210) ----
    { id: 191, name: "Lens Scholar", category: "reading", desc: "学术论文搜索平台，支持开放获取和引用跟踪。", logo: favicon("lens.org"), icon: "fas fa-search", color: "#0066cc", tags: ["论文搜索", "开放获取"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://www.lens.org/scholar" },
    { id: 192, name: "Researchgate", category: "reading", desc: "学术社交网络，支持论文分享、讨论和协作。", logo: favicon("researchgate.net"), icon: "fas fa-people-group", color: "#0a66c2", tags: ["学术社交", "分享"], pricing: "free", region: "foreign", rating: 4.3, users: "2000万+", url: "https://www.researchgate.net" },
    { id: 193, name: "Academia.edu", category: "reading", desc: "学术文章分享平台，拥有全球学术人员数据库。", logo: favicon("academia.edu"), icon: "fas fa-graduation-cap", color: "#ff5733", tags: ["论文分享", "学术"], pricing: "freemium", region: "foreign", rating: 4.2, users: "1500万+", url: "https://www.academia.edu" },
    { id: 194, name: "Google Scholar", category: "reading", desc: "Google 学术搜索，覆盖全球学术出版物。", logo: favicon("scholar.google.com"), icon: "fab fa-google", color: "#4285f4", tags: ["论文搜索", "全球"], pricing: "free", region: "foreign", rating: 4.7, users: "5000万+", url: "https://scholar.google.com" },
    { id: 195, name: "Scopus", category: "reading", desc: "Elsevier 学术索引数据库，覆盖 6000+ 期刊。", logo: favicon("scopus.com"), icon: "fas fa-database", color: "#ff6b35", tags: ["文献索引", "期刊"], pricing: "paid", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.scopus.com" },
    { id: 196, name: "Web of Science", category: "reading", desc: "Clarivate 引文数据库，支持被引文献分析。", logo: favicon("webofscience.com"), icon: "fas fa-globe", color: "#004687", tags: ["引文分析", "期刊"], pricing: "paid", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.webofscience.com" },
    { id: 197, name: "SSRN", category: "reading", desc: "社会科学学术论文库，支持预印本分享。", logo: favicon("ssrn.com"), icon: "fas fa-briefcase", color: "#0066cc", tags: ["预印本", "社会科学"], pricing: "free", region: "foreign", rating: 4.4, users: "100万+", url: "https://www.ssrn.com" },
    { id: 198, name: "bioRxiv", category: "reading", desc: "生物学预印本服务器，发表前论文分享。", logo: favicon("biorxiv.org"), icon: "fas fa-dna", color: "#24aaa0", tags: ["预印本", "生物学"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://www.biorxiv.org" },
    { id: 199, name: "arXiv", category: "reading", desc: "物理、数学、计算机等领域的预印本库。", logo: favicon("arxiv.org"), icon: "fas fa-file-pdf", color: "#b31b1b", tags: ["预印本", "多学科"], pricing: "free", region: "foreign", rating: 4.7, users: "500万+", url: "https://arxiv.org" },
    { id: 200, name: "DOAJ", category: "reading", desc: "开放获取期刊目录，超 2 万种期刊。", logo: favicon("doaj.org"), icon: "fas fa-unlock", color: "#7eb830", tags: ["开放获取", "期刊"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://doaj.org" },

    // ---- 数据库与工具库 (201-220) ----
    { id: 201, name: "Protein Data Bank", category: "data", desc: "蛋白质结构数据库，全球最大的生物分子结构库。", logo: favicon("rcsb.org"), icon: "fas fa-dna", color: "#0071c5", tags: ["数据库", "生物"], pricing: "free", region: "foreign", rating: 4.7, users: "100万+", url: "https://www.rcsb.org" },
    { id: 202, name: "UniProt", category: "data", desc: "蛋白质序列和功能信息数据库。", logo: favicon("uniprot.org"), icon: "fas fa-flask", color: "#cc0080", tags: ["数据库", "蛋白质"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.uniprot.org" },
    { id: 203, name: "NCBI", category: "data", desc: "国家生物技术信息中心，海量生物医学数据。", logo: favicon("ncbi.nlm.nih.gov"), icon: "fas fa-database", color: "#0072b5", tags: ["数据库", "生物医学"], pricing: "free", region: "foreign", rating: 4.7, users: "500万+", url: "https://www.ncbi.nlm.nih.gov" },
    { id: 204, name: "GEO", category: "data", desc: "基因表达数据库，全球最大的微阵列数据库。", logo: favicon("ncbi.nlm.nih.gov"), icon: "fas fa-chart-bar", color: "#0072b5", tags: ["基因表达", "微阵列"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.ncbi.nlm.nih.gov/geo/" },
    { id: 205, name: "TCGA", category: "data", desc: "癌症基因图谱，包含 33 种癌症的组学数据。", logo: favicon("cancer.gov"), icon: "fas fa-dna", color: "#005a9c", tags: ["癌症数据", "基因组"], pricing: "free", region: "foreign", rating: 4.6, users: "50万+", url: "https://www.cancer.gov/tcga" },
    { id: 206, name: "Kaggle Datasets", category: "data", desc: "众多开源数据集库，包括医疗、经济等多领域。", logo: favicon("kaggle.com"), icon: "fas fa-dataset", color: "#20beff", tags: ["数据集", "众多领域"], pricing: "free", region: "foreign", rating: 4.6, users: "500万+", url: "https://www.kaggle.com/datasets" },
    { id: 207, name: "UCI Machine Learning", category: "data", desc: "机器学习数据库，500+ 数据集用于研究。", logo: favicon("archive.ics.uci.edu"), icon: "fas fa-brain", color: "#003d6b", tags: ["ML数据集", "开源"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://archive.ics.uci.edu/ml/" },
    { id: 208, name: "Open Data Europe", category: "data", desc: "欧洲开放数据门户，数百万数据集。", logo: favicon("data.europa.eu"), icon: "fas fa-globe", color: "#003399", tags: ["开放数据", "欧洲"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://data.europa.eu" },
    { id: 209, name: "World Bank Open Data", category: "data", desc: "世界银行开放数据库，全球经济社会数据。", logo: favicon("data.worldbank.org"), icon: "fas fa-bar-chart", color: "#003d99", tags: ["经济数据", "全球"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://data.worldbank.org" },
    { id: 210, name: "Our World in Data", category: "data", desc: "全球发展数据可视化，包含气候、卫生等数据。", logo: favicon("ourworldindata.org"), icon: "fas fa-chart-pie", color: "#e34c26", tags: ["数据可视化", "全球"], pricing: "free", region: "foreign", rating: 4.7, users: "200万+", url: "https://ourworldindata.org" },

    // ---- 开发与部署工具 (211-230) ----
    { id: 211, name: "Vercel", category: "code", desc: "前端部署平台，支持 Next.js、React 等框架一键部署。", logo: favicon("vercel.com"), icon: "fas fa-rocket", color: "#000000", tags: ["部署", "前端"], pricing: "freemium", region: "foreign", rating: 4.7, users: "100万+", url: "https://vercel.com" },
    { id: 212, name: "Netlify", category: "code", desc: "静态网站部署平台，支持自动化 CI/CD。", logo: favicon("netlify.com"), icon: "fas fa-cloud-upload", color: "#00c7b7", tags: ["部署", "静态网站"], pricing: "freemium", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.netlify.com" },
    { id: 213, name: "Heroku", category: "code", desc: "云应用平台，支持快速部署各种应用。", logo: favicon("heroku.com"), icon: "fas fa-cube", color: "#430098", tags: ["云平台", "PaaS"], pricing: "paid", region: "foreign", rating: 4.5, users: "100万+", url: "https://www.heroku.com" },
    { id: 214, name: "DigitalOcean", category: "code", desc: "云计算服务，提供虚拟机、数据库等服务。", logo: favicon("digitalocean.com"), icon: "fas fa-server", color: "#0080ff", tags: ["云计算", "IaaS"], pricing: "paid", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.digitalocean.com" },
    { id: 215, name: "AWS Lambda", category: "code", desc: "无服务器计算，按请求计费运行代码。", logo: favicon("aws.amazon.com"), icon: "fab fa-aws", color: "#ff9900", tags: ["无服务器", "云计算"], pricing: "paid", region: "foreign", rating: 4.6, users: "200万+", url: "https://aws.amazon.com/lambda/" },
    { id: 216, name: "Google Cloud", category: "code", desc: "Google 云平台，提供计算、数据分析等服务。", logo: favicon("cloud.google.com"), icon: "fab fa-google", color: "#4285f4", tags: ["云计算", "IaaS"], pricing: "paid", region: "foreign", rating: 4.6, users: "100万+", url: "https://cloud.google.com" },
    { id: 217, name: "Azure", category: "code", desc: "微软云平台，支持 AI、ML 和数据分析服务。", logo: favicon("azure.microsoft.com"), icon: "fab fa-microsoft", color: "#0078d4", tags: ["云计算", "IaaS"], pricing: "paid", region: "foreign", rating: 4.5, users: "100万+", url: "https://azure.microsoft.com" },
    { id: 218, name: "GitHub", category: "code", desc: "代码托管平台，支持版本控制、CI/CD 和协作。", logo: favicon("github.com"), icon: "fab fa-github", color: "#333", tags: ["代码托管", "协作"], pricing: "freemium", region: "foreign", rating: 4.8, users: "1000万+", url: "https://github.com" },
    { id: 219, name: "GitLab", category: "code", desc: "完整的 DevOps 平台，支持 GitOps 和自动化。", logo: favicon("gitlab.com"), icon: "fab fa-gitlab", color: "#fc6d26", tags: ["代码托管", "DevOps"], pricing: "freemium", region: "foreign", rating: 4.6, users: "100万+", url: "https://gitlab.com" },
    { id: 220, name: "Bitbucket", category: "code", desc: "Atlassian 代码托管，集成 Jira 和其他工具。", logo: favicon("bitbucket.org"), icon: "fas fa-code-branch", color: "#0052cc", tags: ["代码托管", "集成"], pricing: "freemium", region: "foreign", rating: 4.4, users: "100万+", url: "https://bitbucket.org" },

    // ---- 研究管理与评估 (221-240) ----
    { id: 221, name: "ResearchGate Metrics", category: "reading", desc: "论文指标跟踪，显示下载量、引用和影响力。", logo: favicon("researchgate.net"), icon: "fas fa-chart-line", color: "#0a66c2", tags: ["论文指标", "影响力"], pricing: "free", region: "foreign", rating: 4.4, users: "100万+", url: "https://www.researchgate.net" },
    { id: 222, name: "Sci-Hub", category: "reading", desc: "论文下载工具，提供免费论文访问（存在法律争议）。", logo: favicon("sci-hub.ee"), icon: "fas fa-book", color: "#000000", tags: ["论文获取", "争议"], pricing: "free", region: "foreign", rating: 4.3, users: "1000万+", url: "https://sci-hub.ee" },
    { id: 223, name: "Open Access Button", category: "reading", desc: "开放获取论文查找工具，帮助定位免费版本。", logo: favicon("openaccessbutton.org"), icon: "fas fa-unlock", color: "#2ecc71", tags: ["开放获取", "免费"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://openaccessbutton.org" },
    { id: 224, name: "ORCID", category: "reading", desc: "研究者身份识别系统，链接所有科研成果。", logo: favicon("orcid.org"), icon: "fas fa-id-card", color: "#a6ce39", tags: ["身份识别", "信誉"], pricing: "free", region: "foreign", rating: 4.6, users: "1000万+", url: "https://orcid.org" },
    { id: 225, name: "Altmetric", category: "reading", desc: "论文影响力替代指标，追踪学术和社会媒体讨论。", logo: favicon("altmetric.com"), icon: "fas fa-megaphone", color: "#1abc9c", tags: ["影响力", "社交"], pricing: "paid", region: "foreign", rating: 4.5, users: "50万+", url: "https://www.altmetric.com" },
    { id: 226, name: "Plumx", category: "reading", desc: "多维度论文指标分析，包括下载和转发等。", logo: favicon("plumx.com"), icon: "fas fa-bar-chart", color: "#ea4c4c", tags: ["论文指标", "多维度"], pricing: "paid", region: "foreign", rating: 4.5, users: "30万+", url: "https://plumx.com" },
    { id: 227, name: "Impactstory", category: "reading", desc: "开放获取影响力跟踪，展示研究影响。", logo: favicon("impactstory.org"), icon: "fas fa-star", color: "#009ee0", tags: ["开放获取", "影响力"], pricing: "free", region: "foreign", rating: 4.4, users: "20万+", url: "https://impactstory.org" },
    { id: 228, name: "Journal Citation Reports", category: "reading", desc: "期刊影响因子数据库，比较期刊质量。", logo: favicon("jcr.clarivate.com"), icon: "fas fa-newspaper", color: "#004687", tags: ["期刊指标", "影响因子"], pricing: "paid", region: "foreign", rating: 4.6, users: "50万+", url: "https://jcr.clarivate.com" },
    { id: 229, name: "H-Index Calculator", category: "reading", desc: "计算研究人员的 H-index 指标。", logo: favicon("harzing.com"), icon: "fas fa-calculator", color: "#000000", tags: ["h指数", "计算"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://harzing.com/resources/publish-or-perish" },
    { id: 230, name: "Publish or Perish", category: "reading", desc: "学术出版物引文分析工具。", logo: favicon("harzing.com"), icon: "fas fa-magnifying-glass", color: "#000000", tags: ["引文分析", "指标"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://harzing.com/resources/publish-or-perish" },

    // ---- 学习与教育工具 (231-250) ----
    { id: 231, name: "Coursera", category: "tutorials", desc: "顶级在线学习平台，名校课程和专业认证。", logo: favicon("coursera.org"), icon: "fas fa-graduation-cap", color: "#0056d2", tags: ["在线课程", "名校"], pricing: "freemium", region: "foreign", rating: 4.6, users: "1000万+", url: "https://www.coursera.org" },
    { id: 232, name: "edX", category: "tutorials", desc: "MIT 和哈佛创立的学习平台，高质量课程。", logo: favicon("edx.org"), icon: "fas fa-book-open", color: "#02262b", tags: ["在线课程", "名校"], pricing: "freemium", region: "foreign", rating: 4.6, users: "500万+", url: "https://www.edx.org" },
    { id: 233, name: "Udemy", category: "tutorials", desc: "在线学习市场，数百万课程包括编程和数据科学。", logo: favicon("udemy.com"), icon: "fas fa-laptop", color: "#ec5252", tags: ["在线课程", "多样化"], pricing: "paid", region: "foreign", rating: 4.4, users: "2000万+", url: "https://www.udemy.com" },
    { id: 234, name: "Codecademy", category: "tutorials", desc: "交互式编程学习平台。", logo: favicon("codecademy.com"), icon: "fas fa-code", color: "#1f243e", tags: ["编程学习", "交互式"], pricing: "freemium", region: "foreign", rating: 4.4, users: "300万+", url: "https://www.codecademy.com" },
    { id: 235, name: "LinkedIn Learning", category: "tutorials", desc: "LinkedIn 学习平台，职业发展和技能培训。", logo: favicon("linkedin.com"), icon: "fab fa-linkedin", color: "#0a66c2", tags: ["职业发展", "技能"], pricing: "paid", region: "foreign", rating: 4.4, users: "500万+", url: "https://www.linkedin.com/learning/" },
    { id: 236, name: "Skillshare", category: "tutorials", desc: "创意技能在线学习，包括设计、摄影等。", logo: favicon("skillshare.com"), icon: "fas fa-palette", color: "#f5821f", tags: ["创意技能", "在线课程"], pricing: "freemium", region: "foreign", rating: 4.3, users: "1000万+", url: "https://www.skillshare.com" },
    { id: 237, name: "DataCamp", category: "tutorials", desc: "数据科学和分析在线学习平台。", logo: favicon("datacamp.com"), icon: "fas fa-chart-bar", color: "#2e3440", tags: ["数据科学", "在线课程"], pricing: "paid", region: "foreign", rating: 4.5, users: "300万+", url: "https://www.datacamp.com" },
    { id: 238, name: "Fast.ai", category: "tutorials", desc: "深度学习在线课程，强调实践应用。", logo: favicon("fast.ai"), icon: "fas fa-brain", color: "#000000", tags: ["深度学习", "实践"], pricing: "free", region: "foreign", rating: 4.7, users: "100万+", url: "https://www.fast.ai" },
    { id: 239, name: "MIT OpenCourseWare", category: "tutorials", desc: "MIT 免费开放课程，高质量教学资源。", logo: favicon("ocw.mit.edu"), icon: "fas fa-graduation-cap", color: "#a31f34", tags: ["名校课程", "免费"], pricing: "free", region: "foreign", rating: 4.7, users: "500万+", url: "https://ocw.mit.edu" },
    { id: 240, name: "Khan Academy", category: "tutorials", desc: "免费教育平台，从小学到大学各阶段课程。", logo: favicon("khanacademy.org"), icon: "fas fa-chalkboard", color: "#14bf96", tags: ["免费教育", "全阶段"], pricing: "free", region: "foreign", rating: 4.7, users: "5000万+", url: "https://www.khanacademy.org" },

    // ---- 科学计算与工具库 (241-260) ----
    { id: 241, name: "NumPy", category: "llm", desc: "Python 数值计算库，支持多维数组和矩阵运算。", logo: favicon("numpy.org"), icon: "fab fa-python", color: "#013243", tags: ["数值计算", "开源"], pricing: "free", region: "foreign", rating: 4.8, users: "500万+", url: "https://numpy.org" },
    { id: 242, name: "SciPy", category: "llm", desc: "科学计算库，包括优化、线性代数、信号处理等。", logo: favicon("scipy.org"), icon: "fab fa-python", color: "#1f77b4", tags: ["科学计算", "开源"], pricing: "free", region: "foreign", rating: 4.7, users: "200万+", url: "https://scipy.org" },
    { id: 243, name: "Scikit-learn", category: "llm", desc: "机器学习库，包括分类、回归、聚类等算法。", logo: favicon("scikit-learn.org"), icon: "fab fa-python", color: "#f7931e", tags: ["机器学习", "开源"], pricing: "free", region: "foreign", rating: 4.8, users: "300万+", url: "https://scikit-learn.org" },
    { id: 244, name: "XGBoost", category: "llm", desc: "极限梯度提升框架，支持分布式训练。", logo: favicon("xgboost.readthedocs.io"), icon: "fas fa-bolt", color: "#e34234", tags: ["梯度提升", "开源"], pricing: "free", region: "foreign", rating: 4.7, users: "100万+", url: "https://xgboost.readthedocs.io" },
    { id: 245, name: "LightGBM", category: "llm", desc: "轻量级梯度提升框架，性能快速。", logo: favicon("lightgbm.readthedocs.io"), icon: "fas fa-lightning", color: "#9467bd", tags: ["梯度提升", "高效"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://lightgbm.readthedocs.io" },
    { id: 246, name: "CatBoost", category: "llm", desc: "Yandex 梯度提升框架，支持类别特征。", logo: favicon("catboost.ai"), icon: "fas fa-cat", color: "#ffb81c", tags: ["梯度提升", "开源"], pricing: "free", region: "foreign", rating: 4.6, users: "50万+", url: "https://catboost.ai" },
    { id: 247, name: "Statsmodels", category: "llm", desc: "统计建模库，支持线性模型、时间序列等。", logo: favicon("statsmodels.org"), icon: "fas fa-bar-chart", color: "#3b82f6", tags: ["统计分析", "开源"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.statsmodels.org" },
    { id: 248, name: "Polars", category: "llm", desc: "高性能数据处理库，比 Pandas 更快。", logo: favicon("pola-rs.github.io"), icon: "fas fa-rocket", color: "#cd7f32", tags: ["数据处理", "高性能"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://pola-rs.github.io/polars/" },
    { id: 249, name: "DuckDB", category: "data", desc: "嵌入式 SQL 数据库，支持快速分析查询。", logo: favicon("duckdb.org"), icon: "fas fa-database", color: "#ffce00", tags: ["数据库", "SQL"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://duckdb.org" },
    { id: 250, name: "Rust", category: "code", desc: "系统级编程语言，安全性和性能并兼。", logo: favicon("rust-lang.org"), icon: "fab fa-rust", color: "#ce422b", tags: ["编程语言", "系统编程"], pricing: "free", region: "foreign", rating: 4.7, users: "100万+", url: "https://www.rust-lang.org" },

    // ---- 前沿AI与新兴工具 (251-275) ----
    { id: 251, name: "ChatGPT Plus", category: "llm", desc: "ChatGPT 高级版，支持 GPT-4、文件上传等高级功能。", logo: favicon("openai.com"), icon: "fas fa-star", color: "#10a37f", tags: ["大模型", "高级"], pricing: "paid", region: "foreign", rating: 4.8, users: "500万+", url: "https://openai.com/plus" },
    { id: 252, name: "Claude Pro", category: "llm", desc: "Anthropic 高级订阅，支持更高使用配额和优先级。", logo: favicon("anthropic.com"), icon: "fas fa-crown", color: "#7c5cfc", tags: ["大模型", "高级"], pricing: "paid", region: "foreign", rating: 4.7, users: "100万+", url: "https://anthropic.com" },
    { id: 253, name: "Microsoft 365 Copilot", category: "code", desc: "集成到 Office 的 AI 助手，支持文档生成和分析。", logo: favicon("microsoft.com"), icon: "fab fa-microsoft", color: "#0078d4", tags: ["生产力", "集成"], pricing: "paid", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.microsoft.com/en-us/microsoft-365/business/microsoft-365-copilot" },
    { id: 254, name: "Notion AI", category: "data", desc: "Notion 内置 AI，支持内容生成和总结。", logo: favicon("notion.so"), icon: "fas fa-ai", color: "#000000", tags: ["笔记", "AI助手"], pricing: "paid", region: "foreign", rating: 4.5, users: "500万+", url: "https://www.notion.so/product/ai" },
    { id: 255, name: "Grammarly Premium", category: "writing", desc: "高级语法检查和写作增强工具。", logo: favicon("grammarly.com"), icon: "fas fa-pen", color: "#15c39a", tags: ["写作", "高级"], pricing: "paid", region: "foreign", rating: 4.6, users: "200万+", url: "https://www.grammarly.com/premium" },
    { id: 256, name: "Quillbot Premium", category: "writing", desc: "高级改写工具，支持更多风格和自定义设置。", logo: favicon("quillbot.com"), icon: "fas fa-edit", color: "#0066cc", tags: ["改写", "高级"], pricing: "paid", region: "foreign", rating: 4.5, users: "100万+", url: "https://quillbot.com/premium" },
    { id: 257, name: "Tableau AI", category: "data", desc: "Tableau 内置 AI，自动生成可视化和洞察。", logo: favicon("tableau.com"), icon: "fas fa-magic", color: "#ffb81c", tags: ["BI分析", "AI"], pricing: "included", region: "foreign", rating: 4.6, users: "100万+", url: "https://www.tableau.com" },
    { id: 258, name: "Power BI Copilot", category: "data", desc: "Power BI 内置 Copilot，AI 驱动的数据分析。", logo: favicon("powerbi.microsoft.com"), icon: "fas fa-copilot", color: "#f25022", tags: ["BI分析", "AI"], pricing: "paid", region: "foreign", rating: 4.5, users: "50万+", url: "https://powerbi.microsoft.com" },
    { id: 259, name: "Adobe Firefly Advanced", category: "figure", desc: "Adobe 高级生成式 AI，支持自定义和企业使用。", logo: favicon("adobe.com"), icon: "fas fa-fire", color: "#ff0000", tags: ["生成AI", "高级"], pricing: "paid", region: "foreign", rating: 4.6, users: "50万+", url: "https://www.adobe.com/products/firefly" },
    { id: 260, name: "Jasper AI", category: "writing", desc: "内容营销 AI，支持长文本生成和模板库。", logo: favicon("jasper.ai"), icon: "fas fa-sparkles", color: "#1677ff", tags: ["内容生成", "营销"], pricing: "paid", region: "foreign", rating: 4.5, users: "100万+", url: "https://www.jasper.ai", isNew: true },

    // ---- 社区与论坛 (261-275) ----
    { id: 261, name: "Stack Overflow", category: "code", desc: "程序员问答社区，超 2000 万问题。", logo: favicon("stackoverflow.com"), icon: "fas fa-code", color: "#f48024", tags: ["问答", "社区"], pricing: "free", region: "foreign", rating: 4.7, users: "2000万+", url: "https://stackoverflow.com" },
    { id: 262, name: "Reddit r/science", category: "reading", desc: "科学讨论社区，活跃的学术讨论。", logo: favicon("reddit.com"), icon: "fab fa-reddit", color: "#ff4500", tags: ["讨论", "科学"], pricing: "free", region: "foreign", rating: 4.3, users: "1000万+", url: "https://www.reddit.com/r/science" },
    { id: 263, name: "Cross Validated", category: "data", desc: "统计学和数据科学 Q&A 社区。", logo: favicon("stats.stackexchange.com"), icon: "fas fa-chart-bar", color: "#f48024", tags: ["问答", "统计"], pricing: "free", region: "foreign", rating: 4.5, users: "200万+", url: "https://stats.stackexchange.com" },
    { id: 264, name: "Math Stack Exchange", category: "data", desc: "数学问答社区，海量数学问题和解答。", logo: favicon("math.stackexchange.com"), icon: "fas fa-square-root-alt", color: "#f48024", tags: ["问答", "数学"], pricing: "free", region: "foreign", rating: 4.6, users: "500万+", url: "https://math.stackexchange.com" },
    { id: 265, name: "Biostars", category: "reading", desc: "生物信息学 Q&A 社区，500+ 万问题。", logo: favicon("biostars.org"), icon: "fas fa-dna", color: "#0066cc", tags: ["问答", "生物"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://www.biostars.org" },
    { id: 266, name: "Data Science Stack Exchange", category: "data", desc: "数据科学专业问答社区。", logo: favicon("datascience.stackexchange.com"), icon: "fas fa-brain", color: "#f48024", tags: ["问答", "数据科学"], pricing: "free", region: "foreign", rating: 4.4, users: "100万+", url: "https://datascience.stackexchange.com" },
    { id: 267, name: "GitHub Discussions", category: "code", desc: "GitHub 项目讨论区，开发者社区互动。", logo: favicon("github.com"), icon: "fab fa-github", color: "#333", tags: ["讨论", "开发"], pricing: "free", region: "foreign", rating: 4.5, users: "500万+", url: "https://github.com" },
    { id: 268, name: "HackerNews", category: "code", desc: "技术新闻社区，高质量讨论。", logo: favicon("news.ycombinator.com"), icon: "fas fa-rss", color: "#ff6600", tags: ["新闻", "讨论"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://news.ycombinator.com" },
    { id: 269, name: "ProductHunt", category: "llm", desc: "产品发布社区，最新科技产品展示。", logo: favicon("producthunt.com"), icon: "fas fa-rocket", color: "#da552f", tags: ["产品", "社区"], pricing: "free", region: "foreign", rating: 4.5, users: "500万+", url: "https://www.producthunt.com" },
    { id: 270, name: "Medium", category: "tutorials", desc: "博客平台，技术和学术文章分享。", logo: favicon("medium.com"), icon: "fas fa-pencil", color: "#000000", tags: ["博客", "知识分享"], pricing: "freemium", region: "foreign", rating: 4.4, users: "1000万+", url: "https://medium.com" },
    { id: 271, name: "Dev.to", category: "tutorials", desc: "开发者社区博客平台。", logo: favicon("dev.to"), icon: "fab fa-dev", color: "#000000", tags: ["博客", "开发者"], pricing: "free", region: "foreign", rating: 4.5, users: "100万+", url: "https://dev.to" },
    { id: 272, name: "Hacker News for Science", category: "reading", desc: "科学新闻聚合社区。", logo: favicon("sciencehacking.com"), icon: "fas fa-flask", color: "#0066cc", tags: ["新闻", "科学"], pricing: "free", region: "foreign", rating: 4.3, users: "50万+", url: "https://science.sciencehacking.com" },
    { id: 273, name: "LessWrong", category: "tutorials", desc: "理性讨论社区，包含科学和哲学讨论。", logo: favicon("lesswrong.com"), icon: "fas fa-lightbulb", color: "#000000", tags: ["讨论", "理性"], pricing: "free", region: "foreign", rating: 4.4, users: "50万+", url: "https://www.lesswrong.com" },
    { id: 274, name: "OpenScienceFramework", category: "reading", desc: "开放科学协作平台，支持项目管理和分享。", logo: favicon("osf.io"), icon: "fas fa-network-wired", color: "#0066cc", tags: ["开放科学", "协作"], pricing: "free", region: "foreign", rating: 4.5, users: "50万+", url: "https://osf.io" },
    { id: 275, name: "Zenodo", category: "reading", desc: "欧洲开放科学数据库，支持论文和数据集分享。", logo: favicon("zenodo.org"), icon: "fas fa-upload", color: "#0066cc", tags: ["开放科学", "数据"], pricing: "free", region: "foreign", rating: 4.6, users: "100万+", url: "https://zenodo.org" },
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
        views: "5.2万", date: "2026-03-20",
        url: "https://help.openai.com/en/collections/3742473-chatgpt"
    },
    {
        id: 2, title: "DeepSeek 科研编程实战：Python/R 数据分析",
        desc: "使用 DeepSeek 自动生成数据分析代码，涵盖统计检验、机器学习建模和科研可视化，从提问技巧到代码调试全流程。",
        cover: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        icon: "fas fa-code",
        views: "3.8万", date: "2026-03-15",
        url: "https://chat.deepseek.com"
    },
    {
        id: 3, title: "用 Elicit + SciSpace 加速系统综述",
        desc: "详解如何用 AI 工具完成 PRISMA 标准的系统综述：文献检索、筛选、数据提取到偏倚评估，效率提升 10 倍的实操教程。",
        cover: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        icon: "fas fa-book-open",
        views: "2.9万", date: "2026-03-10",
        url: "https://elicit.com/blog"
    },
    {
        id: 4, title: "BioRender + AI 制作顶刊级科研配图",
        desc: "结合 BioRender 和 AI 工具制作达到 Nature/Science 级别的科研示意图，包含配色方案、排版规范和常见图型模板。",
        cover: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        icon: "fas fa-dna",
        views: "2.1万", date: "2026-03-05",
        url: "https://learn.biorender.com"
    },
    {
        id: 5, title: "科研 Prompt Engineering 进阶指南",
        desc: "如何设计高效的科研提示词？从角色设定、结构化指令到思维链技巧，让 AI 输出更精准、更学术化的内容。",
        cover: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        icon: "fas fa-lightbulb",
        views: "1.8万", date: "2026-02-28",
        url: "https://www.promptingguide.ai"
    },
    {
        id: 6, title: "免费工具替代方案：零成本科研工具箱",
        desc: "盘点每个付费科研工具的高质量免费替代品：SPSS→JASP、Endnote→Zotero、GraphPad→R ggplot2，附详细使用教程。",
        cover: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        icon: "fas fa-tools",
        views: "4.5万", date: "2026-02-20",
        url: "https://www.zotero.org/support"
    },
    {
        id: 7, title: "Kimi 长文本阅读：一次性读懂 100 篇论文",
        desc: "利用 Kimi 超长上下文批量阅读文献，快速提取研究方法、关键结论，构建文献矩阵，大幅压缩文献调研时间。",
        cover: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
        icon: "fas fa-moon",
        views: "3.2万", date: "2026-02-15",
        url: "https://kimi.moonshot.cn"
    },
    {
        id: 8, title: "Google Colab 科研机器学习入门",
        desc: "从零开始在 Google Colab 上运行机器学习实验，免费 GPU 环境配置、常用数据集加载、模型训练和结果可视化全教程。",
        cover: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
        icon: "fas fa-robot",
        views: "2.6万", date: "2026-02-10",
        url: "https://colab.research.google.com"
    },
];

// ---- Curated station overrides ----
const CURATED_STATION_SECTIONS = {
    weekly: {
        label: "本周精选",
        hint: "编辑挑选的当周优先入口，适合硕博用户快速起步。"
    },
    essential: {
        label: "高频必备",
        hint: "长期稳定可复用的研究工具，按任务而不是全目录堆叠。"
    }
};

const CURATED_TOOL_EDITORIAL = [
    {
        id: 2,
        stationSection: "weekly",
        sortOrder: 10,
        editorialStatus: "编辑复核",
        reviewedAt: "2026-04-20",
        reviewNote: "长上下文稳定，适合整篇论文拆读、审稿前复盘和 rebuttal 草拟。",
        usageGuide: "先让它按“研究问题 / 方法 / 结果 / 局限”四栏拆全文，再追问你最关心的部分。",
        bestFor: "整篇论文拆解、rebuttal、方法复盘",
        quickStart: "上传全文后先问：这篇文章最值得我复现的部分是什么？",
        caution: "数字、页码和引文仍需手工核对。",
        aliases: ["长上下文", "全文精读", "paper analysis"],
        relatedIds: [8, 39, 50]
    },
    {
        id: 8,
        stationSection: "weekly",
        sortOrder: 20,
        editorialStatus: "编辑复核",
        reviewedAt: "2026-04-19",
        reviewNote: "更像研究助理而不是搜索框，适合文献摸排和证据表起草。",
        usageGuide: "先用一句研究问题检索，再要求它输出纳排标准、变量字段和空白点。",
        bestFor: "文献摸排、系统综述前期、证据表",
        quickStart: "输入研究问题时直接写比较对象、样本和结局变量。",
        caution: "结论表述要回到原文核证，不要直接复制到综述正文。",
        aliases: ["systematic review", "evidence table", "文献摸排"],
        relatedIds: [36, 50, 12]
    },
    {
        id: 50,
        stationSection: "weekly",
        sortOrder: 30,
        editorialStatus: "编辑复核",
        reviewedAt: "2026-04-18",
        reviewNote: "适合在读文献时做“支持 / 反驳 / 提及”判断，能快速筛掉站不住脚的引文。",
        usageGuide: "把关键核心文献先丢进来，看它被谁支持、被谁反驳，再决定是否写进综述主线。",
        bestFor: "引文可信度审查、争议点定位",
        quickStart: "优先核查综述里最关键的 5-10 篇锚点文献。",
        caution: "引用语境仍要回到原文，不要只看 citation statement。",
        aliases: ["citation check", "支持引用", "反驳引用"],
        relatedIds: [8, 36, 1]
    },
    {
        id: 39,
        stationSection: "weekly",
        sortOrder: 40,
        editorialStatus: "编辑复核",
        reviewedAt: "2026-04-17",
        reviewNote: "成稿、协作和投稿前格式修正最稳，适合论文进入“要交稿”的阶段。",
        usageGuide: "从期刊模板起步，和 Zotero 或 BibTeX 联动，不要等到最后一天再调格式。",
        bestFor: "LaTeX 成稿、协作写作、期刊模板",
        quickStart: "先选目标期刊模板，再反推图表、引用和附录结构。",
        caution: "模板本身不等于投稿规范，仍要核查作者指南。",
        aliases: ["latex", "期刊模板", "manuscript"],
        relatedIds: [36, 3, 2]
    },
    {
        id: 1,
        stationSection: "essential",
        sortOrder: 50,
        editorialStatus: "高频",
        reviewedAt: "2026-04-20",
        reviewNote: "适合快速改写、结构重排和把粗糙想法整理成导师能看的版本。",
        usageGuide: "给它明确角色和输出格式，例如“按审稿回复表格输出”或“先列提纲再成段”。",
        bestFor: "摘要、引言、回复信、结构改写",
        quickStart: "先让它生成提纲，不要一上来就要求完整成稿。",
        caution: "不要直接让它编造引用或实验结果。",
        aliases: ["摘要", "引言", "rebuttal"],
        relatedIds: [3, 39, 36]
    },
    {
        id: 3,
        stationSection: "essential",
        sortOrder: 60,
        editorialStatus: "语言把关",
        reviewedAt: "2026-04-18",
        reviewNote: "适合论文接近定稿时做语言层精修，比通用模型更贴近投稿语体。",
        usageGuide: "先自己完成结构和论证，再把单段或单节交给它做语法与表达修正。",
        bestFor: "投稿前语言润色、句级修正",
        quickStart: "按段处理，顺便让它指出逻辑跳跃和术语不一致。",
        caution: "不负责替你修复研究设计问题。",
        aliases: ["language polish", "proofread", "投稿润色"],
        relatedIds: [1, 39, 2]
    },
    {
        id: 12,
        stationSection: "essential",
        sortOrder: 70,
        editorialStatus: "稳定",
        reviewedAt: "2026-04-16",
        reviewNote: "适合做第一轮学术检索和作者脉络梳理，免费入口价值高。",
        usageGuide: "先找综述和高被引锚点，再顺着作者与引用网络扩展。",
        bestFor: "免费学术检索、作者脉络",
        quickStart: "把主题词拆成 2-3 组核心检索词分别搜。",
        caution: "不要把覆盖面误当完整性，关键数据库仍要补查。",
        aliases: ["semantic scholar", "citation graph", "学术检索"],
        relatedIds: [8, 29, 36]
    },
    {
        id: 29,
        stationSection: "essential",
        sortOrder: 80,
        editorialStatus: "高频",
        reviewedAt: "2026-04-16",
        reviewNote: "适合快速拿到带来源的背景信息，但更适合作为探索入口而不是最终证据。",
        usageGuide: "用它快速摸清关键词、机构、数据源，再回到正式数据库做核查。",
        bestFor: "带引用背景调查、跨领域摸底",
        quickStart: "把问题写成“主题 + 对象 + 时间范围 + 是否要论文来源”。",
        caution: "来源质量差异很大，高风险结论必须二次验证。",
        aliases: ["带引用搜索", "background search", "cross-domain"],
        relatedIds: [12, 8, 1]
    },
    {
        id: 36,
        stationSection: "essential",
        sortOrder: 90,
        editorialStatus: "必备",
        reviewedAt: "2026-04-20",
        reviewNote: "文献管理底座，能把阅读、标注、引用和团队共享串起来。",
        usageGuide: "先建 collection 和 tag 规则，再批量收论文，不要把资料堆成一个大库。",
        bestFor: "文献管理、引用输出、阅读归档",
        quickStart: "按“综述 / 方法 / 数据 / rebuttal”建四个主集合即可。",
        caution: "元数据抓取常有错误，导入后要立即校正作者与期刊信息。",
        aliases: ["reference manager", "bib", "citation library"],
        relatedIds: [39, 8, 50]
    },
    {
        id: 42,
        stationSection: "essential",
        sortOrder: 100,
        editorialStatus: "方法友好",
        reviewedAt: "2026-04-15",
        reviewNote: "适合社科、心理和教育研究做基础统计与贝叶斯分析，学习成本低。",
        usageGuide: "先用它确认方法和结果表，再决定是否需要转到 R/Python 做复现图表。",
        bestFor: "统计入门、社科分析、SPSS 替代",
        quickStart: "先跑描述统计和假设检验，再补效应量与可视化。",
        caution: "复杂建模或自动化流程仍建议切到脚本工具。",
        aliases: ["bayesian", "stats gui", "SPSS替代"],
        relatedIds: [47, 25, 19]
    },
    {
        id: 47,
        stationSection: "essential",
        sortOrder: 110,
        editorialStatus: "必备",
        reviewedAt: "2026-04-20",
        reviewNote: "科研脚本、可视化和复现记录的默认工作台。",
        usageGuide: "把数据清洗、分析、图表和解释写在同一 notebook 里，方便回溯与分享。",
        bestFor: "可复现分析、探索性计算、实验记录",
        quickStart: "每一步都写 markdown 注释，别只留代码。",
        caution: "正式项目仍要把核心逻辑沉淀成脚本或包。",
        aliases: ["notebook", "reproducible", "分析记录"],
        relatedIds: [25, 24, 42]
    },
    {
        id: 25,
        stationSection: "essential",
        sortOrder: 120,
        editorialStatus: "高频",
        reviewedAt: "2026-04-15",
        reviewNote: "最适合临时实验、模型复跑和和导师共享 notebook 链接。",
        usageGuide: "需要 GPU 或远程协作时再开，用完及时把结果和代码同步回仓库。",
        bestFor: "临时实验、共享 notebook、GPU 尝试",
        quickStart: "开头就挂载 Drive 或 GitHub，避免实验结束后找不到文件。",
        caution: "临时环境不适合作为唯一实验归档。",
        aliases: ["colab", "gpu", "remote notebook"],
        relatedIds: [47, 24, 16]
    },
    {
        id: 24,
        stationSection: "essential",
        sortOrder: 130,
        editorialStatus: "高频",
        reviewedAt: "2026-04-19",
        reviewNote: "适合把分析脚本、爬虫和实验 pipeline 从零搭起来，并连续迭代。",
        usageGuide: "让它先解释已有代码库，再做增量修改；不要在陌生仓库里直接放权重构。",
        bestFor: "科研编程、脚本迭代、实验 pipeline",
        quickStart: "先问“这个项目的输入输出和依赖是什么”，再改代码。",
        caution: "自动修改前要先看 diff，尤其是数据处理逻辑。",
        aliases: ["ai ide", "research coding", "pipeline"],
        relatedIds: [47, 25, 16]
    },
    {
        id: 16,
        stationSection: "essential",
        sortOrder: 140,
        editorialStatus: "国产可用",
        reviewedAt: "2026-04-18",
        reviewNote: "适合快速生成分析脚本和中文思路梳理，是低成本的编程助理。",
        usageGuide: "把你的变量名、数据结构和目标图表说清楚，让它先出分析 plan 再出代码。",
        bestFor: "中文科研编程、脚本草拟、数学推理",
        quickStart: "优先要求它解释每一步为什么这样做。",
        caution: "输出代码要手动跑通，不要把生成结果当可直接发表代码。",
        aliases: ["deepseek", "国产编程", "中文代码"],
        relatedIds: [24, 47, 25]
    },
    {
        id: 13,
        stationSection: "essential",
        sortOrder: 150,
        editorialStatus: "中文友好",
        reviewedAt: "2026-04-17",
        reviewNote: "适合中文环境下做多篇论文并读、会议纪要整理和初步提炼。",
        usageGuide: "先给阅读任务边界，例如“只比较数据集、方法和局限”，避免它泛泛总结。",
        bestFor: "中文阅读、多文档对比、会议纪要",
        quickStart: "一次只处理一类问题，例如先做方法矩阵，再做争议点。",
        caution: "多文档摘要容易丢细节，最终表格要自己复核。",
        aliases: ["中文阅读", "multi-pdf", "论文对比"],
        relatedIds: [2, 8, 36]
    },
    {
        id: 18,
        stationSection: "essential",
        sortOrder: 160,
        editorialStatus: "视觉首选",
        reviewedAt: "2026-04-14",
        reviewNote: "生物医学与机制图场景最省时间，适合做论文主图和图形摘要。",
        usageGuide: "先定图的叙事层级，再选 icon；不要一上来就开始堆细胞器。",
        bestFor: "机制图、图形摘要、生物医学插图",
        quickStart: "先画黑白结构草图，再上色和统一字体。",
        caution: "最终图例和标注要按目标期刊规范收口。",
        aliases: ["mechanism figure", "graphical abstract", "生物医学"],
        relatedIds: [19, 39, 1]
    },
    {
        id: 19,
        stationSection: "essential",
        sortOrder: 170,
        editorialStatus: "实验常用",
        reviewedAt: "2026-04-14",
        reviewNote: "对生物、医学实验数据非常高频，出图和统计一体化体验好。",
        usageGuide: "把原始数据表清理干净后再导入，优先统一分组命名和单位。",
        bestFor: "实验统计、剂量反应、生存曲线",
        quickStart: "出图前先确认检验方法和误差线定义。",
        caution: "默认图不一定符合投稿要求，颜色和标注要手调。",
        aliases: ["survival curve", "dose response", "prism"],
        relatedIds: [42, 18, 47]
    }
];

const TOOL_DIRECTORY_INDEX = new Map(TOOLS_DATA.map(tool => [tool.id, tool]));
const CURATED_TOOLS = CURATED_TOOL_EDITORIAL.map(meta => {
    const base = TOOL_DIRECTORY_INDEX.get(meta.id);
    if (!base) return null;
    const sectionMeta = CURATED_STATION_SECTIONS[meta.stationSection] || CURATED_STATION_SECTIONS.essential;
    const tags = [...new Set([...(base.tags || []), sectionMeta.label])];
    const keywords = [
        ...(base.keywords || []),
        ...(meta.aliases || []),
        meta.bestFor,
        meta.editorialStatus,
        sectionMeta.label
    ].filter(Boolean);
    return {
        ...base,
        entryKind: "tool",
        sortOrder: meta.sortOrder,
        stationSection: meta.stationSection,
        stationSectionLabel: sectionMeta.label,
        editorialStatus: meta.editorialStatus,
        reviewedAt: meta.reviewedAt,
        reviewNote: meta.reviewNote,
        usageGuide: meta.usageGuide,
        bestFor: meta.bestFor,
        quickStart: meta.quickStart,
        caution: meta.caution,
        relatedIds: meta.relatedIds || [],
        tags,
        keywords: [...new Set(keywords)],
        provenance: {
            ...(base.provenance || {}),
            sourceName: "研究站编辑台",
            status: meta.editorialStatus,
            freshness: `复核 ${meta.reviewedAt}`,
            note: meta.reviewNote
        }
    };
}).filter(Boolean).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

if (CURATED_TOOLS.length) {
    TOOLS_DATA.splice(0, TOOLS_DATA.length, ...CURATED_TOOLS);
}

FEATURED_TOOLS.splice(0, FEATURED_TOOLS.length, ...[
    {
        id: 2,
        kicker: "整篇论文拆读",
        reason: "把论文先拆成问题、方法、结果和限制，再决定你要不要继续深读。",
        usage: "适合开题摸底、组会前复盘、审稿回复草稿。",
        status: "本周精选"
    },
    {
        id: 8,
        kicker: "文献摸排",
        reason: "先做纳排标准和证据表，再写综述，能少走很多弯路。",
        usage: "适合系统综述前期、研究空白定位。",
        status: "本周精选"
    },
    {
        id: 50,
        kicker: "引文可靠性",
        reason: "读文献时先看它被支持还是被反驳，能更快识别争议点。",
        usage: "适合综述写作、回复审稿、争议文献排雷。",
        status: "本周精选"
    },
    {
        id: 39,
        kicker: "临近交稿",
        reason: "从模板和引用开始收口，能避免最后阶段全局返工。",
        usage: "适合 LaTeX 成稿、多人协作和格式整理。",
        status: "本周精选"
    }
]);

PROMPTS_DATA.splice(0, PROMPTS_DATA.length, ...[
    {
        id: 1,
        entryKind: "script",
        title: "开题前 2 小时文献摸排剧本",
        category: "review",
        status: "高频",
        usage: "适合硕士开题、博士换题或导师临时让你快速补背景。",
        output: "输出：关键词组、10 篇锚点文献、3 个研究空白句。",
        tools: ["Elicit", "Semantic Scholar", "Zotero"],
        keywords: ["开题", "文献摸排", "综述", "research gap"],
        content: `你现在是我的研究助理。请围绕研究问题「[研究主题]」帮我完成一轮可执行的文献摸排。

任务要求：
1. 先把问题拆成 3 组核心检索词，分别给出英文同义词和布尔检索式。
2. 为每组检索词推荐适合的数据库（如 Web of Science、PubMed、Semantic Scholar）及原因。
3. 输出 10 篇优先阅读的锚点文献，按“综述 / 方法 / 代表性实证 / 争议文献”分组。
4. 总结这个方向目前最常见的 3 条研究路径与 3 个尚未解决的问题。
5. 最后给我一个 30 分钟内能执行完的阅读顺序。

输出格式：
- 检索词表
- 锚点文献清单
- 研究空白句（可直接写进开题报告）`
    },
    {
        id: 2,
        entryKind: "script",
        title: "论文初稿重写剧本",
        category: "writing",
        status: "常用",
        usage: "适合已经有粗稿，但导师说“逻辑还不够清楚”的场景。",
        output: "输出：重排后的结构、每段功能、需要补证据的位置。",
        tools: ["ChatGPT", "Claude", "Overleaf"],
        keywords: ["初稿", "结构重写", "introduction", "discussion"],
        content: `请把以下论文初稿重写成更适合投稿的结构化版本，但不要改动我的核心发现。

请按下面步骤工作：
1. 先判断当前稿件的逻辑问题，指出哪些段落在重复、跳步或证据不足。
2. 重新输出一版章节和段落提纲，说明每段的功能。
3. 对每一段给出“保留 / 合并 / 前移 / 删除 / 需要补证据”的判断。
4. 只重写一段示范段落，保持学术语气，不要替我编造文献。
5. 最后给我一个“作者自己需要补什么”的待办清单。

原稿：
[粘贴草稿]`
    },
    {
        id: 3,
        entryKind: "script",
        title: "统计方法确认剧本",
        category: "analysis",
        status: "方法",
        usage: "适合拿到数据后，不确定该做 t 检验、回归、混合模型还是贝叶斯分析。",
        output: "输出：方法选择理由、前提检验、结果表与图表建议。",
        tools: ["JASP", "Jupyter Notebook", "GraphPad Prism"],
        keywords: ["统计", "方法选择", "假设检验", "回归"],
        content: `请根据我的研究设计和变量类型，帮我确认统计分析路线，而不是只给一个方法名称。

研究设计：[横断面 / 纵向 / 实验 / 观察]
样本量：[N=?]
因变量：[连续 / 分类 / 计数] + 描述
自变量：[连续 / 分类] + 描述
重复测量：[有 / 无]
我最关心的问题：[组间差异 / 关联 / 预测 / 机制]

请输出：
1. 推荐方法及为什么不用其他常见替代方法。
2. 我需要先检查哪些前提假设。
3. 结果表应该包含哪些列。
4. 最适合的 2-3 张图以及图注里要交代什么。
5. 给我 JASP、R 或 Python 的最小实现示例。`
    },
    {
        id: 4,
        entryKind: "script",
        title: "审稿回复剧本",
        category: "writing",
        status: "投稿",
        usage: "适合收到 revise decision 后，先把评论拆成可执行任务清单。",
        output: "输出：逐条回复框架、证据补充清单、争议意见回应策略。",
        tools: ["Claude", "ChatGPT", "Scite.ai"],
        keywords: ["审稿回复", "rebuttal", "revision", "reviewer comments"],
        content: `请帮我把以下审稿意见转成一份专业、可执行的回复计划。

要求：
1. 先按“可直接修改 / 需要补实验或补分析 / 需要礼貌反驳”三类拆分意见。
2. 每条意见输出三栏：审稿人关切、作者拟回复、需要在稿件中改动的位置。
3. 对存在争议的意见，补一个“可引用哪些证据”的建议。
4. 帮我写一版语气稳妥、不过度承诺的回复模板。
5. 最后给我一个 revision 优先级列表。

审稿意见：
[粘贴 reviewer comments]`
    }
]);

TUTORIALS_DATA.splice(0, TUTORIALS_DATA.length, ...[
    {
        id: 1,
        title: "首页切换为 curated research station",
        desc: "首页从“全目录逛站”改为“本周精选 / 研究剧本 / 高频必备 / 方法工具 / 更新记录”五段式工作台。",
        cover: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
        icon: "fas fa-compass-drafting",
        views: "结构更新",
        date: "2026-04-21",
        status: "已上线",
        note: "搜索和推荐改为围绕精选条目、研究剧本与方法模块工作。"
    },
    {
        id: 2,
        title: "推荐逻辑收窄到研究任务",
        desc: "不再把空结果导回“查看全部工具”，改成围绕研究任务、剧本和方法模块给出建议。",
        cover: "linear-gradient(135deg, #1d4ed8 0%, #06b6d4 100%)",
        icon: "fas fa-route",
        views: "推荐策略",
        date: "2026-04-20",
        status: "已校验",
        note: "适合研究生快速定位“下一步该做什么”，而不是继续逛目录。"
    },
    {
        id: 3,
        title: "方法工具纳入首页壳层",
        desc: "选刊助手、引文核查、PaperDeck 和统计方法库不再像孤立页面，而是作为首页方法工具入口保留。",
        cover: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
        icon: "fas fa-toolbox",
        views: "模块整合",
        date: "2026-04-19",
        status: "已上线",
        note: "缺少 manifest 或状态数据时仍显示本地说明，不阻断模块使用。"
    },
    {
        id: 4,
        title: "高频工具改成编辑台账",
        desc: "工具卡片增加使用场景、编辑复核状态、注意事项，避免只展示评分和用户数。",
        cover: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
        icon: "fas fa-clipboard-check",
        views: "元数据增强",
        date: "2026-04-18",
        status: "已复核",
        note: "更适合硕博用户做任务判断，而不是单看热度。"
    }
]);

const METHOD_TOOL_MODULES = [
    {
        id: "journal",
        entryKind: "method",
        category: "journal",
        title: "选刊助手",
        icon: "fas fa-journal-whills",
        color: "#2563eb",
        status: "内置模块",
        usageGuide: "先明确学科、分区和审稿周期，再看候选期刊。",
        desc: "把投稿约束转成候选期刊清单，适合论文接近成稿时缩小目标范围。",
        keywords: ["投稿", "期刊", "journal", "分区", "审稿周期"],
        ctaLabel: "打开模块"
    },
    {
        id: "cite-check",
        entryKind: "method",
        category: "cite-check",
        title: "引文核查",
        icon: "fas fa-list-check",
        color: "#7c3aed",
        status: "内置模块",
        usageGuide: "先核关键锚点文献，再批量清理引用格式和高风险表述。",
        desc: "适合投稿前、综述成稿前和审稿回复前做最后一轮引文排雷。",
        keywords: ["引文", "citation", "核查", "参考文献", "quote"],
        ctaLabel: "打开模块"
    },
    {
        id: "paperdeck",
        entryKind: "method",
        category: "paperdeck",
        title: "PaperDeck",
        icon: "fas fa-layer-group",
        color: "#059669",
        status: "内置模块",
        usageGuide: "把单篇论文拆成研究问题、方法、数据和可迁移做法四张卡。",
        desc: "适合组会、文献精读和把阅读记录沉淀成自己的方法库。",
        keywords: ["paperdeck", "精读", "读书卡", "文献卡片", "组会"],
        ctaLabel: "打开模块"
    },
    {
        id: "stats",
        entryKind: "method",
        category: "stats",
        title: "统计方法库",
        icon: "fas fa-chart-bar",
        color: "#f59e0b",
        status: "内置模块",
        usageGuide: "按研究目标先找方法，再看图表建议和实现方式。",
        desc: "把常用统计方法、可视化建议和实现入口留在站内，减少来回切换。",
        keywords: ["统计", "方法", "visualization", "回归", "ANOVA"],
        ctaLabel: "打开模块"
    }
];

const STATION_RECOMMEND_SCENES = [
    {
        id: "lit-map",
        label: "文献摸排",
        icon: "fas fa-compass",
        keywords: ["文献", "综述", "检索", "gap", "证据表"]
    },
    {
        id: "drafting",
        label: "成稿重写",
        icon: "fas fa-pen-fancy",
        keywords: ["摘要", "引言", "讨论", "重写", "润色"]
    },
    {
        id: "methods",
        label: "方法确认",
        icon: "fas fa-square-poll-vertical",
        keywords: ["统计", "回归", "检验", "建模", "分析"]
    },
    {
        id: "submission",
        label: "投稿检查",
        icon: "fas fa-paper-plane",
        keywords: ["投稿", "期刊", "审稿", "rebuttal", "引用"]
    },
    {
        id: "figure",
        label: "配图展示",
        icon: "fas fa-bezier-curve",
        keywords: ["图", "figure", "graphical abstract", "汇报", "幻灯"]
    }
];

const STATION_SEARCH_INDEX = [
    ...TOOLS_DATA.map(tool => ({
        entryKind: "tool",
        refId: tool.id,
        title: tool.name,
        desc: tool.reviewNote || tool.desc,
        usageGuide: tool.usageGuide,
        status: tool.editorialStatus || tool.stationSectionLabel || "",
        icon: tool.icon,
        color: tool.color,
        keywords: [...new Set([...(tool.keywords || []), ...(tool.tags || []), tool.bestFor, tool.stationSectionLabel].filter(Boolean))],
        actionLabel: "查看工具"
    })),
    ...PROMPTS_DATA.map(script => ({
        entryKind: "script",
        refId: script.id,
        title: script.title,
        desc: script.usage,
        usageGuide: script.output,
        status: script.status,
        icon: "fas fa-scroll",
        color: "#0f766e",
        keywords: [...new Set([...(script.keywords || []), ...(script.tools || []), script.category, script.status].filter(Boolean))],
        actionLabel: "复制剧本"
    })),
    ...METHOD_TOOL_MODULES.map(module => ({
        entryKind: "method",
        refId: module.category,
        title: module.title,
        desc: module.desc,
        usageGuide: module.usageGuide,
        status: module.status,
        icon: module.icon,
        color: module.color,
        keywords: [...new Set([...(module.keywords || []), module.title, module.status].filter(Boolean))],
        actionLabel: module.ctaLabel || "打开模块"
    }))
];

// ---- 工具官方文档 ----
const TOOL_DOCS = {
    // new tools
    56: "https://support.microsoft.com/copilot",
    57: "https://help.gamma.app",
    62: "https://docs.dify.ai",
    63: "https://www.coze.cn/docs",
    64: "https://microsoft.github.io/autogen/docs/Getting-Started",
    65: "https://docs.crewai.com",
    66: "https://doc.fastgpt.in",
    67: "https://docs.n8n.io",
    68: "https://python.langchain.com/docs",
    69: "https://docs.anthropic.com/claude-code",
    70: "https://aider.chat/docs",
    71: "https://github.com/ollama/ollama",
    73: "https://llm.datasette.io/en/stable",
    74: "https://docs.github.com/en/copilot/github-copilot-in-the-cli",
    1:  "https://help.openai.com/en/collections/3742473-chatgpt",
    2:  "https://docs.anthropic.com",
    3:  "https://paperpal.com/blog",
    5:  "https://writefull.com/docs",
    6:  "https://kimi.moonshot.cn",
    7:  "https://typeset.io/blog",
    8:  "https://elicit.com/blog",
    9:  "https://scispace.com/blog",
    10: "https://www.connectedpapers.com/about",
    12: "https://www.zotero.org/support",
    13: "https://www.mendeley.com/guides",
    15: "https://api.semanticscholar.org",
    16: "https://api-docs.deepseek.com",
    17: "https://platform.moonshot.cn/docs",
    18: "https://learn.biorender.com",
    19: "https://www.graphpad.com/support",
    20: "https://www.originlab.com/doc",
    21: "https://docs.posit.co/ide/user",
    25: "https://docs.github.com/en/copilot",
    26: "https://docs.cursor.com",
    27: "https://code.visualstudio.com/docs",
    28: "https://docs.jupyter.org",
    29: "https://colab.research.google.com/notebooks/intro.ipynb",
    36: "https://www.zotero.org/support",
    39: "https://www.overleaf.com/learn",
    41: "https://jasp-stats.org/documentation",
    42: "https://docs.posit.co",
    44: "https://help.tableau.com",
    47: "https://docs.jupyter.org",
    48: "https://code.visualstudio.com/docs",
};

// ---- GitHub 高星项目推荐 ----
const GITHUB_REPOS = [
    {
        id: 1,
        name: "gpt_academic",
        owner: "binary-husky",
        stars: "65k",
        desc: "为 GPT/GLM 等 LLM 大语言模型提供实用化交互接口，专注于论文阅读/润色/翻译/批改，支持 Python/C++代码调试。",
        topics: ["论文润色", "代码调试", "批量处理"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/binary-husky/gpt_academic"
    },
    {
        id: 2,
        name: "ChatPaper",
        owner: "kaixindelele",
        stars: "8.4k",
        desc: "利用 ChatGPT 总结 arXiv 论文，一键获取论文摘要、创新点、方法论和实验结果，支持批量处理和中文输出。",
        topics: ["文献阅读", "arXiv", "批量总结"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/kaixindelele/ChatPaper"
    },
    {
        id: 3,
        name: "whisper",
        owner: "openai",
        stars: "67k",
        desc: "OpenAI 开源的多语言语音识别模型，可将学术讲座、会议录音转为文字，支持 100+ 种语言，准确率媲美人工。",
        topics: ["语音识别", "多语言", "录音转文字"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/openai/whisper"
    },
    {
        id: 4,
        name: "segment-anything",
        owner: "facebookresearch",
        stars: "46k",
        desc: "Meta 发布的通用图像分割模型，在生物医学图像分析（细胞识别、病理切片分割）中被广泛应用，零样本泛化能力强。",
        topics: ["图像分割", "医学图像", "零样本"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/facebookresearch/segment-anything"
    },
    {
        id: 5,
        name: "transformers",
        owner: "huggingface",
        stars: "130k",
        desc: "Hugging Face 出品，提供数千种预训练模型，覆盖 NLP、CV、生物信息学，是 AI 科研最重要的基础库之一。",
        topics: ["预训练模型", "NLP", "迁移学习"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/huggingface/transformers"
    },
    {
        id: 6,
        name: "gpt-researcher",
        owner: "assafelovic",
        stars: "14k",
        desc: "基于 AI 智能体的自动化研究工具，输入研究问题可自动搜索文献、综合信息并生成带引用的研究报告。",
        topics: ["自动调研", "智能体", "报告生成"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/assafelovic/gpt-researcher"
    },
    {
        id: 7,
        name: "deepchem",
        owner: "deepchem",
        stars: "5.3k",
        desc: "专注于化学、生物学和材料科学的深度学习库，提供药物发现、蛋白质工程、量子化学等领域的 ML 工具包。",
        topics: ["药物发现", "分子ML", "化学信息学"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/deepchem/deepchem"
    },
    {
        id: 8,
        name: "autogen",
        owner: "microsoft",
        stars: "32k",
        desc: "微软开源的多智能体框架，可构建 AI 科研 pipeline：文献检索 → 代码生成 → 实验分析 → 报告撰写全自动化。",
        topics: ["多智能体", "自动化流程", "科研pipeline"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/microsoft/autogen"
    },
    {
        id: 9,
        name: "llama.cpp",
        owner: "ggerganov",
        stars: "65k",
        desc: "在本地 CPU/GPU 运行 LLaMA 等大语言模型，科研人员可在无网络/保密数据环境下使用 AI 辅助分析。",
        topics: ["本地部署", "隐私保护", "离线推理"],
        lang: "C++", langColor: "#f34b7d",
        url: "https://github.com/ggerganov/llama.cpp"
    },
    {
        id: 10,
        name: "lm-evaluation-harness",
        owner: "EleutherAI",
        stars: "7.2k",
        desc: "LLM 标准化评测框架，覆盖 200+ 学术基准（MMLU、GSM8K 等），可对比不同模型在科研任务上的真实能力。",
        topics: ["模型评测", "基准测试", "对比分析"],
        lang: "Python", langColor: "#3572A5",
        url: "https://github.com/EleutherAI/lm-evaluation-harness"
    },
];

// ---- 科研 AI 应用示例 ----
const USE_CASES_DATA = [
    {
        id: 1,
        icon: "fas fa-dna",
        color: "#7c5cfc",
        title: "AlphaFold 蛋白质结构预测",
        scenario: "结构生物学",
        desc: "DeepMind 的 AlphaFold 2 解决了困扰科学界 50 年的蛋白质折叠难题，对 2 亿+ 蛋白质结构完成预测，极大加速药物靶点发现。",
        tools: ["AlphaFold", "PyMOL", "DeepChem"],
        impact: "Science 2021 年度突破",
        link: "https://www.deepmind.com/research/highlighted-research/alphafold"
    },
    {
        id: 2,
        icon: "fas fa-file-alt",
        color: "#10a37f",
        title: "AI 辅助系统综述",
        scenario: "循证医学",
        desc: "使用 Elicit + ResearchRabbit + ChatGPT 构建自动化文献筛选流水线，将传统需要 6 个月的系统综述压缩至 3 周完成。",
        tools: ["Elicit", "ResearchRabbit", "Claude"],
        impact: "效率提升 10x",
        link: "https://elicit.com/blog/systematic-reviews"
    },
    {
        id: 3,
        icon: "fas fa-microscope",
        color: "#ef4444",
        title: "医学图像 AI 分割",
        scenario: "病理学 / 影像学",
        desc: "Meta SAM（Segment Anything）应用于病理切片细胞核分割、MRI 病灶识别，无需大量标注数据，零样本精度达到专业水准。",
        tools: ["SAM", "ITK-SNAP", "Python"],
        impact: "分割精度 >95%",
        link: "https://github.com/facebookresearch/segment-anything"
    },
    {
        id: 4,
        icon: "fas fa-chart-bar",
        color: "#f97316",
        title: "AI 驱动数据分析报告",
        scenario: "统计学 / 数据科学",
        desc: "将实验数据上传给 DeepSeek / ChatGPT，自动生成统计检验代码、可视化图表和结果解读，整个分析过程仅需 30 分钟。",
        tools: ["DeepSeek", "Jupyter", "R Studio"],
        impact: "30 分钟完成全套分析",
        link: "https://chat.deepseek.com"
    },
    {
        id: 5,
        icon: "fas fa-flask",
        color: "#059669",
        title: "AI 辅助药物发现",
        scenario: "计算化学 / 药学",
        desc: "利用 DeepChem + Transformer 模型预测分子活性和毒性，将候选药物从数十万化合物中筛选至数百个，节省数年湿实验时间。",
        tools: ["DeepChem", "RDKit", "AutoDock"],
        impact: "筛选效率提升 1000x",
        link: "https://deepchem.io"
    },
    {
        id: 6,
        icon: "fas fa-pen-nib",
        color: "#2563eb",
        title: "AI 全流程论文写作",
        scenario: "学术写作",
        desc: "从选题（ChatGPT 头脑风暴）→ 文献调研（Elicit）→ 写作（Claude）→ 润色（Grammarly）→ 格式（Overleaf），构建完整 AI 写作工作流。",
        tools: ["ChatGPT", "Claude", "Overleaf", "Grammarly"],
        impact: "写作效率提升 5x",
        link: "https://www.overleaf.com"
    },
];

// ============================================
// 中文期刊本地数据库（30条）
// 字段：name, nameEn, issn, category, field, rank, if_2023, notes
// ============================================
const CHINESE_JOURNALS = [
    { name: '中国科学：信息科学', nameEn: 'SCIENCE CHINA Information Sciences', issn: '1674-7267', category: 'CSCD', field: '计算机/信息', rank: 'Q1', if_2023: 7.3, notes: '中科院1区，信息领域顶刊' },
    { name: '计算机学报', nameEn: 'Chinese Journal of Computers', issn: '0254-4164', category: 'CSCD', field: '计算机', rank: 'A', if_2023: 3.8, notes: '北大核心，CCF-A推荐' },
    { name: '软件学报', nameEn: 'Journal of Software', issn: '1000-9825', category: 'CSCD', field: '软件工程', rank: 'A', if_2023: 3.5, notes: '北大核心，CCF-A推荐' },
    { name: '自动化学报', nameEn: 'Acta Automatica Sinica', issn: '0254-4156', category: 'CSCD', field: '自动化/人工智能', rank: 'Q1', if_2023: 4.2, notes: '中科院2区，AI领域核心' },
    { name: '电子学报', nameEn: 'Acta Electronica Sinica', issn: '0372-2112', category: 'CSCD', field: '电子信息', rank: 'A', if_2023: 2.9, notes: '北大核心，EI收录' },
    { name: '通信学报', nameEn: 'Journal on Communications', issn: '1000-436X', category: 'CSCD', field: '通信', rank: 'A', if_2023: 2.6, notes: '北大核心，CCF-B推荐' },
    { name: '计算机研究与发展', nameEn: 'Journal of Computer Research and Development', issn: '1000-1239', category: 'CSCD', field: '计算机', rank: 'A', if_2023: 3.1, notes: '北大核心，CCF-A推荐' },
    { name: '模式识别与人工智能', nameEn: 'Pattern Recognition and Artificial Intelligence', issn: '1003-6059', category: 'CSCD', field: '人工智能', rank: 'B', if_2023: 1.8, notes: 'CSCD核心，AI专项' },
    { name: '中文信息学报', nameEn: 'Journal of Chinese Information Processing', issn: '1003-0077', category: 'CSCD', field: 'NLP/中文处理', rank: 'B', if_2023: 1.6, notes: 'CSCD核心，NLP领域' },
    { name: '数据库技术与应用', nameEn: 'Journal of Database Technology', issn: '1673-7776', category: '北大核心', field: '数据库', rank: 'B', if_2023: null, notes: '北大核心' },
    { name: '遥感学报', nameEn: 'National Remote Sensing Bulletin', issn: '1007-4619', category: 'CSCD', field: '遥感/地理', rank: 'Q2', if_2023: 3.0, notes: '中科院3区' },
    { name: '地理学报', nameEn: 'Acta Geographica Sinica', issn: '0375-5444', category: 'CSCD', field: '地理科学', rank: 'Q1', if_2023: 4.8, notes: 'CSSCI，地理顶刊' },
    { name: '生态学报', nameEn: 'Acta Ecologica Sinica', issn: '1000-0933', category: 'CSCD', field: '生态学', rank: 'Q2', if_2023: 3.2, notes: 'CSCD核心，生态领域权威' },
    { name: '中国环境科学', nameEn: 'China Environmental Science', issn: '1000-6923', category: 'CSCD', field: '环境科学', rank: 'Q2', if_2023: 2.8, notes: 'CSCD核心，EI收录' },
    { name: '化学学报', nameEn: 'Acta Chimica Sinica', issn: '0567-7351', category: 'CSCD', field: '化学', rank: 'Q2', if_2023: 4.1, notes: '中科院2区，化学领域核心' },
    { name: '物理学报', nameEn: 'Acta Physica Sinica', issn: '1000-3290', category: 'CSCD', field: '物理学', rank: 'Q3', if_2023: 1.7, notes: 'CSCD核心，物理顶刊' },
    { name: '中国机械工程', nameEn: 'China Mechanical Engineering', issn: '1004-132X', category: 'CSCD', field: '机械工程', rank: 'A', if_2023: 2.2, notes: '北大核心，EI收录' },
    { name: '材料科学与工程学报', nameEn: 'Journal of Materials Science and Engineering', issn: '1673-2812', category: '北大核心', field: '材料科学', rank: 'B', if_2023: 1.4, notes: '北大核心' },
    { name: '中国生物医学工程学报', nameEn: 'Chinese Journal of Biomedical Engineering', issn: '0258-8021', category: 'CSCD', field: '生物医学工程', rank: 'B', if_2023: 1.3, notes: 'CSCD核心' },
    { name: '医学影像学杂志', nameEn: 'Journal of Medical Imaging', issn: '1006-9011', category: '北大核心', field: '医学影像', rank: 'C', if_2023: 0.9, notes: '北大核心' },
    { name: '中华医学杂志', nameEn: 'National Medical Journal of China', issn: '0376-2491', category: 'CSCD', field: '医学综合', rank: 'Q3', if_2023: 2.1, notes: 'CSCD核心，医学权威期刊' },
    { name: '管理世界', nameEn: 'Management World', issn: '1002-5502', category: 'CSSCI', field: '管理学', rank: 'A+', if_2023: null, notes: 'CSSCI，国家级权威管理类期刊' },
    { name: '经济研究', nameEn: 'Economic Research Journal', issn: '0577-9154', category: 'CSSCI', field: '经济学', rank: 'A+', if_2023: null, notes: 'CSSCI顶刊，经济学权威' },
    { name: '中国社会科学', nameEn: 'Social Sciences in China', issn: '1002-4921', category: 'CSSCI', field: '社会科学综合', rank: 'A+', if_2023: null, notes: 'CSSCI顶刊，综合社科权威' },
    { name: '心理学报', nameEn: 'Acta Psychologica Sinica', issn: '0439-755X', category: 'CSCD', field: '心理学', rank: 'Q2', if_2023: 2.7, notes: 'CSSCI/CSCD双核心，心理学顶刊' },
    { name: '教育研究', nameEn: 'Educational Research', issn: '0013-1253', category: 'CSSCI', field: '教育学', rank: 'A+', if_2023: null, notes: 'CSSCI顶刊' },
    { name: '新闻与传播研究', nameEn: 'Journalism & Communication', issn: '1005-2577', category: 'CSSCI', field: '新闻传播', rank: 'A', if_2023: null, notes: 'CSSCI核心' },
    { name: '法学研究', nameEn: 'Chinese Journal of Law', issn: '0170-7671', category: 'CSSCI', field: '法学', rank: 'A+', if_2023: null, notes: 'CSSCI顶刊' },
    { name: '中国农业科学', nameEn: 'Scientia Agricultura Sinica', issn: '0578-1752', category: 'CSCD', field: '农学', rank: 'Q2', if_2023: 3.6, notes: 'CSCD核心，中科院3区' },
    { name: '岩石力学与工程学报', nameEn: 'Chinese Journal of Rock Mechanics and Engineering', issn: '1000-6915', category: 'CSCD', field: '岩石/土木', rank: 'Q2', if_2023: 3.4, notes: 'CSCD核心，EI收录，岩土工程权威' },
];

const STATS_METHODS = [
    // ── Stage 1: descriptive ── color #3b82f6
    { id:101, name:'描述性统计汇总', nameEn:'Descriptive Statistics', category:'descriptive', stage:1, discipline:['general','ecology','environmental','sociology','economics'], desc:'计算均值、中位数、标准差、四分位距等集中趋势与离散程度指标，支持数值型与类别型变量，是一切定量分析的基础起点。', tools:['R: summary(), psych::describe()','Python: pandas.describe(), scipy.stats','SPSS: 描述统计','Stata: summarize, tabstat'], useCase:'描述研究样地温度、pH、海拔的分布特征；刻画受访居民年龄与收入的基本分布。', difficulty:1, icon:'fas fa-table-cells', color:'#3b82f6', resources:[{type:'docs',platform:'R',title:'R base: summary() & describe() Functions',url:'https://www.rdocumentation.org/packages/base/versions/3.6.2/topics/summary',icon:'fab fa-r-project',level:'beginner'},{type:'docs',platform:'Python',title:'pandas.DataFrame.describe() Documentation',url:'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html',icon:'fab fa-python',level:'beginner'},{type:'course',platform:'Coursera',title:'Foundations of Data Analysis',url:'https://www.coursera.org/learn/foundations-data-analysis',instructor:'University of Texas',level:'intermediate'},{type:'paper',platform:'arXiv',title:'Data Descriptive Analysis in Ecological Research',url:'https://arxiv.org/search/?query=descriptive+statistics&searchtype=all',icon:'fas fa-file-pdf',year:2023}] },
    { id:102, name:'探索性数据分析', nameEn:'Exploratory Data Analysis (EDA)', category:'descriptive', stage:1, discipline:['general','ecology','environmental','sociology','economics'], desc:'通过箱线图、散点图矩阵、相关热图等可视化手段快速发现数据异常值、分布形态与变量间关系，指导建模策略与数据清洁。', tools:['R: ggplot2, GGally, DataExplorer','Python: seaborn, pandas-profiling, sweetviz','Stata: histogram, scatter'], useCase:'探索土地利用类型与碳排放量的非线性关联；发现调查数据中的异常值与缺失模式。', difficulty:1, icon:'fas fa-magnifying-glass-chart', color:'#3b82f6', resources:[{type:'docs',platform:'Python',title:'Seaborn: Statistical Data Visualization',url:'https://seaborn.pydata.org/',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'Udemy',title:'Data Exploration & Visualization with Python',url:'https://www.udemy.com/course/exploratory-data-analysis/',level:'beginner'},{type:'paper',platform:'IEEE',title:'Exploratory Data Analysis Techniques in Statistical Research',url:'https://ieeexplore.ieee.org/',icon:'fas fa-file-pdf',year:2022}] },
    { id:103, name:'正态性与方差齐性检验', nameEn:'Normality & Homoscedasticity Tests', category:'descriptive', stage:1, discipline:['general','ecology','environmental','sociology'], desc:'Shapiro-Wilk、K-S检验判断正态性；Levene、Bartlett检验判断方差齐性，是选用参数检验方法的前提假设诊断。', tools:['R: shapiro.test(), car::leveneTest()','Python: scipy.stats.shapiro, levene','SPSS: 探索性分析','Stata: swilk, robvar'], useCase:'检验不同植被类型土壤有机碳含量是否满足正态分布假设；验证各污染等级水样重金属浓度的方差齐性。', difficulty:2, icon:'fas fa-chart-bell', color:'#3b82f6', resources:[{type:'docs',platform:'SciPy',title:'scipy.stats.shapiro - Normality Test',url:'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.shapiro.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'car::leveneTest() - Variance Homogeneity',url:'https://www.rdocumentation.org/packages/car/topics/leveneTest',icon:'fab fa-r-project',level:'intermediate'},{type:'course',platform:'Coursera',title:'Statistical Hypothesis Testing',url:'https://www.coursera.org/learn/statistical-hypothesis-testing',level:'intermediate'}] },

    // ── Stage 2: visualization ── color #8b5cf6
    { id:201, name:'科研绘图基础', nameEn:'Scientific Visualization (ggplot2/matplotlib)', category:'visualization', stage:2, discipline:['general','ecology','environmental','sociology','economics'], desc:'基于图层语法绘制期刊级高质量图表，涵盖折线图、箱线图、小提琴图、误差棒图，支持自定义主题、配色与矢量格式输出。', tools:['R: ggplot2, cowplot, ggpubr','Python: matplotlib, seaborn, plotnine','Origin: 所见即所得'], useCase:'绘制不同栖息地物种丰富度对比箱线图（含Tukey显著性标注）；绘制经济增长与碳排放趋势散点图。', difficulty:2, icon:'fas fa-chart-line', color:'#8b5cf6', resources:[{type:'docs',platform:'ggplot2',title:'ggplot2: Elegant Graphics for Data Analysis',url:'https://ggplot2.tidyverse.org/',icon:'fab fa-r-project',level:'intermediate'},{type:'course',platform:'Coursera',title:'Data Visualization with ggplot2',url:'https://www.coursera.org/learn/data-visualization-with-ggplot2',level:'intermediate'},{type:'docs',platform:'Matplotlib',title:'Matplotlib: Visualization with Python',url:'https://matplotlib.org/',icon:'fab fa-python',level:'beginner'}] },
    { id:202, name:'热图与相关矩阵可视化', nameEn:'Heatmap & Correlation Plot', category:'visualization', stage:2, discipline:['general','ecology','environmental','sociology','economics'], desc:'以颜色编码展示矩阵数据，适用于变量相关矩阵、物种×样地矩阵，支持层次聚类辅助行列重排，直观揭示数据内部结构。', tools:['R: pheatmap, ComplexHeatmap, corrplot','Python: seaborn.heatmap(), plotly','Stata: heatplot'], useCase:'展示生态群落各样地物种组成差异；可视化宏观经济指标间的相关网络。', difficulty:2, icon:'fas fa-fire', color:'#8b5cf6', resources:[{type:'docs',platform:'R',title:'pheatmap: Pretty Heatmaps in R',url:'https://www.rdocumentation.org/packages/pheatmap',icon:'fab fa-r-project',level:'intermediate'},{type:'docs',platform:'Python',title:'seaborn.heatmap - Hierarchical Clustering',url:'https://seaborn.pydata.org/generated/seaborn.heatmap.html',icon:'fab fa-python',level:'intermediate'},{type:'paper',platform:'bioRxiv',title:'Visualization Methods for High-dimensional Omics Data',url:'https://www.biorxiv.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:203, name:'地理空间可视化', nameEn:'Geospatial Visualization', category:'visualization', stage:2, discipline:['ecology','environmental','sociology','economics'], desc:'在地图底图上叠加分级地图、气泡图、等值线图和流向图，展示空间分布特征与地理流动规律，支持交互式和静态出版级输出。', tools:['R: tmap, ggmap, sf','Python: geopandas, folium, plotly.express','QGIS/ArcGIS: 可视化分析'], useCase:'绘制城市PM2.5年均浓度分级分布图；可视化城乡人口迁徙流向与区域经济梯度。', difficulty:2, icon:'fas fa-map', color:'#8b5cf6', resources:[{type:'docs',platform:'Python',title:'Folium: Interactive Maps in Python',url:'https://python-visualization.github.io/folium/',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'tmap: Thematic Maps in R',url:'https://www.rdocumentation.org/packages/tmap',icon:'fab fa-r-project',level:'intermediate'},{type:'course',platform:'Coursera',title:'GIS Spatial Analysis and Mapping',url:'https://www.coursera.org/learn/gis-spatial-analysis',level:'advanced'}] },
    { id:204, name:'桑基图与流量可视化', nameEn:'Sankey & Flow Diagram', category:'visualization', stage:2, discipline:['environmental','sociology','economics'], desc:'可视化物质、能量或人口在类别间的流动与转化，流带宽度代表流量大小，适合碳流分配、能量代谢路径、土地利用转移矩阵等。', tools:['R: networkD3, ggalluvial','Python: plotly (sankey), holoviews','D3.js: 高度自定义'], useCase:'展示城市碳流在工业、交通、建筑和农业间的分配结构；描述不同教育程度群体的职业流动矩阵。', difficulty:3, icon:'fas fa-arrows-split-up-and-left', color:'#8b5cf6', resources:[{type:'docs',platform:'Python',title:'Plotly Sankey Diagrams',url:'https://plotly.com/python/sankey-diagram/',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'networkD3: D3 Network Visualization in R',url:'https://www.rdocumentation.org/packages/networkD3',icon:'fab fa-r-project',level:'intermediate'}] },
    { id:205, name:'火山图与森林图', nameEn:'Volcano Plot & Forest Plot', category:'visualization', stage:2, discipline:['ecology','environmental','sociology'], desc:'火山图同时展示差异显著性（-log10 p值）与效应量（fold change），高效筛选显著差异指标；森林图汇总多研究效应量及置信区间，是Meta分析标准可视化格式。', tools:['R: ggplot2, EnhancedVolcano, forestplot','Python: matplotlib, pyforest','metafor: Meta分析专用'], useCase:'可视化不同污染梯度下差异代谢物的显著性与倍数变化；展示多地区研究中政策效应的Meta分析汇总结果。', difficulty:3, icon:'fas fa-chart-scatter', color:'#8b5cf6', resources:[{type:'docs',platform:'R',title:'EnhancedVolcano: Enhanced Volcano Plot in R',url:'https://www.rdocumentation.org/packages/EnhancedVolcano',icon:'fab fa-r-project',level:'advanced'},{type:'course',platform:'Udemy',title:'Meta-Analysis and Systematic Review in R',url:'https://www.udemy.com/course/meta-analysis-r/',level:'advanced'},{type:'paper',platform:'Nature',title:'Meta-Analysis: A Comprehensive Review',url:'https://www.nature.com/',icon:'fas fa-file-pdf',year:2023}] },

    // ── Stage 3: inferential ── color #10b981
    { id:301, name:'t检验', nameEn:"Student's t-test / Welch t-test", category:'inferential', stage:3, discipline:['general','ecology','environmental','sociology','economics'], desc:'比较两组均值差异是否显著，包括独立样本、配对样本及单样本t检验。Welch t检验无需等方差假设，适用于方差不齐情形。', tools:['R: t.test()','Python: scipy.stats.ttest_ind(), ttest_rel()','SPSS: 独立样本T检验','Stata: ttest'], useCase:'比较干旱区与湿润区土壤有机碳含量差异；检验环保政策实施前后居民满意度评分的变化。', difficulty:2, icon:'fas fa-not-equal', color:'#10b981', resources:[{type:'docs',platform:'SciPy',title:'scipy.stats.ttest_ind - Independent T-Test',url:'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html',icon:'fab fa-python',level:'beginner'},{type:'course',platform:'Coursera',title:'Statistical Tests and Hypothesis Testing',url:'https://www.coursera.org/learn/statistical-tests',level:'intermediate'},{type:'docs',platform:'R',title:'R: t.test() Function Documentation',url:'https://www.rdocumentation.org/packages/stats/topics/t.test',icon:'fab fa-r-project',level:'beginner'}] },
    { id:302, name:'方差分析ANOVA', nameEn:'Analysis of Variance (ANOVA)', category:'inferential', stage:3, discipline:['general','ecology','environmental','sociology'], desc:'同时比较三组及以上均值差异，避免多次t检验的I类错误膨胀。配合Tukey HSD、Bonferroni等事后多重比较定位具体差异来源。', tools:['R: aov(), car::Anova(), emmeans','Python: scipy.stats.f_oneway, pingouin','SPSS: 单因素ANOVA','Stata: anova, oneway'], useCase:'比较不同植被恢复年限（5/10/20年）样地地上生物量差异；检验四类教育程度群体收入是否显著不同。', difficulty:2, icon:'fas fa-scale-balanced', color:'#10b981', resources:[{type:'docs',platform:'Python',title:'scipy.stats.f_oneway - One-way ANOVA',url:'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.f_oneway.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'aov() - Analysis of Variance in R',url:'https://www.rdocumentation.org/packages/stats/topics/aov',icon:'fab fa-r-project',level:'intermediate'},{type:'paper',platform:'ResearchGate',title:'ANOVA in Ecological and Environmental Studies',url:'https://www.researchgate.net/',icon:'fas fa-file-pdf',year:2023}] },
    { id:303, name:'非参数检验', nameEn:'Nonparametric Tests (Mann-Whitney/Kruskal-Wallis)', category:'inferential', stage:3, discipline:['general','ecology','environmental','sociology'], desc:'不依赖正态分布假设：Mann-Whitney U适用两组，Kruskal-Wallis适用多组，Wilcoxon适用配对数据。适合小样本、偏态分布或有序类别数据。', tools:['R: wilcox.test(), kruskal.test(), FSA::dunnTest()','Python: scipy.stats.mannwhitneyu, kruskal','SPSS: 非参数检验','Stata: ranksum, kwallis'], useCase:'比较不同污染等级河段底栖动物Shannon多样性指数；分析城乡居民主观幸福感评分差异。', difficulty:2, icon:'fas fa-shuffle', color:'#10b981', resources:[{type:'docs',platform:'SciPy',title:'scipy.stats.mannwhitneyu - Mann-Whitney U Test',url:'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'edX',title:'Non-Parametric Statistics',url:'https://www.edx.org/',level:'intermediate'}] },
    { id:304, name:'相关分析', nameEn:'Correlation Analysis (Pearson/Spearman/Kendall)', category:'inferential', stage:3, discipline:['general','ecology','environmental','sociology','economics'], desc:'Pearson衡量线性相关（正态假设），Spearman秩相关适用非参数情形，Kendall τ适合小样本。偏相关可在控制混淆变量后评估两变量净相关。', tools:['R: cor(), Hmisc::rcorr(), ppcor::pcor()','Python: scipy.stats.pearsonr, spearmanr','SPSS: 双变量相关','Stata: correlate, pcorr'], useCase:'分析降水量与植被NDVI的Spearman相关；探究经济发展与环境污染的倒U型EKC关系。', difficulty:2, icon:'fas fa-link', color:'#10b981', resources:[{type:'docs',platform:'SciPy',title:'scipy.stats.spearmanr - Spearman Rank Correlation',url:'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'cor() - Correlation in R',url:'https://www.rdocumentation.org/packages/stats/topics/cor',icon:'fab fa-r-project',level:'beginner'}] },
    { id:305, name:'卡方检验与Fisher精确检验', nameEn:'Chi-square & Fisher Exact Test', category:'inferential', stage:3, discipline:['general','sociology','economics','ecology'], desc:'检验类别变量独立性：卡方适用大样本，Fisher精确检验适用期望频次小于5的情形，McNemar检验适用配对二分类数据。', tools:['R: chisq.test(), fisher.test()','Python: scipy.stats.chi2_contingency, fisher_exact','SPSS: 交叉表','Stata: tabulate, chi2'], useCase:'检验不同生境类型与保护物种存在缺失之间的关联；分析受教育程度与环保行为类型是否独立。', difficulty:2, icon:'fas fa-table', color:'#10b981', resources:[{type:'docs',platform:'SciPy',title:'scipy.stats.chi2_contingency - Chi-square Test',url:'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'chisq.test() - Chi-square Test in R',url:'https://www.rdocumentation.org/packages/stats/topics/chisq.test',icon:'fab fa-r-project',level:'beginner'},{type:'course',platform:'edX',title:'Categorical Data Analysis',url:'https://www.edx.org/',level:'intermediate'},{type:'paper',platform:'JSTOR',title:'Chi-square Test Applications in Social Research',url:'https://www.jstor.org/',icon:'fas fa-file-pdf',year:2023}] },

    // ── Stage 4: multivariate ── color #f59e0b
    { id:401, name:'多元线性回归', nameEn:'Multiple Linear Regression (MLR)', category:'multivariate', stage:4, discipline:['general','ecology','environmental','sociology','economics'], desc:'探究多个自变量对连续因变量的联合影响，通过OLS估计系数并检验显著性。需诊断残差正态性、VIF多重共线性、Cook距离异常值。', tools:['R: lm(), car::vif(), broom','Python: sklearn.LinearRegression, statsmodels.OLS','SPSS: 线性回归','Stata: regress, vif'], useCase:'建立温度、降水、海拔对物种丰富度的多元回归模型；分析教育年限与工作经验对工资收入的影响。', difficulty:3, icon:'fas fa-chart-diagram', color:'#f59e0b', resources:[{type:'docs',platform:'Python',title:'statsmodels OLS - Ordinary Least Squares',url:'https://www.statsmodels.org/stable/generated/statsmodels.regression.linear_model.OLS.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'lm() - Linear Regression in R',url:'https://www.rdocumentation.org/packages/stats/topics/lm',icon:'fab fa-r-project',level:'beginner'},{type:'course',platform:'Coursera',title:'Multiple Linear Regression',url:'https://www.coursera.org/learn/regression-analysis',level:'intermediate'},{type:'paper',platform:'arXiv',title:'Regression Diagnostics and Model Selection',url:'https://arxiv.org/search/?query=regression+diagnostics',icon:'fas fa-file-pdf',year:2023}] },
    { id:402, name:'Logistic回归', nameEn:'Logistic Regression', category:'multivariate', stage:4, discipline:['general','ecology','environmental','sociology','economics'], desc:'用于二元、多项或有序因变量建模，输出Odds Ratio便于解释，可预测物种存在概率或事件发生概率，支持正则化防止过拟合。', tools:['R: glm(family=binomial), nnet::multinom, MASS::polr','Python: sklearn.LogisticRegression, statsmodels.Logit','SPSS: 二元Logistic','Stata: logit, mlogit, ologit'], useCase:'预测物种在特定环境梯度下的存在概率；分析影响居民参与环保志愿服务意愿的关键因素。', difficulty:3, icon:'fas fa-code-branch', color:'#f59e0b', resources:[{type:'docs',platform:'Python',title:'sklearn LogisticRegression - Classification',url:'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'glm() - Generalized Linear Models in R',url:'https://www.rdocumentation.org/packages/stats/topics/glm',icon:'fab fa-r-project',level:'intermediate'},{type:'course',platform:'Udemy',title:'Logistic Regression Masterclass',url:'https://www.udemy.com/course/logistic-regression/',level:'intermediate'},{type:'paper',platform:'arXiv',title:'Logistic Regression in Binary Classification Problems',url:'https://arxiv.org/search/?query=logistic+regression',icon:'fas fa-file-pdf',year:2023}] },
    { id:403, name:'广义线性模型GLM', nameEn:'Generalized Linear Model (GLM)', category:'multivariate', stage:4, discipline:['ecology','environmental','sociology'], desc:'扩展线性回归至非正态响应：泊松用于计数数据，负二项用于过离散计数，Gamma用于正偏连续量，通过链接函数连接线性预测器与期望值。', tools:['R: glm(), MASS::glm.nb(), glmmTMB','Python: statsmodels.GLM','SAS: PROC GENMOD','Stata: glm, nbreg, poisson'], useCase:'对样地鸟类个体数（计数，泊松回归）进行环境因子回归建模；分析降雨事件下污染物径流浓度的驱动因素。', difficulty:3, icon:'fas fa-wave-square', color:'#f59e0b', resources:[{type:'docs',platform:'R',title:'glm() - Generalized Linear Models',url:'https://www.rdocumentation.org/packages/stats/topics/glm',icon:'fab fa-r-project',level:'intermediate'},{type:'docs',platform:'Python',title:'statsmodels GLM - Count Data & Link Functions',url:'https://www.statsmodels.org/stable/generated/statsmodels.genmod.generalized_linear_model.GLM.html',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Generalized Linear Models and their Extensions',url:'https://www.coursera.org/learn/generalized-linear-models',level:'advanced'},{type:'paper',platform:'bioRxiv',title:'GLM Applications in Ecological Count Data',url:'https://www.biorxiv.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:404, name:'混合效应模型LMM/GLMM', nameEn:'Linear/Generalized Mixed Effects Models', category:'multivariate', stage:4, discipline:['ecology','environmental','sociology'], desc:'在固定效应基础上引入随机效应，处理嵌套结构（个体嵌套于地点）与重复测量数据的非独立性，允许组间截距或斜率变化，提升推断准确性。', tools:['R: lme4, nlme, glmmTMB','Python: statsmodels.MixedLM, pymer4','SAS: PROC MIXED','Stata: mixed, melogit'], useCase:'分析跨多个流域的水质监测数据（以流域为随机效应）；控制面板调查中个体异质性的多层次分析。', difficulty:4, icon:'fas fa-layer-group', color:'#f59e0b', resources:[{type:'docs',platform:'R',title:'lme4: Linear Mixed-Effects Models',url:'https://www.rdocumentation.org/packages/lme4',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'statsmodels Mixed Linear Regression',url:'https://www.statsmodels.org/stable/mixed_linear.html',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Linear Mixed Models',url:'https://www.coursera.org/learn/mixed-effects-models',level:'advanced'},{type:'paper',platform:'ResearchGate',title:'Mixed-Effects Models in Ecological & Environmental Studies',url:'https://www.researchgate.net/',icon:'fas fa-file-pdf',year:2023}] },
    { id:405, name:'广义加性模型GAM', nameEn:'Generalized Additive Model (GAM)', category:'multivariate', stage:4, discipline:['ecology','environmental','economics'], desc:'用样条函数拟合非线性关系，无需预设函数形式，能捕获生态响应曲线中的肩型与钟型非线性模式，可整合多个平滑项并进行交互建模。', tools:['R: mgcv::gam(), gratia','Python: pygam'], useCase:'拟合气温与物种多样性的非线性单峰响应曲线；分析空气污染物浓度与儿童哮喘发病率的非线性剂量响应关系。', difficulty:4, icon:'fas fa-bezier-curve', color:'#f59e0b', resources:[{type:'docs',platform:'R',title:'mgcv: Generalized Additive Models',url:'https://www.rdocumentation.org/packages/mgcv',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'PyGAM - Generalized Additive Models',url:'https://github.com/dswah/pyGAM',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Udemy',title:'Nonlinear Regression with GAM',url:'https://www.udemy.com/course/generalized-additive-models/',level:'advanced'},{type:'paper',platform:'arXiv',title:'Smoothing Splines and GAM for Ecological Response Curves',url:'https://arxiv.org/search/?query=generalized+additive+models',icon:'fas fa-file-pdf',year:2023}] },
    { id:406, name:'主成分分析PCA', nameEn:'Principal Component Analysis (PCA)', category:'multivariate', stage:4, discipline:['general','ecology','environmental','economics'], desc:'将多维相关变量线性变换为少数互不相关的主成分，实现降维、消除多重共线性并构建综合指标，结合双标图同时展示样本与变量关系。', tools:['R: prcomp(), vegan::rda(), factoextra','Python: sklearn.PCA','SPSS: 因子分析-PCA','Stata: pca'], useCase:'从温度、降水、土壤等10个环境变量中提取2-3个主成分用于生态排序；构建城市绿色发展综合指数。', difficulty:3, icon:'fas fa-compress-arrows-alt', color:'#f59e0b', resources:[{type:'docs',platform:'Python',title:'sklearn PCA - Dimensionality Reduction',url:'https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'prcomp() - Principal Component Analysis',url:'https://www.rdocumentation.org/packages/stats/topics/prcomp',icon:'fab fa-r-project',level:'beginner'},{type:'course',platform:'Coursera',title:'Dimensionality Reduction & PCA',url:'https://www.coursera.org/learn/dimensionality-reduction',level:'intermediate'},{type:'paper',platform:'IEEE',title:'PCA Applications in Multivariate Analysis',url:'https://ieeexplore.ieee.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:407, name:'聚类分析', nameEn:'Cluster Analysis (k-means/Hierarchical/DBSCAN)', category:'multivariate', stage:4, discipline:['general','ecology','environmental','sociology'], desc:'无监督学习方法，将样本划分为内部同质的群组。k-means适用球形簇，层次聚类输出树状图，DBSCAN能发现任意形状簇并自动识别噪声点。', tools:['R: kmeans(), hclust(), cluster, factoextra','Python: sklearn.cluster, scipy.cluster','SPSS: 系统聚类','Stata: cluster'], useCase:'基于物种组成相似性将样地划分为不同植被群落类型；识别城市居民出行模式的潜在行为聚类。', difficulty:3, icon:'fas fa-object-group', color:'#f59e0b', resources:[{type:'docs',platform:'Python',title:'sklearn Cluster Analysis - k-means/DBSCAN',url:'https://scikit-learn.org/stable/modules/clustering.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'kmeans() & hclust() - Clustering in R',url:'https://www.rdocumentation.org/packages/stats/topics/kmeans',icon:'fab fa-r-project',level:'beginner'},{type:'course',platform:'Udemy',title:'Clustering Algorithms: k-means, Hierarchical & DBSCAN',url:'https://www.udemy.com/course/clustering-algorithms/',level:'intermediate'},{type:'paper',platform:'arXiv',title:'Clustering Methods in Pattern Recognition',url:'https://arxiv.org/search/?query=clustering+analysis',icon:'fas fa-file-pdf',year:2023}] },
    { id:408, name:'生态排序CCA/RDA/NMDS', nameEn:'Ordination Methods (CCA/RDA/NMDS)', category:'multivariate', stage:4, discipline:['ecology','environmental'], desc:'生态学核心多变量方法：RDA（线性约束排序）、CCA（单峰约束排序）、NMDS（基于距离矩阵的非度量排序），同时分析物种矩阵与环境梯度关系。', tools:['R: vegan::cca(), rda(), metaMDS()','Python: skbio.stats.ordination','PC-ORD: 专业生态排序软件'], useCase:'分析底栖动物群落组成矩阵与水体理化因子（pH、氮磷比、溶解氧）梯度的关系。', difficulty:4, icon:'fas fa-circle-nodes', color:'#f59e0b', resources:[{type:'docs',platform:'R',title:'vegan: Ordination Methods (CCA/RDA/NMDS)',url:'https://www.rdocumentation.org/packages/vegan',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'scikit-bio Ordination Methods',url:'http://scikit-bio.org/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Community Ecology & Ordination',url:'https://www.coursera.org/learn/community-ecology',level:'advanced'},{type:'paper',platform:'bioRxiv',title:'Ordination Techniques in Community Analysis',url:'https://www.biorxiv.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:409, name:'结构方程模型SEM', nameEn:'Structural Equation Modeling (SEM)', category:'multivariate', stage:4, discipline:['ecology','environmental','sociology','economics'], desc:'同时估计多变量因果路径，整合测量模型（潜变量）与结构模型（路径），通过CFI、RMSEA等拟合指数评估整体适配度，支持CFA验证性因子分析。', tools:['R: lavaan, piecewiseSEM, semPlot','Python: semopy','Mplus: 商业软件','AMOS: 图形化界面','SmartPLS: PLS-SEM'], useCase:'分析气候通过土壤质量影响植被生产力的路径效应；检验技术创新通过制度改善影响环保绩效的中介路径。', difficulty:5, icon:'fas fa-diagram-project', color:'#f59e0b', resources:[{type:'docs',platform:'R',title:'lavaan: Structural Equation Modeling',url:'https://www.rdocumentation.org/packages/lavaan',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'semopy: Structural Equation Modeling',url:'https://github.com/semopy/semopy',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Structural Equation Modeling',url:'https://www.coursera.org/learn/structural-equation-modeling',level:'advanced'},{type:'paper',platform:'ResearchGate',title:'SEM Applications in Environmental & Social Research',url:'https://www.researchgate.net/',icon:'fas fa-file-pdf',year:2023}] },

    // ── Stage 5: spatial ── color #06b6d4
    { id:501, name:'空间自相关分析', nameEn:"Spatial Autocorrelation (Moran's I)", category:'spatial', stage:5, discipline:['ecology','environmental','sociology','economics'], desc:"全局Moran's I检验空间聚集性；Getis-Ord G*识别高低值热点区域；LISA定位空间异常聚集点。违反空间独立性假设时必须处理。", tools:["R: spdep::moran.test(), localMoran()",'Python: esda.Moran, libpysal','GeoDa: 开源GUI','ArcGIS: 空间统计工具箱'], useCase:'检验城市PM2.5的空间集聚模式与热点区域；诊断物种分布点数据的空间依赖性。', difficulty:3, icon:'fas fa-location-dot', color:'#06b6d4', resources:[{type:'docs',platform:'R',title:'spdep: Spatial Dependence',url:'https://www.rdocumentation.org/packages/spdep',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'esda: Exploratory Spatial Data Analysis',url:'https://esda.readthedocs.io/',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'edX',title:'Spatial Data Analysis',url:'https://www.edx.org/',level:'intermediate'},{type:'paper',platform:'JSTOR',title:'Spatial Autocorrelation in Geographic Analysis',url:'https://www.jstor.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:502, name:'地理加权回归GWR', nameEn:'Geographically Weighted Regression (GWR)', category:'spatial', stage:5, discipline:['ecology','environmental','sociology','economics'], desc:'允许回归系数随地理位置变化，捕获变量关系的空间异质性，输出每个位置的局部系数可视化地图，揭示驱动因素的区域差异。', tools:['R: GWmodel, spgwr','Python: mgwr (多尺度GWR)','ArcGIS Pro: GWR工具','GWR4.0: 专用软件'], useCase:'分析不同城区绿地覆盖率对房价的局部影响差异；揭示气候变化对各省农业单产影响的空间分异。', difficulty:4, icon:'fas fa-map-location-dot', color:'#06b6d4', resources:[{type:'docs',platform:'R',title:'GWmodel: Geographically Weighted Models',url:'https://www.rdocumentation.org/packages/GWmodel',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'mgwr: Multi-scale Geographically Weighted Regression',url:'https://mgwr.readthedocs.io/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Spatial Analysis and Modeling',url:'https://www.coursera.org/learn/spatial-analysis',level:'advanced'},{type:'paper',platform:'IEEE',title:'Geographically Weighted Regression in Spatial Heterogeneity',url:'https://ieeexplore.ieee.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:503, name:'克里金插值与地统计学', nameEn:'Kriging & Geostatistics', category:'spatial', stage:5, discipline:['ecology','environmental'], desc:'通过半变异函数建模空间相关结构，对未采样位置进行最优无偏插值，同时输出插值不确定性（标准误差）估计，量化空间预测精度。', tools:['R: gstat, geoR, fields','Python: pykrige, gstools','ESRI Geostatistical Analyst','QGIS: 插值插件'], useCase:'由离散土壤采样点插值生成连续土壤重金属浓度分布图；基于气象站数据插值区域降水量空间分布。', difficulty:4, icon:'fas fa-braille', color:'#06b6d4', resources:[{type:'docs',platform:'R',title:'gstat: Spatial and Spatio-Temporal Geostatistics',url:'https://www.rdocumentation.org/packages/gstat',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'PyKrige: Kriging Interpolation',url:'https://github.com/GeoStat-Framework/PyKrige',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'edX',title:'Geostatistics and Spatial Analysis',url:'https://www.edx.org/',level:'advanced'},{type:'paper',platform:'arXiv',title:'Kriging and Spatial Interpolation Methods',url:'https://arxiv.org/search/?query=kriging',icon:'fas fa-file-pdf',year:2023}] },
    { id:504, name:'物种分布模型SDM', nameEn:'Species Distribution Modeling (MaxEnt/BRT)', category:'spatial', stage:5, discipline:['ecology','environmental'], desc:'整合物种分布记录与环境图层预测适宜生境空间分布。MaxEnt仅需存在点数据；BRT或随机森林适用存在-缺失数据，可分析环境变量贡献率。', tools:['MaxEnt: 官方免费软件','R: dismo, biomod2, ENMeval','Python: elapid','QGIS: 集成SDM工具'], useCase:'预测入侵植物在气候变化下的潜在扩散分布区；识别濒危物种关键生境并划定优先保护区域。', difficulty:4, icon:'fas fa-paw', color:'#06b6d4', resources:[{type:'docs',platform:'R',title:'dismo: Species Distribution Modeling',url:'https://www.rdocumentation.org/packages/dismo',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'elapid: Species Distribution Modeling',url:'https://github.com/cisaacstern/elapid',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Niche Modeling and Species Distribution',url:'https://www.coursera.org/learn/species-distribution',level:'advanced'},{type:'paper',platform:'bioRxiv',title:'MaxEnt and Species Distribution Modeling',url:'https://www.biorxiv.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:505, name:'核密度估计空间分析', nameEn:'Spatial Kernel Density Estimation (KDE)', category:'spatial', stage:5, discipline:['ecology','environmental','sociology'], desc:'利用核函数对离散事件点进行平滑，生成连续密度曲面，反映点事件的空间集聚强度，用于识别热点区域、野生动物活动中心。', tools:['R: ks::kde(), spatstat','Python: scipy.stats.gaussian_kde, sklearn','ArcGIS: 核密度工具','QGIS: 热力图'], useCase:'基于野外调查记录估计濒危动物活动热点区域和家域范围；分析城市交通事故的空间集聚热点路段。', difficulty:2, icon:'fas fa-circle', color:'#06b6d4', resources:[{type:'docs',platform:'Python',title:'scipy.stats.gaussian_kde - Kernel Density Estimation',url:'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gaussian_kde.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'ks: Kernel Smoothing',url:'https://www.rdocumentation.org/packages/ks',icon:'fab fa-r-project',level:'intermediate'},{type:'course',platform:'Udemy',title:'Spatial Point Pattern Analysis',url:'https://www.udemy.com/course/spatial-analysis/',level:'intermediate'},{type:'paper',platform:'JSTOR',title:'Kernel Density Estimation in Spatial Analysis',url:'https://www.jstor.org/',icon:'fas fa-file-pdf',year:2023}] },

    // ── Stage 6: timeseries ── color #ec4899
    { id:601, name:'ARIMA与SARIMA建模', nameEn:'ARIMA & Seasonal ARIMA', category:'timeseries', stage:6, discipline:['general','environmental','economics','sociology'], desc:'自回归积分滑动平均模型：ARIMA(p,d,q)建模平稳时序；SARIMA加入季节项S(P,D,Q)捕获周期性波动，通过ACF/PACF识别参数，AIC/BIC准则选模。', tools:['R: forecast::auto.arima(), astsa','Python: statsmodels.ARIMA, pmdarima','SPSS: 时间序列分析','Stata: arima'], useCase:'预测未来12个月流域月均降雨量；对CO2月均浓度时序进行季节调整与长期趋势提取。', difficulty:3, icon:'fas fa-chart-mixed', color:'#ec4899', resources:[{type:'docs',platform:'R',title:'forecast::auto.arima() - ARIMA Modeling',url:'https://www.rdocumentation.org/packages/forecast/topics/auto.arima',icon:'fab fa-r-project',level:'intermediate'},{type:'docs',platform:'Python',title:'statsmodels ARIMA - Time Series',url:'https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.ARIMA.html',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'Coursera',title:'Time Series Forecasting',url:'https://www.coursera.org/learn/time-series',level:'intermediate'},{type:'paper',platform:'arXiv',title:'ARIMA Models in Environmental Time Series',url:'https://arxiv.org/search/?query=ARIMA+time+series',icon:'fas fa-file-pdf',year:2023}] },
    { id:602, name:'时序分解与Mann-Kendall趋势检验', nameEn:'Time Series Decomposition & Mann-Kendall Test', category:'timeseries', stage:6, discipline:['ecology','environmental','economics','sociology'], desc:'STL/X-13分解将时序拆解为趋势、季节与余项三分量。Mann-Kendall非参数趋势检验配合Sen斜率估计，广泛用于气候与生态长期趋势检测，无需正态分布假设。', tools:['R: stats::stl(), trend::mk.test(), Kendall','Python: statsmodels.seasonal_decompose, pymannkendall','Stata: xtmk'], useCase:'检验过去20年黄河流域年径流量是否存在显著下降趋势；分解城市NO2浓度的节假日季节效应与年际趋势。', difficulty:3, icon:'fas fa-timeline', color:'#ec4899', resources:[{type:'docs',platform:'R',title:'stats::stl() - Time Series Decomposition',url:'https://www.rdocumentation.org/packages/stats/topics/stl',icon:'fab fa-r-project',level:'beginner'},{type:'docs',platform:'Python',title:'pymannkendall - Mann-Kendall Test',url:'https://github.com/adi1094/pymannkendall',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'Udemy',title:'Trend Analysis and Seasonal Decomposition',url:'https://www.udemy.com/course/time-series-decomposition/',level:'intermediate'},{type:'paper',platform:'Springer',title:'Mann-Kendall Trend Test in Environmental Monitoring',url:'https://link.springer.com/',icon:'fas fa-file-pdf',year:2023}] },
    { id:603, name:'VAR向量自回归与格兰杰因果', nameEn:'VAR & Granger Causality', category:'timeseries', stage:6, discipline:['general','economics','environmental','sociology'], desc:'多变量时序系统：VAR建模多变量相互预测关系；脉冲响应函数分析一变量冲击的动态影响；格兰杰因果检验判断一变量是否有助于预测另一变量。', tools:['R: vars::VAR(), grangertest()','Python: statsmodels.VAR','Eviews: 经济学标配','Stata: var, vargranger'], useCase:'分析GDP增长、能源消耗与碳排放三者间的格兰杰因果关系及动态响应机制。', difficulty:4, icon:'fas fa-arrows-rotate', color:'#ec4899', resources:[{type:'docs',platform:'R',title:'vars: Vector Autoregression',url:'https://www.rdocumentation.org/packages/vars',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'statsmodels Vector Autoregression',url:'https://www.statsmodels.org/stable/tsa_api.html',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Multivariate Time Series Analysis',url:'https://www.coursera.org/learn/multivariate-time-series',level:'advanced'},{type:'paper',platform:'JSTOR',title:'VAR Models and Granger Causality',url:'https://www.jstor.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:604, name:'变化点检测', nameEn:'Change Point Detection (CUSUM/PELT)', category:'timeseries', stage:6, discipline:['general','ecology','environmental','economics','sociology'], desc:'识别时序均值、方差或分布发生结构性突变的时间节点。CUSUM适合在线监测，PELT算法高效检测多变化点，适用于生态状态转变与经济结构突变识别。', tools:['R: changepoint, strucchange, bcp','Python: ruptures, changefinder','Stata: breakpoint tests'], useCase:'检测湖泊水质时序中富营养化突变的发生节点；识别经济时序中金融危机引起的结构突变点。', difficulty:3, icon:'fas fa-bolt-lightning', color:'#ec4899', resources:[{type:'docs',platform:'R',title:'changepoint: Change Point Detection',url:'https://www.rdocumentation.org/packages/changepoint',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'ruptures: Change Point Detection',url:'https://github.com/deepcharles/ruptures',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Udemy',title:'Detecting Breaks and Change Points',url:'https://www.udemy.com/course/change-point-detection/',level:'advanced'},{type:'paper',platform:'arXiv',title:'Change Point Detection Methods and Applications',url:'https://arxiv.org/search/?query=change+point+detection',icon:'fas fa-file-pdf',year:2023}] },

    // ── Stage 7: causal ── color #ef4444
    { id:701, name:'双重差分法DID', nameEn:'Difference-in-Differences (DiD)', category:'causal', stage:7, discipline:['economics','sociology','environmental'], desc:'通过处理组与控制组政策前后差异之差识别平均处理效应（ATT），依赖平行趋势假设。支持多期DID和交错DID广义估计量，适合政策效果评估的准自然实验。', tools:['R: did, fixest::feols(), plm','Python: linearmodels.PanelOLS','Stata: diff, reghdfe, did_multiplegt'], useCase:'评估碳排放权交易试点对企业碳排放量的因果净效应；识别最低工资立法对城市就业率的政策影响。', difficulty:4, icon:'fas fa-arrow-trend-down', color:'#ef4444', resources:[{type:'docs',platform:'R',title:'did: Difference-in-Differences',url:'https://www.rdocumentation.org/packages/did',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'linearmodels: Panel OLS',url:'https://bashtage.github.io/linearmodels/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Causal Inference & Policy Evaluation',url:'https://www.coursera.org/learn/causal-inference',level:'advanced'},{type:'paper',platform:'arXiv',title:'Difference-in-Differences Methods',url:'https://arxiv.org/search/?query=difference-in-differences',icon:'fas fa-file-pdf',year:2023}] },
    { id:702, name:'断点回归设计RDD', nameEn:'Regression Discontinuity Design (RDD)', category:'causal', stage:7, discipline:['economics','sociology'], desc:'利用分配变量在阈值处的不连续性识别因果效应，分精确断点（Sharp RDD）和模糊断点（Fuzzy RDD），基于局部随机化思想，仅识别阈值附近的局部平均处理效应。', tools:['R: rdrobust, rddensity','Python: rdrobust (Python版)','Stata: rdrobust, rddensity'], useCase:'利用贫困线阈值评估低保政策对农村家庭消费支出的影响；分析空气质量达标线对企业迁址决策的效应。', difficulty:4, icon:'fas fa-chart-gantt', color:'#ef4444', resources:[{type:'docs',platform:'R',title:'rdrobust: Regression Discontinuity',url:'https://www.rdocumentation.org/packages/rdrobust',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'rdrobust: Regression Discontinuity (Python)',url:'https://github.com/rdrobust/rdrobust-python',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'edX',title:'Regression Discontinuity Design',url:'https://www.edx.org/',level:'advanced'},{type:'paper',platform:'JSTOR',title:'RDD Applications in Economics',url:'https://www.jstor.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:703, name:'工具变量法IV/2SLS', nameEn:'Instrumental Variables (IV/2SLS)', category:'causal', stage:7, discipline:['economics','sociology','environmental'], desc:'通过工具变量处理内生性问题（遗漏变量、逆向因果、测量误差）。Hausman检验内生性，第一阶段F统计量（>10）检验工具变量强度，弱工具会导致有偏估计。', tools:['R: AER::ivreg(), fixest','Python: linearmodels.IV2SLS','Stata: ivregress, ivreg2','Eviews: TSLS'], useCase:'以历史降水量作为农业收入的工具变量，估计收入对农村居民健康状况的因果效应。', difficulty:5, icon:'fas fa-code-fork', color:'#ef4444', resources:[{type:'docs',platform:'R',title:'AER::ivreg() - Instrumental Variables',url:'https://www.rdocumentation.org/packages/AER/topics/ivreg',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'linearmodels IV2SLS',url:'https://bashtage.github.io/linearmodels/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Instrumental Variables & Causal Inference',url:'https://www.coursera.org/learn/instrumental-variables',level:'advanced'},{type:'paper',platform:'Springer',title:'IV Estimation in Econometrics',url:'https://link.springer.com/',icon:'fas fa-file-pdf',year:2023}] },
    { id:704, name:'倾向得分匹配PSM', nameEn:'Propensity Score Matching (PSM)', category:'causal', stage:7, discipline:['economics','sociology','ecology'], desc:'通过Logistic回归估计倾向得分，为处理组寻找可比控制组，消除可观测协变量偏差。常用最近邻匹配、核匹配、卡尺匹配，需检验匹配后协变量平衡性。', tools:['R: MatchIt, WeightIt, twang','Python: causalinference, pymatch, DoWhy','Stata: psmatch2, teffects'], useCase:'评估生态补偿项目对农户收入的净效应（消除参与选择偏差）；比较不同治理模式城市的空气质量绩效。', difficulty:4, icon:'fas fa-people-arrows', color:'#ef4444', resources:[{type:'docs',platform:'R',title:'MatchIt: Matching for Causal Inference',url:'https://www.rdocumentation.org/packages/MatchIt',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'causalinference: Propensity Score',url:'https://github.com/AMLab-Amsterdam/causalml',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Udemy',title:'Propensity Score Methods',url:'https://www.udemy.com/course/propensity-score/',level:'advanced'},{type:'paper',platform:'ResearchGate',title:'PSM in Policy Evaluation',url:'https://www.researchgate.net/',icon:'fas fa-file-pdf',year:2023}] },
    { id:705, name:'合成控制法SCM', nameEn:'Synthetic Control Method (SCM)', category:'causal', stage:7, discipline:['economics','environmental'], desc:'通过多个控制单元加权组合构建反事实处理组，适合单一政策干预单元评估，权重由匹配处理前预测变量确定，置换检验提供推断依据。', tools:['R: Synth, SCtools, augsynth','Python: pysynth, synth_control','Stata: synth, sdid'], useCase:'评估某试点城市垃圾分类政策对人均固废处理量的减排效果；估计碳税政策对特定省份碳排放量的影响。', difficulty:5, icon:'fas fa-wand-sparkles', color:'#ef4444', resources:[{type:'docs',platform:'R',title:'Synth: Synthetic Control Methods',url:'https://www.rdocumentation.org/packages/Synth',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'pysynth: Synthetic Control',url:'https://github.com/OscarEngelbrektson/SyntheticControlMethods',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Synthetic Control Methods',url:'https://www.coursera.org/learn/synthetic-control',level:'advanced'},{type:'paper',platform:'JSTOR',title:'Synthetic Control Methods for Comparative Case Studies',url:'https://www.jstor.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:706, name:'因果图与DAG分析', nameEn:'Causal Graph & DAG Analysis', category:'causal', stage:7, discipline:['general','ecology','sociology','economics'], desc:'利用有向无环图显式化因果假设，识别混淆变量、中介变量与碰撞变量，依据后门准则与前门准则指导协变量调整集的选择，避免过度控制偏倚。', tools:['R: dagitty, ggdag, mediation','Python: dowhy, causalnex','DAGitty: 在线交互工具'], useCase:'设计水质研究的协变量调整方案；构建气候变化影响人口迁移的因果链路图。', difficulty:4, icon:'fas fa-share-nodes', color:'#ef4444', resources:[{type:'docs',platform:'R',title:'dagitty: Directed Acyclic Graphs',url:'https://www.rdocumentation.org/packages/dagitty',icon:'fab fa-r-project',level:'intermediate'},{type:'docs',platform:'Python',title:'DoWhy: Causal Inference',url:'https://microsoft.github.io/dowhy/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'edX',title:'Causal Inference & DAGs',url:'https://www.edx.org/',level:'advanced'},{type:'paper',platform:'arXiv',title:'Causal Graphs and Backdoor Adjustment',url:'https://arxiv.org/search/?query=causal+DAG',icon:'fas fa-file-pdf',year:2023}] },
    { id:707, name:'中介与调节效应分析', nameEn:'Mediation & Moderation Analysis', category:'causal', stage:7, discipline:['sociology','economics','ecology'], desc:'中介分析（Bootstrap法）识别变量X通过中介M影响Y的间接效应；调节分析（交互项检验）识别第三变量如何改变X对Y的效应方向或强度。', tools:['R: mediation, lavaan, interactions','Python: pingouin, statsmodels','SPSS: PROCESS宏','Stata: mediate, margins'], useCase:'分析绿地暴露通过心理压力缓解影响居民健康的中介路径；检验社会资本对经济与幸福感关系的调节效应。', difficulty:3, icon:'fas fa-arrows-left-right-to-line', color:'#ef4444', resources:[{type:'docs',platform:'R',title:'mediation: Mediation Analysis',url:'https://www.rdocumentation.org/packages/mediation',icon:'fab fa-r-project',level:'intermediate'},{type:'docs',platform:'Python',title:'pingouin: Mediation Analysis',url:'https://pingouin-stats.org/',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'Udemy',title:'Mediation and Moderation Analysis',url:'https://www.udemy.com/course/mediation-analysis/',level:'intermediate'},{type:'paper',platform:'Springer',title:'Mediation and Moderation Effects',url:'https://link.springer.com/',icon:'fas fa-file-pdf',year:2023}] },

    // ── Stage 8: bayesian ── color #a855f7
    { id:801, name:'贝叶斯推断基础', nameEn:'Bayesian Inference (Prior/Posterior)', category:'bayesian', stage:8, discipline:['general','ecology','environmental','economics'], desc:'将先验知识与数据似然融合为后验分布，输出完整参数不确定性估计（可信区间），适合整合专家知识、处理小样本数据，并支持序贯更新。', tools:['R: brms, rstanarm, BayesFactor','Python: PyMC, ArviZ','Stan: 高效HMC采样器','JAGS: BUGS语言'], useCase:'结合专家经验作先验估计濒危物种种群年增长率；小样本情景下对土壤污染物浓度进行参数估计。', difficulty:4, icon:'fas fa-infinity', color:'#a855f7', resources:[{type:'docs',platform:'R',title:'brms: Bayesian Regression Models',url:'https://www.rdocumentation.org/packages/brms',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'PyMC: Bayesian Modeling',url:'https://www.pymc.io/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Bayesian Methods',url:'https://www.coursera.org/learn/bayesian-methods',level:'advanced'},{type:'paper',platform:'arXiv',title:'Bayesian Inference and Hierarchical Modeling',url:'https://arxiv.org/search/?query=bayesian+inference',icon:'fas fa-file-pdf',year:2023}] },
    { id:802, name:'贝叶斯层级模型', nameEn:'Bayesian Hierarchical Model', category:'bayesian', stage:8, discipline:['ecology','environmental','sociology'], desc:'跨水平共享信息（部分池化）的贝叶斯模型，同时估计群体水平与个体/地点水平参数，自然处理样本量不等的嵌套结构，避免完全池化与无池化的极端偏差。', tools:['R: brms, rstanarm, rjags','Python: PyMC, bambi','Stan: 完全自定义'], useCase:'跨多个流域的水质监测数据联合建模（流域间互借统计强度）；多层次社会调查中个体与社区效应分离。', difficulty:5, icon:'fas fa-sitemap', color:'#a855f7', resources:[{type:'docs',platform:'R',title:'rstanarm: Bayesian Hierarchical Models',url:'https://www.rdocumentation.org/packages/rstanarm',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'bambi: Bayesian Model Building',url:'https://bambinos.github.io/bambi/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'edX',title:'Hierarchical Bayesian Models',url:'https://www.edx.org/',level:'advanced'},{type:'paper',platform:'Springer',title:'Bayesian Hierarchical Modeling',url:'https://link.springer.com/',icon:'fas fa-file-pdf',year:2023}] },
    { id:803, name:'MCMC采样', nameEn:'MCMC (Metropolis-Hastings/HMC)', category:'bayesian', stage:8, discipline:['general','ecology','environmental'], desc:'通过构建收敛到目标后验分布的马尔可夫链进行采样，NUTS/HMC（哈密顿蒙特卡洛）效率远高于经典M-H算法，Stan默认使用NUTS进行自动微分。', tools:['R: brms, rstan, coda','Python: PyMC, numpyro','Stan: NUTS标准实现','JAGS: 吉布斯采样'], useCase:'为复杂生态模型（如食物网能量流动模型）进行后验参数估计；贝叶斯非线性混合模型的参数推断。', difficulty:4, icon:'fas fa-dice', color:'#a855f7', resources:[{type:'docs',platform:'R',title:'rstan: RStan - R Interface to Stan',url:'https://www.rdocumentation.org/packages/rstan',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'numpyro: NumPyro MCMC',url:'https://num.pyro.ai/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Udemy',title:'MCMC Sampling Methods',url:'https://www.udemy.com/course/mcmc-sampling/',level:'advanced'},{type:'paper',platform:'arXiv',title:'Hamiltonian Monte Carlo and NUTS',url:'https://arxiv.org/search/?query=hamiltonian+monte+carlo',icon:'fas fa-file-pdf',year:2023}] },
    { id:804, name:'生态占有率与N-mixture模型', nameEn:'Occupancy & N-mixture Models', category:'bayesian', stage:8, discipline:['ecology'], desc:'专为不完全检测设计的层级模型，将观测过程（检测概率p）与生态过程（占有率或丰度）分离，获得无偏估计，克服传统计数法的低估偏差。', tools:['R: unmarked, ubms, PRESENCE','Python: ecomodel','PRESENCE: 专用软件','MARK: 标记重捕分析'], useCase:'估计考虑检测失误情况下林区鸟类的真实丰度；建模物种局部灭绝与再定殖的动态占有率过程。', difficulty:5, icon:'fas fa-binoculars', color:'#a855f7', resources:[{type:'docs',platform:'R',title:'unmarked: Models for Wildlife Occupancy',url:'https://www.rdocumentation.org/packages/unmarked',icon:'fab fa-r-project',level:'advanced'},{type:'docs',platform:'Python',title:'ecomodel: Species Distribution Models',url:'https://github.com/PrincetonUniversity/ecomodel',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Wildlife Population Models',url:'https://www.coursera.org/learn/wildlife-models',level:'advanced'},{type:'paper',platform:'bioRxiv',title:'Occupancy and N-mixture Models',url:'https://www.biorxiv.org/',icon:'fas fa-file-pdf',year:2023}] },

    // ── Stage 9: ml ── color #22c55e
    { id:901, name:'随机森林', nameEn:'Random Forest (RF)', category:'ml', stage:9, discipline:['general','ecology','environmental','economics'], desc:'集成多棵决策树的Bagging方法，通过随机特征子集增加树间多样性，天然处理非线性与交互效应，提供变量重要性排名，对缺失值与噪声有较强鲁棒性。', tools:['R: randomForest, ranger, caret','Python: sklearn.RandomForestClassifier/Regressor','H2O.ai: 大规模RF'], useCase:'基于气候、地形和人为干扰特征预测目标物种分布；筛选影响企业绿色技术创新的关键驱动因子。', difficulty:3, icon:'fas fa-tree', color:'#22c55e', resources:[{type:'docs',platform:'Python',title:'sklearn Random Forest',url:'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html',icon:'fab fa-python',level:'beginner'},{type:'docs',platform:'R',title:'randomForest: Random Forest',url:'https://www.rdocumentation.org/packages/randomForest',icon:'fab fa-r-project',level:'beginner'},{type:'course',platform:'Udemy',title:'Random Forest & Ensemble Methods',url:'https://www.udemy.com/course/random-forest/',level:'intermediate'},{type:'paper',platform:'IEEE',title:'Random Forest in Machine Learning',url:'https://ieeexplore.ieee.org/',icon:'fas fa-file-pdf',year:2023}] },
    { id:902, name:'梯度提升XGBoost/LightGBM', nameEn:'Gradient Boosting (XGBoost/LightGBM)', category:'ml', stage:9, discipline:['general','ecology','environmental','economics'], desc:'顺序构建弱学习器修正前轮残差，通常比随机森林更精准。XGBoost支持L1/L2正则化，LightGBM叶子优先生长速度更快，SHAP值提供全局可解释性。', tools:['Python: xgboost, lightgbm, catboost, sklearn','R: xgboost, lightgbm','H2O.ai: 自动调参'], useCase:'预测城市洪涝风险分级；精准估算地块级碳汇量。', difficulty:3, icon:'fas fa-bolt', color:'#22c55e', resources:[{type:'docs',platform:'Python',title:'XGBoost: Gradient Boosting',url:'https://xgboost.readthedocs.io/',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'Python',title:'LightGBM: Fast Gradient Boosting',url:'https://lightgbm.readthedocs.io/',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'Coursera',title:'Gradient Boosting & XGBoost',url:'https://www.coursera.org/learn/gradient-boosting',level:'intermediate'},{type:'paper',platform:'arXiv',title:'XGBoost and Gradient Boosting',url:'https://arxiv.org/search/?query=XGBoost',icon:'fas fa-file-pdf',year:2023}] },
    { id:903, name:'支持向量机SVM', nameEn:'Support Vector Machine (SVM)', category:'ml', stage:9, discipline:['ecology','environmental','economics'], desc:'在特征空间中寻找最大间隔超平面，通过核函数（RBF、多项式）处理非线性，在小样本高维场景具有优势，常用于遥感影像分类与文本分类。', tools:['Python: sklearn.SVC/SVR','R: e1071::svm(), kernlab','LIBSVM: 原始实现'], useCase:'基于高光谱遥感影像的土地覆被类型分类；公众对环保政策态度的文本情感分类分析。', difficulty:3, icon:'fas fa-vector-square', color:'#22c55e', resources:[{type:'docs',platform:'Python',title:'sklearn SVM - Support Vector Machine',url:'https://scikit-learn.org/stable/modules/svm.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'e1071::svm() - Support Vector Machine',url:'https://www.rdocumentation.org/packages/e1071/topics/svm',icon:'fab fa-r-project',level:'intermediate'},{type:'course',platform:'Udemy',title:'Support Vector Machines',url:'https://www.udemy.com/course/svm/',level:'intermediate'},{type:'paper',platform:'Springer',title:'SVM Applications in Pattern Recognition',url:'https://link.springer.com/',icon:'fas fa-file-pdf',year:2023}] },
    { id:904, name:'可解释AI SHAP/LIME', nameEn:'Explainable AI (SHAP & LIME)', category:'ml', stage:9, discipline:['general','ecology','environmental','economics'], desc:'为黑箱模型提供事后解释。SHAP基于博弈论提供全局与局部一致性特征重要性；LIME对单个预测局部线性近似，揭示决策依据与关键特征方向。', tools:['Python: shap, lime, InterpretML, alibi','R: DALEX, iml, fastshap'], useCase:'解释随机森林预测物种分布时各环境因子的贡献方向与量值；阐明AI碳排放预测模型中驱动因素的作用机制。', difficulty:3, icon:'fas fa-glasses', color:'#22c55e', resources:[{type:'docs',platform:'Python',title:'SHAP: SHapley Additive exPlanations',url:'https://shap.readthedocs.io/',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'Python',title:'LIME: Local Interpretable Model-Agnostic',url:'https://github.com/marcotcr/lime',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'Coursera',title:'Explainable AI & Model Interpretability',url:'https://www.coursera.org/learn/explainable-ai',level:'advanced'},{type:'paper',platform:'arXiv',title:'SHAP and Interpretable ML',url:'https://arxiv.org/search/?query=SHAP',icon:'fas fa-file-pdf',year:2023}] },
    { id:905, name:'集成学习', nameEn:'Ensemble Learning (Bagging/Boosting/Stacking)', category:'ml', stage:9, discipline:['general','ecology','environmental','economics'], desc:'组合多个基学习器减少方差（Bagging）、偏差（Boosting）或两者（Stacking）。Stacking使用元学习器整合多个异质模型，通常能突破单一模型性能上限。', tools:['Python: sklearn BaggingClassifier, VotingClassifier, StackingClassifier','R: caret, mlr3','H2O: AutoML Stacking'], useCase:'组合RF、XGBoost和逻辑回归的Stacking模型预测流域水质超标风险；集成多种SDM模型提升物种分布预测稳健性。', difficulty:4, icon:'fas fa-layer-group', color:'#22c55e', resources:[{type:'docs',platform:'Python',title:'sklearn Ensemble Methods',url:'https://scikit-learn.org/stable/modules/ensemble.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'R',title:'mlr3: Machine Learning Ensembles',url:'https://www.rdocumentation.org/packages/mlr3',icon:'fab fa-r-project',level:'advanced'},{type:'course',platform:'Coursera',title:'Ensemble Learning & Stacking',url:'https://www.coursera.org/learn/ensemble-learning',level:'advanced'},{type:'paper',platform:'arXiv',title:'Ensemble Methods and Stacking',url:'https://arxiv.org/search/?query=ensemble+learning',icon:'fas fa-file-pdf',year:2023}] },

    // ── Stage 10: dl ── color #f97316
    { id:1001, name:'LSTM与GRU时序预测', nameEn:'LSTM & GRU for Time Series Forecasting', category:'dl', stage:10, discipline:['environmental','economics','ecology'], desc:'通过门机制解决梯度消失问题，能捕获长距离时序依赖关系，适合多步气象预测、水文模拟和经济序列预报，支持多变量输入与注意力机制增强。', tools:['Python: TensorFlow/Keras, PyTorch, darts','R: keras, torch','MATLAB: Deep Learning Toolbox'], useCase:'基于历史流量和气象数据预测未来7天流域径流量（洪涝预警）；预测区域季度碳排放量变化趋势。', difficulty:4, icon:'fas fa-memory', color:'#f97316', resources:[{type:'docs',platform:'Python',title:'TensorFlow/Keras LSTM & GRU',url:'https://www.tensorflow.org/guide/rnn',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'Python',title:'PyTorch LSTM for Time Series',url:'https://pytorch.org/docs/stable/nn.html',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'Coursera',title:'LSTM & Deep Learning for Sequences',url:'https://www.coursera.org/learn/recurrent-neural-networks',level:'advanced'},{type:'paper',platform:'arXiv',title:'LSTM and GRU Architectures',url:'https://arxiv.org/search/?query=LSTM+GRU',icon:'fas fa-file-pdf',year:2023}] },
    { id:1002, name:'CNN空间特征提取', nameEn:'CNN for Spatial & Remote Sensing', category:'dl', stage:10, discipline:['ecology','environmental'], desc:'通过局部感受野和共享权重自动学习空间层级特征，适合遥感影像土地覆被分类、目标检测（野生动物识别）、语义分割（植被制图），迁移学习降低标注数据需求。', tools:['Python: PyTorch, TensorFlow, torchvision','预训练: ResNet, EfficientNet, ViT','GDAL+PyTorch: 遥感流程'], useCase:'基于无人机影像自动识别入侵植物分布斑块；高分卫星影像土地利用动态变化监测与分类。', difficulty:5, icon:'fas fa-camera', color:'#f97316', resources:[{type:'docs',platform:'Python',title:'PyTorch CNN & Image Classification',url:'https://pytorch.org/vision/stable/models.html',icon:'fab fa-python',level:'intermediate'},{type:'docs',platform:'Python',title:'TensorFlow/Keras CNN Tutorial',url:'https://www.tensorflow.org/tutorials/images/cnn',icon:'fab fa-python',level:'beginner'},{type:'course',platform:'Coursera',title:'Convolutional Neural Networks',url:'https://www.coursera.org/learn/convolutional-neural-networks',level:'intermediate'},{type:'paper',platform:'arXiv',title:'CNN Architectures & Remote Sensing',url:'https://arxiv.org/search/?query=CNN+remote+sensing',icon:'fas fa-file-pdf',year:2023}] },
    { id:1003, name:'Transformer与迁移学习', nameEn:'Transformer & Transfer Learning', category:'dl', stage:10, discipline:['general','ecology','environmental','sociology'], desc:'自注意力机制能建模长距离依赖，BERT/RoBERTa用于文本分析（政策文本、社交媒体），ViT用于图像，PatchTST/Informer用于长序列时序预测，预训练+微调大幅降低数据需求。', tools:['Python: transformers (HuggingFace), timm, torch','R: texto2vec, tidymodels'], useCase:'用BERT分析政府环保政策文本的主题分布与情感倾向；用ViT对野外相机影像中动物物种进行自动分类识别。', difficulty:5, icon:'fas fa-robot', color:'#f97316', resources:[{type:'docs',platform:'Python',title:'HuggingFace Transformers',url:'https://huggingface.co/transformers/',icon:'fab fa-python',level:'advanced'},{type:'docs',platform:'Python',title:'PyTorch Vision Transformers',url:'https://pytorch.org/vision/stable/models/vision_transformer.html',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Transformers & Transfer Learning',url:'https://www.coursera.org/learn/nlp-sequence-models',level:'advanced'},{type:'paper',platform:'arXiv',title:'Attention Is All You Need & Vision Transformers',url:'https://arxiv.org/search/?query=transformer+attention',icon:'fas fa-file-pdf',year:2023}] },
    { id:1004, name:'图神经网络GNN', nameEn:'Graph Neural Network (GNN)', category:'dl', stage:10, discipline:['ecology','environmental','economics','sociology'], desc:'将神经网络扩展至图结构数据（节点+边），通过消息传递聚合邻域信息更新节点表征，适合食物网、交通网络、社会网络、知识图谱等关系数据建模。', tools:['Python: PyTorch Geometric, DGL, stellargraph','R: igraph (图分析)','NetworkX: 图基础'], useCase:'模拟食物网拓扑中物种灭绝导致的级联崩溃效应；预测科研合作网络中新合作关系的形成概率。', difficulty:5, icon:'fas fa-project-diagram', color:'#f97316', resources:[{type:'docs',platform:'Python',title:'PyTorch Geometric: Graph Neural Networks',url:'https://pytorch-geometric.readthedocs.io/',icon:'fab fa-python',level:'advanced'},{type:'docs',platform:'Python',title:'DGL: Deep Graph Learning',url:'https://www.dgl.ai/',icon:'fab fa-python',level:'advanced'},{type:'course',platform:'Coursera',title:'Graph Neural Networks',url:'https://www.coursera.org/learn/graph-neural-networks',level:'advanced'},{type:'paper',platform:'arXiv',title:'Graph Neural Networks Survey',url:'https://arxiv.org/search/?query=graph+neural+networks',icon:'fas fa-file-pdf',year:2023}] },
    { id:1005, name:'神经网络与AutoML', nameEn:'Neural Network & AutoML', category:'dl', stage:10, discipline:['general','ecology','environmental','economics'], desc:'多层感知机提供端到端非线性函数逼近能力；AutoML框架（AutoKeras、H2O AutoML、TPOT、AutoGluon）自动搜索最优模型结构与超参数，显著降低机器学习使用门槛。', tools:['Python: keras, autokeras, h2o, tpot, autogluon','R: mlr3, H2O','Google AutoML: 云端'], useCase:'AutoML自动化筛选最优碳排放预测模型；端到端学习遥感光谱指标与地面生物量的映射关系。', difficulty:4, icon:'fas fa-gears', color:'#f97316', resources:[{type:'docs',platform:'Python',title:'Keras: Neural Networks API',url:'https://keras.io/',icon:'fab fa-python',level:'beginner'},{type:'docs',platform:'Python',title:'AutoGluon: AutoML Framework',url:'https://auto.gluon.ai/',icon:'fab fa-python',level:'intermediate'},{type:'course',platform:'Coursera',title:'Neural Networks & Deep Learning',url:'https://www.coursera.org/learn/neural-networks-deep-learning',level:'beginner'},{type:'paper',platform:'arXiv',title:'AutoML and Neural Architecture Search',url:'https://arxiv.org/search/?query=automl+neural+architecture',icon:'fas fa-file-pdf',year:2023}] },
];

// ============================================
// AI 资讯数据
// ============================================
const NEWS_DATA = [
    { id: 1, title: "Claude 3.5 Sonnet 模型发布，性能超 GPT-4o", source: "Anthropic", date: "2026-03-31", category: "LLM", desc: "Anthropic 推出 Claude 3.5 Sonnet，在多个基准测试中超越 GPT-4o，支持 200K 上下文和视觉输入。", url: "https://anthropic.com/news/claude-3-5-sonnet", icon: "fas fa-newspaper", hot: true },
    { id: 2, title: "DeepSeek V3 开源发布，代码能力突破 GPT-4", source: "DeepSeek", date: "2026-03-30", category: "LLM", desc: "国产大模型 DeepSeek 推出 V3 版本，在代码推理和算法设计中表现超过 GPT-4，支持免费使用。", url: "https://deepseek.com/news", icon: "fas fa-code", hot: true },
    { id: 3, title: "NVIDIA GH200 GPU 上市，性能翻倍", source: "NVIDIA", date: "2026-03-29", category: "硬件", desc: "NVIDIA 发布新一代 Grace Hopper Superchip，AI 计算性能相比前代翻倍，支持 141GB HBM3e 显存。", url: "https://nvidia.com/en-us/", icon: "fas fa-microchip", hot: true },
    { id: 4, title: "OpenAI 推出 GPT-5 测试版，多模态能力质的飞跃", source: "OpenAI", date: "2026-03-28", category: "LLM", desc: "OpenAI 内测 GPT-5，支持任意长度上下文、实时网络搜索和动态代码执行能力。", url: "https://openai.com/research", icon: "fas fa-sparkles" },
    { id: 5, title: "Google Gemini 2.0 发布，支持实时视频理解", source: "Google", date: "2026-03-27", category: "LLM", desc: "Google 推出 Gemini 2.0 多模态模型，支持实时视频流分析和场景理解。", url: "https://google.com/deepmind", icon: "fas fa-video" },
    { id: 6, title: "Meta LLAMA 4 开源，性能追平商业模型", source: "Meta", date: "2026-03-26", category: "开源", desc: "Meta 发布开源 LLAMA 4 系列，在多个任务上追平闭源商业模型，支持本地部署。", url: "https://huggingface.co/meta", icon: "fas fa-code" },
    { id: 7, title: "Science 期刊报道：AI 在生物蛋白质折叠新突破", source: "Science", date: "2026-03-25", category: "研究", desc: "顶级期刊报道 AI 蛋白质结构预测取得新进展，准确度达 99.2%，应用于药物发现。", url: "https://science.org", icon: "fas fa-dna", hot: true },
    { id: 8, title: "HuggingFace 发布 Inference API 2.0，推理成本降低 70%", source: "HuggingFace", date: "2026-03-24", category: "工具", desc: "HuggingFace 推出推理 API 优化版本，通过模型量化和批处理降低成本 70%。", url: "https://huggingface.co/", icon: "fas fa-rocket" },
    { id: 9, title: "Anthropic 发布宪法 AI 3.0，自主学习能力显著提升", source: "Anthropic", date: "2026-03-23", category: "研究", desc: "Anthropic 推出宪法 AI 3.0，支持模型通过与用户互动自主优化价值观，无需人工反馈。", url: "https://anthropic.com", icon: "fas fa-brain" },
    { id: 10, title: "Nature 子刊：AI 加速新药研发，已识别 150 个候选化合物", source: "Nature", date: "2026-03-22", category: "研究", desc: "Nature 报道 AI 辅助药物设计发现 150 个全新候选化合物，最快 6 个月进入临床试验。", url: "https://nature.com", icon: "fas fa-flask" },
    { id: 11, title: "微软 Copilot Pro 用户突破 1000 万，企业版大幅增长", source: "Microsoft", date: "2026-03-21", category: "商业", desc: "微软发布最新财报显示 Copilot 用户突破 1000 万，企业订阅增长 300%。", url: "https://microsoft.com", icon: "fas fa-chart-line" },
    { id: 12, title: "GitHub Copilot 企业版支持自定义 LLM，降低成本", source: "GitHub", date: "2026-03-20", category: "工具", desc: "GitHub 推出企业级 Copilot，支持集成自定义模型和私有知识库，成本可降低 40%。", url: "https://github.com", icon: "fas fa-code-branch" },
    { id: 13, title: "ArXiv 论文：Mixture of Experts 突破百万参数瓶颈", source: "arXiv", date: "2026-03-19", category: "论文", desc: "最新 arXiv 论文展示 MOE 架构可有效扩展至百万级专家，推理成本保持线性。", url: "https://arxiv.org", icon: "fas fa-file-pdf" },
    { id: 14, title: "斯坦福 AI 指数 2026 报告发布，投资同比增长 45%", source: "Stanford", date: "2026-03-18", category: "报告", desc: "斯坦福 AI 指数最新报告显示全球 AI 研究投资增长 45%，中国投资占 32%。", url: "https://aiindex.stanford.edu", icon: "fas fa-chart-bar", hot: true },
    { id: 15, title: "OpenAI 发布 GPT-4 Turbo 价格下调 50%，平价 API 时代开启", source: "OpenAI", date: "2026-03-17", category: "商业", desc: "OpenAI 宣布将 GPT-4 Turbo 价格下调 50%，支持 128K 上下文窗口。", url: "https://openai.com/pricing", icon: "fas fa-tag" },
];

// ============================================
// 大模型排名数据
// ============================================
const MODELS_RANKING = [
    { rank: 1,  liveId: "qwen/qwen3.6-plus:free",            name: "Qwen3.6 Plus (free)",         provider: "Alibaba",    type: "Text",            params: "1M ctx",   date: "2026-04-09", weeklyTokens: "6.27T", weeklyGrowth: "NEW",   pricing: "free", url: "https://openrouter.ai/rankings", hot: true,  benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0,    completionPricePerM: 0,    context: '1M' } },
    { rank: 2,  liveId: "deepseek/deepseek-v3.2",             name: "DeepSeek V3.2",               provider: "DeepSeek",   type: "Code-Optimized",  params: "164K ctx", date: "2026-04-09", weeklyTokens: "1.22T", weeklyGrowth: "0%",    pricing: "paid", url: "https://openrouter.ai/rankings", hot: true,  benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.26, completionPricePerM: 0.38, context: '163.8K' } },
    { rank: 3,  liveId: "stepfun/step-3.5-flash:free",        name: "Step 3.5 Flash (free)",       provider: "StepFun",    type: "Text",            params: "256K ctx", date: "2026-04-09", weeklyTokens: "1.19T", weeklyGrowth: "-14%",  pricing: "free", url: "https://openrouter.ai/rankings", hot: true,  benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0,    completionPricePerM: 0,    context: '262.1K' } },
    { rank: 4,  liveId: "minimax/minimax-m2.7",               name: "MiniMax M2.7",                provider: "MiniMax",    type: "Text",            params: "205K ctx", date: "2026-04-09", weeklyTokens: "1.15T", weeklyGrowth: "-13%",  pricing: "paid", url: "https://openrouter.ai/rankings", hot: true,  benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.30, completionPricePerM: 1.20, context: '204.8K' } },
    { rank: 5,  liveId: "xiaomi/mimo-v2-pro",                 name: "MiMo-V2-Pro",                 provider: "Xiaomi",     type: "Text",            params: "1M ctx",   date: "2026-04-09", weeklyTokens: "1.1T",  weeklyGrowth: "-76%",  pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 1,    completionPricePerM: 3,    context: '1M' } },
    { rank: 6,  liveId: "anthropic/claude-sonnet-4.6",        name: "Claude Sonnet 4.6",           provider: "Anthropic",  type: "Text",            params: "1M ctx",   date: "2026-04-09", weeklyTokens: "1.07T", weeklyGrowth: "+6%",   pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 3,    completionPricePerM: 15,   context: '1M' } },
    { rank: 7,  liveId: "minimax/minimax-m2.5",               name: "MiniMax M2.5",                provider: "MiniMax",    type: "Text",            params: "197K ctx", date: "2026-04-09", weeklyTokens: "1.05T", weeklyGrowth: "+50%",  pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.20, completionPricePerM: 1.17, context: '196.6K' } },
    { rank: 8,  liveId: "anthropic/claude-opus-4.6",          name: "Claude Opus 4.6",             provider: "Anthropic",  type: "Text",            params: "1M ctx",   date: "2026-04-09", weeklyTokens: "1.02T", weeklyGrowth: "+1%",   pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 5,    completionPricePerM: 25,   context: '1M' } },
    { rank: 9,  liveId: "google/gemini-3-flash-preview",      name: "Gemini 3 Flash Preview",      provider: "Google",     type: "Multimodal",      params: "1M ctx",   date: "2026-04-09", weeklyTokens: "992B",  weeklyGrowth: "+1%",   pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.50, completionPricePerM: 3,    context: '1M' } },
    { rank: 10, liveId: "moonshot/kimi-k2.5",                 name: "Kimi K2.5",                   provider: "Moonshot",   type: "Text",            params: "128K ctx", date: "2026-04-09", weeklyTokens: "636B",  weeklyGrowth: "+28%",  pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.15, completionPricePerM: 0.60, context: '128K' } },
    { rank: 11, liveId: "openai/gpt-4o-mini",                 name: "GPT-4o-mini",                 provider: "OpenAI",     type: "Multimodal",      params: "128K ctx", date: "2026-04-09", weeklyTokens: "597B",  weeklyGrowth: "+189%", pricing: "paid", url: "https://openrouter.ai/rankings", hot: true,  benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.15, completionPricePerM: 0.60, context: '128K' } },
    { rank: 12, liveId: "x-ai/grok-4.1-fast",                 name: "Grok 4.1 Fast",               provider: "xAI",        type: "Multimodal",      params: "2M ctx",   date: "2026-04-09", weeklyTokens: "582B",  weeklyGrowth: "-29%",  pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.20, completionPricePerM: 0.50, context: '2M' } },
    { rank: 13, liveId: "qwen/qwen3.6-plus-preview:free",     name: "Qwen3.6 Plus Preview (free)", provider: "Alibaba",    type: "Text",            params: "1M ctx",   date: "2026-04-09", weeklyTokens: "541B",  weeklyGrowth: "-51%",  pricing: "free", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0,    completionPricePerM: 0,    context: '1M' } },
    { rank: 14, liveId: "google/gemini-2.5-flash-lite",       name: "Gemini 2.5 Flash Lite",       provider: "Google",     type: "Multimodal",      params: "1M ctx",   date: "2026-04-09", weeklyTokens: "514B",  weeklyGrowth: "-8%",   pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.10, completionPricePerM: 0.40, context: '1M' } },
    { rank: 15, liveId: "nvidia/nemotron-3-super:free",        name: "Nemotron 3 Super (free)",     provider: "NVIDIA",     type: "Text",            params: "128K ctx", date: "2026-04-09", weeklyTokens: "508B",  weeklyGrowth: "-5%",   pricing: "free", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0,    completionPricePerM: 0,    context: '128K' } },
    { rank: 16, liveId: "google/gemini-2.5-flash",            name: "Gemini 2.5 Flash",            provider: "Google",     type: "Multimodal",      params: "1M ctx",   date: "2026-04-09", weeklyTokens: "473B",  weeklyGrowth: "-8%",   pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.15, completionPricePerM: 0.60, context: '1M' } },
    { rank: 17, liveId: "z-ai/glm-5-turbo",                   name: "GLM 5 Turbo",                 provider: "Z.ai",       type: "Text",            params: "203K ctx", date: "2026-04-09", weeklyTokens: "473B",  weeklyGrowth: "-50%",  pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 1,    completionPricePerM: 3.20, context: '202.8K' } },
    { rank: 18, liveId: "openai/gpt-5.4",                     name: "GPT-5.4",                     provider: "OpenAI",     type: "Text",            params: "128K ctx", date: "2026-04-09", weeklyTokens: "434B",  weeklyGrowth: "+26%",  pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 2,    completionPricePerM: 8,    context: '128K' } },
    { rank: 19, liveId: "openai/gpt-oss-120b",                name: "gpt-oss-120b",                provider: "OpenAI",     type: "Text",            params: "128K ctx", date: "2026-04-09", weeklyTokens: "400B",  weeklyGrowth: "-14%",  pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 1,    completionPricePerM: 4,    context: '128K' } },
    { rank: 20, liveId: "z-ai/glm-5",                         name: "GLM 5",                       provider: "Z.ai",       type: "Text",            params: "128K ctx", date: "2026-04-09", weeklyTokens: "355B",  weeklyGrowth: "-11%",  pricing: "paid", url: "https://openrouter.ai/rankings",             benchmark: {}, arena: { source: 'openrouter', snapshotDate: '2026-04-09', promptPricePerM: 0.50, completionPricePerM: 2,    context: '128K' } },
];


// ============================================
// 行业资讯事件分组扩展 + 国产工具扩展
// ============================================
const LEGACY_NEWS_EVENT_TYPE_MAP = {
    'LLM': '模型发布',
    '工具': '产品更新',
    '论文': '论文进展',
    '研究': '论文进展',
    '报告': '行业报告',
    '商业': '投融资与合作',
    '开源': '开源发布',
    '硬件': '基础设施'
};

NEWS_DATA.forEach(item => {
    if (!item.eventType) item.eventType = LEGACY_NEWS_EVENT_TYPE_MAP[item.category] || '行业动态';
});

const NEWS_EVENT_ACTORS = [
    ['OpenAI', 'https://openai.com'], ['Anthropic', 'https://anthropic.com'], ['Google DeepMind', 'https://deepmind.google'],
    ['Microsoft', 'https://microsoft.com'], ['Meta', 'https://ai.meta.com'], ['NVIDIA', 'https://nvidia.com'],
    ['GitHub', 'https://github.com'], ['Hugging Face', 'https://huggingface.co'], ['Mistral AI', 'https://mistral.ai'],
    ['xAI', 'https://x.ai'], ['Perplexity', 'https://perplexity.ai'], ['Cohere', 'https://cohere.com'],
    ['DeepSeek', 'https://deepseek.com'], ['智谱', 'https://www.zhipuai.cn'], ['月之暗面', 'https://kimi.moonshot.cn'],
    ['MiniMax', 'https://www.minimaxi.com'], ['百度', 'https://yiyan.baidu.com'], ['阿里云', 'https://tongyi.aliyun.com'],
    ['腾讯混元', 'https://yuanbao.tencent.com'], ['字节豆包', 'https://www.doubao.com'], ['华为云', 'https://huaweicloud.com'],
    ['科大讯飞', 'https://xinghuo.xfyun.cn'], ['商汤', 'https://www.sensetime.com'], ['昆仑万维', 'https://tiangong.cn'],
    ['360', 'https://so.com'], ['金山办公', 'https://www.wps.cn'], ['美图', 'https://www.meitu.com'],
    ['京东言犀', 'https://yanxi.jd.com'], ['快手可灵', 'https://klingai.com'], ['火山引擎', 'https://www.volcengine.com']
];

const NEWS_EVENT_BLUEPRINTS = [
    { eventType: '模型发布', category: 'LLM', icon: 'fas fa-brain', title: actor => `${actor} 发布新版模型，强化推理与多模态能力`, desc: actor => `${actor} 公布新一轮模型升级，重点覆盖长上下文、代码生成与多模态理解，带动新一波模型选型和对比测试。` },
    { eventType: '产品更新', category: '工具', icon: 'fas fa-screwdriver-wrench', title: actor => `${actor} 上线新产品功能，面向科研与知识工作流`, desc: actor => `${actor} 发布新的工作流能力，覆盖搜索、文档处理、代码辅助或协作流程，适合跟踪落地型 AI 产品变化。` },
    { eventType: '开源发布', category: '开源', icon: 'fas fa-code-branch', title: actor => `${actor} 开源新项目，社区关注度持续升温`, desc: actor => `${actor} 推出新的开源模型、框架或工具链，便于研究团队本地部署、二次开发和快速验证。` },
    { eventType: '论文进展', category: '研究', icon: 'fas fa-flask', title: actor => `${actor} 相关论文引发讨论，聚焦推理效率与应用突破`, desc: actor => `${actor} 相关论文或实验结果被集中关注，方向涉及推理优化、智能体、科学发现或多模态系统。` },
    { eventType: '投融资与合作', category: '商业', icon: 'fas fa-handshake', title: actor => `${actor} 传出新合作与商业化进展`, desc: actor => `${actor} 在投融资、生态合作或企业落地层面出现新信号，反映 AI 产业化节奏和资源流向。` },
    { eventType: '行业报告', category: '报告', icon: 'fas fa-chart-column', title: actor => `${actor} 相关报告更新，释放行业趋势信号`, desc: actor => `${actor} 的研究或行业观察被广泛引用，可用于追踪市场热度、研发节奏和基础设施变化。` }
];

function buildGeneratedEventNews(startId = 3000) {
    const baseDate = new Date('2026-04-02T09:00:00Z');
    let id = startId;
    return NEWS_EVENT_BLUEPRINTS.flatMap((blueprint, groupIndex) => NEWS_EVENT_ACTORS.map(([actor, url], actorIndex) => {
        const date = new Date(baseDate.getTime() - ((groupIndex * NEWS_EVENT_ACTORS.length) + actorIndex) * 6 * 60 * 60 * 1000);
        return { id: id++, title: blueprint.title(actor), source: actor, date: date.toISOString().slice(0, 10), category: blueprint.category, eventType: blueprint.eventType, desc: blueprint.desc(actor), url, icon: blueprint.icon, hot: actorIndex < 4 };
    }));
}

NEWS_DATA.push(...buildGeneratedEventNews());

function hostFromUrl(url) {
    try { return new URL(url).hostname; }
    catch { return 'example.com'; }
}

const DOMESTIC_TOOL_VENDOR_MATRIX = [
    { vendor: '百度', domain: 'baidu.com', color: '#2563eb', products: [
        ['文心一言专业版', 'llm', '中文对话与搜索增强助手', 'https://yiyan.baidu.com', ['国产','对话'], 'freemium', 'fas fa-comments', '300万+'],
        ['文心一格', 'image-ai', '面向海报和视觉素材的 AI 绘图工具', 'https://yige.baidu.com', ['绘图','视觉'], 'freemium', 'fas fa-image', '80万+'],
        ['文心快码', 'code', '面向开发者的国产代码助手', 'https://comate.baidu.com', ['代码','IDE'], 'freemium', 'fas fa-code', '60万+'],
        ['百度智能云千帆', 'agents', '模型开发与应用编排平台', 'https://cloud.baidu.com/product/qianfan.html', ['平台','Agent'], 'paid', 'fas fa-layer-group', '40万+'],
        ['飞桨PaddlePaddle', 'code', '国产深度学习框架与训练生态', 'https://www.paddlepaddle.org.cn', ['框架','训练'], 'free', 'fab fa-python', '120万+'],
        ['百度文库AI助手', 'writing', '面向文档总结和写作改写', 'https://wenku.baidu.com', ['文档','写作'], 'freemium', 'fas fa-file-lines', '200万+'],
        ['度加创作工具', 'video', 'AI 视频脚本、剪辑与分发工具', 'https://aigc.baidu.com', ['视频','创作'], 'freemium', 'fas fa-video', '50万+'],
        ['百度翻译AI版', 'voice', '翻译与语音识别增强工具', 'https://fanyi.baidu.com', ['翻译','语音'], 'free', 'fas fa-language', '500万+'],
        ['百度AI开放平台', 'agents', '语音视觉和 NLP API 集成平台', 'https://ai.baidu.com', ['API','平台'], 'paid', 'fas fa-plug', '90万+'],
        ['百度曦灵数字人', 'video', '数字人与内容播报平台', 'https://xiling.cloud.baidu.com', ['数字人','内容'], 'paid', 'fas fa-user-astronaut', '30万+']
    ]},
    { vendor: '阿里云', domain: 'aliyun.com', color: '#ea580c', products: [
        ['通义千问研究版', 'llm', '适合问答、写作和研究探索的国产大模型入口', 'https://tongyi.aliyun.com', ['通用','中文'], 'free', 'fas fa-brain', '400万+'],
        ['通义灵码', 'code', '国产 IDE 与代码补全助手', 'https://tongyi.aliyun.com/lingma', ['代码','IDE'], 'freemium', 'fas fa-terminal', '180万+'],
        ['通义听悟', 'voice', '会议记录与音视频转写总结工具', 'https://tingwu.aliyun.com', ['会议','转写'], 'freemium', 'fas fa-headphones', '70万+'],
        ['阿里云百炼', 'agents', '企业模型应用与 Agent 编排平台', 'https://bailian.console.aliyun.com', ['平台','编排'], 'paid', 'fas fa-sitemap', '45万+'],
        ['魔搭社区', 'code', '国产模型与数据集开源社区', 'https://modelscope.cn', ['开源','模型'], 'free', 'fas fa-cubes', '150万+'],
        ['PAI灵骏', 'data', '机器学习训练和数据分析平台', 'https://www.aliyun.com/product/bigdata/product/pai', ['训练','分析'], 'paid', 'fas fa-database', '35万+'],
        ['鹿班设计', 'figure', '电商与营销视觉自动生成工具', 'https://luban.aliyun.com', ['设计','海报'], 'freemium', 'fas fa-palette', '65万+'],
        ['夸克AI搜索', 'reading', '面向中文信息检索与总结的搜索工具', 'https://www.quark.cn', ['搜索','总结'], 'free', 'fas fa-magnifying-glass', '500万+'],
        ['阿里云智能客服', 'agents', '知识库问答与服务流程自动化', 'https://www.aliyun.com/product/beebot', ['客服','知识库'], 'paid', 'fas fa-robot', '40万+'],
        ['钉钉AI助理', 'agents', '协作场景中的企业智能助理', 'https://www.dingtalk.com', ['协作','办公'], 'freemium', 'fas fa-briefcase', '220万+']
    ]},
    { vendor: '腾讯', domain: 'tencent.com', color: '#0ea5e9', products: [
        ['腾讯元宝', 'llm', '面向大众用户的国产问答助手', 'https://yuanbao.tencent.com', ['对话','搜索'], 'free', 'fas fa-comment-dots', '300万+'],
        ['腾讯混元开放平台', 'agents', '模型调用与应用搭建平台', 'https://cloud.tencent.com/product/hunyuan', ['平台','API'], 'paid', 'fas fa-cloud', '80万+'],
        ['ima.copilot', 'reading', '知识库构建和个人资料整理工具', 'https://ima.qq.com', ['知识库','整理'], 'free', 'fas fa-book-open', '90万+'],
        ['腾讯文档AI', 'writing', '文档生成、表格总结与协作写作', 'https://docs.qq.com', ['写作','协作'], 'freemium', 'fas fa-file-word', '200万+'],
        ['腾讯云TI平台', 'data', '训练、部署和分析一体化平台', 'https://cloud.tencent.com/product/ti', ['训练','部署'], 'paid', 'fas fa-chart-line', '30万+'],
        ['腾讯云代码助手', 'code', '企业研发场景的代码生成与审查助手', 'https://cloud.tencent.com', ['代码','研发'], 'paid', 'fas fa-code', '35万+'],
        ['微信读书AI问书', 'reading', '书籍问答、总结和检索增强', 'https://weread.qq.com', ['阅读','总结'], 'free', 'fas fa-book', '250万+'],
        ['搜狗输入法AI帮写', 'writing', '输入与短文本生成助手', 'https://pinyin.sogou.com', ['写作','输入'], 'free', 'fas fa-keyboard', '600万+'],
        ['腾讯智影', 'video', 'AI 视频剪辑与数字播报工具', 'https://zenvideo.qq.com', ['视频','创作'], 'freemium', 'fas fa-film', '70万+'],
        ['腾讯云数字人', 'video', '数字人播报与内容生产平台', 'https://cloud.tencent.com/product/dh', ['数字人','内容'], 'paid', 'fas fa-user-tie', '25万+']
    ]},
    { vendor: '字节跳动', domain: 'bytedance.com', color: '#111827', products: [
        ['豆包', 'llm', '字节系通用对话与搜索助手', 'https://www.doubao.com', ['对话','国产'], 'free', 'fas fa-comments', '500万+'],
        ['扣子', 'agents', '可视化 Agent 和工作流搭建平台', 'https://www.coze.cn', ['Agent','工作流'], 'freemium', 'fas fa-diagram-project', '180万+'],
        ['即梦AI', 'image-ai', '图片与视觉内容生成平台', 'https://jimeng.jianying.com', ['绘图','图片'], 'freemium', 'fas fa-wand-magic-sparkles', '160万+'],
        ['MarsCode', 'code', '字节推出的 AI 编程助手', 'https://www.marscode.cn', ['代码','IDE'], 'free', 'fas fa-laptop-code', '110万+'],
        ['火山方舟', 'agents', '模型 API、应用开发与编排平台', 'https://www.volcengine.com/product/ark', ['平台','API'], 'paid', 'fas fa-cubes', '45万+'],
        ['火山引擎机器学习平台', 'data', '训练评估与部署链路平台', 'https://www.volcengine.com/product/ml_platform', ['训练','分析'], 'paid', 'fas fa-database', '25万+'],
        ['飞书妙记', 'voice', '会议转录、纪要与知识沉淀工具', 'https://www.feishu.cn/product/minutes', ['会议','转写'], 'freemium', 'fas fa-microphone-lines', '150万+'],
        ['飞书智能伙伴', 'agents', '协作流程里的智能助手', 'https://www.feishu.cn', ['协作','Agent'], 'freemium', 'fas fa-users', '130万+'],
        ['剪映AI创作', 'video', 'AI 视频剪辑、字幕与脚本工具', 'https://www.capcut.cn', ['视频','剪辑'], 'freemium', 'fas fa-clapperboard', '300万+'],
        ['火山语音合成', 'voice', '配音、TTS 与语音交互接口', 'https://www.volcengine.com/product/speech', ['语音','TTS'], 'paid', 'fas fa-volume-high', '40万+']
    ]},
    { vendor: '华为', domain: 'huaweicloud.com', color: '#b91c1c', products: [
        ['盘古大模型平台', 'llm', '华为云大模型入口与行业能力平台', 'https://www.huaweicloud.com/product/pangu.html', ['国产','模型'], 'paid', 'fas fa-brain', '120万+'],
        ['小艺AI助手', 'llm', '终端侧问答和智能协同助手', 'https://consumer.huawei.com/cn/emui/', ['终端','助手'], 'free', 'fas fa-mobile-screen', '500万+'],
        ['ModelArts', 'data', '训练、推理和数据处理平台', 'https://www.huaweicloud.com/product/modelarts.html', ['训练','平台'], 'paid', 'fas fa-chart-simple', '45万+'],
        ['昇思MindSpore', 'code', '国产 AI 框架与训练生态', 'https://www.mindspore.cn', ['框架','训练'], 'free', 'fab fa-python', '90万+'],
        ['CodeArts IDE', 'code', '研发与协作一体的国产工程平台', 'https://www.huaweicloud.com/product/codearts.html', ['研发','IDE'], 'paid', 'fas fa-code', '35万+'],
        ['CodeArts Check', 'code', '代码扫描与质量检查服务', 'https://www.huaweicloud.com/product/codecheck.html', ['质量','审查'], 'paid', 'fas fa-shield-halved', '22万+'],
        ['华为云EI健康医疗', 'data', '医疗数据分析与辅助识别工具链', 'https://www.huaweicloud.com', ['医疗','分析'], 'paid', 'fas fa-heart-pulse', '18万+'],
        ['盘古数字内容生产线', 'figure', '图像、文案和素材生成工具', 'https://www.huaweicloud.com', ['设计','内容'], 'paid', 'fas fa-pen-ruler', '20万+'],
        ['华为云语音交互', 'voice', '语音识别和合成能力平台', 'https://www.huaweicloud.com/product/si.html', ['语音','ASR'], 'paid', 'fas fa-microphone', '25万+'],
        ['盘古气象大模型', 'data', '气象科研与行业预测模型', 'https://www.huaweicloud.com', ['预测','科研'], 'paid', 'fas fa-cloud-sun', '10万+']
    ]},
    { vendor: '科大讯飞', domain: 'xfyun.cn', color: '#2563eb', products: [
        ['讯飞星火Max', 'llm', '国产对话与写作大模型助手', 'https://xinghuo.xfyun.cn', ['国产','写作'], 'freemium', 'fas fa-bolt', '350万+'],
        ['讯飞听见', 'voice', '会议、访谈与讲座转写工具', 'https://www.iflyrec.com', ['转写','会议'], 'freemium', 'fas fa-headset', '240万+'],
        ['讯飞智文', 'writing', '文稿生成、总结和 PPT 辅助工具', 'https://zhiwen.xfyun.cn', ['写作','PPT'], 'freemium', 'fas fa-file-pen', '80万+'],
        ['讯飞绘文', 'writing', '营销文案与图文创作工具', 'https://huiven.xfyun.cn', ['图文','内容'], 'freemium', 'fas fa-pen-fancy', '45万+'],
        ['讯飞同传', 'voice', '实时同传与多语言会议辅助', 'https://www.iflyrec.com/zhuanti/tongchuan', ['同传','会议'], 'paid', 'fas fa-language', '30万+'],
        ['讯飞翻译机云服务', 'voice', '多语言翻译和语音接口能力', 'https://fy.xfyun.cn', ['翻译','语音'], 'paid', 'fas fa-globe', '40万+'],
        ['星火科研助手', 'reading', '面向论文阅读和研究问答', 'https://xinghuo.xfyun.cn', ['科研','问答'], 'freemium', 'fas fa-graduation-cap', '35万+'],
        ['星火代码助手', 'code', '中文开发场景代码生成工具', 'https://xinghuo.xfyun.cn', ['代码','研发'], 'freemium', 'fas fa-terminal', '30万+'],
        ['讯飞开放平台', 'agents', '语音视觉 NLP API 平台', 'https://www.xfyun.cn', ['API','平台'], 'paid', 'fas fa-plug-circle-bolt', '110万+'],
        ['讯飞AI学习机内容引擎', 'aisoft', '教育内容和智能辅导能力底座', 'https://www.xuexiji.xfyun.cn', ['教育','软件'], 'paid', 'fas fa-school', '60万+']
    ]},
    { vendor: '商汤', domain: 'sensetime.com', color: '#7c3aed', products: [
        ['商量SenseChat', 'llm', '商汤通用对话大模型入口', 'https://chat.sensetime.com', ['对话','国产'], 'freemium', 'fas fa-comment', '120万+'],
        ['日日新大模型平台', 'agents', '行业模型和应用开发平台', 'https://www.sensetime.com', ['平台','模型'], 'paid', 'fas fa-sun', '35万+'],
        ['秒画', 'image-ai', '面向创意和插画的图像生成工具', 'https://miaohua.sensetime.com', ['图片','创意'], 'freemium', 'fas fa-paintbrush', '85万+'],
        ['办公小浣熊', 'writing', '办公文档、表格和总结助手', 'https://www.sensetime.com', ['办公','写作'], 'freemium', 'fas fa-briefcase', '26万+'],
        ['代码小浣熊', 'code', '开发辅助与代码解释工具', 'https://www.sensetime.com', ['代码','解释'], 'freemium', 'fas fa-code', '20万+'],
        ['如影数字人', 'video', '数字人播报和内容制作平台', 'https://www.sensetime.com', ['数字人','视频'], 'paid', 'fas fa-user-astronaut', '18万+'],
        ['SenseCore大装置', 'data', 'AI 训练算力与实验平台', 'https://www.sensetime.com', ['训练','算力'], 'paid', 'fas fa-server', '15万+'],
        ['商汤医疗影像AI', 'data', '医学影像识别和分析平台', 'https://www.sensetime.com', ['医疗','影像'], 'paid', 'fas fa-x-ray', '12万+'],
        ['商汤教育智能批改', 'aisoft', '教育场景识别与批改工具', 'https://www.sensetime.com', ['教育','批改'], 'paid', 'fas fa-book-open-reader', '16万+'],
        ['商汤智慧城市视觉平台', 'agents', '视觉识别与城市感知平台', 'https://www.sensetime.com', ['视觉','平台'], 'paid', 'fas fa-city', '20万+']
    ]},
    { vendor: '智谱', domain: 'zhipuai.cn', color: '#4f46e5', products: [
        ['智谱清言', 'llm', 'GLM 系列的对话与问答入口', 'https://chatglm.cn', ['问答','国产'], 'free', 'fas fa-comments', '300万+'],
        ['BigModel 开放平台', 'agents', '模型 API 与应用搭建平台', 'https://open.bigmodel.cn', ['API','平台'], 'paid', 'fas fa-plug', '75万+'],
        ['AutoGLM', 'agents', '浏览器与桌面自动执行助手', 'https://www.zhipuai.cn', ['自动化','Agent'], 'freemium', 'fas fa-robot', '35万+'],
        ['CodeGeeX', 'code', '国产代码补全与解释助手', 'https://codegeex.cn', ['代码','IDE'], 'free', 'fas fa-code', '160万+'],
        ['CogView 视觉生成', 'image-ai', '图像生成和编辑模型服务', 'https://open.bigmodel.cn', ['图像','生成'], 'paid', 'fas fa-image', '32万+'],
        ['GLM 检索增强', 'reading', '面向中文搜索与摘要的工具能力', 'https://open.bigmodel.cn', ['搜索','摘要'], 'paid', 'fas fa-magnifying-glass', '24万+'],
        ['智谱科研助手', 'reading', '论文阅读、综述与问答支持', 'https://www.zhipuai.cn', ['论文','综述'], 'freemium', 'fas fa-book', '20万+'],
        ['智谱文档助手', 'writing', '长文档写作和改写工具', 'https://www.zhipuai.cn', ['文档','写作'], 'freemium', 'fas fa-file-lines', '20万+'],
        ['GLM 语音交互', 'voice', 'ASR/TTS 与语音问答能力', 'https://open.bigmodel.cn', ['语音','TTS'], 'paid', 'fas fa-microphone-lines', '14万+'],
        ['GLM Agent Studio', 'agents', '多步骤任务编排工作台', 'https://open.bigmodel.cn', ['工作流','Agent'], 'paid', 'fas fa-sitemap', '18万+']
    ]},
    { vendor: '月之暗面', domain: 'moonshot.cn', color: '#111827', products: [
        ['Kimi 智能助手', 'llm', '超长上下文中文助手', 'https://kimi.moonshot.cn', ['长文档','问答'], 'free', 'fas fa-moon', '600万+'],
        ['Kimi 探索版', 'reading', '搜索增强与问题探索工具', 'https://kimi.moonshot.cn', ['搜索','阅读'], 'freemium', 'fas fa-compass', '120万+'],
        ['Kimi 论文助手', 'reading', '论文阅读、总结和问答工具', 'https://kimi.moonshot.cn', ['论文','总结'], 'freemium', 'fas fa-file-pdf', '80万+'],
        ['Kimi 长文写作', 'writing', '长篇写作与资料整合工具', 'https://kimi.moonshot.cn', ['写作','长文'], 'freemium', 'fas fa-pen-nib', '70万+'],
        ['Kimi 翻译助手', 'voice', '长文档翻译和术语整理工具', 'https://kimi.moonshot.cn', ['翻译','术语'], 'freemium', 'fas fa-language', '35万+'],
        ['Kimi PPT 助手', 'figure', '演示文稿大纲与视觉排版辅助', 'https://kimi.moonshot.cn', ['PPT','演示'], 'freemium', 'fas fa-display', '25万+'],
        ['Kimi 浏览器助手', 'reading', '网页总结和标签页问答', 'https://kimi.moonshot.cn', ['网页','总结'], 'freemium', 'fas fa-globe', '22万+'],
        ['Kimi 会议纪要', 'voice', '音频转写与纪要生成工具', 'https://kimi.moonshot.cn', ['转写','纪要'], 'freemium', 'fas fa-headphones', '20万+'],
        ['Kimi API 平台', 'agents', '模型接入与工作流开发平台', 'https://platform.moonshot.cn', ['API','平台'], 'paid', 'fas fa-plug-circle-check', '18万+'],
        ['Kimi 代码问答', 'code', '代码解释、重构和调试问答', 'https://kimi.moonshot.cn', ['代码','调试'], 'freemium', 'fas fa-laptop-code', '24万+']
    ]},
    { vendor: 'MiniMax', domain: 'minimaxi.com', color: '#7c3aed', products: [
        ['MiniMax Chat', 'llm', '国产多模态对话模型入口', 'https://www.minimaxi.com', ['对话','多模态'], 'freemium', 'fas fa-comments', '180万+'],
        ['海螺AI', 'video', '视频生成和创意内容平台', 'https://hailuoai.com', ['视频','生成'], 'freemium', 'fas fa-video', '140万+'],
        ['MiniMax 开放平台', 'agents', '模型 API 和应用编排平台', 'https://www.minimaxi.com/platform', ['API','平台'], 'paid', 'fas fa-cloud-arrow-up', '40万+'],
        ['Talkie 中文版', 'voice', '互动语音陪伴与角色对话工具', 'https://www.minimaxi.com', ['语音','角色'], 'freemium', 'fas fa-headset', '60万+'],
        ['MiniMax 文案助手', 'writing', '营销文案和摘要生成工具', 'https://www.minimaxi.com', ['写作','文案'], 'freemium', 'fas fa-feather-pointed', '22万+'],
        ['MiniMax 图像生成', 'image-ai', '图像创建与编辑工具', 'https://www.minimaxi.com', ['图像','编辑'], 'paid', 'fas fa-image', '28万+'],
        ['MiniMax 音色工坊', 'voice', '语音克隆与配音平台', 'https://www.minimaxi.com', ['语音','配音'], 'paid', 'fas fa-wave-square', '20万+'],
        ['MiniMax Agent Studio', 'agents', '任务流和智能体搭建工具', 'https://www.minimaxi.com', ['Agent','工作流'], 'paid', 'fas fa-diagram-project', '15万+'],
        ['MiniMax 代码助手', 'code', '编码问答和补全服务', 'https://www.minimaxi.com', ['代码','补全'], 'paid', 'fas fa-code-branch', '18万+'],
        ['MiniMax 企业知识库', 'agents', '企业内部知识助手平台', 'https://www.minimaxi.com', ['知识库','企业'], 'paid', 'fas fa-book-atlas', '16万+']
    ]},
    { vendor: 'DeepSeek', domain: 'deepseek.com', color: '#0f766e', products: [
        ['DeepSeek Chat 专业版', 'llm', '中文问答和深度推理助手', 'https://chat.deepseek.com', ['推理','国产'], 'free', 'fas fa-brain', '500万+'],
        ['DeepSeek Coder 平台', 'code', '代码生成、补全与审查工具', 'https://www.deepseek.com', ['代码','开发'], 'free', 'fas fa-code', '220万+'],
        ['DeepSeek API 平台', 'agents', '模型调用和应用开发入口', 'https://platform.deepseek.com', ['API','平台'], 'paid', 'fas fa-plug', '70万+'],
        ['DeepSeek Research', 'reading', '论文、资料和网页问答支持', 'https://chat.deepseek.com', ['研究','阅读'], 'free', 'fas fa-book-open', '90万+'],
        ['DeepSeek 企业知识助手', 'agents', '企业知识库和流程自动化工具', 'https://www.deepseek.com', ['知识库','自动化'], 'paid', 'fas fa-building', '25万+'],
        ['DeepSeek Long Context', 'reading', '长文档分析和多文件比较能力', 'https://chat.deepseek.com', ['长文档','比较'], 'free', 'fas fa-file-lines', '55万+'],
        ['DeepSeek Math', 'data', '数学推理和研究计算助手', 'https://www.deepseek.com', ['推理','数学'], 'free', 'fas fa-square-root-variable', '30万+'],
        ['DeepSeek Benchmark Lab', 'data', '模型评测和对比工作台', 'https://platform.deepseek.com', ['评测','对比'], 'paid', 'fas fa-chart-column', '18万+'],
        ['DeepSeek Agent Workbench', 'agents', '多步骤任务和工具调用工作台', 'https://platform.deepseek.com', ['Agent','工作台'], 'paid', 'fas fa-toolbox', '16万+'],
        ['DeepSeek CLI', 'cli', '终端中的模型调用和问答工具', 'https://platform.deepseek.com', ['CLI','终端'], 'free', 'fas fa-terminal', '20万+']
    ]},
    { vendor: '秘塔', domain: 'metaso.cn', color: '#1d4ed8', products: [
        ['秘塔AI搜索', 'reading', '中文搜索、问答与资料汇总工具', 'https://metaso.cn', ['搜索','资料'], 'free', 'fas fa-search', '300万+'],
        ['秘塔写作猫', 'writing', '写作改写与语法优化工具', 'https://xiezuocat.com', ['写作','润色'], 'freemium', 'fas fa-cat', '100万+'],
        ['秘塔翻译', 'voice', '文档翻译与术语统一工具', 'https://metaso.cn', ['翻译','术语'], 'freemium', 'fas fa-language', '25万+'],
        ['秘塔论文助手', 'reading', '文献检索和综述辅助工具', 'https://metaso.cn', ['论文','检索'], 'freemium', 'fas fa-file-pdf', '20万+'],
        ['秘塔法律搜索', 'reading', '法规案例与判例问答搜索', 'https://metaso.cn', ['法律','搜索'], 'freemium', 'fas fa-scale-balanced', '16万+'],
        ['秘塔知识库助手', 'agents', '资料整合与知识问答助手', 'https://metaso.cn', ['知识库','问答'], 'freemium', 'fas fa-book-bookmark', '18万+'],
        ['秘塔网页总结', 'reading', '网页、报告和链接摘要工具', 'https://metaso.cn', ['网页','总结'], 'free', 'fas fa-globe', '24万+'],
        ['秘塔文档解析', 'data', 'PDF、表格和报告结构化提取工具', 'https://metaso.cn', ['文档','提取'], 'paid', 'fas fa-table', '14万+'],
        ['秘塔团队版', 'agents', '团队协作和资料共享空间', 'https://metaso.cn', ['团队','协作'], 'paid', 'fas fa-users-gear', '12万+'],
        ['秘塔播客摘要', 'voice', '音频内容总结与时间轴提炼工具', 'https://metaso.cn', ['音频','摘要'], 'freemium', 'fas fa-podcast', '10万+']
    ]},
    { vendor: '360', domain: '360.com', color: '#16a34a', products: [
        ['纳米AI搜索', 'reading', '面向中文互联网的 AI 搜索入口', 'https://www.n.cn', ['搜索','中文'], 'free', 'fas fa-magnifying-glass', '260万+'],
        ['360智脑', 'llm', '360 通用问答与办公助手', 'https://ai.360.com', ['对话','办公'], 'free', 'fas fa-brain', '120万+'],
        ['360鸿图', 'image-ai', '图像生成与设计辅助平台', 'https://ai.360.com', ['设计','图片'], 'freemium', 'fas fa-image', '40万+'],
        ['360智绘', 'figure', '海报和视觉创意工具', 'https://ai.360.com', ['海报','视觉'], 'freemium', 'fas fa-palette', '28万+'],
        ['360数字员工', 'agents', '流程自动化与企业智能助手', 'https://ai.360.com', ['企业','自动化'], 'paid', 'fas fa-user-tie', '18万+'],
        ['360安全大模型', 'agents', '安全分析与攻击面检测助手', 'https://ai.360.com', ['安全','分析'], 'paid', 'fas fa-shield', '16万+'],
        ['360文档AI', 'writing', '文档总结、写作和改写工具', 'https://ai.360.com', ['文档','写作'], 'freemium', 'fas fa-file-lines', '20万+'],
        ['360视频摘要', 'video', '视频理解与摘要生成工具', 'https://ai.360.com', ['视频','摘要'], 'freemium', 'fas fa-film', '12万+'],
        ['360浏览器AI助手', 'reading', '网页内容总结和问答助手', 'https://browser.360.cn', ['浏览器','问答'], 'free', 'fas fa-window-maximize', '100万+'],
        ['360企业知识库', 'agents', '知识问答和内部资料助手', 'https://ai.360.com', ['知识库','企业'], 'paid', 'fas fa-building-user', '12万+']
    ]},
    { vendor: '昆仑万维', domain: 'kunlun.com', color: '#0284c7', products: [
        ['天工AI', 'llm', '昆仑万维通用大模型助手', 'https://tiangong.cn', ['对话','搜索'], 'free', 'fas fa-cloud', '180万+'],
        ['天工AI搜索', 'reading', '搜索与资料整合入口', 'https://tiangong.cn', ['搜索','阅读'], 'free', 'fas fa-search', '65万+'],
        ['SkyMusic', 'voice', 'AI 音乐创作与配乐工具', 'https://tiangong.cn', ['音乐','创作'], 'freemium', 'fas fa-music', '20万+'],
        ['SkyReels', 'video', 'AI 短视频生成与脚本工具', 'https://tiangong.cn', ['视频','生成'], 'freemium', 'fas fa-video', '18万+'],
        ['天工代码助手', 'code', '开发场景的代码生成与问答工具', 'https://tiangong.cn', ['代码','开发'], 'freemium', 'fas fa-code', '16万+'],
        ['天工PPT助手', 'figure', '演示文稿结构与素材整理工具', 'https://tiangong.cn', ['PPT','图表'], 'freemium', 'fas fa-display', '14万+'],
        ['天工办公助手', 'writing', '文案总结与日常办公问答工具', 'https://tiangong.cn', ['办公','写作'], 'free', 'fas fa-briefcase', '40万+'],
        ['天工Agent 平台', 'agents', '任务流和插件调用平台', 'https://tiangong.cn', ['Agent','平台'], 'paid', 'fas fa-sitemap', '12万+'],
        ['天工语音助手', 'voice', '语音问答与朗读能力平台', 'https://tiangong.cn', ['语音','助手'], 'freemium', 'fas fa-microphone', '12万+'],
        ['天工科研助手', 'reading', '论文摘要与研究问题问答工具', 'https://tiangong.cn', ['科研','论文'], 'freemium', 'fas fa-flask', '10万+']
    ]},
    { vendor: '美图', domain: 'meitu.com', color: '#ec4899', products: [
        ['美图设计室', 'figure', '海报、电商图和社媒视觉设计工具', 'https://www.meitu.com', ['设计','海报'], 'freemium', 'fas fa-pen-ruler', '260万+'],
        ['WHEE', 'image-ai', 'AI 绘图和图像生成平台', 'https://www.meitu.com', ['绘图','图片'], 'freemium', 'fas fa-image', '120万+'],
        ['开拍', 'video', '视频脚本、口播和剪辑工具', 'https://www.meitu.com', ['视频','创作'], 'freemium', 'fas fa-clapperboard', '90万+'],
        ['美图云修', 'image-ai', '摄影修图与批量处理工具', 'https://www.meitu.com', ['修图','摄影'], 'paid', 'fas fa-camera-retro', '35万+'],
        ['美图商品图', 'figure', '电商商品图智能生成工具', 'https://www.meitu.com', ['电商','商品图'], 'freemium', 'fas fa-store', '30万+'],
        ['美图AI PPT', 'figure', 'PPT 视觉与内容编排助手', 'https://www.meitu.com', ['PPT','演示'], 'freemium', 'fas fa-file-powerpoint', '18万+'],
        ['美图口播数字人', 'video', '数字人视频生成平台', 'https://www.meitu.com', ['数字人','视频'], 'paid', 'fas fa-user-tie', '15万+'],
        ['美图文案助手', 'writing', '图文营销文案与标题生成', 'https://www.meitu.com', ['文案','营销'], 'freemium', 'fas fa-feather', '22万+'],
        ['美图AI修片助手', 'image-ai', '影楼和摄影后期批量优化工具', 'https://www.meitu.com', ['修片','后期'], 'paid', 'fas fa-sliders', '14万+'],
        ['美图创意素材库', 'figure', '素材生成与模板管理平台', 'https://www.meitu.com', ['素材','模板'], 'freemium', 'fas fa-photo-film', '16万+']
    ]},
    { vendor: '金山办公', domain: 'wps.cn', color: '#dc2626', products: [
        ['WPS AI', 'writing', '文档、表格和演示的办公助手', 'https://www.wps.cn', ['办公','写作'], 'freemium', 'fas fa-file-word', '500万+'],
        ['WPS 灵犀', 'llm', '办公场景问答和内容总结助手', 'https://www.wps.cn', ['问答','办公'], 'freemium', 'fas fa-lightbulb', '140万+'],
        ['WPS PDF AI', 'reading', 'PDF 阅读、问答和摘要工具', 'https://www.wps.cn', ['PDF','总结'], 'freemium', 'fas fa-file-pdf', '80万+'],
        ['WPS 表格 Copilot', 'data', '表格公式、分析和可视化辅助', 'https://www.wps.cn', ['表格','分析'], 'freemium', 'fas fa-table-cells', '75万+'],
        ['WPS 演示美化', 'figure', 'PPT 结构、排版和视觉增强', 'https://www.wps.cn', ['PPT','排版'], 'freemium', 'fas fa-display', '60万+'],
        ['WPS 云文档助手', 'agents', '知识库和多人协作问答工具', 'https://www.wps.cn', ['协作','知识库'], 'paid', 'fas fa-cloud', '45万+'],
        ['WPS 智能校对', 'writing', '中文文稿校对、改写和润色', 'https://www.wps.cn', ['校对','润色'], 'freemium', 'fas fa-spell-check', '55万+'],
        ['WPS 扫描增强', 'data', '票据、表格和扫描件结构化提取', 'https://www.wps.cn', ['扫描','OCR'], 'freemium', 'fas fa-camera', '30万+'],
        ['WPS AI会议纪要', 'voice', '音频转写和纪要生成工具', 'https://www.wps.cn', ['转写','纪要'], 'freemium', 'fas fa-microphone-lines', '28万+'],
        ['WPS 企业知识助手', 'agents', '企业知识问答和内容沉淀平台', 'https://www.wps.cn', ['企业','知识库'], 'paid', 'fas fa-building', '22万+']
    ]},
    { vendor: '京东', domain: 'jd.com', color: '#ef4444', products: [
        ['言犀智能助手', 'llm', '京东系对话和业务问答助手', 'https://yanxi.jd.com', ['对话','业务'], 'freemium', 'fas fa-comment-dots', '100万+'],
        ['言犀数字人', 'video', '直播与客服场景数字人平台', 'https://yanxi.jd.com', ['数字人','直播'], 'paid', 'fas fa-user-tie', '35万+'],
        ['京东羚珑', 'figure', '商品图、营销图和素材生成工具', 'https://ling.jd.com', ['设计','电商'], 'freemium', 'fas fa-store', '40万+'],
        ['京东云开发平台', 'agents', '企业模型与应用搭建平台', 'https://www.jdcloud.com', ['平台','企业'], 'paid', 'fas fa-cloud-arrow-up', '18万+'],
        ['京东云代码助手', 'code', '研发提效和代码问答工具', 'https://www.jdcloud.com', ['代码','研发'], 'paid', 'fas fa-code', '15万+'],
        ['京东智能客服', 'agents', '问答机器人和服务流程自动化', 'https://yanxi.jd.com', ['客服','自动化'], 'paid', 'fas fa-headset', '25万+'],
        ['京东广告文案AI', 'writing', '电商标题和活动文案助手', 'https://www.jd.com', ['文案','电商'], 'freemium', 'fas fa-pen-fancy', '16万+'],
        ['京东工业知识助手', 'agents', '产业知识问答和流程辅助', 'https://www.jd.com', ['产业','知识库'], 'paid', 'fas fa-industry', '10万+'],
        ['京东语音分析', 'voice', '客服录音转写和质检分析工具', 'https://www.jdcloud.com', ['语音','质检'], 'paid', 'fas fa-wave-square', '12万+'],
        ['京东数据洞察AI', 'data', '零售数据分析与预测工具', 'https://www.jdcloud.com', ['分析','预测'], 'paid', 'fas fa-chart-column', '14万+']
    ]},
    { vendor: '快手', domain: 'kuaishou.com', color: '#f97316', products: [
        ['可灵AI', 'video', 'AI 视频生成和角色动画工具', 'https://klingai.com', ['视频','生成'], 'freemium', 'fas fa-video', '220万+'],
        ['快手文生图', 'image-ai', '面向创意内容的图片生成工具', 'https://klingai.com', ['图片','创意'], 'freemium', 'fas fa-image', '60万+'],
        ['快手脚本助手', 'writing', '短视频脚本和口播文案工具', 'https://www.kuaishou.com', ['脚本','文案'], 'freemium', 'fas fa-scroll', '22万+'],
        ['磁力开悟', 'data', '营销分析与商业洞察工具', 'https://www.kuaishou.com', ['营销','分析'], 'paid', 'fas fa-chart-line', '18万+'],
        ['快手数字人', 'video', '内容播报与直播数字人平台', 'https://www.kuaishou.com', ['数字人','直播'], 'paid', 'fas fa-user-astronaut', '12万+'],
        ['快手智能配音', 'voice', '短视频配音和音色生成工具', 'https://www.kuaishou.com', ['配音','语音'], 'freemium', 'fas fa-volume-high', '18万+'],
        ['快手创意素材工坊', 'figure', '视频封面和素材视觉平台', 'https://www.kuaishou.com', ['素材','视觉'], 'freemium', 'fas fa-photo-film', '14万+'],
        ['快手评论摘要', 'reading', '评论和舆情摘要工具', 'https://www.kuaishou.com', ['摘要','舆情'], 'freemium', 'fas fa-comments', '10万+'],
        ['快手内容 Agent', 'agents', '内容策划和分发工作流工具', 'https://www.kuaishou.com', ['Agent','内容'], 'paid', 'fas fa-sitemap', '8万+'],
        ['快手创作者工作台', 'aisoft', '创作者运营和 AI 辅助软件入口', 'https://www.kuaishou.com', ['创作者','软件'], 'free', 'fas fa-desktop', '25万+']
    ]},
    { vendor: '网易有道', domain: 'youdao.com', color: '#ef4444', products: [
        ['有道子曰', 'llm', '教育与学习场景的大模型助手', 'https://www.youdao.com', ['教育','问答'], 'freemium', 'fas fa-graduation-cap', '90万+'],
        ['有道翻译AI', 'voice', '多语言翻译与文档处理工具', 'https://fanyi.youdao.com', ['翻译','文档'], 'free', 'fas fa-language', '500万+'],
        ['有道速读', 'reading', '长文摘要和知识提炼工具', 'https://www.youdao.com', ['阅读','总结'], 'freemium', 'fas fa-book-open', '35万+'],
        ['有道写作', 'writing', '英文写作与改写辅助工具', 'https://write.youdao.com', ['写作','英文'], 'freemium', 'fas fa-pen', '40万+'],
        ['网易天音', 'voice', '音乐和音频生成工具', 'https://tianyin.music.163.com', ['音乐','语音'], 'freemium', 'fas fa-music', '20万+'],
        ['有道会议同传', 'voice', '会议口译和同传辅助工具', 'https://www.youdao.com', ['会议','同传'], 'paid', 'fas fa-headset', '12万+'],
        ['有道AI课件', 'figure', '教学课件和演示辅助工具', 'https://www.youdao.com', ['课件','演示'], 'freemium', 'fas fa-chalkboard', '14万+'],
        ['有道词典AI问答', 'reading', '词典、例句和知识问答工具', 'https://dict.youdao.com', ['词典','问答'], 'free', 'fas fa-book', '300万+'],
        ['有道研发助手', 'code', '面向教育业务的代码与脚本辅助工具', 'https://www.youdao.com', ['代码','研发'], 'paid', 'fas fa-code', '10万+'],
        ['有道学习Agent', 'agents', '学习规划与知识整理工具', 'https://www.youdao.com', ['学习','Agent'], 'freemium', 'fas fa-user-graduate', '16万+']
    ]},
    { vendor: '作业帮', domain: 'zybang.com', color: '#22c55e', products: [
        ['银河大模型助手', 'llm', '教育与问答场景国产模型助手', 'https://www.zybang.com', ['教育','问答'], 'free', 'fas fa-star', '80万+'],
        ['作业帮答疑AI', 'reading', '题目解析与知识点问答工具', 'https://www.zybang.com', ['教育','解析'], 'free', 'fas fa-circle-question', '200万+'],
        ['作业帮写作批改', 'writing', '作文批改和表达优化工具', 'https://www.zybang.com', ['写作','批改'], 'freemium', 'fas fa-pencil', '40万+'],
        ['作业帮口语陪练', 'voice', '英语口语练习和语音反馈工具', 'https://www.zybang.com', ['口语','语音'], 'freemium', 'fas fa-microphone', '28万+'],
        ['作业帮AI课件', 'figure', '教师课件和讲义生成工具', 'https://www.zybang.com', ['课件','图表'], 'freemium', 'fas fa-file-powerpoint', '15万+'],
        ['作业帮教研数据台', 'data', '教学数据分析和学习报告平台', 'https://www.zybang.com', ['教育','分析'], 'paid', 'fas fa-chart-pie', '12万+'],
        ['作业帮题库助手', 'reading', '题库检索与组卷辅助工具', 'https://www.zybang.com', ['题库','检索'], 'freemium', 'fas fa-book-open-reader', '25万+'],
        ['作业帮数字讲师', 'video', '课程讲解数字人平台', 'https://www.zybang.com', ['数字人','课程'], 'paid', 'fas fa-user-tie', '8万+'],
        ['作业帮智能教辅', 'aisoft', '教学与练习场景软件工具', 'https://www.zybang.com', ['教育','软件'], 'paid', 'fas fa-tablet-screen-button', '10万+'],
        ['作业帮教学Agent', 'agents', '学习任务编排与助教流程工具', 'https://www.zybang.com', ['Agent','教学'], 'paid', 'fas fa-sitemap', '8万+']
    ]}
];

function buildDomesticToolExpansion(startId = 5000) {
    const existingNames = new Set(TOOLS_DATA.map(tool => tool.name));
    let id = startId;
    return DOMESTIC_TOOL_VENDOR_MATRIX.flatMap(entry => entry.products.map(([name, category, summary, url, tags, pricing, icon, users]) => ({
        id: id++,
        name,
        category,
        desc: `${entry.vendor}生态工具：${summary}`,
        logo: favicon(hostFromUrl(url)),
        icon,
        color: entry.color,
        tags: [...new Set([...(tags || []), '国产'])],
        pricing,
        region: 'domestic',
        rating: pricing === 'free' ? 4.6 : pricing === 'freemium' ? 4.5 : 4.4,
        users,
        url,
        hot: users.includes('300万') || users.includes('500万')
    }))).filter(tool => !existingNames.has(tool.name));
}

TOOLS_DATA.push(...buildDomesticToolExpansion());
