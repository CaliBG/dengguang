export type Work = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  cover: string;
  /** 详情页 slug（app/site/works-data.ts），无详情页的条目（如赛事）留空 */
  slug?: string;
};

// 作品数据：从旧作品集站（zuopinwangzhan / aurorashouse-restore）迁移。
// 封面图在 public/works/ 下；新增作品往数组里加条目即可，页面自动渲染。
export const WORKS: Work[] = [
  {
    id: "01",
    slug: "force-balance",
    title: "43+1 — 力量与平衡",
    category: "空间",
    year: "2025",
    description:
      "捕捉“力量被凝固”的瞬间。榔头本应是主导的工具，但在这里被定格在钉子的世界中——失去了攻击性，反而被钉子们支撑着、包围着。",
    cover: "/works/work01.jpg",
  },
  {
    id: "02",
    slug: "memory-of-the-flesh",
    title: "皮囊记忆 / Memory of the Flesh",
    category: "空间",
    year: "2025",
    description:
      "镜面被框入洁白的边界中，观者既成为观看者，也成为被观看者——一份关于“身体记忆”的存在证据。",
    cover: "/works/work02.jpg",
  },
  {
    id: "03",
    slug: "pain",
    title: "痛 — 被规训的皮囊",
    category: "空间",
    year: "2025",
    description:
      "以“皮囊”为核心意象，隐喻当代个体在社交滤镜与社会规训下被捆束、塑形的状态。",
    cover: "/works/work03.jpg",
  },
  {
    id: "04",
    slug: "deep-sea-breathing",
    title: "深海呼吸 — 压力代谢仪式",
    category: "实验",
    year: "2026",
    description:
      "当社会压力如深海般无声蔓延，服饰表面流动的呼吸鳃结构将焦虑转化为可视的起伏波纹。",
    cover: "/works/work04.jpg",
  },
  {
    id: "05",
    slug: "imprint-flowing-traces",
    title: "拓印 — 流动的痕",
    category: "实验",
    year: "2026",
    description:
      "以“沙”为媒介，将无形的时间感知转化为可观察与触摸的流动痕迹。距离即介入，观众即参与者。",
    cover: "/works/work05.jpg",
  },
  {
    id: "06",
    slug: "yzs-merch",
    title: "YZS® 周边系列 — 可触摸的态度",
    category: "品牌",
    year: "2026",
    description:
      "把设计从屏幕带回现实，让每一件周边成为日常生活中的“可触摸表达”——克制、直接，但不失锋芒。",
    cover: "/works/work06.jpg",
  },
  {
    id: "07",
    slug: "quiet-index",
    title: "安静指数 / Quiet Index",
    category: "实验",
    year: "2026",
    description:
      "通过电子显示屏与环境传感器，把宿舍里不可见的噪音与作息状态转化为可理解的“安静指数”，以非指向性的方式缓解共享空间的隐性压力。",
    cover: "/works/work07.jpg",
  },
  {
    id: "08",
    slug: "indigo-lion",
    title: "靛狮·域守 — Indigo Lion",
    category: "空间",
    year: "2026",
    description:
      "结合墩头篮非遗文化与舞狮意象，以废旧纺织物、报纸、轮胎与电路板重构地方文化记忆，让乡土文化在当代装置语言中被重新激活。",
    cover: "/works/work08.jpg",
  },
  {
    id: "09",
    slug: "tongkuang",
    title: "同框 / Tongkuang — 前后双摄相机",
    category: "应用",
    year: "2026",
    description:
      "让前后摄像头同时取景的 iOS 相机应用——后置记录眼前的世界，前置记录看世界的你。从相机调度到内购体系全部独立设计开发。",
    cover: "/works/tongkuang.jpg",
  },
  {
    id: "10",
    title: "粤港澳大湾区学校设计作品展",
    category: "赛事",
    year: "2026",
    description:
      "第八届粤港澳大湾区学校设计作品展暨第十届广东省高校设计作品学院奖双年展——作品入选参展。",
    cover: "/works/comp-bay.jpg",
  },
  {
    id: "11",
    title: "第26届白金创意国际大学生平面设计大赛",
    category: "赛事",
    year: "2026",
    description: "平面设计参赛作品已完成提交，入围结果公布后更新。",
    cover: "/works/comp-platinum-1.jpg",
  },
];
