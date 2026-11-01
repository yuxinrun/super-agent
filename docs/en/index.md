---
layout: home

hero:
  name: Super-agent
  text: An agent that finds its own work
  tagline: "Late on 31 October 2026, the DeepSeek Harness team laid open an agent infrastructure design: AI directs AI, and the human moves up from the one issuing each instruction to the one setting goals and signing off. This handbook explains it until you can retell it to a coworker."
  actions:
    - theme: brand
      text: Ten minutes, start here
      link: /en/guide/what-is
    - theme: alt
      text: See the architecture diagram
      link: /en/architecture/overview
    - theme: alt
      text: Original article and open-source prototype
      link: https://github.com/deepseek-ai/dsh-superagent-prototype
---

<div class="mp-wrap">

<section class="mp-section" style="border-top:0;padding-top:20px">

<div class="mp-eyebrow">Super-agent · the architecture handbook</div>

## In one line: the bottleneck is not the model, it's your attention

<p class="mp-lead">Once a model can work for half an hour on its own, the new choke point is you: five windows open, instructions handed out one by one, progress checked back and forth, the background retold to every single AI. You wanted AI to lighten your load; instead a human now manages a pile of AIs. Super-agent's answer is to hand the managing of AI to AI as well — the system layer takes over sessions and context, and you keep only the goal and the sign-off.</p>

<div class="mp-stats">
  <div class="mp-stat"><strong>5</strong><span>big modules · holding up a resident agent</span></div>
  <div class="mp-stat"><strong>7</strong><span>old ideas lifted from operating systems</span></div>
  <div class="mp-stat"><strong>12.4</strong><span>minutes · p50 for half the tasks</span></div>
  <div class="mp-stat"><strong>2026</strong><span>10-31 public · MIT prototype open-sourced</span></div>
</div>

<div class="mp-tags">
  <span>DeepSeek Harness</span><span>Router</span><span>Worker Pool</span><span>Event-driven</span><span>Fast / Slow Path</span><span>Full-duplex</span><span>Storage / Compute Split</span><span>Watchdog</span>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow coral">The problem · how you use AI today</div>

## You are not using AI. You are its manual scheduler.

<p class="mp-lead">Put the two working styles side by side and the gap is obvious. Left is today. Right is the life Super-agent wants you living.</p>

<div class="mp-split">
<div>

<div class="mp-steps">
  <div class="mp-step"><b>Today</b><div><strong>You open windows</strong><p>One session per task, and every session starts with you re-explaining the background.</p></div></div>
  <div class="mp-step"><b>Today</b><div><strong>You watch progress</strong><p>It runs, you wait; it asks, you answer; you stop, it stops.</p></div></div>
  <div class="mp-step"><b>Today</b><div><strong>You are the human bus</strong><p>Whatever session A found, you copy-paste it into session B.</p></div></div>
  <div class="mp-step"><b>Today</b><div><strong>You do the remembering</strong><p>Close the window and it forgets. Next week, same task, explain from scratch.</p></div></div>
</div>

<div class="mp-quote">The word session gives the game away: it means one conversation with a start and an end, not a colleague who is always on duty. You hired a temp, then hold it to a permanent role's expectations.</div>

</div>
<div>

<div class="mp-steps">
  <div class="mp-step"><b>After</b><div><strong>You set the goal</strong><p>"Sort this batch of complaints and draft the weekly report" — one sentence, no decomposition.</p></div></div>
  <div class="mp-step"><b>After</b><div><strong>Router hands out work</strong><p>The scheduling layer decides how many Workers to open and what context each gets.</p></div></div>
  <div class="mp-step"><b>After</b><div><strong>Workers run in parallel</strong><p>Each keeps its own session and its own context: no queueing, no cross-contamination.</p></div></div>
  <div class="mp-step"><b>After</b><div><strong>You sign off</strong><p>The merged result lands in the chat window you already know. All you judge is whether it ships.</p></div></div>
</div>

<a class="mp-go" style="display:inline-block;margin-top:18px;color:var(--accent);font-weight:650" href="./guide/why.html">Read the full problem statement →</a>

</div>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow">Anatomy · the five modules</div>

## Under the hood: a miniature OS built for agents

<p class="mp-lead">This architecture invents no new theory. It bolts five engineering modules together so that one agent can stay resident, run in parallel, start its own work and revive itself. Each module answers a problem you will hit sooner or later.</p>

<div class="mp-grid">
  <a class="mp-card" href="./architecture/two-layer.html">
    <span class="mp-num">01</span>
    <h3>Two-layer architecture</h3>
    <p>The Router supervises: filter, queue, judge, merge. Workers execute: one session per task, heads-down.</p>
    <span class="mp-go">Who should own context</span>
  </a>
  <a class="mp-card tone-coral" href="./architecture/event-driven.html">
    <span class="mp-num">02</span>
    <h3>Event-driven</h3>
    <p>It moves when something arrives, not when you ask. Fast Path goes straight through; only Slow Path makes the model think; noise just gets logged.</p>
    <span class="mp-go">Three fates for one event</span>
  </a>
  <a class="mp-card tone-blue" href="./architecture/multi-channel.html">
    <span class="mp-num">03</span>
    <h3>Async multi-channel</h3>
    <p>Full duplex: it listens, talks and works at the same time. Find it in IM, in GitHub comments, in forms.</p>
    <span class="mp-go">Why interaction never queues</span>
  </a>
  <a class="mp-card tone-lime" href="./architecture/storage-compute.html">
    <span class="mp-num">04</span>
    <h3>Storage/compute split</h3>
    <p>What gets remembered moves outside the model. A Worker can be swapped out at any moment without taking the memory down with it.</p>
    <span class="mp-go">Where the context went</span>
  </a>
  <a class="mp-card" href="./architecture/watchdog.html">
    <span class="mp-num">05</span>
    <h3>External Watchdog</h3>
    <p>It judges nothing right or wrong; only whether the process still breathes. Hung, timed out, crashed — an outside process kicks it awake.</p>
    <span class="mp-go">How it revives itself</span>
  </a>
  <a class="mp-card tone-coral" href="./foundations/os-ideas.html">
    <span class="mp-num">06</span>
    <h3>Seven old ideas</h3>
    <p>Scheduling, caching, batching, Fast/Slow Path, speculative execution, storage/compute split, watchdogs — all family heirlooms of operating systems.</p>
    <span class="mp-go">What it stole, and from whom</span>
  </a>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow coral">Cost · why not think about every message</div>

## When an event arrives, there are actually three paths

<p class="mp-lead">If the Router has to think hard about every group message, you hired a manager whose only job is opening the door. The real savings live on the path that doesn't think.</p>

<EventPath />

<a class="mp-go" style="display:inline-block;margin-top:18px;color:var(--accent);font-weight:650" href="./architecture/event-driven.html">See the full event mechanism →</a>

</section>

<section class="mp-section">

<div class="mp-eyebrow">Evidence · the numbers</div>

## The evidence it offers, and the edges of that evidence

<p class="mp-lead">Early experiments show that a system layer taking over session scheduling does work. Read the numbers together with how they were measured — including the line everyone skips: the open-source prototype is not exactly the build that produced them.</p>

<MetricGrid />

<a class="mp-go" style="display:inline-block;margin-top:18px;color:var(--accent);font-weight:650" href="./evidence/numbers.html">How to read these numbers →</a>

</section>

<section class="mp-section">

<div class="mp-band">
  <div class="mp-eyebrow coral">It is not a model · this is not a new model</div>
  <h2 class="mp-h2">What shipped is not a bigger brain. It's a new foreman.</h2>
  <p class="mp-lead">Super-agent trains no parameters and swaps no reasoning ability. What it changes is who manages sessions. That sounds plain, but it decides whether you can use an agent as a colleague instead of a tool you have to sit with the whole time.</p>

  <div class="mp-band-grid">
    <div>
      <div class="mp-band-card">
        <h3>The model thinks, the system remembers</h3>
        <p>Asking the model to hold every session is asking the chef to run the till, do the shopping and answer the phone. Capability doesn't grow; it gets eaten by chores.</p>
        <a href="./architecture/two-layer.html">How the two layers split the work →</a>
      </div>
      <div class="mp-band-card" style="margin-top:14px">
        <h3>The human moves up to decisions and sign-off</h3>
        <p>You set the goal, you sign the result. Handing out work, running it in parallel, syncing, retrying — the system owns the middle. That is this architecture's real product value, not a few seconds saved.</p>
        <a href="./guide/what-is.html">Read the one-sentence definition →</a>
      </div>
    </div>
    <div>
      <div class="mp-band-card">
        <h3>Proactivity is designed in</h3>
        <p>"It finds its own work" sounds like witchcraft. The implementation is engineering: the event stream stays open, the Router holds judgment, and the agent comes back to a person when it's done. No magic, just subscriptions.</p>
        <a href="./architecture/event-driven.html">Event-driven, in detail →</a>
      </div>
      <div class="mp-band-card" style="margin-top:14px">
        <h3>Reliability is outsourced to a watchdog</h3>
        <p>A model cannot certify that it is still alive. An outside process watches the heartbeat and restarts on a hang. Task state lives outside the model, so restarting is not amnesia.</p>
        <a href="./architecture/watchdog.html">The Watchdog →</a>
      </div>
    </div>
  </div>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow">Field notes · don't misread this</div>

## Six common misunderstandings about Super-agent

<p class="mp-lead">The hype arrives before the understanding. These six are the easiest to bend out of shape, and each one is backed up in a later chapter.</p>

<div class="mp-grid">
  <div class="mp-card tone-coral"><span class="mp-num">A</span><h3>"DeepSeek shipped a new model"</h3><p>It didn't. No new weights, no new leaderboard run — an agent system architecture plus a research prototype.</p><span class="mp-go">What it actually is</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">B</span><h3>"Download it and it just works"</h3><p>Officially a research prototype. The code differs from the internal build, the channels are limited, and deploying it solo takes real effort.</p><span class="mp-go">Where it stops</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">C</span><h3>"This is just a multi-agent framework"</h3><p>LangGraph and CrewAI orchestrate several roles inside one task. Super-agent solves residency, events and state.</p><span class="mp-go">Versus the frameworks</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">D</span><h3>"No more looking after the AI"</h3><p>The human moves up to goals and sign-off, not out. More autonomy makes review and permission design more important, not less.</p><span class="mp-go">Open problems</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">E</span><h3>"12.4 minutes is an industry benchmark"</h3><p>That is the p50 of the team's own early experiment, against a single Session with Subagent tools. Not reproducible as-is.</p><span class="mp-go">How to read the numbers</span></div>
  <div class="mp-card tone-coral"><span class="mp-num">F</span><h3>"Search superagent and you'll find it"</h3><p>The name is already crowded: a JavaScript request library, sales automation products, marketing adjectives. This site is about DeepSeek's orchestration-layer architecture.</p><span class="mp-go">A crowded name</span></div>
</div>

</section>

<section class="mp-section">

<div class="mp-eyebrow">Sister sites · the other handbooks</div>

## Three handbooks, three layers of the same machine

<p class="mp-lead">Super-agent is about how one agent stays resident and runs in parallel. MCP Patterns is about how capabilities get plugged in. How to Build Better Agents is about designing loops, context and evaluation. Only the three together make a complete engineering picture.</p>

<div class="mp-friend">
  <a class="mp-friend-card" href="https://yuxinrun.github.io/mcp-patterns/" target="_blank" rel="noopener">
    <span>yuxinrun.github.io/mcp-patterns</span>
    <strong>MCP Patterns</strong>
    <p>A field handbook of MCP Server engineering patterns: protocol, transport, auth, multi-tenancy, debugging, Skill Hub and framework integration. The tools Super-agent's Workers call live inside that system.</p>
    <em>Read the tool-layer handbook →</em>
  </a>
  <a class="mp-friend-card" href="https://how-to-build-better-agents.yuxin.run/" target="_blank" rel="noopener">
    <span>how-to-build-better-agents.yuxin.run</span>
    <strong>How to Build Better Agents</strong>
    <p>A practical handbook for traditional programmers moving into agent work, and for agent engineers going deeper. 10 structured chapters, bilingual, light and dark themes.</p>
    <em>Read the agent handbook →</em>
  </a>
</div>

<div class="mp-quote">Suggested order: learn the loop and the context on the sister site, come back here for residency and parallelism, then wire in real capabilities with MCP.</div>

</section>

</div>
