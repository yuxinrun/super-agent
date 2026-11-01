import { reactive } from 'vue'
import { FLAT, normalize } from './reading-order'
import type { ListenItem } from './reading-order'
import { FLAT_EN } from './reading-order.en'

const CHUNK_LIMIT = 180

export type Scope = 'page' | 'group' | 'site'

// 连播队列随界面语言切换：中文版 15 页，英文版同构镜像
let queue: ListenItem[] = FLAT

/** 切换连播队列（英文用 ORDER_EN，中文用 ORDER） */
export function setQueueLang(lang: string) {
  queue = lang.startsWith('en') ? FLAT_EN : FLAT
}

const queueIndexOf = (link: string): number =>
  queue.findIndex((i) => normalize(i.link) === normalize(link))

const queueGroupOf = (link: string): string | undefined =>
  queue.find((g) => g.items.some((i) => normalize(i.link) === normalize(link)))?.group

const UI = {
  zh: {
    unsupported: '这个浏览器不支持语音合成，试试 Safari、Edge 或 Chrome。',
    silent: '按下播放后一句都没出声。常见于系统静音、Linux 没装语音后端，或浏览器禁用了网页发声。',
    empty: '这一页没有可朗读的正文。',
    failed: (err: string) => `朗读中断（${err}）。可以点播放重试，或换一个声音。`,
    offQueue: '这一页不在目录顺序里，连播先停在这里。从左侧目录挑一页就能接着听。',
    endOfScope: '按现在的连播范围，这就是最后一段了。要听得更长，把范围切成「全书」。',
    artist: '鱼心快跑 · Super-agent 手册',
    album: '一本可以听完的架构手册',
    title: 'Super-agent 讲透',
    langPrefix: 'zh'
  },
  en: {
    unsupported: 'This browser has no speech synthesis. Try Safari, Edge or Chrome.',
    silent:
      'Nothing came out after you pressed play. Usual causes: the system is muted, Linux has no speech backend, or the browser blocks page audio.',
    empty: 'There is no readable text on this page.',
    failed: (err: string) => `Playback stopped (${err}). Press play to retry, or pick another voice.`,
    offQueue:
      'This page is not in the reading order, so autoplay stops here. Pick a page from the sidebar to continue.',
    endOfScope: 'That was the last section in the current scope. Choose “Whole book” to keep going.',
    artist: 'Yuxin Runs · Super-agent Handbook',
    album: 'An architecture handbook you can finish by listening',
    title: 'Super-agent, Explained',
    langPrefix: 'en'
  }
}

let ui = UI.zh

/** 语音引擎的界面语言：影响错误文案、锁屏元信息与默认声音筛选 */
export function setUiLang(lang: string) {
  ui = lang.startsWith('en') ? UI.en : UI.zh
  setQueueLang(lang)
  loadVoices()
}

export interface PagePayload {
  link: string
  title: string
  blocks: string[]
}

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined

export const listen = reactive({
  supported: Boolean(synth),
  ready: false,
  playing: false,
  paused: false,
  link: '',
  title: '',
  blocks: [] as string[],
  cursor: -1,
  speed: 1,
  voiceURI: '',
  scope: 'site' as Scope,
  error: '',
  voices: [] as SpeechSynthesisVoice[],
  nativeOnly: true,
  // 引擎报告支持、但实际一句都没念出来。UI 据此弹「没出声」说明，而不是让用户对着哑掉的播放键发呆
  silent: false
})

const store =
  typeof localStorage !== 'undefined'
    ? {
        get: (k: string) => localStorage.getItem(k),
        set: (k: string, v: string) => localStorage.setItem(k, v)
      }
    : { get: () => null, set: () => {} }

let epoch = 0
let goFn: ((link: string) => void) | null = null
let heart: ReturnType<typeof setInterval> | null = null

export const setNavigator = (fn: (link: string) => void) => {
  goFn = fn
}

const clean = (raw: string) =>
  raw
    .replace(/\u200b|\u00a0/g, ' ')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

// 把一个长段落切成口播友好的短句：不拆小数点，超长句必须有硬切点，否则 Chrome 会在 15 秒处掐断
const SOFT_CUTS = ['，', '、', '：', ',', ';', ' ', ':']

function splitSentences(text: string): string[] {
  const out: string[] = []
  const chars = [...text]
  let buf = ''
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    buf += ch
    const digitDot = /\d/.test(chars[i - 1] ?? '') && /\d/.test(chars[i + 1] ?? '')
    const hard = '。！？；…\n'.includes(ch) || ('.!?'.includes(ch) && !digitDot)
    if (hard && buf.trim().length > 6) {
      out.push(buf.trim())
      buf = ''
      continue
    }
    if (buf.length >= CHUNK_LIMIT) {
      let cut = -1
      for (const mark of SOFT_CUTS) cut = Math.max(cut, buf.lastIndexOf(mark))
      // 找不到任何自然切点就直接切，宁可断成两口气，也不要一整段被浏览器吞掉
      if (cut < 40 && buf.length >= CHUNK_LIMIT * 1.6) cut = CHUNK_LIMIT
      if (cut > 0) {
        out.push(buf.slice(0, cut + 1).trim())
        buf = buf.slice(cut + 1)
      }
    }
  }
  if (buf.trim()) out.push(buf.trim())
  return out.filter(Boolean)
}

export const blocksOf = (page: PagePayload): string[] =>
  page.blocks.flatMap((b) => splitSentences(clean(b))).filter((b) => b.length > 1)

export const totalChars = (blocks: string[]) => blocks.reduce((s, b) => s + b.length, 0)

export const minutesOf = (blocks: string[], speed = listen.speed) =>
  Math.max(1, Math.round(totalChars(blocks) / (250 * speed)))

const preferScore = (v: SpeechSynthesisVoice) => {
  const n = v.name.toLowerCase()
  let s = 0
  if (v.lang.toLowerCase().startsWith(ui.langPrefix)) s += 100
  if (v.localService) s += 8
  if (/xiaoxiao|yaoyao|yunxi|yunjian|ting|shuiwen|huihui|wanlingliang/.test(n)) s += 40
  if (/aria|jenny|guy|samantha|sonia|ryan|libby/.test(n)) s += 30
  if (/google/.test(n)) s += 12
  if (/enhanced|natural|online/.test(n)) s += 6
  if (/neural/.test(n)) s += 20
  return s
}

function loadVoices() {
  if (!synth) return
  const all = synth.getVoices()
  if (!all.length) return
  const pool = listen.nativeOnly
    ? all.filter((v) => v.lang.toLowerCase().startsWith(ui.langPrefix))
    : all
  const voices = (pool.length ? pool : all).slice().sort((a, b) => preferScore(b) - preferScore(a))
  listen.voices = voices
  const savedVoice = store.get('sa-listen-voice')
  const picked = voices.find((v) => v.voiceURI === savedVoice) || voices[0]
  if (picked && !voices.some((v) => v.voiceURI === listen.voiceURI)) listen.voiceURI = picked.voiceURI
  listen.ready = true
}

let inited = false

export function initSpeech() {
  if (!synth) {
    listen.error = ui.unsupported
    return
  }
  const saved = store.get('sa-listen-speed')
  if (saved) listen.speed = Number(saved) || 1
  const savedScope = store.get('sa-listen-scope') as Scope | null
  if (savedScope && ['page', 'group', 'site'].includes(savedScope)) listen.scope = savedScope
  // 组件重挂载时只刷新声音列表，避免重复注册 voiceschanged
  if (inited) {
    loadVoices()
    return
  }
  inited = true
  loadVoices()
  synth.addEventListener?.('voiceschanged', loadVoices)
  // 部分浏览器首次 getVoices() 返回空数组，1 秒内通常会有 voiceschanged
  if (!listen.ready) setTimeout(loadVoices, 800)
}

export const currentVoice = () => listen.voices.find((v) => v.voiceURI === listen.voiceURI)

export function setVoice(uri: string) {
  listen.voiceURI = uri
  store.set('sa-listen-voice', uri)
}

export function setSpeed(v: number) {
  listen.speed = v
  store.set('sa-listen-speed', String(v))
  if (listen.playing) restartFrom(listen.cursor)
}

export function setScope(s: Scope) {
  listen.scope = s
  store.set('sa-listen-scope', s)
}

export function toggleNativeOnly() {
  listen.nativeOnly = !listen.nativeOnly
  initSpeech()
}

const keepAlive = () => {
  if (heart) clearInterval(heart)
  // Chrome 会在约 15 秒后静默掐断长句朗读，resume() 是无害的续命动作
  heart = setInterval(() => {
    if (synth && listen.playing && !listen.paused && synth.speaking) synth.resume()
  }, 9000)
}

export function stop() {
  epoch += 1
  listen.playing = false
  listen.paused = false
  listen.cursor = -1
  clearSilentWatch()
  if (synth) synth.cancel()
  if (heart) {
    clearInterval(heart)
    heart = null
  }
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'paused'
    navigator.mediaSession.metadata = null
  }
  if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('sa-listen-resume')
}

// 有些环境里 speechSynthesis 存在、getVoices() 也不为空，但 speak() 既不报错也不出声。
// 没有 onstart 就等于没出声，这时必须告诉用户，而不是让播放键继续假装在工作。
let spoken = false
let silentTimer: ReturnType<typeof setTimeout> | null = null

function clearSilentWatch() {
  if (silentTimer) {
    clearTimeout(silentTimer)
    silentTimer = null
  }
}

function armSilentWatch() {
  clearSilentWatch()
  spoken = false
  listen.silent = false
  silentTimer = setTimeout(() => {
    silentTimer = null
    if (!listen.playing || listen.paused || spoken) return
    listen.silent = true
    listen.error = ui.silent
    stop()
  }, 2500)
}

/** 载入一页；若这页正在被朗读则保持进度不动 */
export function loadPage(page: PagePayload, autoResume = false) {
  const link = normalize(page.link)
  if (listen.playing && listen.link === link) return
  const blocks = blocksOf(page)
  const wasPlaying = listen.playing && !listen.paused
  listen.blocks = blocks
  listen.link = link
  listen.title = page.title
  if (autoResume && wasPlaying && blocks.length) {
    const saved = readResumeCursor(link)
    restartFrom(saved === null ? 0 : Math.min(saved, blocks.length - 1))
  } else if (wasPlaying && blocks.length) {
    restartFrom(0)
  } else if (listen.playing) {
    // 暂停中换了页：不要替用户决定「这一页也念出来」
    stop()
  }
}

const readResumeCursor = (link: string): number | null => {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem('sa-listen-resume')
    if (!raw) return null
    const o = JSON.parse(raw)
    return o.link === link && typeof o.cursor === 'number' ? o.cursor : null
  } catch {
    return null
  }
}

export function nextLink(): string | null {
  if (listen.scope === 'page') return null
  const i = queueIndexOf(listen.link)
  // 首页不在目录里，但按顺序听的人通常就是从首页按下去的
  if (i < 0) {
    const isHome = listen.link === '/' || listen.link === '/en'
    return isHome && queue.length ? normalize(queue[0].link) : null
  }
  const next = queue[i + 1]
  if (!next) return null
  if (listen.scope === 'group' && queueGroupOf(next.link) !== queueGroupOf(listen.link)) return null
  return normalize(next.link)
}

export function prevLink(): string | null {
  if (listen.scope === 'page') return null
  const i = queueIndexOf(listen.link)
  if (i <= 0) return null
  const prev = queue[i - 1]
  if (listen.scope === 'group' && queueGroupOf(prev.link) !== queueGroupOf(listen.link)) return null
  return normalize(prev.link)
}

/** 目录位置（第几页 / 共几页），供播放条显示 */
export const queuePosition = (link: string) => {
  const i = queueIndexOf(link)
  return i < 0 ? '' : `${i + 1}/${queue.length}`
}

function restartFrom(cursor: number) {
  epoch += 1
  if (synth) synth.cancel()
  listen.cursor = cursor
  listen.playing = true
  listen.paused = false
  keepAlive()
  armSilentWatch()
  speak()
}

export function play() {
  if (!listen.supported) {
    listen.error = ui.unsupported
    return
  }
  if (!listen.blocks.length) {
    listen.error = ui.empty
    return
  }
  listen.error = ''
  if (listen.paused) {
    listen.paused = false
    if (synth) synth.resume()
    updateMedia('play')
    return
  }
  if (listen.playing) return
  restartFrom(listen.cursor >= 0 ? listen.cursor : 0)
}

export function pause() {
  if (!listen.playing) return
  listen.paused = true
  clearSilentWatch()
  if (synth) synth.pause()
  updateMedia('pause')
}

export function toggle() {
  if (!listen.playing) play()
  else if (listen.paused) play()
  else pause()
}

export function jump(cursor: number) {
  if (cursor < 0 || cursor >= listen.blocks.length) return
  restartFrom(cursor)
}

export function nextBlock() {
  if (listen.cursor + 1 < listen.blocks.length) restartFrom(listen.cursor + 1)
  else advancePage()
}

export function prevBlock() {
  if (listen.cursor > 0) restartFrom(listen.cursor - 1)
}

function goTo(link: string) {
  // 先记下下一页的起点，路由切换后由 loadPage 接续
  if (typeof sessionStorage !== 'undefined')
    sessionStorage.setItem('sa-listen-resume', JSON.stringify({ link, cursor: 0 }))
  if (goFn) goFn(link)
  else stop()
}

function advancePage() {
  const i = queueIndexOf(listen.link)
  const link = nextLink()
  if (!link) {
    stop()
    listen.error = i < 0 ? ui.offQueue : ui.endOfScope
    return
  }
  goTo(link)
}

/** 锁屏上的「上一首」按页算，不按句 */
function backPage() {
  const link = prevLink()
  if (link) goTo(link)
  else restartFrom(0)
}

function speak() {
  if (!synth) return
  const myEpoch = epoch
  const text = listen.blocks[listen.cursor]
  if (!text) {
    stop()
    return
  }
  const u = new SpeechSynthesisUtterance(text)
  const v = currentVoice()
  if (v) {
    u.voice = v
    u.lang = v.lang
  } else u.lang = ui.langPrefix === 'en' ? 'en-US' : 'zh-CN'
  u.rate = listen.speed
  u.pitch = 1
  u.volume = 1
  u.onstart = () => {
    spoken = true
    clearSilentWatch()
  }
  u.onend = () => {
    if (myEpoch !== epoch) return
    if (listen.cursor + 1 < listen.blocks.length) {
      listen.cursor += 1
      saveResume()
      speak()
    } else advancePage()
  }
  u.onerror = (ev) => {
    if (myEpoch !== epoch) return
    const err = (ev as SpeechSynthesisErrorEvent).error
    if (err === 'interrupted' || err === 'canceled') return
    listen.error = ui.failed(err)
    listen.playing = false
    listen.paused = false
  }
  if (typeof sessionStorage !== 'undefined') saveResume()
  updateMedia('play')
  synth.speak(u)
}

function saveResume() {
  try {
    sessionStorage.setItem(
      'sa-listen-resume',
      JSON.stringify({ link: listen.link, cursor: listen.cursor })
    )
  } catch {
    /* 隐私模式下 sessionStorage 会抛错，忽略 */
  }
}

function updateMedia(state: 'play' | 'pause') {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
  const ms = navigator.mediaSession
  try {
    ms.playbackState = state === 'play' ? 'playing' : 'paused'
    if (state === 'play') {
      ms.metadata = new MediaMetadata({
        title: listen.title || ui.title,
        artist: ui.artist,
        album: ui.album
      })
      ms.setActionHandler('play', () => play())
      ms.setActionHandler('pause', () => pause())
      ms.setActionHandler('previoustrack', () => backPage())
      ms.setActionHandler('nexttrack', () => advancePage())
    }
  } catch {
    /* 老浏览器没有 MediaMetadata，锁屏控制只是降级，不影响朗读 */
  }
}

export const progress = () =>
  listen.blocks.length ? Math.round(((listen.cursor + 1) / listen.blocks.length) * 100) : 0
