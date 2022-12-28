<template lang="pug">
div.bg-dark-grey.py-3.rounded.border-mid-grey
  div.text-center
    div Scroll to see some map action!
  div#map-container
  VueMapboxFeature(
    :feature='bikeShelters',
    :layer-type='"circle"',
    :map='mapInstance',
    :paint='circlePaint',
    :pulse='true',
    :uid='"circle-example"'
  )
  VueMapboxFeature(
    :feature='polyGeom',
    :layer-type='"fill"',
    :map='mapInstance',
    :paint='fillPaint',
    :pulse='true',
    :uid='"poly-example"'
  )
  VueMapboxFeature(
    :feature='lineGeom',
    :layer-type='"line"',
    :map='mapInstance',
    :paint='linePaint',
    :pulse='true',
    :uid='"line-example"'
  )
</template>

<script setup>
import * as turf from '@turf/turf'
import { useWindowScroll } from '@vueuse/core'
import mapboxgl from 'mapbox-gl'
import { computed, markRaw, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

import bikeShelters from '../assets/bikeShelters.json'

import VueMapboxFeature from '../../../src/components/VueMapboxFeature.vue'

import 'mapbox-gl/dist/mapbox-gl.css'

const circlePaint = {
  'circle-radius': 5,
  'circle-color': '#29434e',
  'circle-opacity': 0.5,
  'circle-stroke-width': 2,
  'circle-stroke-color': '#29434e',
  'circle-stroke-opacity': 0.8,
}
const linePaint = {
  'line-opacity': 1,
  'line-color': '#29434e',
  'line-width': 4,
  'line-dasharray': [1, 2],
  'line-blur': 0,
}
const fillPaint = {
  'fill-opacity': 0.2,
  'fill-color': '#a00037',
}
const { x, y } = useWindowScroll()
const buffer = computed(() => Math.sin(y.value / 100) * 5)
const scene = reactive({
  lng: -73.99397182589848,
  lat: 40.687436325313655,
  zoom: 9,
  pitch: 0,
})
mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hvbmdvbG9sbyIsImEiOiJja2lubnc4ZWcxNTI2MzJxajhsa3NxcWtxIn0.gg7J040GTgBNook7aNclMQ'
const mapInstance = ref(null)
onMounted(() => {
  mapInstance.value = markRaw(
    new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [scene.lng, scene.lat],
      zoom: scene.zoom,
      pitch: scene.pitch,
      interactive: false,
    })
  )
})
const polyGeom = computed(() => {
  let c = turf.concave(bikeShelters)
  return turf.buffer(c, -buffer.value)
})
const lineGeom = computed(() => {
  return turf.polygonToLine(polyGeom.value)
})
</script>

<style lang="postcss" scoped>
#map-container {
  @apply my-3 h-[400px] max-h-[400px] min-h-[400px] w-full bg-theme;
}
</style>
