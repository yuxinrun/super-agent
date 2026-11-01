---
layout: home

hero:
  name: Super-agent
  text: 一个会自己找活干的 Agent
  tagline: 2026 年 10 月 31 日深夜，DeepSeek Harness 团队摊开了一套 Agent 底层架构：让 AI 去指挥 AI 干活，人从「逐条下指令的人」上移到「定目标和验收的人」。这份手册把它讲到你能给同事复述一遍。
  actions:
    - theme: brand
      text: 十分钟讲透
      link: /guide/what-is
    - theme: alt
      text: 直接看架构图
      link: /architecture/overview
    - theme: alt
      text: 原文与开源原型
      link: https://github.com/deepseek-ai/dsh-superagent-prototype
---

<div class="mp-wrap">

<section class="mp-section" style="border-top:0;padding-top:20px">

<div class="mp-eyebrow">Super-agent · 架构解读手册</div>

## 一句话：Agent 的瓶颈不是模型，是你的注意力

<p class="mp-lead">模型能一口气干半小时的活之后，新的卡点变成了你：开五个窗口、分别下指令、来回核对进度、给每一个 AI 复述一遍背景。你想用 AI 减负，结果变成人在管理一堆 AI。Super-agent 的答案是把「管理 AI」这件事也交给 AI——系统层接管会话与上下文，你只留下目标和验收。</p>

<div class="mp-stats">
  <div class="mp-stat"><strong>5</strong><span>大模块 · 撑起一个常驻 Agent</span></div>
  <div class="mp-stat"><strong>7</strong><span>件从操作系统偷来的老主意</span></div>
  <div class="mp-stat"><strong>12.4</strong><span>分钟 · 一半任务 p50 完成</span></div>
  <div class="mp-stat"><strong>2026</strong><span>10-31 公开 · MIT 原型开源</span></div>
</div>

<div class="mp-tags">
  <span>DeepSeek Harness</span><span>Router</span><span>Worker Pool</span><span>Event-driven</span><span>Fast / Slow Path</span><span>Full-duplex</span><span>Storage / Compute Split</span><span>Watchdog</span>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow coral">The problem · 你现在是怎么用 AI 的</div>

## 你不是在用 AI，你是在当 AI 的人工调度器

<p class="mp-lead">把两种工作方式并排放，差别一眼就出来。左边是今天，右边是 Super-agent 想让你过上的日子。</p>

<div class="mp-split">
<div>

<div class="mp-steps">
  <div class="mp-step"><b>今天</b><div><strong>你开窗口</strong><p>每件事一个会话，每个会话你都要重新交代背景。</p></div></div>
  <div class="mp-step"><b>今天</b><div><strong>你盯进度</strong><p>它在跑，你在等；它问一句，你答一句，你一停它就停。</p></div></div>
  <div class="mp-step"><b>今天</b><div><strong>你当人肉总线</strong><p>A 会话查到的资料，你得复制粘贴给 B 会话。</p></div></div>
  <div class="mp-step"><b>今天</b><div><strong>你负责记住</strong><p>关掉窗口就失忆，下周同一件事从头解释。</p></div></div>
</div>

<div class="mp-quote">会话（session）这个词本身就暴露了现状：它是有始有终的一次对话，而不是一个一直在岗的同事。你请的是临时工，却按正式岗 Expectation 去期待它。</div>

</div>
<div>

<div class="mp-steps">
  <div class="mp-step"><b>之后</b><div><strong>你定目标</strong><p>「把这批投诉分类整理出周报初稿」——一句话，不用拆解。</p></div></div>
  <div class="mp-step"><b>之后</b><div><strong>Router 分活</strong><p>系统里的调度层决定开几个 Worker、各给什么上下文。</p></div></div>
  <div class="mp-step"><b>之后</b><div><strong>Worker 并行干</strong><p>各聊各的会话、各记各的上下文，互不排队、互不串味。</p></div></div>
  <div class="mp-step"><b>之后</b><div><strong>你来验收</strong><p>汇总好的结果推到你熟悉的聊天窗口，你只判断能不能发。</p></div></div>
</div>

<a class="mp-go" style="display:inline-block;margin-top:18px;color:var(--accent);font-weight:650" href="./guide/why.html">看问题定义的完整版 →</a>

</div>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow">Anatomy · 五大模块</div>

## 拆开看：一台给 Agent 用的迷你操作系统

<p class="mp-lead">这套架构没有发明新理论。它做的是把五个工程模块拼在一起，让一个 Agent 能常驻、能并行、能自己开工、能自己复活。每个模块都对应一个你迟早会撞上的问题。</p>

<div class="mp-grid">
  <a class="mp-card" href="./architecture/two-layer.html">
    <span class="mp-num">01</span>
    <h3>双层架构</h3>
    <p>Router 当主管：过滤、排队、判断、汇总。Worker 当执行者：一个任务一个会话，专心想事。</p>
    <span class="mp-go">看谁该管上下文</span>
  </a>
  <a class="mp-card tone-coral" href="./architecture/event-driven.html">
    <span class="mp-num">02</span>
    <h3>事件驱动</h3>
    <p>不等你去问，事情来了才动。Fast Path 直通，Slow Path 才叫模型思考，噪音只记账。</p>
    <span class="mp-go">看三种命运</span>
  </a>
  <a class="mp-card tone-blue" href="./architecture/multi-channel.html">
    <span class="mp-num">03</span>
    <h3>异步多信道</h3>
    <p>全双工：它能同时听、同时说、同时干。你在 IM、GitHub 评论、表单里都能找到它。</p>
    <span class="mp-go">看交互怎么不排队</span>
  </a>
  <a class="mp-card tone-lime" href="./architecture/storage-compute.html">
    <span class="mp-num">04</span>
    <h3>存算分离</h3>
    <p>把「记得什么」搬到模型外面。Worker 可以随时被换掉，记忆不会跟着进程一起消失。</p>
    <span class="mp-go">看上下文去哪了</span>
  </a>
  <a class="mp-card" href="./architecture/watchdog.html">
    <span class="mp-num">05</span>
    <h3>外部 Watchdog</h3>
    <p>不判断对错，只判断还喘不喘气。卡死、超时、崩溃，由外面的进程把它踹醒。</p>
    <span class="mp-go">看它怎么自己复活</span>
  </a>
  <a class="mp-card tone-coral" href="./foundations/os-ideas.html">
    <span class="mp-num">06</span>
    <h3>七件老主意</h3>
    <p>调度、缓存、批处理、Fast/Slow Path、投机执行、存算分离、看门狗——全是操作系统的祖传手艺。</p>
    <span class="mp-go">看它偷了什么师</span>
  </a>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow coral">Cost · 为什么不每条消息都想一下</div>

## 事件进来之后，其实有三条路

<p class="mp-lead">如果每一条群消息都要 Router 认真思考一次，你就雇了一个专门去开门的经理。真正省钱的是那条「不用想」的路。</p>

<EventPath />

<a class="mp-go" style="display:inline-block;margin-top:18px;color:var(--accent);font-weight:650" href="./architecture/event-driven.html">看事件驱动的完整机制 →</a>

</section>

<section class="mp-section">

<div class="mp-eyebrow">Evidence · 数字</div>

## 它给出的证据，和证据的边界

<p class="mp-lead">初步实验证明了「系统层接管会话调度」这条路走得通。请把数字和口径一起读——包括那句最容易被忽略的话：开源的原型，和跑出这些数字的版本，不完全一样。</p>

<MetricGrid />

<a class="mp-go" style="display:inline-block;margin-top:18px;color:var(--accent);font-weight:650" href="./evidence/numbers.html">看这些数字怎么读 →</a>

</section>

<section class="mp-section">

<div class="mp-band">
  <div class="mp-eyebrow coral">It is not a model · 这不是新模型</div>
  <h2 class="mp-h2">发布的不是一颗更大的脑子，而是一个新的工头</h2>
  <p class="mp-lead">Super-agent 不训练参数、不换推理能力，它换的是「谁在管理会话」。这件事看起来很朴素，但它决定了你能不能把一个 Agent 当同事用，而不是当一个需要你全程陪聊的工具。</p>

  <div class="mp-band-grid">
    <div>
      <div class="mp-band-card">
        <h3>模型负责想，系统负责记</h3>
        <p>让模型自己记住所有会话，等于让厨师自己兼收银、兼采购、兼接电话。能力没变强，只是被杂事吃掉了。</p>
        <a href="./architecture/two-layer.html">看双层架构怎么分工 →</a>
      </div>
      <div class="mp-band-card" style="margin-top:14px">
        <h3>人上移到决策与验收</h3>
        <p>目标由你定，成果由你签。中间的派活、并行、同步、重试交给系统。这是这套架构真正的产品价值，不是省了几秒。</p>
        <a href="./guide/what-is.html">看一句话版定义 →</a>
      </div>
    </div>
    <div>
      <div class="mp-band-card">
        <h3>主动性是设计出来的</h3>
        <p>「会自己找活干」听起来像玄学，实现方式很工程：事件流常开，Router 有判断权，做完再回来找人。没有魔法，只有订阅。</p>
        <a href="./architecture/event-driven.html">看事件驱动 →</a>
      </div>
      <div class="mp-band-card" style="margin-top:14px">
        <h3>可靠性外包给看门狗</h3>
        <p>模型不能自己保证自己活着。外部进程盯心跳、发现卡死就重启，任务状态在模型外面，所以重启不是失忆。</p>
        <a href="./architecture/watchdog.html">看 Watchdog →</a>
      </div>
    </div>
  </div>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow">Field notes · 别误会</div>

## 关于 Super-agent 的 6 个常见误解

<p class="mp-lead">热度来得比理解快。下面这六条是最容易被转歪的地方，每一条都能在后面的章节里找到依据。</p>

<div class="mp-grid">
  <div class="mp-card tone-coral"><span class="mp-num">A</span><h3>「DeepSeek 发了个新模型」</h3><p>不是。没有新参数、没有新 benchmark 刷榜，是一套 Agent 系统架构加一个研究原型。</p><span class="mp-go">它到底是什么</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">B</span><h3>「可以下载安装开箱即用」</h3><p>官方定位是研究原型，代码与内部版本不完全一致，接入渠道有限，个人部署有门槛。</p><span class="mp-go">能力边界</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">C</span><h3>「这就是 Multi-Agent 框架」</h3><p>LangGraph、CrewAI 让你在一次任务里编排多个角色；Super-agent 解决的是常驻、事件与状态。</p><span class="mp-go">与框架的区别</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">D</span><h3>「AI 从此不用管了」</h3><p>人上移到目标和验收，不是消失。自主性越高，验收与权限设计越重要。</p><span class="mp-go">开放问题</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">E</span><h3>「12.4 分钟是行业基准」</h3><p>那是团队自己初步实验的 p50，基线是带 Subagent 工具的单 Session，不可直接复现。</p><span class="mp-go">数字怎么读</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">F</span><h3>「搜 superagent 就能搜到它」</h3><p>这个词已经很挤：JavaScript 请求库、销售自动化产品、营销形容词都在用。本站说的是 DeepSeek 那套编排层架构。</p><span class="mp-go">这个词很挤</span></div>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow">Sister sites · 姊妹站</div>

## 三本手册，讲的是同一件事的三个层面

<p class="mp-lead">Super-agent 讲「一个 Agent 怎么常驻并并行」，MCP Patterns 讲「能力怎么接进来」，构建更好的 Agent 讲「循环、上下文与评估怎么设计」。三本合起来才是完整的工程图。</p>

<div class="mp-friend">
  <a class="mp-friend-card" href="https://yuxinrun.github.io/mcp-patterns/" target="_blank" rel="noopener">
    <span>yuxinrun.github.io/mcp-patterns</span>
    <strong>MCP Patterns</strong>
    <p>MCP Server 工程模式与实战手册：协议、传输、鉴权、多租户、调试、Skill Hub 与框架对接。Super-agent 里 Worker 要调的那些工具，就在这套体系里。</p>
    <em>去读工具层手册 →</em>
  </a>
  <a class="mp-friend-card" href="https://how-to-build-better-agents.yuxin.run/" target="_blank" rel="noopener">
    <span>how-to-build-better-agents.yuxin.run</span>
    <strong>如何构建更好的 Agent</strong>
    <p>写给传统程序员转型 Agent 开发、以及 Agent 工程师进阶的实战手册。10 章结构化内容、双语、明暗主题。</p>
    <em>去读 Agent 手册 →</em>
  </a>
</div>

<div class="mp-quote">建议阅读顺序：先在姊妹站理解 Agent 的循环与上下文，再回来看怎么让它常驻并并行，最后用 MCP 把真实能力接进去。</div>

</section>

</div>
