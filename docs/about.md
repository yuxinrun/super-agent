---
title: 关于本站
description: 这份手册的素材来源、写作约定、哪些是原文哪些是本站归纳、以及鱼心快跑三个站之间的关系。
---

# 关于本站

## 这是什么

一份把 DeepSeek Harness 团队的 **Super-agent 架构**讲到底的中文手册（另有一份英文镜像）。不是新闻复述，也不是官方文档翻译——是**一个人能看懂、看完能跟别人讲清楚**的那种版本。

标题里「讲透」是承诺，也是唯一的验收标准：读完每一页，你应当能回答一个具体的问题。

## 素材从哪来

| 来源 | 用处 |
| --- | --- |
| 《Super-agent 设计探索：迈向更自主的 Agent 系统》，DeepSeek Harness 团队，2026-10-31 | 全部核心事实与数字的出处 |
| [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)（MIT） | 开源原型的存在与定位 |
| 国内外多家科技媒体的报道 | 交叉核对文章里的数字与措辞 |

::: danger 一条贯穿全站的规则
凡是原文里有的，本站照实说，并标明是哪一节。  
凡是本站自己推的、补的、比的，**一定写成「本站推演」或放进 `warning` 框里。**

比如这几处就是推演，不是官方结论：[看门狗的权限边界](limits/open-problems.md)、[和 Anthropic 脑手分离的对照](architecture/storage-compute.md)、[编排层 / 会话层 / 运行环境层这三层切法](guide/vs-others.md)。
:::

## 写作约定

- **通俗优先。** 每引入一个术语，先给一个不涉及术语的说法。看到「Inline / Spill」这种词，应当已经在上下文里知道它在讲什么了。
- **幽默但不油腻。** 可以拿工头、马具、看门狗开玩笑，不拿做事的人开玩笑。
- **数字必须带口径。** p50 和 p95 不混着说，省时间和省钱不混着说，原型和内部版本不混着说。
- **不吹不黑。** 这套架构有意思的地方很多，没做完的地方也很多，两样都写在页面上。

## 关于设计与技术实现

站点用 VitePress 构建，视觉体系是鱼心快跑自己那套：**暖白纸面 + 深海墨绿 + 蓝绿色主调**，Manrope 配 JetBrains Mono，母题是工程图纸——虚线框、栅格、单色标签。深色模式不是简单反色，是同一套语义色换到夜航环境。

七个交互组件（Hero 结构图、双层架构图、三路径图、指标格、四特质、借鉴对照表、品牌标记）都是手写 Vue 组件，中英两份文案在组件内部切换，不靠机器翻译。

## 三个站的关系

<div class="mp-grid">
  <a class="mp-card" href="https://yuxinrun.github.io/mcp-patterns/" target="_blank" rel="noopener">
    <span class="mp-num">A</span>
    <h3>MCP Patterns</h3>
    <p>MCP Server 的工程模式与实战手册。管的是「工具怎么被标准化地接进来」。</p>
    <span class="mp-go">看接口层</span>
  </a>
  <a class="mp-card tone-coral" href="https://how-to-build-better-agents.yuxin.run/" target="_blank" rel="noopener">
    <span class="mp-num">B</span>
    <h3>构建更好的 Agent</h3>
    <p>Agent 设计原则与常见失败模式。管的是「一个 Agent 内部怎么想」。</p>
    <span class="mp-go">看单体内</span>
  </a>
  <a class="mp-card tone-blue" href="../architecture/overview.html">
    <span class="mp-num">C</span>
    <h3>本站</h3>
    <p>Super-agent 讲透。管的是「很多个 Agent 同时跑的时候，谁指挥」。</p>
    <span class="mp-go">看编排层</span>
  </a>
</div>

三个站分别站在 Agent 系统的三个不同高度上。如果只想读一个，从[一句话讲透 Super-agent](guide/what-is.md) 开始。

## 纠错

数字和措辞都在公开材料里可查，但**我依然可能读错**。每页都标了出处，发现对不上先照出处核对一遍。确认是本站写错了，就一定会改。

错了会改，改不动就删页面——这一点不需要你提醒。
