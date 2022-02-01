<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, markRaw, onUnmounted, ref, toRefs, watch, watchEffect } from 'vue'

import { animateCircle, animateFill, animateLine } from './animateFuncs'
import { circlePaint, extrusionPaint, fillPaint, heatmapPaint, linePaint } from './paintStyles'

// props
const props = defineProps({
  // a mapbox GL or MapLibre GL instance
  map: {
    type: Object,
    required: true,
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
// destructure props with reactivity
const { map, uid, layerType, feature, paint, visible, pulse, behindLayer } = toRefs(props)
const mapRaw = markRaw(map.value)
// mix paint
const paintMixed = computed(() => {
  if (layerType.value === 'circle') {
    return Object.assign(circlePaint, paint.value)
  } else if (layerType.value === 'line') {
    return Object.assign(linePaint, paint.value)
  } else if (layerType.value === 'fill') {
    return Object.assign(fillPaint, paint.value)
  } else if (layerType.value === 'heatmap') {
    return Object.assign(heatmapPaint, paint.value)
  } else if (layerType.value === 'fill-extrusion') {
    return Object.assign(extrusionPaint, paint.value)
  } else {
    return console.warn(
      'layerType must match one of "circle", "line", "fill", "heatmap", or "fill-extrusion"'
    )
  }
})
watchEffect(() => {
  if (!mapRaw.getLayer(uid.value)) return
  for (const [key, val] in Object.entries(paintMixed.value)) {
    mapRaw.setPaintProperty(uid.value, key, val)
  }
})
const layoutBase = computed(() => {
  if (layerType.value === 'circle') {
    return {
      visibility: 'visible',
    }
  } else if (layerType.value === 'line') {
    return {
      visibility: 'visible',
      'line-cap': 'round',
      'line-join': 'round',
      'line-miter-limit': 2,
      'line-round-limit': 1.05,
    }
  } else if (layerType.value === 'fill') {
    return {
      visibility: 'visible',
    }
  } else if (layerType.value === 'heatmap') {
    return {
      visibility: 'visible',
    }
  } else if (layerType.value === 'fill-extrusion') {
    return {
      visibility: 'visible',
    }
  } else
    return console.warn(
      'layerType must match one of "circle", "line", "fill", "heatmap", or "fill-extrusion"'
    )
})
watch(
  visible,
  () => {
    if (visible.value) {
      layoutBase.value.visibility = 'visible'
      if (mapRaw && mapRaw.getLayer(uid.value)) {
        mapRaw.setLayoutProperty(uid.value, 'visibility', 'visible')
      }
    } else {
      layoutBase.value.visibility = 'none'
      if (mapRaw && mapRaw.getLayer(uid.value)) {
        mapRaw.setLayoutProperty(uid.value, 'visibility', 'none')
      }
    }
  },
  {
    immediate: true,
  }
)
const animateFunc = ref(null)
watch(
  pulse,
  () => {
    if (pulse.value) {
      if (layerType.value === 'circle') {
        animateFunc.value = animateCircle(paintMixed.value, mapRaw, uid.value)
      } else if (layerType.value === 'line') {
        animateFunc.value = animateLine(paintMixed.value, mapRaw, uid.value)
      } else if (layerType.value === 'fill') {
        animateFunc.value = animateFill(paintMixed.value, mapRaw, uid.value)
      } else {
        animateFunc.value = null
      }
    } else {
      if (animateFunc.value) {
        animateFunc.value.pause()
        animateFunc.value = null
      }
    }
  },
  {
    immediate: true,
  }
)
const firstLoad = ref(true)
watch(
  feature,
  () => {
    if (!feature.value) {
      cleanup()
    } else if (!firstLoad.value) {
      setGeom()
    } else if (mapRaw.isStyleLoaded()) {
      setGeom()
    } else {
      mapRaw.on('style.load', () => {
        setGeom()
      })
    }
  },
  {
    immediate: true,
  }
)
const setGeom = () => {
  if (firstLoad.value) firstLoad.value = false
  if (mapRaw && mapRaw.getSource(uid.value)) {
    // if geom already exists -> update data
    mapRaw.getSource(uid.value).setData(feature.value)
  } else if (mapRaw) {
    // otherwise -> add from scratch
    // add source
    mapRaw.addSource(uid.value, {
      type: 'geojson',
      data: feature.value,
    })
    // add layer
    mapRaw.addLayer(
      {
        id: uid.value,
        type: layerType.value,
        source: uid.value,
        layout: layoutBase.value,
        paint: paintMixed.value,
        transition: {
          duration: 0,
          delay: 0,
        },
      },
      behindLayer.value
    )
    // return the layer for reference from parent component
    emit('layer-added', uid.value)
  } else {
    console.warn('NOTE -> unable to set feature collection geom')
  }
}
const cleanup = () => {
  if (mapRaw && mapRaw.getLayer(uid.value)) {
    emit('layer-removed', uid.value)
    mapRaw.removeLayer(uid.value)
  }
  if (mapRaw && mapRaw.getSource(uid.value)) {
    mapRaw.removeSource(uid.value)
  }
}
onUnmounted(() => {
  // important for cleaning up old layers and avoiding style clashes
  cleanup()
})
</script>
