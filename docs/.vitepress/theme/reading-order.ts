export type ListenItem = { text: string; link: string }
export type ListenGroup = { group: string; items: ListenItem[] }

// 全站唯一的阅读顺序。config.mts 里的侧边栏与听书的连播队列都按它排。
// 新增页面必须同时出现在这里和 reading-order.en.ts，否则连播会静默停在上一页。
export const ORDER: ListenGroup[] = [
  {
    group: '开始',
    items: [
      { text: '一句话讲透 Super-agent', link: '/guide/what-is' },
      { text: '为什么 AI 越多你越累', link: '/guide/why' },
      { text: '它和 Multi-Agent 框架有何不同', link: '/guide/vs-others' }
    ]
  },
  {
    group: '五大模块',
    items: [
      { text: '全景：一台 Agent 操作系统', link: '/architecture/overview' },
      { text: '双层架构：Router 与 Worker', link: '/architecture/two-layer' },
      { text: '事件驱动：Trigger 与直通', link: '/architecture/event-driven' },
      { text: '面向人的交互：多信道与全双工', link: '/architecture/multi-channel' },
      { text: '存算分离：Inline / Spill / 链式召回', link: '/architecture/storage-compute' },
      { text: 'Watchdog：会自己复活', link: '/architecture/watchdog' }
    ]
  },
  {
    group: '地基',
    items: [{ text: '借自操作系统的老主意', link: '/foundations/os-ideas' }]
  },
  {
    group: '证据',
    items: [
      { text: '实验数字怎么读', link: '/evidence/numbers' },
      { text: 'Harness 与「一切都是插件」', link: '/evidence/harness' }
    ]
  },
  {
    group: '边界',
    items: [
      { text: '还没解决的问题', link: '/limits/open-problems' },
      { text: '这个词已经很挤了', link: '/limits/name-collision' }
    ]
  },
  {
    group: '关于',
    items: [{ text: '关于本站', link: '/about' }]
  }
]

export const FLAT: ListenItem[] = ORDER.flatMap((g) => g.items)

export const groupOf = (link: string): string | undefined =>
  ORDER.find((g) => g.items.some((i) => normalize(i.link) === normalize(link)))?.group

export const indexOfLink = (link: string): number =>
  FLAT.findIndex((i) => normalize(link) === normalize(i.link))

export function normalize(link: string): string {
  if (!link) return ''
  let l = link.split('#')[0].split('?')[0]
  l = l.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\.md$/, '')
  if (!l.startsWith('/')) l = `/${l}`
  l = l.replace(/\/$/, '')
  return l === '' ? '/' : l
}
