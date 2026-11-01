---
title: Why more AI makes you more tired
description: "The real problem Super-agent targets: once single tasks run themselves, the bottleneck moves to human attention — and how a manual scheduler gets built by accident."
---

# Why more AI makes you more tired

Conclusion first: **once a model can finish a job on its own, the time you saved gets eaten back by managing the model.** That isn't a quip. It's the wall almost everyone who used agents seriously ran into over the past two years.

The DeepSeek Harness team calls this wall the **attention bottleneck** — human intervention in single-task execution keeps shrinking, so the bottleneck moves from "can the AI do it" to "can the human keep up".

## You're probably doing a fourth job, while thinking you're doing the first

<LayerArch />

A real afternoon usually goes like this:

1. Open one window to reproduce a bug, open a second to draft the weekly report.
2. A third window asks whether to continue. You switch over and click confirm — because if you aren't there, it genuinely doesn't move.
3. The first window turns up the key clue. You copy it and paste it into the second window as background.
4. It hits you that you stopped writing code. You are **doing scheduling**: assigning tasks, syncing context, checking progress, reintroducing yourself over and over.

::: warning What makes this wall hard to see
It doesn't fail a single task. Every window does good work, the code runs, the answers are right. What it burns is your **switch count** and your **memory bandwidth** — and neither of those writes a log or shows a dashboard. So you can't prove you're doing extra work, until one day you notice you opened 20 sessions in a day.
:::

## Three shapes you have today, and where each one breaks

| Shape | What it solves | Where it breaks | Why it breaks |
| --- | --- | --- | --- |
| Single-window chat | one question, one small task | long tasks need you sitting there | the session has a start and an end; nobody is on duty |
| Multiple windows in parallel | several things moving at once | context sync is all human copy-paste | windows share no state |
| Single Session + Subagent tools | let the model dispatch its own subtasks | the main session's context keeps swelling, and you are still the only bus | the scheduler is the model, not the system |

The third row is what most people use now, and what most people overrate. It already looks like AI directing AI. But notice: every subtask's result still flows back into **one and the same context window**, the session still **has a start and an end**, and someone (you) still has to hold the intent outside the window. It parallelised execution. It never moved **memory** and **scheduling** out of the model.

## Which parts Super-agent swapped out

It adds no capability. What it does is **take three things away from the model**:

<div class="mp-steps">
  <div class="mp-step"><b>1</b><div><strong>Session management, handed to the system</strong><p>A session is no longer a property of a chat window. It's an execution unit you can create, resume and address.</p></div></div>
  <div class="mp-step"><b>2</b><div><strong>Context sync, handed to external state</strong><p>What Workers need to share is stored outside the model. No copy-paste from you, and no shoving everything back into the same window.</p></div></div>
  <div class="mp-step"><b>3</b><div><strong>Liveness checks, handed to a watchdog</strong><p>The model is not responsible for proving it's still alive. An outside process watches the heartbeat and restarts on a hang.</p></div></div>
</div>

Those three things taken away are exactly the three that turned you into a human bus.

## A metaphor that isn't accurate, but earns its keep

::: tip Think company, not brain
You used to hire one very capable temp: every shift starts with re-briefing the project, it forgets everything at clock-out, and it stands idle when you're away. What Super-agent wants is not a smarter temp. It wants to **build you a department** — a supervisor (Router) answering the phone and handing out work, several specialists (Worker) each owning one patch, a records room (external state) holding all the background, and a security guard (Watchdog) walking the floor after hours to see whose desk is still occupied.

You got promoted from desk neighbour to department head. Your new job is stating requirements and signing.

The distortion needs stating too: people in a department have judgment, dodge blame and read your hints. The Router does none of that; it acts on the rules you wrote and the big model's reasoning. **Don't read an organisational metaphor as a capability metaphor.**
:::

## Why this deserves a handbook

The hype came fast; the misreadings came faster. The commonest sentence is "DeepSeek shipped another model" — and in that sentence, **the word "model" names precisely the thing least present in this release**. What's worth reading is the engineering: how an agent system handles residency, concurrency, context and crash recovery.

Those four problems are still solved by hand on every team building agent applications. They aren't DeepSeek's problems; they're this stage's shared problems. It just happens that someone spread the answers open into nine chapters and attached a repo you can read.

<div class="mp-quote">There's a plain test for whether an agent technique is real progress: did it make you open fewer windows. What reduces your manual moves is progress. What only adds things you can configure is a framework changelog.</div>

## Next

<div class="mp-grid">
  <a class="mp-card" href="./vs-others.html">
    <span class="mp-num">01</span>
    <h3>First, sort it out from the frameworks</h3>
    <p>If LangGraph / CrewAI / AutoGen is what just popped into your head, this page exists to answer "isn't that the same thing?".</p>
    <span class="mp-go">Where the line sits</span>
  </a>
  <a class="mp-card tone-coral" href="../architecture/overview.html">
    <span class="mp-num">02</span>
    <h3>Or go straight to the architecture</h3>
    <p>Five modules taken apart one by one: what each solves, what it costs, and where the old idea was borrowed from.</p>
    <span class="mp-go">Start the teardown</span>
  </a>
  <a class="mp-card tone-blue" href="../evidence/numbers.html">
    <span class="mp-num">03</span>
    <h3>Or look only at the evidence</h3>
    <p>How the experiment ran, what it was compared against, and which conclusions the measurement actually supports.</p>
    <span class="mp-go">See the data</span>
  </a>
</div>
