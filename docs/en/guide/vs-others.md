---
title: How it differs from multi-agent frameworks
description: The layer difference between Super-agent and LangGraph / CrewAI / AutoGen, Claude Code subagents, and single-Session use — and how they coexist.
---

# How it differs from multi-agent frameworks

This is the first question that has to be answered, otherwise every discussion collapses into "LangGraph did that years ago". The answer will probably surprise you: **they barely sit on the same layer, so this is neither competition nor replacement.**

The one-line version:

> **A framework helps you orchestrate one task. Super-agent cares how an agent stays alive for the long run.**

The first is an orchestration layer, the second a runtime layer. Like a workflow engine and an operating system — you can use both at once, and neither looks like it's competing for the same job.

## Three layers, don't blur them

| Layer | What question it answers | Representatives | Does it know what a lifecycle is? |
| --- | --- | --- | --- |
| Orchestration layer | inside one task: who runs first, who after, who gets the result | LangGraph, CrewAI, AutoGen, workflow tools of every kind | yes, but it stops at this run |
| Session layer | inside one session: how the model calls tools, how it dispatches subtasks | Claude Code's subagents, agent loops of every kind | the session has a start and an end |
| Runtime layer | how a session exists across processes and across days; who triages events; who restarts it after a crash | the DeepSeek Super-agent architecture, the Harness base | **the session is a resident execution unit** |

All of Super-agent's novelty is in that last row.

## Line by line

### Versus LangGraph / CrewAI / AutoGen

These frameworks let you define several roles and the message flow between them — written clearly, and they produce handsome results. But watch the trigger: **normally you start a run** (`invoke` / `stream` / `crew.kickoff()`), which builds the graph, executes and returns. When the run ends, that "team" stops existing; next time you start a new one.

Super-agent cares about the opposite direction. What if **nobody starts it**? What if events arrive while you sleep? What if three things arrive at once and two of them belong to sessions you left unfinished last week? These are questions a framework won't answer for you, because its unit of abstraction is a **graph**, not a **process**.

::: tip You can stack the two
A framework can be the implementation inside a Worker. The Router hands a "needs multi-role collaboration" task to some Worker, and that Worker runs a LangGraph graph internally — entirely reasonable. The layers don't conflict. What conflicts is picking between them as if they were one thing.
:::

### Versus subagents in Claude Code / the Agent SDK

This one is closer, because a subagent is also "one agent dispatching several". The difference is in two places:

1. **Where state lives.** A subagent's output ends up back in the main session's context. Super-agent puts session state outside the model, and Workers don't share memory through one window.
2. **Who manages sessions.** In the first case the model itself decides whether to dispatch a subtask, inside your conversation. In the second an independent scheduling layer decides — and that layer spends most of its time not reasoning at all, just taking shortcuts.

So: a subagent saves you words on **one task**; Super-agent makes **a batch of tasks** not need you in the room.

### Versus cloud "general agent" products

There's another category on the market: cloud agents that run asynchronously — you get a virtual workspace, hand over a task, and it notifies you when it's done. Their goals overlap heavily with Super-agent. Both solve "the human doesn't have to stay".

The difference is delivery shape. Those are **products**: you hand tasks to a runtime somebody else operates. Super-agent is **an architecture text plus a research prototype**: it gives you a skeleton you can build yourself, and nine chapters that open up the engineering problems. The first lowers your deployment cost; the second lowers your comprehension cost.

::: warning This section is this site's inference, not the article's comparison
DeepSeek's technical article names no product and picks no fight. The layering above comes from public reporting and common sense, offered only to help you place this architecture on the map. **Do not cite it as an official competitor verdict.**
:::

## One table that collects every difference

| Dimension | Orchestration framework | Single Session + subagent | Super-agent |
| --- | --- | --- | --- |
| Trigger | a human starts a run | a human sends a message | an event arrives |
| Lifecycle | gone when the run ends | over when the session closes | resident across sessions |
| Context sync | state passed inside the graph | everything back into the main window | storage outside the model |
| Parallel granularity | nodes / roles | subtasks, still bound by the main window | independent Workers, one context each |
| After a crash | rerun this run | you resend it | the watchdog restarts it and continues from the checkpoint |
| Who schedules | the code you wrote | the model + you | the Router (mostly not reasoning) |
| Where you sit | orchestration engineer | there the whole time | set the goal + sign off |
| Unit of abstraction | graph | session | resident execution unit |

## Why these differences deserve their own page

Because the cost of confusing them is practical. Treat Super-agent as "yet another framework" and you'll do one wrong thing: **try to replace your existing orchestration layer with it**, then find it gives you nowhere to write a DAG. Treat it as a runtime and you'll ask the second wrong question: "when do I call it?"

The correct reading is as a checklist of the parts an agent needs in order to become resident. On that checklist, what a framework cannot supply is the point — event triage, state kept outside, a heartbeat watchdog, and the cost engineering of **making the foreman think a few fewer times**.

<div class="mp-quote">The first question in any selection is never "which one". It's "which question is this answering". Ask the wrong question and a beautiful answer is useless.</div>

## Keep reading

<div class="mp-grid">
  <a class="mp-card" href="../architecture/overview.html">
    <span class="mp-num">01</span>
    <h3>Enter the architecture</h3>
    <p>How five modules assemble into one resident agent, and how they mesh with each other.</p>
    <span class="mp-go">The full teardown</span>
  </a>
  <a class="mp-card tone-coral" href="../foundations/os-ideas.html">
    <span class="mp-num">02</span>
    <h3>See what it stole</h3>
    <p>Scheduling, caching, batching, Fast/Slow Path, speculative execution, storage/compute split, watchdogs.</p>
    <span class="mp-go">Seven old ideas</span>
  </a>
  <a class="mp-card tone-blue" href="../limits/open-problems.html">
    <span class="mp-num">03</span>
    <h3>See what's still unfinished</h3>
    <p>Scalability, cross-instance communication, security and privacy — the unsolved list the team wrote itself.</p>
    <span class="mp-go">Open problems</span>
  </a>
</div>
