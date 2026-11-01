<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onContentUpdated, useData, useRoute, useRouter, withBase } from 'vitepress'
import { articleRoot, collectBlocks } from '../extract'
import {
  initSpeech,
  listen,
  loadPage,
  minutesOf,
  nextBlock,
  pause,
  play,
  prevBlock,
  progress,
  queuePosition,
  setNavigator,
  setScope,
  setSpeed,
  setUiLang,
  setVoice,
  stop,
  toggleNativeOnly,
  totalChars
} from '../useSpeech'

const route = useRoute()
const router = useRouter()
const { page, lang } = useData()

const showTools = ref(false)
const collapsed = ref(false)
const barEl = ref<HTMLElement | null>(null)
const dialogEl = ref<HTMLElement | null>(null)

// '' 关闭；unsupported 浏览器不支持语音合成；novoice 支持但系统没有可用语音；silent 点了播放但一句没出声
type DialogKind = '' | 'unsupported' | 'novoice' | 'silent'
const dialog = ref<DialogKind>('')
// 语音列表异步到达，首屏 1.5 秒内为空属正常，不能立刻判"没有语音"
const voiceWaitDone = ref(false)

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2]
const SCOPES = computed<Array<{ key: 'page' | 'group' | 'site'; label: string }>>(() =>
  lang.value.startsWith('en')
    ? [
        { key: 'page', label: 'Page' },
        { key: 'group', label: 'Chapter' },
        { key: 'site', label: 'Whole book' }
      ]
    : [
        { key: 'page', label: '本页' },
        { key: 'group', label: '本章' },
        { key: 'site', label: '全书' }
      ]
)

// 播放条全站共用一套界面，所以文案按 lang 切，不另做英文组件
const T = computed(() => {
  const en = lang.value.startsWith('en')
  return {
    aria: en ? 'Audiobook player' : '听书播放器',
    noBody: en ? 'No readable text on this page' : '这一页没有正文',
    part: (i: number, n: number, m: number) =>
      en ? `Part ${i}/${n} · about ${m} min left here` : `第 ${i}/${n} 段 · 本页还剩约 ${m} 分钟`,
    idle: (m: number, chars: number) =>
      en ? `About ${m} min on this page · ${chars} characters` : `本页约 ${m} 分钟 · ${chars} 字`,
    eyebrow: en ? 'LISTEN · audiobook' : 'LISTEN · 听书',
    reading: en ? 'Reading this page…' : '正在读取本页…',
    play: en ? 'Play this page' : '播放这一页',
    pauseBtn: en ? 'Pause' : '暂停',
    prev: en ? 'Previous part' : '上一段',
    next: en ? 'Next part' : '下一段',
    scope: en ? 'Autoplay scope' : '连播范围',
    speed: en ? 'Speed' : '语速',
    voice: en ? 'Voice' : '声音',
    loading: en ? 'Loading…' : '加载中…',
    nativeToggle: en
      ? listen.nativeOnly
        ? 'All voices'
        : 'English only'
      : listen.nativeOnly
        ? '全部声音'
        : '仅中文',
    tools: en ? (showTools.value ? 'Hide tips' : 'How to use') : showTools.value ? '收起说明' : '怎么用',
    stop: en ? 'Stop' : '停止朗读',
    collapse: en ? 'Collapse the player' : '收起播放条',
    expand: en ? 'Expand the player' : '展开播放条',
    why: en ? 'Why?' : '为什么？',
    noSupport: en
      ? 'This browser cannot read aloud. Press play to see what you can do.'
      : '这个浏览器朗读不了，点播放键看能怎么办。',
    hint: en
      ? 'For the commute: hit play, switch the scope to “Whole book”, then lock your phone — the system player keeps going. Alt+P toggles play/pause. Voices come from your own device; Edge and Chrome on Windows sound the most natural.'
      : '通勤用法：按下播放后切到「全书」，它会按目录顺序自己翻下一页；手机锁屏也能用系统播放器继续，Alt+P 播放/暂停。声音来自浏览器自带的语音，Edge 与 Chrome 的 Windows 中文声音（Xiaoxiao / YunxiNeural）最自然。',
    untitled: en ? 'This page' : '这一页'
  }
})

const DIALOG = computed(() => {
  const en = lang.value.startsWith('en')
  const kind = dialog.value
  const unsupported = kind === 'unsupported'
  const silent = kind === 'silent'

  const title = en
    ? unsupported
      ? 'This browser cannot read pages aloud'
      : silent
        ? 'It said yes, but nothing came out'
        : 'No usable voice on this device'
    : unsupported
      ? '这个浏览器暂时念不了这一页'
      : silent
        ? '它答应了，但一句都没出声'
        : '这台设备上没有可用语音'

  const lead = en
    ? unsupported
      ? 'The audio player is built on the browser’s own speech engine. Yours either lacks it or has it switched off, so the play button would do nothing — better to say so than to pretend.'
      : silent
        ? 'The browser did offer a speech engine and did hand over voices, but two seconds after you pressed play not a single sentence started. That usually means the engine is muted, blocked, or has no working backend behind it.'
        : 'The browser supports speech, but the system has not offered it a single voice. That happens on freshly installed systems, some Android builds and locked-down phones.'
    : unsupported
      ? '听书用的是浏览器自带的语音引擎。你这个浏览器要么没有这个能力，要么被关掉了，所以按下播放键不会有声音——与其让你以为坏了，不如直接说明白。'
      : silent
        ? '浏览器确实交出了语音引擎，也给了声音列表，但按下播放两秒后一句都没开始念。通常是系统静音、浏览器禁止网页发声，或者桌面环境根本没有可用的语音后端。'
        : '浏览器支持朗读，但系统一个语音都没给。常见于刚装好的系统、部分安卓定制机，以及被精简过的手机。'

  const fixes = en
    ? silent
      ? [
          'Check the obvious first: system volume is up, nothing is muted, the tab is not muted.',
          'Try Edge or Chrome — both ship their own speech backend and are the least likely to stay silent.',
          'On Linux desktop: install a speech backend (speech-dispatcher plus espeak-ng), then restart the browser.'
        ]
      : unsupported
        ? [
            'Open this page in Edge, Safari or Chrome — the three that handle speech synthesis best.',
            'On iOS: Settings → Accessibility → Spoken Content → Voices, download a voice.',
            'Or just read it: every diagram here is followed by a sentence that states its conclusion in words, so nothing is lost without audio.'
          ]
        : [
            'On Windows: Settings → Time & language → Speech, add a language pack, then reload this page.',
            'On iOS: Settings → Accessibility → Spoken Content → Voices, download a voice.',
            'Or switch the player to “All voices” and let it read with whatever the device has.'
          ]
    : silent
      ? [
          '先看最蠢的那几项：系统音量没归零、没开静音、这个标签页也没被单独静音。',
          '换 Edge 或 Chrome：这两家自带语音后端，最不容易出现「点了没声」。',
          'Linux 桌面：装一个语音后端（speech-dispatcher 配 espeak-ng），重启浏览器再来。'
        ]
      : unsupported
        ? [
            '换 Edge、Safari 或 Chrome 打开——这三家对语音合成的支持最完整。',
            'iPhone：设置 → 辅助功能 → 朗读内容 → 声音，先下载一个中文语音。',
            '直接读也行：每张图下面都有一句把结论说完的话，不听也不会漏掉重点。'
          ]
        : [
            'Windows：设置 → 时间和语言 → 语音，添加一个语音包，再刷新这一页。',
            'iPhone：设置 → 辅助功能 → 朗读内容 → 声音，下载一个中文语音。',
            '或者把播放条切到「全部声音」，让它用设备上现有的声音念。'
          ]

  return {
    tag: en ? 'LISTEN · not available' : 'LISTEN · 暂时念不了',
    title,
    lead,
    fixesTitle: en ? 'Three things worth trying' : '三个可以试的办法',
    fixes,
    ok: en ? 'Got it' : '知道了',
    alt: en ? 'Read this page instead' : '那就先读这一页',
    close: en ? 'Close' : '关闭'
  }
})

const linkFromRoute = computed(() =>
  '/' + (route.data.relativePath || 'index.md').replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
)

const pageMinutes = computed(() => (listen.blocks.length ? minutesOf(listen.blocks) : 0))
const remainingMinutes = computed(() => {
  if (!listen.blocks.length) return 0
  const rest = listen.blocks.slice(Math.max(0, listen.cursor)).reduce((s, b) => s + b.length, 0)
  return Math.max(0, Math.round(rest / (250 * listen.speed)))
})
const positionLabel = computed(() => queuePosition(listen.link))
const headline = computed(() =>
  !listen.blocks.length
    ? T.value.noBody
    : listen.playing
      ? T.value.part(Math.max(0, listen.cursor) + 1, listen.blocks.length, remainingMinutes.value)
      : T.value.idle(pageMinutes.value, totalChars(listen.blocks))
)
const currentLine = computed(() => {
  const t = listen.blocks[Math.max(0, listen.cursor)] || listen.blocks[0] || ''
  return t.length > 64 ? `${t.slice(0, 64)}…` : t
})

function titleOf(root: Element | null) {
  return page.value.title || root?.querySelector('h1')?.textContent?.trim() || T.value.untitled
}

async function readDom(maxWait = 1600) {
  const started = Date.now()
  while (Date.now() - started < maxWait) {
    const root = articleRoot()
    const blocks = collectBlocks(root)
    if (blocks.length) return { link: linkFromRoute.value, title: titleOf(root), blocks }
    await new Promise((r) => setTimeout(r, 100))
    await nextTick()
  }
  const root = articleRoot()
  return { link: linkFromRoute.value, title: titleOf(root), blocks: collectBlocks(root) }
}

async function sync() {
  loadPage(await readDom(), true)
}

// 所有播放入口都走这里：不支持就弹窗，不静默失败
function togglePlay() {
  if (!listen.supported) {
    dialog.value = 'unsupported'
    return
  }
  // 语音列表是异步来的，等过了宽限期还是空的，才判定"这台设备没有语音"
  if (voiceWaitDone.value && !listen.voices.length) {
    dialog.value = 'novoice'
    return
  }
  listen.playing && !listen.paused ? pause() : play()
}

function toggleCollapse() {
  collapsed.value = !collapsed.value
  try {
    localStorage.setItem('sa-listen-collapsed', collapsed.value ? '1' : '0')
  } catch (e) {
    /* 存不住就算了 */
  }
  nextTick(publishHeight)
}

function closeDialog() {
  dialog.value = ''
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && dialog.value) {
    closeDialog()
    return
  }
  if (!e.altKey) return
  if (e.code === 'KeyP') {
    e.preventDefault()
    togglePlay()
  } else if (e.code === 'ArrowRight' && listen.playing) {
    e.preventDefault()
    nextBlock()
  } else if (e.code === 'ArrowLeft' && listen.playing) {
    e.preventDefault()
    prevBlock()
  }
}

function publishHeight() {
  if (!barEl.value) return
  document.documentElement.style.setProperty('--sa-bar-h', `${Math.round(barEl.value.offsetHeight)}px`)
}

let ro: ResizeObserver | null = null

// 播放器只在客户端渲染：SSR 阶段扫不到正文，输出必然和首屏 DOM 不一致，会被判成 hydration mismatch
const mounted = ref(false)

let voiceTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  mounted.value = true
  setUiLang(lang.value)
  initSpeech()
  voiceTimer = setTimeout(() => {
    voiceWaitDone.value = true
  }, 1500)
  try {
    collapsed.value = localStorage.getItem('sa-listen-collapsed') === '1'
  } catch (e) {
    /* 隐私模式下读不到，保持展开 */
  }
  setNavigator((link) => {
    void router.go(withBase(link))
  })
  window.addEventListener('keydown', onKey)
  nextTick(() => {
    void sync()
    publishHeight()
    if (typeof ResizeObserver !== 'undefined' && barEl.value) {
      ro = new ResizeObserver(publishHeight)
      ro.observe(barEl.value)
    }
  })
  // 不支持时每个会话提示一次：不弹窗说清楚，读者只会以为播放键坏了
  if (!listen.supported) {
    try {
      if (!sessionStorage.getItem('sa-listen-notified')) {
        sessionStorage.setItem('sa-listen-notified', '1')
        dialog.value = 'unsupported'
      }
    } catch (e) {
      dialog.value = 'unsupported'
    }
  }
})

// 中英切换后连播队列与声音列表都要跟着换，否则英文页会念中文目录、挑中文声音
watch(lang, (next) => {
  setUiLang(next)
  initSpeech()
  nextTick(publishHeight)
})

// 引擎报告支持、但两秒内一句都没念出来：主动说明，别让用户对着哑掉的播放键猜
watch(
  () => listen.silent,
  (v) => {
    if (v) dialog.value = 'silent'
  }
)

// 弹窗打开时锁滚动并把焦点挪进去，关闭时还原
watch(dialog, async (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) {
    await nextTick()
    dialogEl.value?.focus()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (voiceTimer) clearTimeout(voiceTimer)
  ro?.disconnect()
  ro = null
  document.body.style.overflow = ''
  stop()
})

// 内容换页后重扫正文；若正在朗读，useSpeech 会从目录里的下一页接着念
onContentUpdated(() => {
  void sync()
})
</script>

<template>
  <aside
    v-if="mounted"
    ref="barEl"
    class="sa-listen"
    :class="{ 'is-playing': listen.playing && !listen.paused, 'is-collapsed': collapsed }"
    :aria-label="T.aria"
  >
    <div class="sa-listen-progress" :style="{ width: listen.playing ? progress() + '%' : '0%' }"></div>

    <!-- 收起态：只留播放键、标题和展开，不占半屏 -->
    <div v-if="collapsed" class="sa-listen-mini">
      <button class="sa-l-btn sa-l-btn--main" :aria-label="listen.playing && !listen.paused ? T.pauseBtn : T.play"
              @click="togglePlay">
        <svg v-if="listen.playing && !listen.paused" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M8 5l12 7-12 7z" fill="currentColor" />
        </svg>
      </button>
      <span class="sa-l-mini-title">{{ listen.title || T.reading }}</span>
      <span v-if="positionLabel" class="sa-l-mini-pos">{{ positionLabel }}</span>
      <button class="sa-l-btn sa-l-icon" :title="T.expand" :aria-label="T.expand" @click="toggleCollapse">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path d="M12 8l6 6H6z" fill="currentColor" />
        </svg>
      </button>
    </div>

    <div v-else class="sa-listen-inner">
      <div class="sa-listen-left">
        <button class="sa-l-btn sa-l-btn--main" :aria-label="listen.playing && !listen.paused ? T.pauseBtn : T.play"
                @click="togglePlay">
          <svg v-if="listen.playing && !listen.paused" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M8 5l12 7-12 7z" fill="currentColor" />
          </svg>
        </button>
        <button class="sa-l-btn" :title="T.prev" :aria-label="T.prev" @click="prevBlock">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M6 5h2v14H6zM20 5l-10 7 10 7z" fill="currentColor" />
          </svg>
        </button>
        <button class="sa-l-btn" :title="T.next" :aria-label="T.next" @click="nextBlock">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M16 5h2v14h-2zM4 5l10 7-10 7z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div class="sa-listen-meta">
        <p class="sa-l-eyebrow">
          <span class="sa-l-dot" :class="{ on: listen.playing && !listen.paused }"></span>
          {{ T.eyebrow }}
          <template v-if="positionLabel"> · {{ positionLabel }}</template>
          <template v-if="pageMinutes"> · {{ headline }}</template>
        </p>
        <p class="sa-l-title">{{ listen.title || T.reading }}</p>
        <p class="sa-l-line">{{ currentLine }}</p>
      </div>

      <div class="sa-listen-right">
        <div class="sa-l-seg" role="group" :aria-label="T.scope">
          <button v-for="s in SCOPES" :key="s.key" :class="{ on: listen.scope === s.key }"
                  @click="setScope(s.key)">{{ s.label }}</button>
        </div>
        <div class="sa-l-seg sa-l-seg--speed" role="group" :aria-label="T.speed">
          <button v-for="v in SPEEDS" :key="v" :class="{ on: listen.speed === v }"
                  @click="setSpeed(v)">{{ v }}×</button>
        </div>
        <label class="sa-l-voice">
          <span class="sr-only">{{ T.voice }}</span>
          <select :value="listen.voiceURI" @change="setVoice(($event.target as HTMLSelectElement).value)">
            <option v-for="v in listen.voices" :key="v.voiceURI" :value="v.voiceURI">
              {{ v.name }}
            </option>
            <option v-if="!listen.voices.length" value="">{{ T.loading }}</option>
          </select>
        </label>
        <button class="sa-l-link" @click="toggleNativeOnly">{{ T.nativeToggle }}</button>
        <button class="sa-l-link" @click="showTools = !showTools">{{ T.tools }}</button>
        <button class="sa-l-btn" :title="T.stop" :aria-label="T.stop" @click="stop()">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" fill="currentColor" />
          </svg>
        </button>
        <button class="sa-l-btn sa-l-icon" :title="T.collapse" :aria-label="T.collapse" @click="toggleCollapse">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d="M12 16l-6-6h12z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <p v-if="!collapsed && !listen.supported" class="sa-l-error">
      {{ T.noSupport }}
      <button class="sa-l-why" @click="dialog = 'unsupported'">{{ T.why }}</button>
    </p>
    <p v-else-if="listen.error && !collapsed" class="sa-l-error">
      {{ listen.error }}
      <button v-if="listen.silent" class="sa-l-why" @click="dialog = 'silent'">{{ T.why }}</button>
    </p>
    <p v-else-if="showTools && !collapsed" class="sa-l-hint">{{ T.hint }}</p>

    <!-- 不支持时的友好提示：说清为什么、能怎么办，不做死胡同。挂在 body 上，避免被固定定位的播放条裁掉 -->
    <Teleport to="body">
      <div v-if="dialog" class="sa-listen-modal" @click.self="closeDialog">
        <div
          ref="dialogEl"
          class="sa-listen-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sa-listen-dialog-title"
          tabindex="-1"
        >
          <span class="sa-listen-dialog-tag">{{ DIALOG.tag }}</span>
          <h2 id="sa-listen-dialog-title" class="sa-listen-dialog-title">{{ DIALOG.title }}</h2>
          <p class="sa-listen-dialog-lead">{{ DIALOG.lead }}</p>
          <p class="sa-listen-dialog-sub">{{ DIALOG.fixesTitle }}</p>
          <ul class="sa-listen-dialog-list">
            <li v-for="f in DIALOG.fixes" :key="f">{{ f }}</li>
          </ul>
          <div class="sa-listen-dialog-actions">
            <button class="sa-listen-dialog-btn" @click="closeDialog">{{ DIALOG.ok }}</button>
            <button class="sa-listen-dialog-ghost" @click="closeDialog">{{ DIALOG.alt }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </aside>
</template>
