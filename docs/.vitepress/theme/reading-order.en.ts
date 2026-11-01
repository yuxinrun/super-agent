import type { ListenGroup, ListenItem } from './reading-order'

// 英文版阅读顺序：与中文版 ORDER **一一镜像**（同分组、同顺序、15 页）。
// 侧栏、连播队列、播放条的「第 N/共 M 页」全部由这份生成。
// 纪律：新增中文页必须同步新增英文页并写进这里；两份页数不一致就是构建缺陷，不是「精简版」。
export const ORDER_EN: ListenGroup[] = [
  {
    group: 'Start',
    items: [
      { text: 'Super-agent in one page', link: '/en/guide/what-is' },
      { text: 'Why more AI makes you more tired', link: '/en/guide/why' },
      { text: 'How it differs from multi-agent frameworks', link: '/en/guide/vs-others' }
    ]
  },
  {
    group: 'Five Modules',
    items: [
      { text: 'Overview: an OS for agents', link: '/en/architecture/overview' },
      { text: 'Two-layer: Router and Worker', link: '/en/architecture/two-layer' },
      { text: 'Event-driven: triggers and passthrough', link: '/en/architecture/event-driven' },
      { text: 'Human-facing: channels and full duplex', link: '/en/architecture/multi-channel' },
      { text: 'Split compute, state, environment', link: '/en/architecture/storage-compute' },
      { text: 'Watchdog', link: '/en/architecture/watchdog' }
    ]
  },
  {
    group: 'Foundations',
    items: [{ text: 'Borrowed from operating systems', link: '/en/foundations/os-ideas' }]
  },
  {
    group: 'Evidence',
    items: [
      { text: 'Reading the experiment numbers', link: '/en/evidence/numbers' },
      { text: 'Harness and everything-as-plugin', link: '/en/evidence/harness' }
    ]
  },
  {
    group: 'Limits',
    items: [
      { text: 'Open problems', link: '/en/limits/open-problems' },
      { text: 'A crowded name', link: '/en/limits/name-collision' }
    ]
  },
  {
    group: 'About',
    items: [{ text: 'About', link: '/en/about' }]
  }
]

export const FLAT_EN: ListenItem[] = ORDER_EN.flatMap((g) => g.items)
