const SKIP = [
  'table',
  'pre',
  'script',
  'style',
  '.custom-block-title',
  '.vp-code-group',
  '[data-listen="skip"]',
  'a.header-anchor',
  'button',
  '.VPDocFooter',
  '.edit-link',
  '.last-updated',
  '.outline',
  'svg',
  'img',
  'input',
  'select'
].join(', ')

const BLOCK = new Set(['H2', 'H3', 'H4', 'H5', 'P', 'LI', 'BLOCKQUOTE', 'DT', 'DD', 'FIGCAPTION'])

const textOf = (el: HTMLElement) => {
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll(SKIP).forEach((n) => n.remove())
  const t = (clone.textContent ?? '').replace(/\s+/g, ' ').trim()
  // 列表符号与编号前缀不需要念出来
  return t.replace(/^[•·\-*]\s*/, '')
}

/** 正文根节点：文档页用 .vp-doc，首页用 .VPHome（首页那几段导语也值得在通勤路上听完） */
export const articleRoot = (): Element | null =>
  document.querySelector('.vp-doc') ?? document.querySelector('.VPHome')

/** 按 DOM 顺序抓出可朗读的块，跳过图表、表格与代码 */
export function collectBlocks(root: Element | null = articleRoot()): string[] {
  if (!(root instanceof HTMLElement)) return []
  const out: string[] = []
  const walk = (el: Element) => {
    for (const child of Array.from(el.children)) {
      if (!(child instanceof HTMLElement)) continue
      if (child.matches(SKIP)) continue
      if (BLOCK.has(child.tagName)) {
        const t = textOf(child)
        if (t.length > 1) out.push(t)
      } else {
        const t = textOf(child)
        if (!t) continue
        // 自定义组件里可以标 data-listen="read"，直接整段念
        if (child.dataset.listen === 'read') out.push(t)
        else walk(child)
      }
    }
  }
  walk(root)
  return out
}
