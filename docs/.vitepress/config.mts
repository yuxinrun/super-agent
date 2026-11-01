import { defineConfig } from 'vitepress'

// 若仓库名部署（https://<user>.github.io/super-agent/），构建时用 BASE=/super-agent/
// 绑定自定义域名时保持 BASE=/
const base = process.env.BASE ?? '/'

const sisterMcp = 'https://yuxinrun.github.io/mcp-patterns/'
const sisterAgent = 'https://how-to-build-better-agents.yuxin.run/'

const zhSidebar = [
  {
    text: '开始',
    collapsed: false,
    items: [
      { text: '一句话讲透 Super-agent', link: '/guide/what-is' },
      { text: '为什么 AI 越多你越累', link: '/guide/why' },
      { text: '它和 Multi-Agent 框架有何不同', link: '/guide/vs-others' }
    ]
  },
  {
    text: '五大模块',
    collapsed: false,
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
    text: '地基',
    collapsed: false,
    items: [{ text: '借自操作系统的老主意', link: '/foundations/os-ideas' }]
  },
  {
    text: '证据',
    collapsed: false,
    items: [
      { text: '实验数字怎么读', link: '/evidence/numbers' },
      { text: 'Harness 与「一切都是插件」', link: '/evidence/harness' }
    ]
  },
  {
    text: '边界',
    collapsed: false,
    items: [
      { text: '还没解决的问题', link: '/limits/open-problems' },
      { text: '这个词已经很挤了', link: '/limits/name-collision' }
    ]
  },
  {
    text: '关于',
    collapsed: false,
    items: [{ text: '关于本站', link: '/about' }]
  }
]

const enSidebar = [
  {
    text: 'Start',
    collapsed: false,
    items: [
      { text: 'Super-agent in one page', link: '/en/guide/what-is' },
      { text: 'Why more AI makes you more tired', link: '/en/guide/why' },
      { text: 'How it differs from multi-agent frameworks', link: '/en/guide/vs-others' }
    ]
  },
  {
    text: 'Five Modules',
    collapsed: false,
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
    text: 'Foundations',
    collapsed: false,
    items: [{ text: 'Borrowed from operating systems', link: '/en/foundations/os-ideas' }]
  },
  {
    text: 'Evidence',
    collapsed: false,
    items: [
      { text: 'Reading the experiment numbers', link: '/en/evidence/numbers' },
      { text: 'Harness and everything-as-plugin', link: '/en/evidence/harness' }
    ]
  },
  {
    text: 'Limits',
    collapsed: false,
    items: [
      { text: 'Open problems', link: '/en/limits/open-problems' },
      { text: 'A crowded name', link: '/en/limits/name-collision' }
    ]
  },
  {
    text: 'About',
    collapsed: false,
    items: [{ text: 'About', link: '/en/about' }]
  }
]

const zhNav = [
  { text: '是什么', link: '/guide/what-is', activeMatch: '/guide/' },
  { text: '架构', link: '/architecture/overview', activeMatch: '/architecture/' },
  { text: '地基', link: '/foundations/os-ideas', activeMatch: '/foundations/' },
  { text: '证据', link: '/evidence/numbers', activeMatch: '/evidence/' },
  {
    text: '更多',
    items: [
      { text: '边界与风险', link: '/limits/open-problems' },
      { text: '术语撞车', link: '/limits/name-collision' },
      { text: '关于本站', link: '/about' },
      { text: '姊妹站：MCP Patterns ↗', link: sisterMcp, target: '_blank', rel: 'noopener' },
      { text: '姊妹站：构建更好的 Agent ↗', link: sisterAgent, target: '_blank', rel: 'noopener' }
    ]
  }
]

const enNav = [
  { text: 'What', link: '/en/guide/what-is', activeMatch: '/en/guide/' },
  { text: 'Modules', link: '/en/architecture/overview', activeMatch: '/en/architecture/' },
  { text: 'Roots', link: '/en/foundations/os-ideas', activeMatch: '/en/foundations/' },
  { text: 'Proof', link: '/en/evidence/numbers', activeMatch: '/en/evidence/' },
  {
    text: 'More',
    items: [
      { text: 'Open problems', link: '/en/limits/open-problems' },
      { text: 'Name collision', link: '/en/limits/name-collision' },
      { text: 'About', link: '/en/about' },
      { text: 'Sister site: MCP Patterns ↗', link: sisterMcp, target: '_blank', rel: 'noopener' },
      { text: 'Sister site: Better Agents ↗', link: sisterAgent, target: '_blank', rel: 'noopener' }
    ]
  }
]

export default defineConfig({
  title: 'Super-agent 讲透',
  description:
    '把 DeepSeek Harness 团队的 Super-agent 架构讲到底：双层 Router/Worker、事件驱动、异步多信道、存算分离、外部 Watchdog，以及它从操作系统借来的那些老主意。',
  base,
  lang: 'zh-CN',
  appearance: true,
  lastUpdated: true,
  metaChunk: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#f6f4ee', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#06100e', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  markdown: {
    theme: { light: 'github-dark', dark: 'github-dark' },
    lineNumbers: false,
    image: { lazyLoading: true }
  },
  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo-dark.svg' },
    siteTitle: 'Super-agent 讲透',
    nav: zhNav,
    sidebar: zhSidebar,
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于', formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
    footer: {
      message: `<div class="mp-footer-brand"><img src="${base}yuxin-run.png" alt="鱼心快跑" width="546" height="363" /><span>鱼心快跑，Bug 追不上</span></div>`,
      copyright: '© 2026 鱼心快跑 · Super-agent 讲透'
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: { buttonText: '搜索手册', buttonAriaLabel: '搜索手册' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询',
            backButtonTitle: '返回',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    langMenuLabel: '切换语言',
    notFound: {
      title: '页面不存在',
      quote: 'Router 翻了所有频道，没找到这个会话。回首页重新订阅。',
      linkText: '返回首页'
    }
  },
  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Super-agent, Explained',
      description:
        'A plain-language walkthrough of the DeepSeek Harness super-agent architecture: a two-layer router and workers, event-driven scheduling, async multi-channel interaction, storage/compute separation and an external watchdog.',
      themeConfig: {
        siteTitle: 'Super-agent, Explained',
        nav: enNav,
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdated: { text: 'Updated', formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
        footer: {
          message: `<div class="mp-footer-brand"><img src="${base}yuxin-run.png" alt="Yuxin Runs" width="546" height="363" /><span>Run, Yuxin, run. Bugs cannot catch you.</span></div>`,
          copyright: '© 2026 Yuxin Runs · Super-agent, Explained'
        },
        search: {
          provider: 'local',
          options: {
            detailedView: true,
            translations: {
              button: { buttonText: 'Search the handbook', buttonAriaLabel: 'Search the handbook' }
            }
          }
        },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
        langMenuLabel: 'Change language',
        notFound: {
          title: 'Page not found',
          quote: 'The router checked every channel and found no session here. Go back and resubscribe.',
          linkText: 'Go home'
        }
      }
    }
  },
  transformHead({ pageData }) {
    const en = pageData.relativePath === 'en/index.md' || pageData.relativePath.startsWith('en/')
    const site = en ? 'Super-agent, Explained' : 'Super-agent 讲透'
    const fallback = en
      ? 'Super-agent, Explained — the always-on agent architecture with a router, a worker pool and a watchdog'
      : 'Super-agent 讲透｜持续在线、会自己找活干的 Agent 架构'
    const t = pageData.frontmatter.title
    const title = t ? `${t} | ${site}` : fallback
    const description = en
      ? 'A plain-language walkthrough of the DeepSeek Harness super-agent architecture: two-layer router and workers, event-driven scheduling, multi-channel interaction, state outside the model, and an external watchdog.'
      : 'AI 指挥 AI 干活，人只管目标和验收。一份把 Super-agent 讲到底的通俗手册。'
    return [
      ['meta', { name: 'author', content: en ? 'Yuxin Runs' : '鱼心快跑' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    ]
  }
})
