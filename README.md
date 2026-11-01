# Super-agent 讲透

一份把 **DeepSeek Harness 团队的 Super-agent 架构**讲到底的中英双语手册。

> Agent 的瓶颈不是模型，是你的注意力。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 输出到 docs/.vitepress/dist
npm run preview
```

## 部署

GitHub Pages 走仓库名路径，构建时注入 `BASE`：

```bash
BASE=/super-agent/ npm run build
```

`.github/workflows/deploy.yml` 已经设好 `BASE: /super-agent/`。绑定自定义域名时把 workflow 里的 `BASE` 改成 `/`。

## 目录

```
docs/
├── .vitepress/
│   ├── config.mts          # 中英两套 nav / sidebar / 搜索文案
│   └── theme/
│       ├── index.ts        # 全局注册 7 个组件 + Layout 插槽
│       ├── style.css       # 鱼心快跑设计令牌与 .mp-* 版式原语
│       └── components/     # HeroDiagram / LayerArch / EventPath /
│                           # MetricGrid / FourTraits / BorrowGrid / BrandMark
├── public/                 # logo、favicon、品牌图
├── index.md                # 首页（8 段式）
├── guide/ architecture/ foundations/ evidence/ limits/ about.md
└── en/                     # 与上面结构 1:1 镜像
```

`docs/**` 与 `docs/en/**` 是**镜像目录**：任何一侧新增页面，另一侧必须补齐，否则构建失败。组件内部用 `useData().lang` 自带双语，不需要两份组件。

## 内容来源

- 《Super-agent 设计探索：迈向更自主的 Agent 系统》，DeepSeek Harness 团队，2026-10-31
- [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)（MIT，研究原型）
- 国内外多家科技媒体报道，用于交叉核对数字与措辞

全站约定：**原文有的照实写，本站推演的一定标出来。** 数字全部保留口径（p50 / p95、省时间还是省钱、原型与内部版本）。

## 设计体系

视觉与版式继承 [鱼心快跑品牌规范](BRAND.md)：暖白纸面、深海墨绿、蓝绿主色，Manrope + JetBrains Mono，工程蓝图母题。姊妹站：[MCP Patterns](https://yuxinrun.github.io/mcp-patterns/)、[构建更好的 Agent](https://how-to-build-better-agents.yuxin.run/)。
