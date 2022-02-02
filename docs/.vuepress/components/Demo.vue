<template lang="pug">
#map-container
ClientOnly
  div(v-if='mapInstance')
    VueMapboxFeature(
      :map='mapInstance'
      :uid='"circle-example"'
      :layer-type='"circle"'
      :feature='bikeShelters'
      :paint='circlePaint'
      :pulse='true'
    )
  div(v-if='mapInstance')
    VueMapboxFeature(
      :map='mapInstance'
      :uid='"poly-example"'
      :layer-type='"fill"'
      :feature='polyGeom'
      :paint='fillPaint'
      :pulse='true'
    )
  div(v-if='mapInstance')
    VueMapboxFeature(
      :map='mapInstance'
      :uid='"line-example"'
      :layer-type='"line"'
      :feature='lineGeom'
      :paint='linePaint'
      :pulse='true'
    )
</template>

<script setup>
import * as turf from '@turf/turf'
import { useScroll } from '@vueuse/core'
import mapboxgl from 'mapbox-gl'
import { computed, markRaw, onMounted, onUnmounted, reactive, ref, watch, toRef } from 'vue'

import bikeShelters from '../public/bikeShelters.json'

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
const { x, y, isScrolling, arrivedState, directions } = useScroll(window, {
  throttle: 20,
})
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

<style scoped>
#map-container {
  position: relative;
  margin: 20px 0 20px 0;
  width: 100%;
  min-height: 400px;
}
</style>
