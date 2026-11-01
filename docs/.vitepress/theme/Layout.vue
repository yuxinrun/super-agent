<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HeroDiagram from './components/HeroDiagram.vue'
import BrandMark from './components/BrandMark.vue'
import ListenBar from './components/ListenBar.vue'

const { Layout } = DefaultTheme
const { page } = useData()
</script>

<template>
  <!-- 页面切换淡入淡出：key 挂在 relativePath 上，换页才触发，锚点跳转不触发 -->
  <Transition name="sa-page" mode="out-in">
    <Layout :key="page.relativePath">
      <template #home-hero-image><HeroDiagram /></template>
      <template #home-hero-info-before><BrandMark variant="pill" /></template>
      <template #layout-bottom><ListenBar /></template>
    </Layout>
  </Transition>
</template>
