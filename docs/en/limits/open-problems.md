---
title: Open Problems
description: DeepSeek itself lists four unfinished items at the end of its article — architectural scalability, human-agent collaboration efficiency, cross-instance communication, safety and privacy. This page makes them concrete, then adds three debts the official article doesn't mention but any running system will eventually pay.
---

# Open Problems

An article that explains an architecture well is the one most likely to slack off in its last section. This page can't do the same — **so, up front: the first four items below are what DeepSeek admits; the last three are this site's inference.**

## The four the article admits

| Open problem | Where it's stuck | Why this one is hardest |
| --- | --- | --- |
| Architectural scalability | Once the Worker count grows, routing, state and cost all rise at once | Today's data comes from one internal instance, not hundreds of teams sharing it |
| Human-agent collaboration efficiency | How people interrupt, how they change their minds, how they accept a result without watching the process | "Async full duplex" is stated in the protocol, but **it is not on by default yet** |
| Cross-instance communication (A2A) | Whether your agent and my agent can talk directly | Once they can, auth, tenant boundaries and accountability all get rebuilt |
| Safety and privacy protection | Something permanently online that reads your group chat and your CI | Its attack surface isn't a particular flaw — it's **everything it can see** |

::: warning About the word "async"
The article mentions that an async ReAct Loop lets an agent receive new instructions while a task is in progress. It also states: **this capability is not enabled by default today.**

That matters. Between "supported by the architecture" and "available to you now" sits an entire product cycle.
:::

## Three debts the article doesn't mention

### 01 Who owns the silent cost

Speculation is nice: see a bug, reproduce it silently, fix it if you can, say nothing if you can't. The problem is **the part that says nothing still bills**.

A Worker spends twenty minutes reproducing a bug it never ends up fixing — whose account does that go on? Nobody asks, and nobody knows it happened. When that kind of attempt runs three hundred times a day, cost drains away in a **report no one will ever read**.

Any team that actually deploys this needs a separate budget line and a separate switch for the silent path.

### 02 How much authority the watchdog should have

The Watchdog's way of judging is clever: it doesn't only watch the heartbeat, it also uses a model to decide whether this Worker is just busy wandering.

But **there is a line between judging and correcting**. A watchdog that believes "you're drifting" — should it be allowed to kill the task, rewrite the goal, or only record one line of log?

Give it power and you have added another fallible, moving thing. Withhold power and it can only raise alarms, and alarms eventually become part of that stream of messages where 93% is not work.

::: tip No good answer here
Operating systems spent forty years on this problem: the kernel has absolute power, but every kernel decision is deterministic and reproducible. Using a probabilistic model as a watchdog puts a **non-deterministic judgment** in a **position that must be deterministic**. This is the part of the design that worries me most.
:::

### 03 Who audits it

A Router that is permanently online is the required path for every event. It has read your group chat, your CI, your calendar. It also holds the full external state chain.

This architecture moved memory out of the model window and into a database — **the right move**. But it also, in the same motion, raised the audit requirement from session-log level to data-platform level. A system that works on your behalf and a system that sees your entire working trail are the same object.

## A boundary at the practice level

On top of those design-level open questions, two very unsexy but very real ones:

- **Limited channels to attach.** Right now it's only a few kinds of event source that can be connected.
- **Personal deployment has a floor.** Stateless containers + a database + a local daemon is not something one `npm install` solves.

<div class="mp-quote">An honest signal often hides at the end: this design never pretends to have solved everything. What it offers is a shape still walking toward that.</div>

## Read next

<div class="mp-grid">
  <a class="mp-card" href="../architecture/watchdog.html">
    <span class="mp-num">01</span>
    <h3>How the watchdog works</h3>
    <p>A separate Watchdog Session, a loop driven by scheduled messages, and the two-layer judgment of heartbeat vs semantics.</p>
    <span class="mp-go">Back to the mechanism</span>
  </a>
  <a class="mp-card tone-coral" href="name-collision.html">
    <span class="mp-num">02</span>
    <h3>One thing worth clearing up</h3>
    <p>Several groups have been using the word superagent for years — don't wander between rooms while searching.</p>
    <span class="mp-go">See the name collision</span>
  </a>
  <a class="mp-card tone-blue" href="../about.html">
    <span class="mp-num">03</span>
    <h3>How this site came to be</h3>
    <p>Sources, which parts are the original text, which are our framing, and how the three sites relate.</p>
    <span class="mp-go">About this site</span>
  </a>
</div>
