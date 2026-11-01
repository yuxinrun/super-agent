---
title: "Two layers: the Router runs the job, the Worker does the work"
description: Where the line between Router and Worker falls, why the Router gets no tools, why the Worker never replies to you, and the experiment behind that boundary.
---

# Two layers: the Router runs the job, the Worker does the work

If you remember one design decision from all of Super-agent, make it this one: **split one Agent into two layers — a manager that stays resident, and a pool of short-lived executors.**

## The exact split

| Dimension | Router layer | Worker layer |
| --- | --- | --- |
| Lifetime | **resident**, always running | task-scoped; it can end when the job does |
| Who it faces | people. Every channel arrives here | the Router. It never talks to the user |
| Owns | global coordination, global memory, dispatch, collecting results | one concrete job: read material, call tools, produce output |
| In its hands | **no tools** | tools, plus the right to spawn Subagents for finer work |
| Context | keeps the global index of who is doing what and what relates to what | each gets its own isolated session context |
| How often it thinks | as little as possible (batching + passthrough) | as hard as needed, on exactly one task |

In one line: **the Router decides what gets done, by whom, and who gets the result. The Worker decides how.**

## Why the Router gets zero tools

This is the most counterintuitive cut in the design, and the smartest one.

The obvious approach is to give the manager every tool and let it "step in when necessary". Super-agent does not. **No tools means it physically cannot do the work** — it cannot run that test for you even if it wants to. All it can do is hand the job out.

::: tip This constraint came out of an experiment, not out of taste
In the team's comparison runs, the single-Session setup under a neutral prompt — Subagent tool included — **delegated in 0 of 5 runs**. The model just did everything itself. With a delegation-friendly prompt, 4 of 5 runs delegated, but the runs still finished slower than Super-agent, and the model still occasionally decided the task was too small to bother handing off.

That tells you one thing: **asking the model for self-discipline in a prompt is an unreliable engineering premise.** Tell it not to interfere and it interferes. Rather than write three paragraphs of pleading, take its hands away. Structural constraints are cheaper than behavioural ones, and they hold.
:::

Same logic as privilege levels in an operating system: kernel mode schedules, user mode computes. You do not want the scheduler doing floating point.

## Why the Worker never replies to you

Because **you need one thing to talk to**.

If every Worker could message you directly, you would get five "this is done", "need a confirmation", "that one failed" notes across five channels — and you would be back to being the human message bus. That is exactly what this architecture is trying to delete.

So the Worker reports state and results to the Router, and the Router speaks for the whole system. The AI you @ in the channel is always the same one.

<div class="mp-quote">This is what "continuous" actually means: not that it has a good memory, but that you never have to remember its org chart. You know one colleague. How many processes are behind it is its own business.</div>

## The two capabilities that matter for a Worker

1. **Subscribe to a Thread.** Once it has a task, the Worker subscribes straight to the related event line. Later messages on that line are delivered **by the program, without passing through the Router every time**. The ablation measured what that shortcut is worth: take it away and Router judgments climb by about 30% (see [event-driven](./event-driven.md)).
2. **Spawn Subagents.** Two layers does not mean "only two". A Worker can split finer work into subtasks. The difference: delegation happens **inside an isolated session**, instead of merging every detail back into one context window.

## Why the context explodes

This is the original problem the two layers exist to solve. In a single-Session setup, as parallel work piles up, one window has to hold:

- the original instructions and every back-and-forth for three tasks
- everything each task looked up along the way
- every error message and every retry
- your own three changes of mind

So the same window is working memory and archive at once. The more tool definitions and history the model sees, the more expensive — and more wrong — its "what should I do now" becomes. The two-layer fix is plain engineering: **the manager keeps an index, details stay in each Worker's session, and you follow references back when you need them.**

| Approach | What sits in the context | Cost |
| --- | --- | --- |
| one window, brute force | every detail of every task | window bloat, rising cost, and the model forgets to delegate |
| single Session + Subagent | subtask results still merge into the main window | the main window is still the bottleneck, and the lifecycle still has a start and an end |
| two layers + state outside the model | Router holds the global index, Workers hold their own contexts | you need a referencing and recall mechanism (Inline / Spill / Chain of Recall) |

## In human terms

<FourTraits />

::: warning Do not read the metaphor as a promise
"Virtual team" is easy to picture, but it drops one important fact: **the Router is not a person**. It will not ask you twice because your brief was vague (unless you designed it to), and it will not stop a task it thinks should not happen. Use org metaphors to lower comprehension cost, not to substitute for a capability assessment.
:::

## Building a layer like this yourself? Watch three things

1. **The manager becomes a single point.** Every interaction passes through the Router; if it dies, the whole Agent dies. Which is why an external [Watchdog](./watchdog.md) needs to be watching it.
2. **Delegation needs a budget.** Unbounded Worker spawning sends tokens and concurrency out of control — one of the reasons the passthrough mechanism exists at all.
3. **Write the boundary into code, not into advice.** "No tools for the Router" is an implementation choice, not a guideline in a document. If your framework only says "please do not execute things yourself" in a prompt, you will get the same result as that 0-of-5 experiment.

<div class="mp-quote">Good architecture does not do moral education. It does physical isolation.</div>

## Keep reading

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./event-driven.html">
    <span class="mp-num">02</span>
    <h3>Event-driven</h3>
    <p>How the Router thinks less, concretely: rules filter first, the model only judges real questions.</p>
    <span class="mp-go">Next stop</span>
  </a>
  <a class="mp-card tone-blue" href="./multi-channel.html">
    <span class="mp-num">03</span>
    <h3>Human-facing interaction</h3>
    <p>Why every channel converges on the same Router, and what full duplex actually is.</p>
    <span class="mp-go">Next stop</span>
  </a>
  <a class="mp-card tone-lime" href="./storage-compute.html">
    <span class="mp-num">04</span>
    <h3>Separating compute, state and environment</h3>
    <p>Where a Worker's memory lives, and why it can be rerun in the cloud.</p>
    <span class="mp-go">Next stop</span>
  </a>
</div>
