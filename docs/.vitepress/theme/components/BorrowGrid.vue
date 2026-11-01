<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))

const zhRows = [
  { os: '进程调度', osEn: 'Scheduler', idea: '谁在跑、谁在等、谁该被抢占', here: 'Router 常驻做全局调度：开几个 Worker、谁先谁后、谁跟谁有关。Worker 在隔离会话里并发执行', tone: 'accent' },
  { os: '缓存', osEn: 'Cache', idea: '把热数据放在更便宜的地方', here: '近期信息 Inline 进上下文窗口，低频内容 Spill 到窗口外按需读；读缓存 token 是被单独记账的成本项', tone: 'blue' },
  { os: '批处理', osEn: 'Batching', idea: '攒一批再干，摊薄固定开销', here: 'Router 攒一批事件一起想，单次决定的推理时间从 6.4 秒降到 1.6 秒', tone: 'coral' },
  { os: 'Fast / Slow Path', osEn: 'Fast / Slow Path', idea: '常见情况走捷径，少见情况走完整流程', here: '程序规则先过滤，命中订阅的事件直送 Worker；真要判断的才叫大模型。直通一拆，Router 决定数涨约 30%', tone: 'accent' },
  { os: '投机执行', osEn: 'Speculation', idea: '还没确认要不要，先把大概率有用的做了', here: '内部策略叫「静默复现并修复」：先在后台复现和分析，确认问题真实存在且修复简单才提交，否则保持安静', tone: 'lime' },
  { os: '存算分离', osEn: 'Storage / compute split', idea: '数据库不等于应用服务器', here: 'Agent Loop 放云端无状态弹性容器，会话状态进数据库，本地只留一个不存状态的轻量 daemon（BYOM）', tone: 'blue' },
  { os: '看门狗', osEn: 'Watchdog', idea: '不判断对错，只判断还喘不喘气', here: '独立 Watchdog Session 由定时消息驱动，既处理接口报错，也用模型判断 Worker 有没有实质进展、方向有没有偏', tone: 'coral' }
]

const enRows = [
  { os: 'Scheduler', osEn: 'Scheduler', idea: 'Who runs, who waits, who gets preempted', here: 'A resident router owns global scheduling: how many workers, in what order, which ones are related. Workers execute concurrently in isolated sessions', tone: 'accent' },
  { os: 'Cache', osEn: 'Cache', idea: 'Put hot data somewhere cheaper', here: 'Recent facts inline in the context window, cold ones spilled outside and pulled on demand; cached read tokens are booked as a cost', tone: 'blue' },
  { os: 'Batching', osEn: 'Batching', idea: 'Accumulate, then pay the fixed cost once', here: 'The router thinks over a batch of events; inference per decision drops from 6.4s to 1.6s', tone: 'coral' },
  { os: 'Fast / Slow Path', osEn: 'Fast / Slow Path', idea: 'Shortcut for the common case, full path for the rest', here: 'Programmatic rules filter first; subscribed events go straight to a worker. Remove passthrough and router decisions rise about 30%', tone: 'accent' },
  { os: 'Speculation', osEn: 'Speculation', idea: 'Do the likely-useful work before it is confirmed', here: 'Their internal policy is “silently reproduce and fix”: investigate in the background, speak up only if the bug is real and the fix is simple', tone: 'lime' },
  { os: 'Storage / compute split', osEn: 'Storage / compute split', idea: 'The database is not the app server', here: 'The agent loop runs in stateless cloud containers, session state goes to a database, your machine keeps only a stateless daemon (BYOM)', tone: 'blue' },
  { os: 'Watchdog', osEn: 'Watchdog', idea: 'It does not judge correctness, only a heartbeat', here: 'A separate watchdog session driven by timed messages handles infrastructure errors, and also asks the model whether each worker is making real progress', tone: 'coral' }
]

const rows = computed(() => (en.value ? enRows : zhRows))
</script>

<template>
  <div class="bw">
    <div class="bw-head">
      <span class="bw-col1">{{ en ? 'Classic systems idea' : '老主意' }}</span>
      <span class="bw-col2">{{ en ? 'What it meant there' : '原本解决什么' }}</span>
      <span class="bw-col3">{{ en ? 'What it does inside an agent' : '在 Agent 里干什么' }}</span>
    </div>
    <div
      v-for="r in rows"
      :key="r.osEn"
      :class="['bw-row', `tone-${r.tone}`]"
    >
      <div class="bw-col1">
        <b class="bw-os">{{ en ? r.osEn : r.os }}</b>
        <span class="bw-tag">{{ r.osEn.toLowerCase() }}</span>
      </div>
      <p class="bw-col2">{{ r.idea }}</p>
      <p class="bw-col3">{{ r.here }}</p>
    </div>
    <p class="bw-foot">
      {{
        en
          ? 'Nothing here is a new theory. That is the whole argument: agent infrastructure is late, so it is allowed to steal from infrastructure that is fifty years old.'
          : '这里面没有一个新理论。这恰恰是它的论点：Agent 的基础设施太年轻，所以可以心安理得地偷师五十岁的老基础设施。'
      }}
    </p>
  </div>
</template>

<style scoped>
.bw {
  margin: 28px 0;
  padding: 6px 22px 18px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background:
    radial-gradient(ellipse 55% 80% at 100% 0%, var(--accent-soft), transparent 60%),
    var(--panel);
}

.bw-head {
  display: grid;
  grid-template-columns: 210px 1fr 1.25fr;
  gap: 18px;
  padding: 16px 0 12px;
  border-bottom: 1px dashed var(--line);
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.bw-row {
  display: grid;
  grid-template-columns: 210px 1fr 1.25fr;
  gap: 18px;
  align-items: start;
  padding: 15px 0;
  border-bottom: 1px dashed var(--line);
}

.bw-row:last-of-type {
  border-bottom: 0;
}

.bw-os {
  display: block;
  color: var(--ink);
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.35;
}

.bw-tag {
  display: block;
  margin-top: 3px;
  color: var(--card-color, var(--accent));
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.05em;
}

.tone-coral {
  --card-color: var(--coral);
}

.tone-blue {
  --card-color: var(--blue);
}

.tone-lime {
  --card-color: var(--lime);
}

.bw-col2 {
  color: var(--muted);
  font-size: 11.5px;
  line-height: 1.6;
}

.bw-col3 {
  color: var(--ink-2);
  font-size: 12.5px;
  line-height: 1.6;
}

.bw-foot {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
  color: var(--muted);
  font-size: 11.5px;
  line-height: 1.65;
}

@media (max-width: 900px) {
  .bw-head {
    display: none;
  }

  .bw-row {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 16px 0;
  }
}

@media (max-width: 640px) {
  .bw {
    padding: 4px 18px 16px;
  }
}
</style>
