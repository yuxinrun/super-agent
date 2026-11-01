<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))

const zhItems = [
  {
    tone: 'accent',
    k: '01 / CONTINUITY',
    t: '连续',
    meta: '换信道，不换对象',
    d: '你在群里叫它、在 GitHub 评论里叫它、在邮件里叫它，都是同一个 Agent。它记得上周那件事，不需要你重新解释一遍。',
    who: '靠：面向人的交互 + 状态外置'
  },
  {
    tone: 'coral',
    k: '02 / EFFICIENCY',
    t: '高效',
    meta: '并行完成多个复杂任务',
    d: '几件事同时推进，互不阻塞。慢的那个不该让你已经做完的东西等在门口，也不该把你的上下文越撑越满。',
    who: '靠：双层架构 + 批处理'
  },
  {
    tone: 'blue',
    k: '03 / PROACTIVITY',
    t: '主动',
    meta: '持续观察，自行推进',
    d: '不用你每次敲门。群聊、日程、CI 结果、评论都是触发器；有值得做的事它就开工，确认有用再来找你验收。',
    who: '靠：事件驱动 + 投机执行'
  },
  {
    tone: 'lime',
    k: '04 / PERSISTENCE',
    t: '持久',
    meta: '始终在线，异常自动恢复',
    d: '进程崩了、模型超时、你的电脑睡了，任务不该原地蒸发。外部看门狗盯着心跳，发现不对就介入修复。',
    who: '靠：Watchdog + 云端计算'
  }
]

const enItems = [
  {
    tone: 'accent',
    k: '01 / CONTINUITY',
    t: 'Continuous',
    meta: 'Change channel, not the agent',
    d: 'You reach it from the group chat, a GitHub comment or an email — same agent either way. It remembers last week’s task; you do not re-explain.',
    who: 'Enabled by: human-facing interaction + externalised state'
  },
  {
    tone: 'coral',
    k: '02 / EFFICIENCY',
    t: 'Efficient',
    meta: 'Several complex tasks at once',
    d: 'Many things progress in parallel without blocking each other. A slow task should not make finished work wait at the door, or inflate one shared context.',
    who: 'Enabled by: two layers + batching'
  },
  {
    tone: 'blue',
    k: '03 / PROACTIVITY',
    t: 'Proactive',
    meta: 'Watches, then acts',
    d: 'Nobody has to knock. Chat, calendar, CI results and review comments are all triggers; when something is worth doing it starts, and only surfaces when it is useful.',
    who: 'Enabled by: event-driven core + speculation'
  },
  {
    tone: 'lime',
    k: '04 / PERSISTENCE',
    t: 'Persistent',
    meta: 'Always on, self-recovering',
    d: 'Process dies, model times out, your laptop sleeps — the task should not evaporate. An external watchdog watches heartbeats and intervenes.',
    who: 'Enabled by: watchdog + cloud-side compute'
  }
]

const items = computed(() => (en.value ? enItems : zhItems))
</script>

<template>
  <div class="ft">
    <div v-for="f in items" :key="f.t" :class="['ft-card', `tone-${f.tone}`]">
      <span class="ft-kicker">{{ f.k }}</span>
      <h3>{{ f.t }}</h3>
      <p class="ft-meta">{{ f.meta }}</p>
      <p class="ft-desc">{{ f.d }}</p>
      <span class="ft-who">{{ f.who }}</span>
    </div>
  </div>
</template>

<style scoped>
.ft {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 28px 0;
}

.ft-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 18px 18px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel);
  overflow: hidden;
  transition: transform 0.25s var(--ease), border-color 0.25s, box-shadow 0.25s;
}

.ft-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: var(--card-color, var(--accent));
  opacity: 0.85;
}

.ft-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--card-color, var(--accent)) 55%, var(--line));
  box-shadow: var(--shadow);
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

.ft-kicker {
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.ft-card h3 {
  margin: 9px 0 0;
  color: var(--ink);
  font-size: 17px;
  font-weight: 720;
  letter-spacing: -0.022em;
  line-height: 1.2;
}

.ft-meta {
  margin-top: 2px;
  color: var(--card-color, var(--accent));
  font-size: 11.5px;
  font-weight: 650;
}

.ft-desc {
  flex: 1;
  margin-top: 9px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.65;
}

.ft-who {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.05em;
}

@media (max-width: 1080px) {
  .ft {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .ft {
    grid-template-columns: 1fr;
  }
}
</style>
