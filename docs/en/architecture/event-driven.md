---
title: "Event-driven: the Agent stops waiting for a knock"
description: The two gates a Trigger passes (rule filtering and model judgement), the passthrough subscription, Router batching, and the cost structure the ablation experiment exposes.
---

# Event-driven: the Agent stops waiting for a knock

Passive response is the genetic defect of single-Session mode: **if you do not talk, it does not exist.** The first step toward a collaborator that is always on is replacing your Enter key with events from the outside world as the thing that starts work.

## Trigger: what counts as something happening

The article calls all external input a **Trigger**, and every example it gives is something already firing in a real workday:

<div class="mp-tags">
  <span>chat messages</span><span>email</span><span>calendar reminders</span><span>review comments</span><span>CI run results</span><span>tickets / forms</span>
</div>

Notice what they have in common: **they are happening, and none of them need you to retell them.** Your current workflow is copy-pasting them to the AI — and that step is exactly what gets deleted here.

## Two gates: cheap first, expensive later

A chat message arrives. If every one of them makes the model seriously consider "should I handle this", cost becomes the main problem immediately — almost all chat messages are noise.

Super-agent puts two gates in series:

1. **Rule filtering (Fast Path)**: deterministic rules screen first. A hit on an event line some Worker already subscribed to gets delivered straight away — **the model is never asked to think about it**.
2. **Model judgement (Slow Path)**: only what the rules cannot decide goes to the Router — whether to start a task, who gets it, and which tasks it relates to or conflicts with.

<EventPath />

::: tip The value of this split is not speed. It is cost
The team's ablation experiment removed the passthrough mechanism, and the result is interesting:
- **Router decisions up about 30%**
- **cached read tokens up from 23.23M to 31.77M** (roughly +37%)
- **completion time basically unchanged**

That last line is the one people skip and the one that makes the case. What got saved was not the stopwatch reading; it was **the inference bill and the manager's attention budget**. A gatekeeper who forwards without thinking and a gatekeeper who convenes a meeting for everything will spend thirty percent more meeting time on the same pile of work.
:::

## Batching: do not wake up once per message

Even on the slow path, the Router should not spin up a separate judgement for a single message. The fix is to **bundle the events that have piled up and judge them as one batch**:

<div class="mp-stats">
  <div class="mp-stat"><strong>6.4s</strong><span>reasoning time per decision when judging one at a time</span></div>
  <div class="mp-stat"><strong>1.6s</strong><span>amortised per decision after batching</span></div>
  <div class="mp-stat"><strong>≈4×</strong><span>the amortisation factor</span></div>
  <div class="mp-stat"><strong>0</strong><span>new models or new capabilities required</span></div>
</div>

This is the operating system's old "batching" idea reused as-is: spread the fixed cost of one wake-up across several tasks. The latency does not disappear. It just stops being paid once per trivial thing.

## Where proactivity actually comes from

Assemble these three and "finds its own work" stops being an adjective:

<div class="mp-steps">
  <div class="mp-step"><b>1</b><div><strong>The event stream stays open</strong><p>Triggers keep arriving. Nothing waits on you to initiate.</p></div></div>
  <div class="mp-step"><b>2</b><div><strong>Rules filter first</strong><p>Deterministic matters get deterministic code. Most of the noise stops right there.</p></div></div>
  <div class="mp-step"><b>3</b><div><strong>The Router judges in batches</strong><p>Whatever is left goes in one batch, one decision: start work or not, how many, what context, and who conflicts with whom.</p></div></div>
  <div class="mp-step"><b>4</b><div><strong>Workers subscribe to the follow-up</strong><p>Later messages about that thing go straight to the Worker doing it, with no trip back to ask again.</p></div></div>
</div>

Add [speculative execution](./multi-channel.md) (do the probably-useful work in the background first, commit only once it proves valuable) and proactivity has an engineering implementation — **it is not willpower. It is somebody standing watch on its behalf.**

## The price of this road is part of the deal

::: warning Event-driven invites three hard problems through the door at once
1. **Misfires.** "Thirty messages in the channel, which one justifies starting work" becomes a judgement call you tune for years. Loose rules and it acts on nonsense; tight rules and it is a passive tool again.
2. **Permission anxiety.** A process that wakes up on external messages and then calls tools needs its permission model designed on day one — who may trigger it from the channel, which Triggers are read-only.
3. **Silent cost.** It runs while saying nothing, and it spends money while saying nothing. A resident Agent without a dashboard is a bill you never check.
:::

None of these are things DeepSeek missed. They are the natural exchange rate for this kind of architecture: **you traded your manual scheduling for automation that now has to be governed.** Complexity did not vanish. It moved from your calendar into your architecture.

<div class="mp-quote">To judge whether an event-driven design is mature, check whether it treats "events that should not be answered" as a first-class case. A system that handles hits but not noise is a toy.</div>

## Keep reading

<div class="mp-grid">
  <a class="mp-card tone-blue" href="./multi-channel.html">
    <span class="mp-num">03</span>
    <h3>Human-facing interaction</h3>
    <p>Multi-channel, full duplex and speculative execution: what you do while it works.</p>
    <span class="mp-go">Next stop</span>
  </a>
  <a class="mp-card tone-lime" href="./storage-compute.html">
    <span class="mp-num">04</span>
    <h3>Separating compute, state and environment</h3>
    <p>Where Trigger and Thread live as objects, and how the model gets them back.</p>
    <span class="mp-go">Next stop</span>
  </a>
  <a class="mp-card" href="../evidence/numbers.html">
    <span class="mp-num">05</span>
    <h3>How to read the numbers</h3>
    <p>~300 messages, ~20 work requests, 5 repeats — the scale and the rules of the experiment.</p>
    <span class="mp-go">See the evidence</span>
  </a>
</div>
