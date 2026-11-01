---
title: "Overview: a miniature operating system for agents"
description: The five modules of the Super-agent architecture, its three core objects (Trigger / Thread / Worker Session), and how they mesh together.
---

# Overview: a miniature operating system for agents

The architecture the DeepSeek Harness team published has five parts, and the order below is the order data moves through them:

<div class="mp-steps">
  <div class="mp-step"><b>01</b><div><strong>Two-layer architecture</strong><p>The Router takes the interaction and does the dispatch; Workers execute concurrently in isolated sessions.</p></div></div>
  <div class="mp-step"><b>02</b><div><strong>Event-driven</strong><p>Something happening in the outside world is a Trigger. Program rules filter first; the model then decides whether to act.</p></div></div>
  <div class="mp-step"><b>03</b><div><strong>Human-facing interaction</strong><p>Multi-channel, full duplex: reach it from another channel and it is still the same Agent; you can talk over it while it works.</p></div></div>
  <div class="mp-step"><b>04</b><div><strong>Separating compute, state and environment</strong><p>Reasoning runs in stateless cloud containers, session state goes to a database, the heavy environment stays on your own machine.</p></div></div>
  <div class="mp-step"><b>05</b><div><strong>Watchdog</strong><p>A separate session driven by scheduled messages, watching for missing progress and for drift.</p></div></div>
</div>

<LayerArch />

## Three objects: pin down the nouns first

Every mechanism later hangs off these three. Not knowing them means you have not read this page.

| Object | What it is | Who creates it | Who consumes it | Why you need it |
| --- | --- | --- | --- | --- |
| **Trigger** | one external event: a chat message, an email, a calendar reminder, a review comment, a CI result | the real work site | Router (or a Worker directly, via passthrough) | so the Agent can start without you typing |
| **Thread** | an event line / topic you can subscribe to | the event source | Workers subscribe; Router maintains the relationships | so "later messages" have somewhere to find whoever is doing the work |
| **Worker Session** | an isolated session executing one task, with its own context | created when the Router hands out work | the Worker reads and writes it; state lives outside the model | so parallel work does not share one context window |

::: tip These three nouns are the key to every mechanism here
Chain of Recall runs on **the reference relationships between Trigger / Thread / Worker Session**: the model walks IDs, level by level, to pull history back instead of keeping the whole transcript resident in the window. When a later chapter stops making sense, come back to this table.
:::

## Five traits: which module pays for which

<FourTraits />

A common misreading treats the four traits as a vision board — "always on", "parallel", "proactive", "self-healing" — which sounds like what any mature Agent product should have anyway. The actual information is in **which module owns each trait, and what it costs**:

| What you want | The mechanism required | What you pay for it |
| --- | --- | --- |
| remembering across sessions | state stored in a database outside the model | another storage layer plus reference design (Inline / Spill / Chain of Recall) |
| several things at once | isolated Worker sessions + Router dispatch | the Router becomes a single point, so you have to make it think less |
| finding its own work | always-on Triggers + rule filtering + speculative execution | misfires, cost, and handing over the power to decide "this is worth doing" |
| recovering after a crash | an external Watchdog Session + scheduled messages | a third-party process judging your progress, which needs boundaries and auditing |

## The design stance worth stealing: capability comes from structure, not from squeezing the model

This is the part of the architecture most worth copying. Every module does the same thing: **it moves something out of the model's job**.

- Dispatch moves out → the Router is resident; it does not wait for the model to decide to schedule.
- Memory moves out → state goes to the database; the window holds hot data only.
- Liveness moves out → the Watchdog looks from outside, so the model never has to report "still alive".
- Even **tools** move out — the Router holds none, so it physically cannot go run the test itself.

::: warning This is where the most convincing evidence in the whole design sits
In the experiments, the single-Session setup under a neutral prompt **called a Subagent zero times across 5 runs** — with the tools sitting right there. With a delegation-friendly prompt, 4 of 5 runs delegated, and it was still slower than Super-agent; in some runs the model decided the task was too small and did it itself.

The conclusion is plain: **if you ask, it does not listen.** Counting on the model to be disciplined is an unreliable engineering premise. Super-agent stops counting. It changes the structure instead: the manager gets no hands, the doer gets its own brain.
:::

## The architecture is not finished, and the official article says so

Three named loose ends. Read everything else carrying them:

1. **The async ReAct loop is not enabled by default yet.** "You can talk while it works" is not the default path in the prototype.
2. **Few channels are actually wired up.** Chat, email, CI and GitHub are Trigger sources in the design, not adapters that all exist today.
3. **Cross-instance communication (A2A), security and privacy are still open problems.** How several Super-agent instances cooperate, and what it means to keep state in someone else's cloud — the article files these under unsolved, not solved.

<div class="mp-quote">An architecture article that writes "not done yet" into the body beats an announcement that says "fully shipped". What you were missing was never confidence. It was a checklist.</div>

## Keep pulling it apart

<div class="mp-grid">
  <a class="mp-card" href="./two-layer.html">
    <span class="mp-num">01</span>
    <h3>Two-layer architecture</h3>
    <p>Why the Router has zero tools, and why the Worker never replies to you directly.</p>
    <span class="mp-go">See the split</span>
  </a>
  <a class="mp-card tone-coral" href="./event-driven.html">
    <span class="mp-num">02</span>
    <h3>Event-driven</h3>
    <p>The two gates a Trigger passes through, plus the shortcut that needs no thinking.</p>
    <span class="mp-go">See filtering and passthrough</span>
  </a>
  <a class="mp-card tone-blue" href="./multi-channel.html">
    <span class="mp-num">03</span>
    <h3>Human-facing interaction</h3>
    <p>Multi-channel, the async ReAct loop, speculative execution — how it works while you are not looking.</p>
    <span class="mp-go">See the interaction</span>
  </a>
  <a class="mp-card tone-lime" href="./storage-compute.html">
    <span class="mp-num">04</span>
    <h3>Separating compute, state and environment</h3>
    <p>Inline / Spill, Chain of Recall, and BYOM: why your machine runs nothing but an empty daemon.</p>
    <span class="mp-go">See where memory went</span>
  </a>
  <a class="mp-card" href="./watchdog.html">
    <span class="mp-num">05</span>
    <h3>Watchdog</h3>
    <p>It does not only catch crashes. It uses a model to judge whether you are spinning in place.</p>
    <span class="mp-go">See self-healing</span>
  </a>
  <a class="mp-card tone-coral" href="../foundations/os-ideas.html">
    <span class="mp-num">06</span>
    <h3>Seven old ideas</h3>
    <p>The full comparison table: scheduling, caching, batching, Fast / Slow Path, speculation, separating compute from state, watchdogs.</p>
    <span class="mp-go">See whose homework</span>
  </a>
</div>
