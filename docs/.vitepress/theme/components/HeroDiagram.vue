<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))

const events = ['IM 群消息', 'GitHub 评论', '定时器', '表单工单']
const eventsEn = ['chat message', 'GitHub comment', 'timer', 'form ticket']
const workers = ['复现问题', '写代码', '查资料', '出报告']
const workersEn = ['reproduce', 'write code', 'research', 'report']
</script>

<template>
  <div class="hd" aria-hidden="true">
    <div class="hd-halo"></div>

    <div class="hd-node hd-human">
      <div>
        <span class="hd-label">{{ en ? 'YOU' : '你' }}</span>
        <strong>{{ en ? 'Set the goal · sign off the result' : '只定目标 · 只验收结果' }}</strong>
      </div>
      <span class="hd-dot"></span>
    </div>

    <div class="hd-wire">
      <i></i><i></i><i></i>
      <span>{{ en ? 'no per-message babysitting' : '不再逐条盯消息' }}</span>
    </div>

    <div class="hd-node hd-router">
      <div class="hd-router-head">
        <span class="hd-label">ROUTER / {{ en ? 'manager' : '主管' }}</span>
        <span class="hd-status"><b></b>awake</span>
      </div>
      <strong>{{ en ? 'Filter events · queue work · merge results' : '过滤事件 · 排队任务 · 汇总交付 · 唯一的对外出口' }}</strong>
      <div class="hd-chips">
        <span v-for="(e, i) in (en ? eventsEn : events)" :key="e">{{ e }}</span>
      </div>
    </div>

    <div class="hd-wire hd-wire-alt">
      <i></i><i></i><i></i>
      <span>{{ en ? 'dispatch · report back' : '派活 · 回报' }}</span>
    </div>

    <div class="hd-node hd-workers">
      <span class="hd-label">{{ en ? 'WORKER POOL / run in parallel' : 'WORKER 池 / 并行干活' }}</span>
      <div class="hd-tools">
        <span v-for="(w, i) in (en ? workersEn : workers)" :key="w">{{ w }}</span>
      </div>
      <div class="hd-guard">
        <span>{{ en ? 'isolated session' : '会话隔离' }}</span>
        <span>{{ en ? 'subscribes to a thread' : '订阅 thread' }}</span>
        <span>{{ en ? 'has the tools' : '工具在它手里' }}</span>
        <span>{{ en ? 'router has none' : 'Router 一个工具都没有' }}</span>
      </div>
    </div>

    <div class="hd-base">
      <span><b>STATE</b>{{ en ? 'session memory lives outside the model' : '会话状态放在模型外' }}</span>
      <span><b>DOG</b>{{ en ? 'external watchdog restarts it' : '外部看门狗兜底复活' }}</span>
    </div>

    <div class="hd-foot">
      <span>{{ en ? 'Always online' : '一直在线' }}</span>
      <span>{{ en ? 'Many things at once' : '同时好几件事' }}</span>
      <span>{{ en ? 'Finds work itself' : '自己找活干' }}</span>
      <span>{{ en ? 'Recovers alone' : '挂了能自己爬起来' }}</span>
    </div>
  </div>
</template>

<style scoped>
.hd {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, 470px);
  margin-inline: auto;
  padding: 26px 24px 20px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background:
    radial-gradient(ellipse 80% 60% at 80% 0%, var(--accent-soft), transparent 60%),
    var(--panel);
  box-shadow: var(--shadow-lg);
  transform: rotate(-1.4deg);
}

.hd::after {
  content: '';
  position: absolute;
  inset: 10px;
  border: 1px dashed var(--line);
  border-radius: 20px;
  pointer-events: none;
}

.hd-halo {
  position: absolute;
  right: -34px;
  top: -30px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: radial-gradient(circle, var(--coral-soft), transparent 65%);
  filter: blur(2px);
}

.hd-node {
  position: relative;
  z-index: 1;
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  background: var(--panel);
}

.hd-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.hd-human {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border-color: color-mix(in srgb, var(--coral) 38%, var(--line));
}

.hd-human strong {
  display: block;
  margin-top: 3px;
  font-size: 13px;
  font-weight: 700;
}

.hd-dot {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--coral);
  box-shadow: 0 0 0 5px var(--coral-soft);
}

.hd-wire {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 0 9px;
}

.hd-wire i {
  width: 1.5px;
  height: 5px;
  border-radius: 2px;
  background: var(--line-strong);
}

.hd-wire span {
  margin-top: 2px;
  padding: 2px 8px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-2);
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.hd-router {
  padding: 15px 18px 16px;
  border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
  background: linear-gradient(120deg, var(--accent-soft), transparent 70%), var(--panel);
}

.hd-router-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hd-router strong {
  display: block;
  margin-top: 8px;
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.4;
}

.hd-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 9px;
}

.hd-status b {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: hd-blink 2.4s infinite;
}

.hd-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 11px;
}

.hd-chips span {
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-2);
  color: var(--ink-2);
  font-size: 11px;
  font-weight: 600;
}

.hd-workers {
  padding: 15px 18px 14px;
}

.hd-tools {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 11px;
}

.hd-tools span {
  padding: 9px 4px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--panel-2);
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: 9.5px;
  text-align: center;
}

.hd-guard {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.hd-guard span {
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--blue-soft);
  color: var(--blue);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.hd-base {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.hd-base span {
  padding: 9px 11px;
  border: 1px dashed var(--line-strong);
  border-radius: 10px;
  color: var(--muted);
  font-size: 10.5px;
  line-height: 1.45;
}

.hd-base b {
  display: block;
  margin-bottom: 2px;
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.1em;
}

.hd-foot {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--line);
  color: var(--faint);
  font-size: 10px;
}

.hd-foot span::before {
  content: '•';
  margin-right: 5px;
  color: var(--accent);
}

@keyframes hd-blink {
  50% {
    opacity: 0.3;
  }
}

@media (max-width: 960px) {
  .hd {
    transform: none;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .hd {
    padding: 20px 16px 18px;
    border-radius: 20px;
  }

  .hd-tools {
    grid-template-columns: repeat(2, 1fr);
  }

  .hd-base {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hd-status b {
    animation: none;
  }
}
</style>
