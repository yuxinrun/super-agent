---
title: 全景：一台给 Agent 用的迷你操作系统
description: Super-agent 整体架构的五个模块、三个核心对象（Trigger / Thread / Worker Session），以及它们如何咬合。
---

# 全景：一台给 Agent 用的迷你操作系统

DeepSeek Harness 团队给出的架构由五部分组成，顺序就是数据的流向：

<div class="mp-steps">
  <div class="mp-step"><b>01</b><div><strong>双层架构</strong><p>Router 承接交互与调度，Worker 在隔离会话里并发执行。</p></div></div>
  <div class="mp-step"><b>02</b><div><strong>事件驱动</strong><p>外部世界发生的事叫 Trigger；程序规则先过滤，大模型再判断要不要动手。</p></div></div>
  <div class="mp-step"><b>03</b><div><strong>面向人的交互</strong><p>多信道、全双工：换一个渠道找它，还是同一个 Agent；它干活时你还能插话。</p></div></div>
  <div class="mp-step"><b>04</b><div><strong>计算、状态与环境分离</strong><p>推理放云端无状态容器，会话状态进数据库，重环境留在你自己的机器上。</p></div></div>
  <div class="mp-step"><b>05</b><div><strong>Watchdog</strong><p>一个独立会话由定时消息驱动，盯着有没有进展、有没有跑偏。</p></div></div>
</div>

<LayerArch />

## 三个对象，先把名词钉住

后面所有的机制都挂在这三个对象上。不清楚它们，就等于没读这一页。

| 对象 | 是什么 | 谁产生 | 谁消费 | 为什么需要它 |
| --- | --- | --- | --- | --- |
| **Trigger** | 一条外部事件：群消息、邮件、日程提醒、代码审查评论、CI 结果 | 真实工作现场 | Router（或直通的 Worker） | 让 Agent 的启动不必依赖你敲字 |
| **Thread** | 一条可以被订阅的事件线 / 话题 | 事件源 | Worker 订阅，Router 维护关系 | 让「后续消息」有地方去找正在干活的人 |
| **Worker Session** | 一个执行任务的独立会话，有自己的上下文 | Router 派活时创建 | Worker 读写，状态存模型外 | 让并行不共享同一个上下文窗口 |

::: tip 这三个名词是理解全套机制的钥匙
链式召回（Chain of Recall）靠的就是 **Trigger ↔ Thread ↔ Worker Session 之间的引用关系**：模型沿着 ID 一级级把历史找回来，而不是把整段历史常驻在窗口里。看不懂后面几章时，回到这张表。
:::

## 五个特征，怎么落到五个模块

<FourTraits />

一个常见的误读是把四个特征当成愿景清单——「持续在线」「并行」「主动」「自愈」，听起来像任何一个成熟 Agent 产品都应该有的东西。真正的信息量在于**每个特征都由哪个具体模块负责，以及代价是什么**：

| 你想要的 | 需要的机制 | 你付出的代价 |
| --- | --- | --- |
| 跨会话记得事 | 状态存到模型外面的数据库 | 多一套存储与引用设计（Inline / Spill / 链式召回） |
| 同时干多件事 | Worker 会话隔离 + Router 调度 | Router 成为单点，必须想办法让它少思考 |
| 自己找活干 | Trigger 常开 + 程序规则过滤 + 投机执行 | 误触发与成本，以及「它凭什么判断这件事值得做」的权力让渡 |
| 崩了能复活 | 外部 Watchdog 独立会话 + 定时消息 | 一个会评判你进展的第三方进程，需要边界与审计 |

## 关键的设计取向：能力不从模型里挤，从结构里省

这一条是整套架构最值得抄走的部分。它的每一个模块都在做同一件事：**把某样东西从模型的职责里搬出去**。

- 调度搬出去 → Router 常驻，不靠模型临时起意。
- 记忆搬出去 → 状态进数据库，窗口只放热数据。
- 存活判断搬出去 → Watchdog 在外面看，模型自己不用报告「我还活着」。
- 甚至**工具**也搬出去——Router 手上没有工具，所以它物理上无法亲自下场跑测试。

::: warning 这里藏着整套架构最有说服力的一条证据
实验里，中性提示下的单 Session 方案，**五次运行一次都没有调用 Subagent**——即使工具就在手边。换成「优先委派」的提示词，五次里有四次委派了，但仍然比 Super-agent 慢；甚至有模型嫌任务太小、自己上手的时候。

结论很朴素：**你求它，它不听。** 指望模型「自觉」是不可靠的工程前提。Super-agent 的做法是不再指望，改在结构上让主管没有手、让执行者有独立的脑子。
:::

## 这套架构现在还不完整，官方也这么说

三个明确的未闭环项，读的时候请带着它们：

1. **异步 ReAct Loop 尚未默认开启。** 「它干活时你还能同时说话」这个理想，在原型里还没有成为默认路径。
2. **接入渠道有限。** 群聊、邮件、CI、GitHub 是设计目标里的 Trigger 源，不是全部已经接完的适配器。
3. **跨实例通信（A2A）与安全隐私仍是开放问题。** 多个 Super-agent 实例之间怎么协作、状态存云端意味着什么，文章把它列为待解，而不是已解。

<div class="mp-quote">一份把「还没做完」写进正文的架构文，比一份「全面落地」的公告有用得多。你缺的从来不是信心，是清单。</div>

## 继续拆

<div class="mp-grid">
  <a class="mp-card" href="./two-layer.html">
    <span class="mp-num">01</span>
    <h3>双层架构</h3>
    <p>Router 为什么一个工具都没有，Worker 为什么不直接回你消息。</p>
    <span class="mp-go">看分工</span>
  </a>
  <a class="mp-card tone-coral" href="./event-driven.html">
    <span class="mp-num">02</span>
    <h3>事件驱动</h3>
    <p>Trigger 进来之后经历的两道闸，以及那条不用想就能走通的捷径。</p>
    <span class="mp-go">看过滤与直通</span>
  </a>
  <a class="mp-card tone-blue" href="./multi-channel.html">
    <span class="mp-num">03</span>
    <h3>面向人的交互</h3>
    <p>多信道、异步 ReAct、投机执行——它怎么在你不看的时候干活。</p>
    <span class="mp-go">看交互</span>
  </a>
  <a class="mp-card tone-lime" href="./storage-compute.html">
    <span class="mp-num">04</span>
    <h3>计算、状态与环境分离</h3>
    <p>Inline / Spill、链式召回，以及 BYOM：为什么本地只放一个空壳 daemon。</p>
    <span class="mp-go">看记忆去哪了</span>
  </a>
  <a class="mp-card" href="./watchdog.html">
    <span class="mp-num">05</span>
    <h3>Watchdog</h3>
    <p>它不只管崩没崩，还会用模型判断你有没有在原地打转。</p>
    <span class="mp-go">看自愈</span>
  </a>
  <a class="mp-card tone-coral" href="../foundations/os-ideas.html">
    <span class="mp-num">06</span>
    <h3>七件老主意</h3>
    <p>把对照表看全：调度、缓存、批处理、Fast/Slow Path、投机、存算分离、看门狗。</p>
    <span class="mp-go">看它偷了什么师</span>
  </a>
</div>
