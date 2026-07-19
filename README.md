# dengguang — 杨子硕作品集

杨子硕（YZS）的作品集网站。首页是一盏可以拉动的吊灯，照亮一张真实渲染进
WebGL 的 HTML 页面；**向下滚动时灯光会越来越亮，直到照亮整个屏幕**，无缝进入
下方的作品与关于区；回到顶部时，灯光重新暗下来。

**[在线访问 →](https://calibg.github.io/dengguang/)**

## 交互

| 输入 | 动作 |
| --- | --- |
| 向下滚动 | 灯光渐亮，照亮全屏，进入作品区 |
| 回到顶部 | 灯光渐暗，回到暗室 |
| 鼠标左键拖动 | 拉动吊灯瞄准 |
| 松开 | 吊灯自由摆动 |
| 右键拖动 | 调整光束角度 |
| 右键单击 | 切换灯光颜色 |
| 双击 | 复位吊灯 |

## 本地开发

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

质量检查：

```bash
npm run lint
npm test
```

## 部署

```bash
npm run deploy
```

本地构建静态站点并推送到 `gh-pages` 分支，GitHub Pages 从该分支发布：
<https://calibg.github.io/dengguang/>。

## 添加作品

作品数据在 [`app/site/content.ts`](./app/site/content.ts)，按 `Work` 结构往
`WORKS` 数组里加条目即可，页面自动渲染卡片。

## 致谢与来源

灯光交互部分基于开源项目
[HTML-Light-Demo](https://github.com/jinruozai/HTML-Light-Demo)（MIT License，
作者 [@LazyGooooo](https://x.com/LazyGooooo)），其原创概念与艺术方向来自
[@kaolti](https://x.com/kaolti)。HTML-in-Canvas 渲染由
[three-html-render](https://www.npmjs.com/package/three-html-render) 与
[Three.js](https://threejs.org/) 驱动。

## License

本项目基于 [MIT License](./LICENSE) 发布（沿用上游项目的许可证）。
