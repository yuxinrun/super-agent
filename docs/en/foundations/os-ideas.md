---
title: Seven Old Ideas Borrowed From Operating Systems
description: Scheduling, caching, batching, Fast/Slow Path, speculation, storage-compute separation, watchdogs — how Super-agent moves systems software's old ideas into an agent architecture.
---

# Seven Old Ideas Borrowed From Operating Systems

The most counterintuitive thing about DeepSeek's article: **it proposes no new theory, and treats that as a feature.**

The team says it outright. This design takes classic ideas from computer systems and moves them into an agent architecture — scheduling, caching, batching, Fast/Slow Path, speculation, storage-compute separation, watchdogs. Together those ideas are around fifty years old, older than the entire machine-learning industry.

<BorrowGrid />

## Why borrowing from systems software is the right direction

Because the problems agents have now, **systems software already had — and solved pretty well.**

| Where agents are | The same scene in systems software | The answer that already exists |
| --- | --- | --- |
| One model juggling many things at once | One kernel managing many processes | Schedulers, priorities, preemption |
| The context window is too small and too expensive | Memory is too small and too expensive | Tiered storage, paging, working sets |
| Thinking once per message costs too much to afford | Handling every interrupt in full | Batching, fast path / slow path |
| No idea whether the task is still alive | No idea whether the process is dead | Heartbeat, watchdog |
| Want to get ready before being confirmed | Compute before the branch resolves | Speculation |
| Memory can't live on the process | Data can't live on the app server | Storage-compute separation |

This isn't rhetorical similarity. It's **isomorphism**: the constraints are the same (scarce resources, unpredictable arrivals, fault tolerance required), so the solutions transfer directly.

## Anyone who knows systems spotted it immediately

::: tip Kernel mode and user mode
The Router only schedules and holds no tools; the Worker only does the work and never talks to the outside. That split is nearly the same picture as an operating system: kernel mode schedules, user mode computes.

What got carried over isn't a specific algorithm, it's a **habit of mind**: draw the responsibilities and the permissions first, then talk about intelligence. An agent that can do anything equals a process that can do anything — you cannot reason about it, and you cannot guarantee it.
:::

## The value of "unsexy, but it works"

Tech loves new words. The most re-readable thing in this release is the opposite: **it proves a young field can copy an old field's homework without embarrassment.**

Three lessons you can take from here:

1. **Don't apologize for not having invented anything.** Your users only care whether the problem went away.
2. **Mature solutions ship with engineering dividends.** Describe your context budget as "tiered caching" and the communication cost inside a team drops at once — everyone listening already knows how that layer is designed, when it invalidates, and how to measure it.
3. **Old ideas bring free metrics.** Batching has an amortization factor, caching has a hit rate, a watchdog has a heartbeat interval. Borrow the framework and you automatically borrow its KPIs; you don't have to invent them.

<div class="mp-quote">What the agent field lacks is not imagination but discipline. Systems software has fifty years of discipline. Copying it is not shameful.</div>

## One necessary caveat

::: warning The analogy doesn't guarantee correctness
"Like an operating system" means **the problems have the same shape**, not **the solutions transfer as-is**. An OS faces a deterministic instruction stream; an agent faces a probabilistic model that misreads intent and decides for itself whether to obey. The same layering needs completely different fault tolerance on each side.

The evidence is in the experiment: with the Subagent tool configured, under a neutral prompt the model **failed to delegate in all five runs**. An operating system never decides "this job looks too small, I'll do it myself". (See [the two-layer architecture](../architecture/two-layer.md))
:::

## Read next

<div class="mp-grid">
  <a class="mp-card" href="../evidence/numbers.html">
    <span class="mp-num">01</span>
    <h3>Read the evidence</h3>
    <p>Four setups compared, the 300-message experiment scale, p50 / p95 and the ablation data.</p>
    <span class="mp-go">How to read the numbers</span>
  </a>
  <a class="mp-card tone-coral" href="../evidence/harness.html">
    <span class="mp-num">02</span>
    <h3>Read the base</h3>
    <p>What a Harness is, which parts "everything is a plugin" covers, and what the team runs on it internally.</p>
    <span class="mp-go">See it in use</span>
  </a>
  <a class="mp-card tone-blue" href="../limits/open-problems.html">
    <span class="mp-num">03</span>
    <h3>Read the edges</h3>
    <p>Scalability, A2A, safety and privacy — the parts the official article admits are not finished.</p>
    <span class="mp-go">See the risks</span>
  </a>
</div>
