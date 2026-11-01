---
title: Harness 与「一切都是插件」
description: Super-agent 不是从石头缝里蹦出来的，它长在 DeepSeek Harness 上。这篇讲 Harness 是什么、插件化指哪些层、开源原型仓库能拿到什么、以及团队内部拿它干什么。
---

# Harness 与「一切都是插件」

::: info 一句话
Super-agent 是一套**架构**，Harness 是让它能跑起来的**底座**。前者讲「谁调度谁」，后者讲「你想换什么都能换」。
:::

## Harness 这个词的本义

Harness 原意是**马具**——套在马身上那副皮带。技术语境里借的是同一个动作：一匹很有力气但会乱跑的马，套上具之后才能拉车。

所以「Agent Harness」说的不是模型本身，而是**模型外面那一圈**：怎么把上下文喂进去、工具怎么接、输出怎么收、出错了怎么兜住、换模型时哪些地方不用重写。

同一个模型，套不同的 Harness，表现差距可以很大。这也是为什么这类基础设施最近开始被单独拿出来说。

## 「一切都是插件」具体指哪几层

文章里这句话不是形容词，是一张清单：

| 插件位 | 可以换成什么 | 为什么要能换 |
| --- | --- | --- |
| 模型 | 不同规模、不同价位的模型 | 便宜模型做过滤，贵模型做判断 |
| 工具 | 任何外部能力，含 MCP 生态 | 工具会一直变，架构不该跟着变 |
| 存储 | 会话状态放哪儿 | 有人要云端库，有人只要本地文件 |
| 界面 | 群聊 / GitHub 评论 / 邮件 / 自有 UI | 人本来就在多个信道里工作 |

::: tip 和 MCP 是同一件事的两端
MCP 解决的是**工具怎么被标准化地接进来**；Harness 解决的是**接进来之后谁来调度、状态存哪儿、挂了怎么办**。

一个管接口，一个管 runtime。想连起来看，去看姊妹站 [MCP Patterns](https://yuxinrun.github.io/mcp-patterns/)。
:::

另外两项兼容性也写在文章里：**专家包迁移**与**自定义工作流**。翻成大白话——你已经攒下的那套领域配置，和你已经画好的那套流程，迁过来时不用推倒重来。

## 开源原型能拿到什么

::: warning 先把预期校准
仓库地址：[deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)，MIT 许可。

团队的措辞很明确：这是**研究原型**。它存在的意义是「把这套设计跑给你看」，不是「给你一个可以直接上线的服务」。而且**跑实验数字的那个版本和开源版本不完全一致**——你在公开代码里复现那张表格，大概率对不上。
:::

对一个原型来说，值得看的三处：

1. **Router 与 Worker 的边界在代码里长什么样**——尤其是「Router 不给工具」这件事是怎么落地的。
2. **Trigger / Thread / Worker Session 三个 ID 的引用链**——链式召回不是概念，是一段可以读的实现。
3. **Watchdog Session 是怎么被定时消息驱动的**——这是整套设计里最少见、也最值得抄的一块。

## 内部拿它干什么

文章列了三类日常用途，值得注意的是它们都不是「写新功能」：

- **问题复现与修复**——用户报一个 bug，先静默复现一次，能修就顺手修了，不能修就闭嘴。
- **代码审查**——CI 和评论本来就是事件源，正好喂。
- **Harness 自身的迭代**——用自己的基础设施开发自己的基础设施。

最后这条是整个故事里最有分量的部分。**这不是一个「我们设想这样会很好」的方案，是一个已经在给自己干活的方案。** 前面那组实验数据，很大一部分就来自这个一直在跑的实例。

<div class="mp-quote">判断一个架构靠不靠谱，有个便宜办法：看作者自己是不是用户。DeepSeek 这里是——是的。</div>

## 继续读

<div class="mp-grid">
  <a class="mp-card" href="../architecture/storage-compute.html">
    <span class="mp-num">01</span>
    <h3>底座怎么部署</h3>
    <p>云端无状态容器、数据库里的会话状态、本地那个什么都不存的 daemon，以及 BYOM。</p>
    <span class="mp-go">看存算分离</span>
  </a>
  <a class="mp-card tone-coral" href="../evidence/numbers.html">
    <span class="mp-num">02</span>
    <h3>数据从哪来</h3>
    <p>300 条消息的实验、p50/p95、五次都没委派、消融省的是钱。</p>
    <span class="mp-go">回到数字</span>
  </a>
  <a class="mp-card tone-blue" href="../limits/open-problems.html">
    <span class="mp-num">03</span>
    <h3>还没做完的</h3>
    <p>扩展性、A2A、安全与隐私，以及从原型到产品的距离。</p>
    <span class="mp-go">看边界</span>
  </a>
</div>
