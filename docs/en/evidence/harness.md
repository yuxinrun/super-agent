---
title: Harness and "Everything Is a Plugin"
description: Super-agent didn't appear out of a rock; it grows on top of the DeepSeek Harness. What a Harness is, which layers the plugin claim covers, what the open-source prototype repo gives you, and what the team runs on it internally.
---

# Harness and "Everything Is a Plugin"

::: info In one sentence
Super-agent is an **architecture**; Harness is the **base** that lets it run. The first is about who schedules whom; the second is about being able to swap out whatever you want to swap.
:::

## The literal meaning of the word Harness

Harness originally means **horse harness** — the set of straps on a horse's body. The technical usage borrows the same action: a horse with plenty of power that runs wild only pulls a cart once it's harnessed.

So "agent harness" is not the model itself. It is **the ring around the model**: how context gets fed in, how tools attach, how output gets collected, what catches you when something breaks, and which parts you don't have to rewrite when you change models.

The same model with different harnesses can perform very differently. That is why this kind of infrastructure has recently started being talked about on its own.

## "Everything is a plugin" — which layers exactly

In the article this phrase isn't an adjective, it's a list:

| Plugin slot | Swappable for | Why it has to be swappable |
| --- | --- | --- |
| Model | Models of different sizes and different prices | Cheap models filter, expensive models decide |
| Tools | Any external capability, including the MCP ecosystem | Tools keep changing; the architecture shouldn't change with them |
| Storage | Where session state lives | Some want a cloud database, some only want a local file |
| Interface | Group chat / GitHub comments / email / your own UI | People already work across several channels |

::: tip Two ends of the same job
MCP solves **how tools get attached in a standard way**; Harness solves **who schedules them once they're attached, where the state lives, and what happens when it dies**.

One handles the interface, one handles the runtime. To read them together, see the sister site [MCP Patterns](https://yuxinrun.github.io/mcp-patterns/).
:::

Two more compatibility items are written into the article as well: **expert package migration** and **custom workflows**. In plain language — the domain configuration you've already accumulated, and the process you've already drawn up, move over without being torn down.

## What the open-source prototype gives you

::: warning Calibrate expectations first
Repo: [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype), MIT licensed.

The team's wording is explicit: this is a **research prototype**. Its purpose is to run this design for you to see, not to hand you a service you can deploy. And **the version that produced the experiment numbers is not fully identical to the open-source one** — try to reproduce that table from the public code and it most likely won't match.
:::

Three places worth reading in a prototype like this:

1. **Where the Router / Worker boundary lands in code** — especially how "the Router gets no tools" is actually enforced.
2. **The reference chain across the three IDs: Trigger / Thread / Worker Session** — Chain of Recall isn't a concept here, it's a piece of readable implementation.
3. **How the Watchdog Session is driven by scheduled messages** — the rarest part of the whole design, and the most worth copying.

## What the team uses it for internally

The article lists three everyday uses, and the notable thing is that none of them is "write a new feature":

- **Reproducing and fixing problems** — a user reports a bug, the agent silently reproduces it first; if it can fix it, it fixes it on the way; if it can't, it keeps quiet.
- **Code review** — CI and comments are event sources anyway; good feed.
- **Iterating on Harness itself** — using its own infrastructure to develop its own infrastructure.

That last one carries the most weight in the whole story. **This is not a proposal that says "we imagine this would be nice"; it is one already doing its own work.** Much of that experiment data came from this instance that has been running the whole time.

<div class="mp-quote">A cheap way to judge whether an architecture is sound: check whether the authors are also the users. Here, they are.</div>

## Read next

<div class="mp-grid">
  <a class="mp-card" href="../architecture/storage-compute.html">
    <span class="mp-num">01</span>
    <h3>How the base is deployed</h3>
    <p>Stateless containers in the cloud, session state in a database, a local daemon that stores nothing, and BYOM.</p>
    <span class="mp-go">See storage-compute separation</span>
  </a>
  <a class="mp-card tone-coral" href="../evidence/numbers.html">
    <span class="mp-num">02</span>
    <h3>Where the data came from</h3>
    <p>The 300-message experiment, p50/p95, five runs with no delegation, and an ablation that saves money.</p>
    <span class="mp-go">Back to the numbers</span>
  </a>
  <a class="mp-card tone-blue" href="../limits/open-problems.html">
    <span class="mp-num">03</span>
    <h3>What's unfinished</h3>
    <p>Scalability, A2A, safety and privacy, plus the distance from prototype to product.</p>
    <span class="mp-go">See the edges</span>
  </a>
</div>
