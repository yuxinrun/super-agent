---
title: 这个词已经很挤了
description: 搜 superagent 会跳出 JavaScript 请求库、销售自动化产品、分层强化学习的元控制器，还有无所不在的营销形容词。这篇帮你把「鱼」分清楚。
---

# 这个词已经很挤了

如果你现在打开搜索引擎输入 `superagent`，会同时撞上至少四类完全不同的东西。把它们分清楚，比多记一个架构名词有用得多。

## 四拨人抢同一个词

| 你搜到的东西 | 它是什么 | 它和本站说的关系 |
| --- | --- | --- |
| `superagent`（npm） | 一个存在了很多年的 JavaScript HTTP 请求库，写 Node / 浏览器发请求用的 | 完全无关。它甚至不是 Agent |
| Superagent（SaaS 产品） | 销售自动化 / AI SDR 类产品，用来批量跟进线索 | 同名，不是同一件事 |
| 分层强化学习里的层级智能体 | Options 框架与元控制器（meta-controller）这一脉：上层选技能，下层执行 | 思想上有一点点亲戚关系，但**这个词并不是它的通用叫法**，别硬套 |
| 营销语境里的「super agent」 | 任何产品觉得自己比别人的 Agent 强，就会说自己是一个 super agent | 噪音。是本站最需要跟它划清界限的一类 |

本站讲的这一个，具体写法是 **Super-agent**——DeepSeek Harness 团队 2026 年 10 月底那篇文章里提出的一套**编排层架构**。带连字符，大写 S，指向很窄。

::: tip 为什么值得较这个真
因为「Agent」这个词已经被稀释到没有信息量了。当所有产品都叫自己 Agent，说「这是一个 Agent」等于什么都没说。

区分的方式不是换个更响的名字，是**说清楚它在哪一层**。这也是[它和 Multi-Agent 框架有何不同](../guide/vs-others.md)整篇在干的事。
:::

## 三层说法，一句话定位

```
模型层        决定「能不能想明白」
编排层        决定「谁在跑、谁在等、谁该被叫起来」  ← Super-agent 在这里
运行环境层    决定「跑在哪儿、状态存哪儿、挂了谁管」← Harness 在这里
```

一个词的记忆法：**Super-agent 不是一个更聪明的 Agent，是一个工头。** 工头自己不会砌墙，他的活是决定谁去砌哪面墙。

## 顺手分清这三对

- **Router vs 路由模型**：Router 是编排层里的常驻调度进程，不是一个做意图分类的小模型。它更像操作系统的调度器。
- **Worker vs 子任务 / Subagent**：Worker 是**独立会话、可并发、持有工具**的执行体；传统 Subagent 通常是一次性的、依附于父会话的调用。
- **Watchdog vs 重试逻辑**：重试是「失败了再来一次」，Watchdog 是「我不知道你有没有失败，所以我在外面盯着你有没有进展」。后者能抓住前者永远抓不到的那类问题——**没有报错的瞎忙**。

<div class="mp-quote">遇到新名词时最好用的一个问题：它在哪一层？这个问题比它叫什么更能定位信息。</div>

## 继续读

<div class="mp-grid">
  <a class="mp-card" href="../guide/what-is.html">
    <span class="mp-num">01</span>
    <h3>回到定义</h3>
    <p>一句话、四个特质、一张图，把这套东西到底说的是什么先钉住。</p>
    <span class="mp-go">一句话讲透</span>
  </a>
  <a class="mp-card tone-coral" href="../architecture/overview.html">
    <span class="mp-num">02</span>
    <h3>五个零件</h3>
    <p>双层架构、事件驱动、面向人的交互、状态与环境分离、Watchdog。</p>
    <span class="mp-go">看全景</span>
  </a>
  <a class="mp-card tone-blue" href="../limits/open-problems.html">
    <span class="mp-num">03</span>
    <h3>没做完的</h3>
    <p>官方承认的四个开放问题，和三条迟早要还的账。</p>
    <span class="mp-go">看边界</span>
  </a>
</div>
