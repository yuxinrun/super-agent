---
title: 事件驱动：让 Agent 不必等你敲门
description: Trigger 的两道闸（程序规则过滤与大模型判断）、订阅直通机制、Router 批处理，以及消融实验揭示的成本结构。
---

# 事件驱动：让 Agent 不必等你敲门

被动响应是单 Session 模式的基因病：**你不说话，它就不存在。** 想让它变成持续在线的协作者，第一步是把「启动条件」从你的回车键换成外部世界发生的事件。

## Trigger：什么算一件事发生了

文章把外部信息统称为 **Trigger**，举的例子都是真实工作现场里已经在响的东西：

<div class="mp-tags">
  <span>群聊消息</span><span>邮件</span><span>日程提醒</span><span>代码审查评论</span><span>CI 运行结果</span><span>工单 / 表单</span>
</div>

注意这批例子的共同点：它们**都在发生，都不需要你转述**。你现在的用法是把它们复制粘贴给 AI——这一步正是被消灭的对象。

## 两道闸：先便宜，后贵

一条群消息进来了。如果每条都叫大模型认真判断「这件事要不要处理」，成本会立刻变成主要矛盾——绝大多数群消息是废话。

Super-agent 的做法是串联两道闸：

1. **程序规则过滤（Fast Path）**：用确定性的规则先筛一遍。命中某个 Worker 已订阅的事件线，就直接投递，**根本不叫模型思考**。
2. **大模型判断（Slow Path）**：规则判不了的，才交给 Router 判断要不要启动任务、分给谁、跟哪些任务有关联或冲突。

<EventPath />

::: tip 这套分流的价值不在快，在便宜
团队的消融实验把直通机制拆掉，结果很有意思：
- **Router 决策次数增加约 30%**
- **读缓存 token 从 2323 万涨到 3177 万**（约 +37%）
- **完成时间基本不变**

最后一条是最容易被忽略、也最能说明问题的。省下来的不是秒表读数，是**推理账单和主管的注意力带宽**。一个不假思索就能转达的门卫，和一个凡事要开会研究的门卫，处理同样的事要花掉多三成的会议时间。
:::

## 批处理：别来一条想一次

即便走了慢路径，Router 也不该为单条消息单独醒一次。做法是把攒着的事件**打包成一个批次一起判断**：

<div class="mp-stats">
  <div class="mp-stat"><strong>6.4s</strong><span>逐条判断时的单决定推理时间</span></div>
  <div class="mp-stat"><strong>1.6s</strong><span>批处理后摊薄到每个决定</span></div>
  <div class="mp-stat"><strong>≈4×</strong><span>摊薄倍数</span></div>
  <div class="mp-stat"><strong>0</strong><span>需要新模型或新能力</span></div>
</div>

这就是操作系统里「批处理」那个老主意的直接复用：一次启动的固定开销摊到多个任务上。延迟没有消失，只是不再为每一件小事单独付一次。

## 主动性从哪儿来

把这三样拼起来，「会自己找活干」就不再是形容词：

<div class="mp-steps">
  <div class="mp-step"><b>1</b><div><strong>事件流常开</strong><p>Trigger 不停进来，不依赖你发起。</p></div></div>
  <div class="mp-step"><b>2</b><div><strong>规则先筛</strong><p>确定性的事用确定性的代码处理，绝大多数噪音止步于此。</p></div></div>
  <div class="mp-step"><b>3</b><div><strong>Router 批判断</strong><p>剩下的攒一批，一次决定：开不开工、开几个、给什么上下文、跟谁冲突。</p></div></div>
  <div class="mp-step"><b>4</b><div><strong>Worker 订阅后续</strong><p>这件事的后续消息直送正在干活的 Worker，不必再回来问一遍。</p></div></div>
</div>

配合[投机执行](./multi-channel.md)（先在后台把大概率有用的活做了，确认有价值再提交），主动性就有了工程实现——**它不是有意志，它是有人在替它值班。**

## 这条路的代价，必须一起读

::: warning 事件驱动把三个难题同时请进门
1. **误触发。** 「群里有 30 条消息，哪条值得开工」变成一个你需要长期调的判定问题。规则写松了它乱动，写紧了它又变成被动工具。
2. **权限焦虑。** 一个能被外部消息唤醒、还会自己调工具的进程，权限模型必须一开始就设计好——谁能在群里触发它、哪些 Trigger 只能读不能写。
3. **静默成本。** 它不吭声的时候也在跑，也在花钱。没有 dashboard 的常驻 Agent，等于一张你从不检查的账单。
:::

这三条都不是 DeepSeek 没想到的，而是这类架构天然的交换条件：**你用人肉调度换来了一套需要被治理的自动化。** 复杂度没有消失，它从你的日程表搬到了你的架构里。

<div class="mp-quote">判断一个事件驱动设计是不是成熟，看它有没有把「不该响应的事件」当成一等公民来处理。只会处理命中，不只会处理噪音的，是玩具。</div>

## 继续读

<div class="mp-grid">
  <a class="mp-card tone-blue" href="./multi-channel.html">
    <span class="mp-num">03</span>
    <h3>面向人的交互</h3>
    <p>多信道、全双工与投机执行：它干活时你怎么办。</p>
    <span class="mp-go">下一站</span>
  </a>
  <a class="mp-card tone-lime" href="./storage-compute.html">
    <span class="mp-num">04</span>
    <h3>计算、状态与环境分离</h3>
    <p>Trigger 与 Thread 这些对象存在哪里，模型怎么把它们找回来。</p>
    <span class="mp-go">下一站</span>
  </a>
  <a class="mp-card" href="../evidence/numbers.html">
    <span class="mp-num">05</span>
    <h3>数字怎么读</h3>
    <p>300 条消息、20 条工作请求、5 次重复——实验的规模与口径。</p>
    <span class="mp-go">看证据</span>
  </a>
</div>
