<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import { throttledWatch, promiseTimeout } from '@vueuse/core'
import { computed, onUnmounted, ref, toRefs } from 'vue'

import { animateCircle, animateFill, animateLine } from './animateFuncs'
import { circlePaint, extrusionPaint, fillPaint, heatmapPaint, linePaint } from './paintStyles'

// props
const props = defineProps({
  // a mapbox GL or MapLibre GL instance
  map: {
    type: Object,
    default: () => {},
  },
  // provide a unique ID for each feature
  uid: {
    type: String,
    required: true,
  },
  // set the layer type to circle, line, fill, heatmap, or fill-extrusion
  // access as "layer-type"
  layerType: {
    type: String,
    required: true,
    validator: function (val) {
      return ['circle', 'line', 'fill', 'heatmap', 'fill-extrusion'].indexOf(val) !== -1
    },
  },
  // geoJson feature (dynamic)
  feature: {
    type: Object,
    default: () => {},
  },
  // object of key - value pairs for the mapbox paint style (dynamic)
  paint: {
    type: Object,
    default: () => {},
  },
  // whether the object should be visible (dynamic)
  visible: {
    type: Boolean,
    default: true,
  },
  // whether to pulse the object (dynamic)
  // does not apply to heatmaps or fill-extrusions
  pulse: {
    type: Boolean,
    default: false,
  },
  // optional: an existing layer behind which to place this layer
  // access as "behind-layer"
  behindLayer: {
    type: String,
    default: null,
  },
})
// emits
const emit = defineEmits(['layer-added', 'layer-removed'])
const layoutBase = computed(() => {
  if (props.layerType === 'line') {
    return {
      visibility: 'visible',
      'line-cap': 'round',
      'line-join': 'round',
      'line-miter-limit': 2,
      'line-round-limit': 1.05,
    }
  } else {
    return {
      visibility: 'visible',
    }
  }
})
const paintMixed = computed(() => {
  if (props.layerType === 'circle') return Object.assign(circlePaint, props.paint)
  if (props.layerType === 'line') return Object.assign(linePaint, props.paint)
  if (props.layerType === 'fill') return Object.assign(fillPaint, props.paint)
  if (props.layerType === 'heatmap') return Object.assign(heatmapPaint, props.paint)
  return Object.assign(extrusionPaint, props.paint)
})
const updateGeom = () => {
  props.map.getSource(props.uid).setData(props.feature)
}
const removeFeature = () => {
  if (props.map && props.map.getLayer(props.uid)) {
    props.map.removeLayer(props.uid)
    emit('layer-removed', props.uid)
  }
  if (props.map && props.map.getSource(props.uid)) {
    props.map.removeSource(props.uid)
  }
}
const updatePaint = () => {
  if (!props.map.getLayer(props.uid)) return
  for (const [key, val] of Object.entries(paintMixed.value)) {
    props.map.setPaintProperty(props.uid, key, val)
  }
}
const updateVisible = () => {
  if (!props.map.getLayer(props.uid)) return
  if (props.visible) {
    props.map.setLayoutProperty(props.uid, 'visibility', 'visible')
  } else {
    props.map.setLayoutProperty(props.uid, 'visibility', 'none')
  }
}
const animateFunc = ref(null)
const cancelAnim = () => {
  if (!!animateFunc.value) {
    animateFunc.value.pause()
    animateFunc.value = null
  }
}
const updatePulse = () => {
  if (!props.pulse) return cancelAnim()
  if (!props.map.getLayer(props.uid)) return
  if (props.layerType === 'circle') {
    animateFunc.value = animateCircle(paintMixed.value, props.map, props.uid)
  } else if (props.layerType === 'line') {
    animateFunc.value = animateLine(paintMixed.value, props.map, props.uid)
  } else if (props.layerType === 'fill') {
    animateFunc.value = animateFill(paintMixed.value, props.map, props.uid)
  } else {
    cancelAnim()
  }
}
// functions
const loadGeom = () => {
  // add source
  props.map.addSource(props.uid, {
    type: 'geojson',
    data: props.feature,
  })
  // add layer
  props.map.addLayer(
    {
      id: props.uid,
      type: props.layerType,
      source: props.uid,
      layout: layoutBase.value,
      paint: paintMixed.value,
      transition: {
        duration: 0,
        delay: 0,
      },
    },
    props.behindLayer
  )
  // return the layer for reference from parent component
  emit('layer-added', props.uid)
  // trigger other updates
  updatePaint()
  updateVisible()
  updatePulse()
}
const loadHandler = async () => {
  while (true) {
    if (props.map.isStyleLoaded()) {
      loadGeom()
      break
    } else {
      await promiseTimeout(50)
    }
  }
}
const srcLoaded = ref(false)
const logicHandler = () => {
  if (!props.map) return
  if (!srcLoaded.value && feature.value) {
    // if not loaded and feature exists - then load
    srcLoaded.value = true
    loadHandler()
  } else if (srcLoaded.value && !feature.value) {
    // if already loaded but feature is removed
    srcLoaded.value = false
    removeFeature()
  } else if (srcLoaded.value && props.map.getLayer(props.uid)) {
    // if feature exists, update if layer is finished loading
    updateGeom()
  }
}
// logic
const { map, feature, paint, visible, pulse } = toRefs(props)
// trigger paint, visible, pulse once feature is loaded
const throttleRate = 20
// map or feature could be available first, so watch for both
throttledWatch(
  map,
  () => {
    logicHandler()
  },
  { immediate: true, throttle: throttleRate }
)
throttledWatch(
  feature,
  () => {
    logicHandler()
  },
  { immediate: true, throttle: throttleRate }
)
throttledWatch(
  paint,
  () => {
    updatePaint()
  },
  { throttle: throttleRate }
)
throttledWatch(
  visible,
  () => {
    updateVisible()
  },
  { throttle: throttleRate }
)
throttledWatch(
  pulse,
  () => {
    updatePulse()
  },
  { throttle: throttleRate }
)
// important for cleaning up old layers and avoiding style clashes
onUnmounted(() => {
  removeFeature()
})
</script>
