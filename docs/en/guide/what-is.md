---
title: Super-agent in one page
description: "What Super-agent is, what it is not, and why it is worth reading: four traits — continuity, efficiency, proactivity, durability — mapped to the five modules."
---

# Super-agent in one page

Super-agent is an **agent infrastructure design** the DeepSeek Harness team published on **31 October 2026**, shipped with an MIT-licensed research prototype, `deepseek-ai/dsh-superagent-prototype`. What it wants to do fits in one sentence:

> **Turn the agent from a conversation you open into a colleague who is always on duty.**

Not one word of that is about model parameters. It is about **organisation** — the company changed the rota sheet and the process, not the brains of its staff.

## What it looks like

<FourTraits />

Four traits is not four slogans. Each one maps to a concrete engineering module. Without the module, the trait is just an adjective.

| Trait | In plain words | Which module carries it | Without it |
| --- | --- | --- | --- |
| Continuity | No re-explaining the background | Storage/compute split | Close the window, lose the memory; brief it from zero every time |
| Efficiency | Several things moving at once | Two-layer architecture + batching | The slow task blocks the fast one at the door |
| Proactivity | Finds its own work | Event-driven | It only exists while you are typing |
| Durability | Gets up after it falls | External Watchdog | The process crashes, the task evaporates on the spot |

## The friendly definition, and the strict one

**Friendly version**: an agent that stays online, runs several things at once, looks for work on its own and recovers from failures by itself.

**Strict version**: an agent system where a **system layer** takes over session management and context sync. The model's attention goes to the work; scheduling, syncing and recovery sink down into the infrastructure.

The two versions differ only in subject. The friendly one says "this agent is capable". The strict one says "the **system** does the agent's chores". Every bit of value in this architecture sits in that change of subject: capability isn't squeezed out of the model, it is saved out of the engineering structure.

## What it is explicitly not

- **Not a new large model.** No training, no leaderboard chasing, no swap in reasoning ability.
- **Not a product you download and run out of the box.** Officially a **research prototype**, and the open code is **not identical** to the internal build that produced the numbers.
- **Not a multi-agent framework that orchestrates several roles inside one task.** LangGraph and CrewAI are ahead on that road, and the two solve problems at different layers (see [how it differs from multi-agent frameworks](./vs-others.md)).
- **Not the `superagent` you hit in a search engine.** There's a JavaScript request library on npm and several sales products with the same name; neither belongs here (see [this name is already crowded](../limits/name-collision.md)).

## Five modules, one diagram

<LayerArch />

Left to right: events pour in from where the work actually happens; the Router filters with cheap rules first and only calls the model in when judgment is genuinely needed; each Worker takes one session and they run in parallel; memory and the watchdog both live outside the model.

::: tip Why this diagram is worth ten minutes
If you remember only one thing, remember this: **a session should not be managed by a chat window.** For the past two years the word quietly meant "one conversation". Super-agent changes it into "a resumable, addressable execution unit that can exist across weeks". The change sounds tiny, but it decides whether an agent can be called a colleague.
:::

## How to judge this design quickly

Look at three details. They tell you more than the conclusions do:

1. **It admits cost.** The Router's design core is not "smarter", it is "think fewer times" — batching squeezes inference per decision from 6.4s to 1.6s. That is somebody who did the arithmetic.
2. **It ran an ablation.** Take passthrough out and Router judgments climb by about 30%, while cached read tokens go from 23.23M to 31.77M. Publishing the numbers with a part removed means these modules were not just drawn.
3. **It leaves problems standing.** Architectural scalability, cross-instance communication (A2A), security and privacy are all named as unsolved. An article that writes its difficulties inside it beats an announcement claiming full rollout.

## What to read next

<p class="mp-lead" style="margin-top:6px">Pick a path by purpose. You don't have to read in order.</p>

<div class="mp-grid">
  <a class="mp-card" href="./why.html">
    <span class="mp-num">Path A</span>
    <h3>I want to know why it's needed</h3>
    <p>How the attention bottleneck forms, and why a single Session + Subagent hits a wall. For anyone not yet tortured by five open windows.</p>
    <span class="mp-go">The problem statement</span>
  </a>
  <a class="mp-card tone-coral" href="../architecture/overview.html">
    <span class="mp-num">Path B</span>
    <h3>I want the architecture, properly</h3>
    <p>All five modules opened one by one: what each solves, what it costs, and which old OS idea it borrowed.</p>
    <span class="mp-go">Overview and teardown</span>
  </a>
  <a class="mp-card tone-blue" href="../evidence/numbers.html">
    <span class="mp-num">Path C</span>
    <h3>I only care whether the evidence holds</h3>
    <p>Experiment setup, baseline choice, how the numbers were measured, and which conclusions can't be extrapolated yet.</p>
    <span class="mp-go">Reading the numbers</span>
  </a>
  <a class="mp-card tone-lime" href="../limits/open-problems.html">
    <span class="mp-num">Path D</span>
    <h3>I want to know if it reaches production</h3>
    <p>The unsolved list the team published, the capability edges, and which pits you have to fall into yourself first.</p>
    <span class="mp-go">Limits and risks</span>
  </a>
</div>

<div class="mp-quote">This site's writing rules: every fact and number points at its original source; guesses are labelled as guesses; metaphors exist to cut the cost of understanding, never to stand in for a definition. If a metaphor feels smooth, that is not your permission to quote it in a report.</div>
