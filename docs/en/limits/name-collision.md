---
title: The Word Is Already Crowded
description: Search superagent and you get a JavaScript HTTP library, a sales-automation product, the meta-controller of hierarchical reinforcement learning, and an everywhere marketing adjective. This page sorts the fish.
---

# The Word Is Already Crowded

Open a search engine right now and type `superagent`, and you hit at least four completely different things at the same time. Telling them apart is more useful than memorizing one more architecture noun.

## Four groups fighting over one word

| What you find | What it is | Its relation to what this site means |
| --- | --- | --- |
| `superagent` (npm) | A JavaScript HTTP request library that has been around for years, used to send requests from Node or the browser | Completely unrelated. It isn't even an agent |
| Superagent (the SaaS product) | Sales automation / AI SDR products that follow up with leads in bulk | Same name, not the same thing |
| Hierarchical agents in hierarchical reinforcement learning | The Options framework and the meta-controller lineage: an upper level picks the skill, a lower level executes | A little intellectual kinship, but **this word is not the usual name for it** — don't force the match |
| "super agent" in marketing | Any product that thinks its agent beats the others calls itself a super agent | Noise. The category this site most needs to keep its distance from |

The one this site talks about is spelled **Super-agent** — an **orchestration-layer architecture** proposed by the DeepSeek Harness team in its article at the end of October 2026. With a hyphen, capital S, and a narrow reference.

::: tip Why this argument is worth having
Because the word "agent" has been diluted until it carries no information. When every product calls itself an agent, saying "this is an agent" says nothing at all.

The way to tell them apart isn't a louder name, it's **saying clearly which layer it lives in**. That is the whole job of [how it differs from multi-agent frameworks](../guide/vs-others.md).
:::

## Three layers, one line each

```
model layer          decides "can it think this through"
orchestration layer  decides "who runs, who waits, who should be woken up"  ← Super-agent is here
runtime layer        decides "where it runs, where state lives, who handles a crash" ← Harness is here
```

A one-phrase mnemonic: **Super-agent is not a smarter agent, it's a foreman.** A foreman doesn't lay bricks. His job is deciding who goes to which wall.

## Three pairs worth separating

- **Router vs a routing model**: the Router is a resident scheduling process in the orchestration layer, not a small model doing intent classification. It is closer to an operating system's scheduler.
- **Worker vs subtask / Subagent**: a Worker is an **independent session, concurrent, holding tools**; a traditional Subagent is usually one-shot and leans on the parent session.
- **Watchdog vs retry logic**: retry is "it failed, run it again". A Watchdog is "I don't know whether you failed, so I'm outside watching whether you're making progress". The second catches the kind of problem the first never will — **busy wandering with no error raised**.

<div class="mp-quote">The most useful question in front of a new noun: which layer is it in? That locates information better than its name does.</div>

## Read next

<div class="mp-grid">
  <a class="mp-card" href="../guide/what-is.html">
    <span class="mp-num">01</span>
    <h3>Back to the definition</h3>
    <p>One sentence, four traits, one diagram — pinning down what this thing actually is.</p>
    <span class="mp-go">The one-page version</span>
  </a>
  <a class="mp-card tone-coral" href="../architecture/overview.html">
    <span class="mp-num">02</span>
    <h3>Five parts</h3>
    <p>Two-layer architecture, event-driven, human-facing interaction, state and environment separated, and the Watchdog.</p>
    <span class="mp-go">See the whole picture</span>
  </a>
  <a class="mp-card tone-blue" href="../limits/open-problems.html">
    <span class="mp-num">03</span>
    <h3>Unfinished</h3>
    <p>The four open problems the article admits, and three debts that will come due.</p>
    <span class="mp-go">See the edges</span>
  </a>
</div>
