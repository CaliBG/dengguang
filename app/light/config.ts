export const CONCEPTS = {
  品牌: "品牌与视觉识别——标志、字体与色彩系统的完整表达。",
  网页: "网页与交互——从布局到动效，屏幕里的叙事。",
  动效: "动态设计——让信息在时间的维度里展开。",
  空间: "空间与展陈——把设计放进真实的场地。",
  实验: "实验项目——技术、材料与形式的即兴练习。",
} as const;

export type Concept = keyof typeof CONCEPTS;

export type LightingSettings = {
  enabled: boolean;
  angle: number;
  brightness: number;
  color: string;
};

export const COLOR_PRESETS = ["#ffb36b", "#ffd9a3", "#8fdcff", "#c79cff", "#ff5f7f"] as const;

export const INITIAL_LIGHT: LightingSettings = {
  enabled: true,
  angle: 34,
  brightness: 1450,
  color: "#ffb36b",
};
