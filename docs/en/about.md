---
title: About This Site
description: "Where this handbook's material comes from, the writing conventions, which statements are the original text and which are our framing, not an official statement, and how the three Yuxin Runs sites relate to each other."
---

# About This Site

## What this is

A handbook that takes the DeepSeek Harness team's **Super-agent architecture** all the way down, written in Chinese with an English mirror alongside. Not a news retelling, not a translation of official docs — the kind of version **one person can actually understand, and then explain to someone else**.

"Explained all the way down" in the title is a promise and the only acceptance test: after each page, you should be able to answer one specific question.

## Where the material comes from

| Source | What it's used for |
| --- | --- |
| "Super-agent Design Exploration: Toward More Autonomous Agent Systems", DeepSeek Harness team, 2026-10-31 | The source of every core fact and number |
| [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype) (MIT) | The existence and the positioning of the open-source prototype |
| Reporting from several tech outlets at home and abroad | Cross-checking the article's numbers and wording |

::: danger One rule that runs through the whole site
Whatever is in the original, this site states it plainly and marks which section it came from.  
Whatever this site inferred, added, or compared is **always written as "this site's inference" or put inside a `warning` block.**

For instance, these are inferences, not official conclusions: [the watchdog's authority boundary](limits/open-problems.md), [the comparison with Anthropic's brain/hands separation](architecture/storage-compute.md), [the three-layer cut of orchestration / session / runtime](guide/vs-others.md).
:::

## Writing conventions

- **Plainness first.** Every term gets a non-technical phrasing before it gets a definition. By the time you meet "Inline / Spill", the context should already have told you what it's about.
- **Funny, not smarmy.** Joke about the foreman, the horse harness, the watchdog — never about the people doing the work.
- **Every number carries its measurement basis.** p50 and p95 don't get mixed together, saving time and saving money don't get mixed together, the prototype and the internal version don't get mixed together.
- **Neither hyping nor burying.** This architecture has a lot that's interesting and a lot that's unfinished. Both are on the pages.

## Design and implementation

The site is built with VitePress. The visual system is Yuxin Runs' own: **warm paper plus deep sea-green, with a teal accent**, Manrope paired with JetBrains Mono, and the motif is an engineering drawing — dashed frames, grids, monochrome labels. Dark mode isn't a simple inversion; it's the same set of semantic colors moved into a night-navigation environment.

The seven interactive components (hero structure diagram, two-layer architecture diagram, three-path diagram, metric grid, four traits, the borrowing comparison table, and the brand mark) are all hand-written Vue components. Each carries both language versions of its copy internally and switches by itself — no machine translation.

## How the three sites relate

<div class="mp-grid">
  <a class="mp-card" href="https://yuxinrun.github.io/mcp-patterns/" target="_blank" rel="noopener">
    <span class="mp-num">A</span>
    <h3>MCP Patterns</h3>
    <p>Engineering patterns and field notes for MCP servers. Its question: how tools get attached in a standard way.</p>
    <span class="mp-go">The interface layer</span>
  </a>
  <a class="mp-card tone-coral" href="https://how-to-build-better-agents.yuxin.run/" target="_blank" rel="noopener">
    <span class="mp-num">B</span>
    <h3>How to Build Better Agents</h3>
    <p>Agent design principles and common failure modes. Its question: how one agent thinks inside itself.</p>
    <span class="mp-go">Inside a single agent</span>
  </a>
  <a class="mp-card tone-blue" href="../architecture/overview.html">
    <span class="mp-num">C</span>
    <h3>This site</h3>
    <p>Super-agent, explained all the way down. Its question: when many agents run at once, who gives the orders.</p>
    <span class="mp-go">The orchestration layer</span>
  </a>
</div>

The three sites stand at three different heights of an agent system. If you only read one, start with [Super-agent in one page](guide/what-is.md).

## Corrections

The numbers and the wording are all checkable against public material, but **I can still have read it wrong**. Every page cites its source, so check the source first when something looks off.

If it's wrong, it gets fixed; if it can't be fixed, the page comes down — you don't need to remind me about that.
