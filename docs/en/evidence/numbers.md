---
title: Reading the Experiment Numbers
description: p50 12.4 minutes, p95 15.7 minutes, five runs with no delegation, and 37% more cached tokens once you remove the passthrough — every number from the DeepSeek Super-agent experiment, including what it proves and what it doesn't.
---

# Reading the Experiment Numbers

Numbers are the easiest thing to fake in an article about architecture. So this page covers the setup first, then the numbers, then **what these numbers do not prove**.

<MetricGrid />

## How the experiment was arranged

The DeepSeek Harness team ran one end-to-end comparison. Not a benchmark of "hand the model a question and time the answer" — they dropped the agent into **real workflow noise**.

| Setup item | What it was |
| --- | --- |
| Input | A group-chat message stream plus a GitHub CI stream, poured in together |
| Scale per run | About 300 messages |
| Actual work inside | About 20 work requests |
| The rest | Small talk, follow-up questions, "stop that", CI notifications |
| Compared | Four end-to-end configurations |
| Repetition | 5 runs of each |

That "20 / 300" ratio is the one thing in the setup worth staring at. **93% of the messages are not work.** And that is exactly what a real working day looks like: most of your messages need nothing from you, and every single one is competing for your attention.

An agent that only knows "receive one, process one" under this load gets interrupted 280 times by 280 pieces of noise.

## The main result: not fast, but a short tail

| Configuration | p50 | p95 |
| --- | --- | --- |
| Super-agent | 12.4 min | 15.7 min |
| Single Session + Subagent (the old approach) | — | 29.5 min |

::: tip First, what these two percentiles are
p50 is the median: half the tasks finish faster than it. p95 is the 95th percentile: where the **unluckiest tasks** land.

The point of this set is **the gap between the two**. Super-agent's p50 and p95 differ by only 3.3 minutes, which means it delivers **evenly**. The old approach's p95 is 29.5 minutes — the far end of the longest chain.

What actually punishes engineers is never the average; it's "why did this task hang for half an hour". So the number to remember here isn't 12.4. It's 15.7 against 29.5.
:::

## The most interesting line: given a subtask tool, the model didn't use it

The old approach **did have the Subagent tool configured** — the ability to hand work to somebody else sat at its hand the whole time.

The result: under a neutral prompt, **five runs, and not one Subagent call.**

Later the team swapped in a delegation-friendly prompt, and four of the five runs started delegating. Even then the whole chain stayed slower than Super-agent. And in one run the model actively refused to delegate, on the grounds that **the job was too small and it would do it itself**.

::: warning Why this one stings
It makes two points at once:

1. **"Able to parallelize" and "willing to parallelize" are different things.** Putting the tool on the shelf doesn't mean the model uses it.
2. **Handing scheduling to the model's in-the-moment judgment is handing the architecture to its mood.** One self-assessment of "this feels too small" is enough to switch the entire parallel path off.

Super-agent's approach is not to talk the model into delegating. It **removes, structurally, its ability to step into the ring** — the Router gets no tools at all. See [the two-layer architecture](../architecture/two-layer.md).
:::

## Ablation: what it saves is money, not seconds

Take out the subscription passthrough shortcut — after a Worker subscribes to a Thread, later events stop going through the Router for a decision — and rerun:

| Metric | Change |
| --- | --- |
| Completion time | Essentially unchanged |
| Router decisions | Up about 30% |
| Cached read tokens | 23.23M → 31.77M (about +37%) |

A very clean conclusion: **the passthrough doesn't save time; it saves cost and the foreman's bandwidth.**

If you only look at p50, this design looks deletable. Open the bill and you find out what it has been blocking for you all along.

## Batching: the one optimization broken out on its own

The Router doesn't think once per event; it **collects a small batch and thinks once**. Per-decision inference time went from **6.4s down to 1.6s**.

Also a standard systems-software move: take a fixed, expensive action — here, waking a large model once — and spread it across a batch of requests. A four-letter optimization, a four-times payoff.

## What these numbers do not prove

The honest part, kept for last.

1. **One scenario, five repeats.** A 300-message group chat plus CI is a very specific load. Swap in "1000 tickets" or "pure codebase refactor" and the curve might not look like this. n=5 gives you a trend, not a confidence interval.
2. **Only time was measured, not quality.** Nothing in this experiment scores "was the deliverable good". Fast isn't the same as right — what it shows is that this architecture **handles noise more cleanly**, not that it thinks better.
3. **The open-source prototype is not the version that produced the numbers.** The team says so itself: the code is a research prototype, and the internal instance isn't fully identical to the public one. Failing to reproduce this table from the repo is normal.
4. **The baseline is "a single Session under a neutral prompt".** Honest, but weak. In real products, plenty of people have already tuned prompts, routing rules and multi-agent frameworks hard.

<div class="mp-quote">How to read them: treat this set as evidence that the problem is real, not as a verdict that the design has won. The first it supports; the second needs more scenarios.</div>

## Read next

<div class="mp-grid">
  <a class="mp-card" href="../architecture/event-driven.html">
    <span class="mp-num">01</span>
    <h3>How the passthrough works</h3>
    <p>The Trigger list, the two gates, and why "program filters, then the model decides" can't run in reverse.</p>
    <span class="mp-go">See event-driven</span>
  </a>
  <a class="mp-card tone-coral" href="../evidence/harness.html">
    <span class="mp-num">02</span>
    <h3>What it runs on</h3>
    <p>Harness, "everything is a plugin", and what the team uses it for internally.</p>
    <span class="mp-go">See the base</span>
  </a>
  <a class="mp-card tone-blue" href="../limits/open-problems.html">
    <span class="mp-num">03</span>
    <h3>And then?</h3>
    <p>The four things the official article lists as unfinished, and the distance between a prototype and a product.</p>
    <span class="mp-go">See the edges</span>
  </a>
</div>
