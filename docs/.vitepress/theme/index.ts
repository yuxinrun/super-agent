import DefaultTheme from 'vitepress/theme'
import PageLayout from './Layout.vue'
import HeroDiagram from './components/HeroDiagram.vue'
import LayerArch from './components/LayerArch.vue'
import EventPath from './components/EventPath.vue'
import MetricGrid from './components/MetricGrid.vue'
import FourTraits from './components/FourTraits.vue'
import BorrowGrid from './components/BorrowGrid.vue'
import BrandMark from './components/BrandMark.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: PageLayout,
  enhanceApp({ app }) {
    app.component('BrandMark', BrandMark)
    app.component('HeroDiagram', HeroDiagram)
    app.component('LayerArch', LayerArch)
    app.component('EventPath', EventPath)
    app.component('MetricGrid', MetricGrid)
    app.component('FourTraits', FourTraits)
    app.component('BorrowGrid', BorrowGrid)
  }
}
