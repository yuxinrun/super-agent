---
title: "Human-facing interaction: change the channel, same Agent"
description: Multi-channel continuous interaction, the full-duplex capability the async ReAct loop is meant to bring (not enabled by default yet), and how speculative execution lets the Agent work while you are not looking.
---

# Human-facing interaction: change the channel, same Agent

This layer solves one very specific problem: **the conversation between a person and an Agent should not have a single entrance, and it should not be exclusive.**

## Multi-channel: one Agent, many doors

The "continuous" trait lands here — you interact with **the same** Agent across IM, GitHub comments and other channels.

| Channel | What you say there | What the system has to solve |
| --- | --- | --- |
| group chat / IM | "triage this complaint for me" | message identity: was this line meant for it? which Thread does it belong to? |
| GitHub comment / PR | "check why CI went red" | linking an event to its code context |
| email / calendar | "prep the materials for next week's meeting" | waking a task on a time dimension |
| CI result | nobody said anything; the build just failed | how an unsolicited Trigger enters the queue |

The point: **a channel is an entrance, not an identity.** If the thing you raised in the chat and the thing you raised in the PR belong to the same Thread, that should be one memory, not two unrelated sessions. That is only possible by putting state outside the model (see [separating compute from state](./storage-compute.md)).

::: tip Why this matters more than it sounds
Today's reality: what you ask the AI in tool A and what you ask in tool B never share memory. In most products, "multi-channel" just means "several bots that do not know each other". Super-agent converges the entrances on the Router: every channel arrives at one coordination point. How many Workers sit behind it is your implementation detail, not your cognitive load.
:::

## Full duplex: you do not queue while it works

The traditional Agent loop is a half-duplex walkie-talkie: once it starts executing, you wait. If you want to say something, that usually means interrupting.

Super-agent introduces the **async ReAct Loop** — the Reason / Act cycle no longer blocks the conversation channel, so the AI **can still take new instructions while running a long task**.

One thing has to be said honestly, though: **the async ReAct loop is not enabled by default yet.** It is a design goal, not a finished path. So "you can interrupt it any time while it runs" should currently be read as "the architecture leaves room for this".

<div class="mp-quote">Stating plainly which feature is not on by default is the biggest difference between a technical article and a product announcement. On this point the article behaved.</div>

## Speculative execution: do it first, commit only if it turns out useful

The most interesting implementation detail behind "proactive" is here. It borrows the CPU's old trick: **when you are not yet sure the result will be used, try it in the background; commit if it is useful, throw it away if it is not.**

The article gives two concrete strategies:

<div class="mp-split">
<div>

### Engineering: silently reproduce and fix

When someone reports a bug in the channel, the AI **first reproduces it in the background and analyses the cause**; it only surfaces a result once the problem is confirmed real and a simple fix has been found. **Otherwise it stays quiet.**

This is the textbook use of speculation: most bug reports are not worth interrupting you for, but a share of them are worth having already been investigated.

### Personal assistant: a meeting invite

On receiving an invite, it can check for schedule conflicts, gather background material and have a reply drafted. When you actually ask, the answer is already sitting there.

</div>
<div>

### The bill, itemised: what this mechanism costs

| Bill | What it is | What you have to decide |
| --- | --- | --- |
| **compute** | work done that may be thrown away entirely | how much budget you will waste for responsiveness |
| **side effects** | "try it first" is dangerous in a world with writes | which actions may be speculated, and which absolutely may not |
| **interruption** | commit at the wrong moment and it is noise | under what conditions it is allowed to speak |

The second bill is the heavy one. Reading files and looking things up can be speculated freely; **changing code, sending messages, placing orders cannot.** An Agent that applies speculation to write operations does not need to be smart in order to cause real damage.

</div>
</div>

::: warning A reminder from this site: speculation is not "just go ahead and try"
There is one test — **if this action goes wrong, can you undo it without a trace?** If yes, allow speculation. If no, require explicit confirmation. This rule belongs in the permission layer, not in a prompt (for the reason, see [the two-layer architecture](./two-layer.md): the 0-of-5 delegation run, and the model deciding the task was too small and doing it itself).
:::

## What these three add up to

Stack up "several doors besides the one you opened + no queueing + it prepared in advance" and you get the experience the team is describing: **the Agent moves from tool to long-running collaborator.**

You stop "opening an AI". You talk to a colleague in a channel that already exists. It may be busy with something else, but it knows whose task this is, what it involves, and it comes back to you at a suitable moment.

## Keep reading

<div class="mp-grid">
  <a class="mp-card tone-lime" href="./storage-compute.html">
    <span class="mp-num">04</span>
    <h3>Separating compute, state and environment</h3>
    <p>Where one memory shared across channels actually lives, and how Inline / Spill split the context budget.</p>
    <span class="mp-go">Next stop</span>
  </a>
  <a class="mp-card" href="./watchdog.html">
    <span class="mp-num">05</span>
    <h3>Watchdog</h3>
    <p>It starts work ahead of you, so somebody has to judge whether it is making progress or spinning.</p>
    <span class="mp-go">Next stop</span>
  </a>
  <a class="mp-card tone-coral" href="../limits/open-problems.html">
    <span class="mp-num">06</span>
    <h3>Open problems</h3>
    <p>Human-agent collaboration efficiency, trust and control — the more proactive it is, the pricier these get.</p>
    <span class="mp-go">See the limits</span>
  </a>
</div>
