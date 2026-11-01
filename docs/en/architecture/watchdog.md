---
title: "The external Watchdog: a guard for the Agent that can think"
description: A separate Watchdog Session, an external control loop driven by scheduled messages, infrastructure recovery, and using a model to judge whether there is real progress and whether the direction has drifted.
---

# The external Watchdog: a guard for the Agent that can think

A resident Agent system has a problem that a use-it-and-leave-it Agent never needed: **nobody knows whether it is still alive right now.**

The process exists but is stuck. The model still returns but keeps going in circles. The task is still running but the direction drifted off ages ago. All three look identical on a dashboard — they all read "still running".

## What it is

Super-agent puts **a separate Watchdog Session** outside the main architecture:

- it is **not in the main loop**; it is an independent session outside the system;
- it is **driven by scheduled messages**, forming its own external control loop;
- it does two kinds of work: handling **infrastructure failures** like interface errors, and **using a model to judge whether each Worker has made real progress and whether it has strayed from the goal**;
- when it finds something wrong, **it steps in and fixes it**.

<LayerArch />

## Why it has to be external

Because "supervising yourself" does not hold up logically.

::: tip A hung process does not report that it is hung
This is the oldest piece of common sense in operations, and it is the entire reason watchdogs exist. A hardware watchdog works in a way too blunt to argue with: the main loop feeds the dog on schedule, and **if it does not show up, the box reboots** — no questions asked. It does not need to understand what the program is doing. It needs a heartbeat.

Super-agent keeps that bluntness — interface errors, lost processes: those calls need no intelligence. **It adds one step**: beyond the heartbeat, it uses a model to judge progress at the semantic level. So this guard does not only check whether you are back at your desk. It glances at your screen and asks, "you have been circling this problem for forty minutes — want to try a different angle?"
:::

## Heartbeat plus semantics: two tiers of judgement

| Judgement type | The question it asks | Needs intelligence? | Action |
| --- | --- | --- | --- |
| infrastructure | is it still breathing? any interface errors? | no | restart, retry, swap the instance |
| progress semantics | did it make real progress in the last hour? | **yes** | step in, fix, correct course |
| goal semantics | is the thing it is doing still the thing you asked for? | **yes** | step in, hand it back to a human |

The third row is the most valuable and the most dangerous. The first two are availability engineering; the third is already **alignment engineering**: a process authorised to judge whether the direction is right is itself an Agent that needs constraining.

## This is where "persistent" closes the loop

Back to the original four traits — **persistent = always online, failures recovered automatically**. It depends entirely on this chapter:

<div class="mp-steps">
  <div class="mp-step"><b>1</b><div><strong>State lives outside the model</strong><p>See [separating compute from state](./storage-compute.md). The process is disposable; the memory is not.</p></div></div>
  <div class="mp-step"><b>2</b><div><strong>Somebody notices it stopped</strong><p>An independent Session plus scheduled messages, with no reliance on the main loop certifying its own health.</p></div></div>
  <div class="mp-step"><b>3</b><div><strong>Somebody decides the rescue</strong><p>Infrastructure problems get a straight restart; semantic problems go to a model to judge whether to correct course.</p></div></div>
  <div class="mp-step"><b>4</b><div><strong>Resume from the breakpoint</strong><p>Because the state is in the database, a restart does not mean explaining everything from scratch.</p></div></div>
</div>

Skip step 2 and step 1 is worthless — state sitting in a database that nobody retrieves and reruns is just a more reliable failure record.

<div class="mp-quote">"Self-healing" is not an action. It is a loop: detect the failure → classify it → pick an action → resume execution. Drop any of the four steps and all you have done is write prettier crash logs.</div>

## Three questions you have to answer yourself

This site's inference, not content from the original article — but if you actually build this, you will hit all three:

1. **Who watches the watchdog?** The Watchdog is also a session, and it can hang too. It needs an external heartbeat source, and that chain has to end somewhere the Agent does not control (a process manager, cron, the platform).
2. **Where is the boundary on correcting course?** "Notice the drift, then step in" means it has the power to change a running task. Give it too little and it is useless; give it too much and you get a clever guard that steers the work into a ditch.
3. **Who audits it?** A process that can read and write Worker state and restart tasks must leave a complete record of every intervention. Otherwise failure attribution becomes philosophy: who exactly broke this.

::: warning This is the shared weak spot of this whole family of architectures
The more autonomy, the more you need a system that can answer "what just happened, and who decided it". The Watchdog is the first role in this architecture that **must be strictly audited**, and at prototype stage it is usually the part nobody finished. That is part of why the official article files security and privacy under open problems (see [open problems](../limits/open-problems.md)).
:::

## Keep reading

<div class="mp-grid">
  <a class="mp-card tone-blue" href="../foundations/os-ideas.html">
    <span class="mp-num">06</span>
    <h3>Seven old ideas</h3>
    <p>Watchdog, heartbeat, control loop — every one of these words was born in systems software.</p>
    <span class="mp-go">See whose homework</span>
  </a>
  <a class="mp-card tone-coral" href="../evidence/numbers.html">
    <span class="mp-num">07</span>
    <h3>How to read the experiment numbers</h3>
    <p>How much faster two layers are than a single Session, and which half the ablation proved.</p>
    <span class="mp-go">See the evidence</span>
  </a>
  <a class="mp-card" href="../limits/open-problems.html">
    <span class="mp-num">08</span>
    <h3>Open problems</h3>
    <p>Scalability, cross-instance communication (A2A), security and privacy.</p>
    <span class="mp-go">See the limits</span>
  </a>
</div>
