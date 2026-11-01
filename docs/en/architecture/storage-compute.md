---
title: "Separating compute, state and environment: moving memory out of the model"
description: The Inline and Spill context budget, the Chain of Recall reference mechanism, the cloud Agent Loop plus database plus lightweight local daemon deployment, and how it compares to separating brains from hands.
---

# Separating compute, state and environment: moving memory out of the model

This layer looks least like "AI" and most like **systems engineering**, and it is what actually decides whether this architecture can stay resident. DeepSeek names the inspiration directly in the article: **separating compute from state**, the move from database land.

It happens at two scales. Do not conflate them:

| Scale | What gets separated | Mechanism |
| --- | --- | --- |
| **window scale** | "what the model sees now" vs "keep it for later" | Inline & Spill, Chain of Recall |
| **deployment scale** | "where reasoning runs" vs "where state lives" vs "where the environment is" | cloud Agent Loop + database + local daemon (BYOM) |

## Window scale: Inline and Spill

The context window is the only workbench, and the bench is exactly that big. The team's approach is an explicit two tiers:

- **Inline**: information likely to be needed soon goes **straight into the context window**, where the model can see it without looking anything up.
- **Spill**: content over budget, or rarely used, **stays outside the window** for the model to read on demand.

That is operating-system memory/disk tiering carried over untouched: hot data somewhere fast, cold data somewhere cheap, paged in when something needs it.

::: tip The ablation experiment put a price on this design
Removing the event passthrough pushed cached read tokens from **23.23M to 31.77M** (roughly +37%), while completion time barely moved. Those numbers do not say "slower". They say **putting content back inside the model is billed separately**. The context budget is a cost line, not a style preference.
:::

## Reference scale: Chain of Recall

Anything you Spill has to come back, or you just lost it. The way back is not similarity search — it **walks the reference relationships**:

<div class="mp-steps">
  <div class="mp-step"><b>1</b><div><strong>Trigger</strong><p>An external event arrives, carrying its source and its identity.</p></div></div>
  <div class="mp-step"><b>2</b><div><strong>Thread</strong><p>The event attaches to an event line. That line is the anchor for "the context of this thing".</p></div></div>
  <div class="mp-step"><b>3</b><div><strong>Worker Session</strong><p>The session handling that line and the Trigger / Thread keep each other's IDs.</p></div></div>
  <div class="mp-step"><b>4</b><div><strong>Walk the IDs back, level by level</strong><p>When the model needs history, it reads the content back along the linked IDs instead of keeping history resident in the window.</p></div></div>
</div>

The value of this mechanism is that **it makes "remembering" no longer mean "always displayed"**. Tasks that live across weeks, cross-channel references to the same thing, a Worker being replaced and picking up where it left off — all of it held up by that ID graph, not by a context window that happens to be big enough.

<div class="mp-quote">The hard part of context management is not compression. It is deciding what may live outside the window and still be retrievable at any moment. The first is a trick. The second is a data structure.</div>

## Deployment scale: three layers, three homes

This is the most engineering-heavy stretch of the design. It pulls three things apart:

| Layer | Where it runs | Stateful? | Why |
| --- | --- | --- | --- |
| **Agent Loop (compute)** | stateless, elastic compute containers in the cloud | no | scales and restarts freely; **your laptop can sleep and the task keeps going** |
| **session state** | a database | yes — the single source of truth | memory has to outlive the process before continuity and recovery mean anything |
| **execution environment** | the user's own device, running only a **lightweight daemon that keeps no session state** | no (deliberately) | commands run locally, results travel back; enables **BYOM (Bring Your Own Machine)** |

The last row is the most practical trade-off in the whole design. Real work happens on the developer's own machine: local repo, local toolchain, local credentials. Keep the environment local, move compute and state to the cloud, and make sure **the local process is a forgetful, disposable shell** — restart, upgrade or drop offline, and memory is unaffected.

::: tip How this relates to separating brains from hands
The article draws the comparison itself: this direction matches Anthropic's **separation of brains and hands** (decoupling model reasoning from the execution sandbox). The difference is the landing point — that idea describes **on-demand sandboxes inside a hosted service**, while Super-agent has to reach **the personal machine someone uses every day, online in bursts**. Same principle, two sets of real constraints: one solves elastic scaling, the other solves "my computer is where the work actually happens".
:::

## Why this deserves a chapter of its own

Because most Agent designs take the laziest and most fragile route here: **state inside the session process, memory inside the context window.** Demos are easy to write that way. The price is three fatal defects:

| Defect | Symptom | This chapter's fix |
| --- | --- | --- |
| the session is the life | process ends, task vanishes | state in the database, the Loop can be rebuilt |
| the window is the memory | more tasks, context bursts | Inline / Spill + Chain of Recall |
| the environment is the identity | new machine, new person | stateless local daemon; identity lives in cloud state |

So "always on" comes down to three unglamorous engineering facts: a table holding state, a tier policy deciding what the model sees, and a replaceable execution shell. **Not one of them is model capability, and not one of them can be skipped.**

## Keep reading

<div class="mp-grid">
  <a class="mp-card" href="./watchdog.html">
    <span class="mp-num">05</span>
    <h3>Watchdog</h3>
    <p>State being recoverable is not the same as the task being worth resuming — who decides whether it is working or spinning?</p>
    <span class="mp-go">Last piece</span>
  </a>
  <a class="mp-card tone-blue" href="../foundations/os-ideas.html">
    <span class="mp-num">06</span>
    <h3>Seven old ideas</h3>
    <p>Cache tiering and separating compute from state have been solved in operating systems for fifty years.</p>
    <span class="mp-go">See the lineage</span>
  </a>
  <a class="mp-card tone-coral" href="../limits/open-problems.html">
    <span class="mp-num">07</span>
    <h3>Open problems</h3>
    <p>Once session state moves into a cloud database, security and privacy finally get hard.</p>
    <span class="mp-go">See the limits</span>
  </a>
</div>
