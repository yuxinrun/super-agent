<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))
</script>

<template>
  <div class="arch">
    <div class="arch-col">
      <span class="arch-kicker">01 / {{ en ? 'events' : '事件源' }}</span>
      <strong>{{ en ? 'Chat · CI · Timer · Ticket' : '群消息 · 构建 · 定时器 · 工单' }}</strong>
      <p>{{ en ? 'Anything that happens while you are not looking' : '那些你不盯着时也在发生的事' }}</p>
    </div>
    <div class="arch-link"><span>{{ en ? 'push' : '推过来' }}</span></div>
    <div class="arch-col arch-router">
      <span class="arch-kicker">02 / {{ en ? 'router' : '调度层' }}</span>
      <strong>Router</strong>
      <p>{{ en ? 'Cheap filter first, expensive thought second. Decides what is worth a worker.' : '先便宜过滤，再昂贵思考。判断哪件事值得开一个 Worker。' }}</p>
    </div>
    <div class="arch-link arch-link-alt"><span>{{ en ? 'spawn' : '派活' }}</span></div>
    <div class="arch-col arch-workers">
      <span class="arch-kicker">03 / {{ en ? 'workers' : '执行层' }}</span>
      <strong>Worker × N</strong>
      <p>{{ en ? 'Each owns one session, one context, one job. They never wait for each other.' : '一个任务一个会话一份上下文，彼此不排队、不串味。' }}</p>
    </div>
    <div class="arch-link"><span>{{ en ? 'read / write' : '读写' }}</span></div>
    <div class="arch-col arch-state">
      <span class="arch-kicker">04 / {{ en ? 'outside' : '模型之外' }}</span>
      <strong>{{ en ? 'State Store · Watchdog' : '外部状态 · 看门狗' }}</strong>
      <p>{{ en ? 'Memory lives in storage; the dog restarts whoever stops breathing.' : '记忆存在外面；谁停止呼吸，狗就把谁踹醒。' }}</p>
    </div>
  </div>
</template>

<style scoped>
.arch {
  display: grid;
  grid-template-columns: 1fr 30px 1fr 30px 1fr 30px 1fr;
  align-items: stretch;
  margin: 28px 0;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background:
    radial-gradient(ellipse 60% 90% at 0% 0%, var(--accent-soft), transparent 55%),
    var(--panel);
}

.arch-col {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 16px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel-2);
}

.arch-kicker {
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.arch-col strong {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.arch-col p {
  color: var(--muted);
  font-size: 10.5px;
  line-height: 1.55;
}

.arch-router {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
  background: linear-gradient(150deg, var(--accent-soft), transparent 70%), var(--panel-2);
}

.arch-workers {
  border-color: color-mix(in srgb, var(--coral) 38%, var(--line));
}

.arch-state {
  border-color: color-mix(in srgb, var(--blue) 38%, var(--line));
}

.arch-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arch-link::before {
  content: '';
  width: 100%;
  border-top: 1.5px dashed var(--line-strong);
}

.arch-link::after {
  content: '';
  position: absolute;
  right: 1px;
  width: 5px;
  height: 5px;
  border-top: 1.5px solid var(--line-strong);
  border-right: 1.5px solid var(--line-strong);
  transform: rotate(45deg);
}

.arch-link span {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 2px 5px;
  background: var(--panel);
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 7.5px;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}

@media (max-width: 900px) {
  .arch {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .arch-link {
    height: 26px;
  }

  .arch-link::before {
    width: 1.5px;
    height: 100%;
    border-top: 0;
    border-left: 1.5px dashed var(--line-strong);
  }

  .arch-link::after {
    right: auto;
    bottom: 1px;
    transform: rotate(135deg);
  }
}
</style>
