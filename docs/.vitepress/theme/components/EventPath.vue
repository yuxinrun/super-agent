<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))

const zhLanes = [
  {
    id: 'fast',
    kicker: 'FAST PATH',
    name: '订阅直通',
    cost: '几乎不花钱',
    costNote: '不叫模型思考',
    trigger: '事件命中一个已有 Worker 订阅的频道',
    example: '「刚才那个 PR 的 review 意见」→ 直接递给正在等它的 Worker'
  },
  {
    id: 'slow',
    kicker: 'SLOW PATH',
    name: 'Router 判断',
    cost: '花一次推理',
    costNote: '批处理摊薄',
    trigger: '没人订阅，或需要新开 / 合并任务',
    example: '「客户提了三个新需求」→ 决定开几个 Worker、各给什么上下文'
  },
  {
    id: 'drop',
    kicker: 'QUIET PATH',
    name: '先不管它',
    cost: '零成本',
    costNote: '只记账',
    trigger: '噪音、重复、或还没到该做的事',
    example: '「群里有人发了个表情包」→ 记进事件流，不唤醒任何人'
  }
]

const enLanes = [
  {
    id: 'fast',
    kicker: 'FAST PATH',
    name: 'Subscription passthrough',
    cost: 'Almost free',
    costNote: 'No model call',
    trigger: 'The event matches a channel some worker already subscribes to',
    example: '“Review comment on that PR” → delivered straight to the worker waiting for it'
  },
  {
    id: 'slow',
    kicker: 'SLOW PATH',
    name: 'Router decides',
    cost: 'One inference',
    costNote: 'Amortised by batching',
    trigger: 'Nobody subscribed, or a task must be opened or merged',
    example: '“A client filed three new requests” → how many workers, and what context each gets'
  },
  {
    id: 'drop',
    kicker: 'QUIET PATH',
    name: 'Leave it alone',
    cost: 'Zero',
    costNote: 'Logged only',
    trigger: 'Noise, duplicates, or work that is not due yet',
    example: '“Someone posted a sticker in the group” → appended to the stream, wakes nobody'
  }
]

const lanes = computed(() => (en.value ? enLanes : zhLanes))
</script>

<template>
  <figure class="ep">
    <div class="ep-head">
      <div class="ep-legend">
        <span v-for="lane in lanes" :key="lane.id" :class="`ep-${lane.id}`">
          <i></i>{{ lane.kicker }}
        </span>
      </div>
      <figcaption>{{ en ? 'One event arrives · three possible fates' : '一条事件进来 · 三种命运' }}</figcaption>
    </div>

    <div class="ep-lanes">
      <div v-for="lane in lanes" :key="lane.id" class="ep-lane" :class="`ep-${lane.id}`">
        <div class="ep-rail"><b></b></div>
        <div class="ep-body">
          <div class="ep-title">
            <span class="ep-kicker">{{ lane.kicker }}</span>
            <strong>{{ lane.name }}</strong>
          </div>
          <p class="ep-trigger">{{ lane.trigger }}</p>
          <p class="ep-example">{{ lane.example }}</p>
        </div>
        <div class="ep-cost">
          <strong>{{ lane.cost }}</strong>
          <span>{{ lane.costNote }}</span>
        </div>
      </div>
    </div>

    <p class="ep-note">
      {{
        en
          ? 'The point is not cleverness, it is cost. If every message made the router think, you would have hired a manager whose job is answering the doorbell. Their ablation is the honest part: remove the passthrough and router decisions rise about 30% and cached read tokens go from 23.23M to 31.77M — while wall-clock barely moves. The shortcut does not buy seconds, it buys money and headroom.'
          : '重点不是聪明，是成本。如果每条群消息都要 Router 认真想一想，你就雇了一位专职开门的经理。最有意思的是那个消融实验：把直通拆掉，Router 判断次数涨约 30%、读缓存 token 从 2323 万涨到 3177 万，但完成时间基本没动。这条捷径省的不是秒，是钱和主管的带宽。'
      }}
    </p>
  </figure>
</template>

<style scoped>
.ep {
  margin: 26px 0;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background:
    radial-gradient(ellipse 50% 70% at 100% 0%, var(--coral-soft), transparent 60%),
    var(--panel);
}

.ep-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--line);
}

.ep-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.ep-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.03em;
}

.ep-legend i {
  width: 18px;
  height: 4px;
  border-radius: 2px;
}

.ep figcaption {
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.05em;
}

.ep-lanes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 0 2px;
}

.ep-lane {
  display: grid;
  grid-template-columns: 4px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel-2);
}

.ep-rail {
  align-self: stretch;
}

.ep-rail b {
  display: block;
  width: 4px;
  height: 100%;
  border-radius: 999px;
  background: var(--lane-color, var(--accent));
  opacity: 0.85;
}

.ep-fast {
  --lane-color: var(--accent);
}

.ep-slow {
  --lane-color: var(--coral);
}

.ep-drop {
  --lane-color: var(--blue);
}

.ep-legend .ep-fast i,
.ep-kicker {
  background: none;
}

.ep-legend .ep-fast i {
  background: var(--accent);
}

.ep-legend .ep-slow i {
  background: var(--coral);
}

.ep-legend .ep-drop i {
  background: var(--blue);
}

.ep-title strong {
  display: block;
  margin-top: 3px;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.ep-kicker {
  color: var(--lane-color, var(--accent));
  font-family: var(--font-mono);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.ep-trigger {
  margin-top: 4px;
  color: var(--ink-2);
  font-size: 11.5px;
  line-height: 1.55;
}

.ep-example {
  margin-top: 3px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.55;
}

.ep-cost {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: right;
  white-space: nowrap;
}

.ep-cost strong {
  color: var(--lane-color, var(--accent));
  font-size: 11.5px;
  font-weight: 700;
}

.ep-cost span {
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.ep-note {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
  color: var(--muted);
  font-size: 11.5px;
  line-height: 1.65;
}

@media (max-width: 760px) {
  .ep {
    padding: 18px;
  }

  .ep-lane {
    grid-template-columns: 4px 1fr;
    gap: 12px;
  }

  .ep-cost {
    grid-column: 2;
    flex-direction: row;
    gap: 8px;
    align-items: baseline;
    text-align: left;
  }
}
</style>
