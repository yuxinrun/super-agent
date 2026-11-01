<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))

const zhItems = [
  { v: '12.4', u: '分钟', tone: 'accent', t: '一半任务在此完成', d: 'SUPER-AGENT · P50', k: '基线是「单 Session + Subagent 工具」；中性提示下五次运行一次都没有委派子任务' },
  { v: '15.7', u: '分钟', tone: 'blue', t: '九成半任务在此完成', d: 'SUPER-AGENT · P95', k: '同一批任务，中性提示的单 Session 方案 p95 是 29.5 分钟' },
  { v: '29.5', u: '分钟', tone: 'coral', t: '旧方案的尾部时间', d: '单 SESSION · 中性提示 · P95', k: '几乎慢一倍。而且这是「提示词里写了优先委派」之前的数字' },
  { v: '6.4 → 1.6', u: '秒', tone: 'coral', t: '一次决定摊薄后的推理时间', d: 'ROUTER 批处理', k: '把多个事件攒成一批一起想，而不是来一条想一次' },
  { v: '2323 → 3177', u: '万 token', tone: 'lime', t: '读缓存 token（+约 37%）', d: '消融：去掉订阅直通', k: '注意：完成时间基本没变。省下来的是钱和 Router 的带宽，不是秒表' },
  { v: '300 / 20', u: '条消息', tone: 'accent', t: '实验规模', d: '其中约 20 条是工作请求', k: '其余为闲聊、跟进、叫停与 CI 消息；每种方案重复跑 5 次' }
]

const enItems = [
  { v: '12.4', u: 'min', tone: 'accent', t: 'Half of tasks finish by here', d: 'SUPER-AGENT · P50', k: 'Baseline is a single session with a subagent tool; under a neutral prompt it delegated zero times in five runs' },
  { v: '15.7', u: 'min', tone: 'blue', t: '95% of tasks finish by here', d: 'SUPER-AGENT · P95', k: 'Same workload: the neutral-prompt single session took 29.5 minutes at p95' },
  { v: '29.5', u: 'min', tone: 'coral', t: 'The old tail', d: 'SINGLE SESSION · NEUTRAL · P95', k: 'Nearly twice as slow — and that is before any prompt begging it to delegate' },
  { v: '6.4 → 1.6', u: 'sec', tone: 'coral', t: 'Inference cost per decision', d: 'ROUTER BATCHING', k: 'Think over a batch of events instead of once per event' },
  { v: '2323 → 3177', u: '×10k tok', tone: 'lime', t: 'Cached read tokens (+~37%)', d: 'ABLATION: passthrough removed', k: 'Wall-clock barely moved. What you saved was money and router headroom, not seconds' },
  { v: '300 / 20', u: 'messages', tone: 'accent', t: 'Experiment scale', d: 'ABOUT 20 ARE REAL WORK REQUESTS', k: 'The rest is chat, follow-ups, stops and CI noise; every setup ran five times' }
]

const items = computed(() => (en.value ? enItems : zhItems))
</script>

<template>
  <div class="mg">
    <div class="mg-head">
      <span class="mg-kicker">{{ en ? 'Reported numbers · read with the caveat' : '原文给出的数字 · 请连着口径一起读' }}</span>
      <span class="mg-src">DeepSeek Harness · Super-agent · 2026-10-31</span>
    </div>
    <div class="mg-grid">
      <div v-for="m in items" :key="m.t" :class="['mg-tile', `tone-${m.tone}`]">
        <div class="mg-value">
          <strong>{{ m.v }}</strong>
          <span v-if="m.u">{{ m.u }}</span>
        </div>
        <b class="mg-title">{{ m.t }}</b>
        <p class="mg-desc">{{ m.d }}</p>
        <p class="mg-caveat">{{ en ? 'Caveat: ' : '口径：' }}{{ m.k }}</p>
      </div>
    </div>
    <p class="mg-foot">
      {{
        en
          ? 'All figures come from the team’s own initial experiment, and the code you can clone is not the exact build that produced them. Treat them as evidence that the design works, not as a benchmark you can reproduce.'
          : '这些数字全部出自团队自己的初步实验，而且开源出来的代码和跑出这些数字的内部版本并不完全一致。把它们当作「这套设计能work」的证据，而不是你可以复现的基准测试。'
      }}
    </p>
  </div>
</template>

<style scoped>
.mg {
  margin: 28px 0;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background:
    radial-gradient(ellipse 55% 75% at 0% 100%, var(--blue-soft), transparent 60%),
    var(--panel);
}

.mg-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px dashed var(--line);
}

.mg-kicker {
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.mg-src {
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.mg-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 18px 0 4px;
}

.mg-tile {
  position: relative;
  padding: 16px 15px 15px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel-2);
  overflow: hidden;
}

.mg-tile::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: var(--tile-color, var(--accent));
  opacity: 0.85;
}

.tone-coral {
  --tile-color: var(--coral);
}

.tone-blue {
  --tile-color: var(--blue);
}

.tone-lime {
  --tile-color: var(--lime);
}

.mg-value {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.mg-value strong {
  color: var(--ink);
  font-size: 1.75rem;
  font-weight: 760;
  line-height: 1;
  letter-spacing: -0.04em;
}

.mg-value span {
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mg-title {
  display: block;
  margin-top: 9px;
  color: var(--ink);
  font-size: 12.5px;
  font-weight: 680;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.mg-desc {
  margin-top: 3px;
  color: var(--tile-color, var(--accent));
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.04em;
}

.mg-caveat {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--line);
  color: var(--muted);
  font-size: 10.5px;
  line-height: 1.5;
}

.mg-foot {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
  color: var(--muted);
  font-size: 11.5px;
  line-height: 1.65;
}

@media (max-width: 1080px) {
  .mg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .mg {
    padding: 18px;
  }

  .mg-grid {
    grid-template-columns: 1fr;
  }
}
</style>
