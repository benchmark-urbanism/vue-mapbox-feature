<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted, watchEffect, useSlots } from 'vue'

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
// mix paint
const paintMixed = computed(() => {
  if (props.layerType === 'circle') {
    return Object.assign(circlePaint, props.paint)
  } else if (props.layerType === 'line') {
    return Object.assign(linePaint, props.paint)
  } else if (props.layerType === 'fill') {
    return Object.assign(fillPaint, props.paint)
  } else if (props.layerType === 'heatmap') {
    return Object.assign(heatmapPaint, props.paint)
  } else if (props.layerType === 'fill-extrusion') {
    return Object.assign(extrusionPaint, props.paint)
  } else {
    return console.warn(
      'layerType must match one of "circle", "line", "fill", "heatmap", or "fill-extrusion"'
    )
  }
})
watchEffect(() => {
  if (props.map) {
    if (!props.map.getLayer(props.uid)) return
    for (const [key, val] in Object.entries(paintMixed.value)) {
      props.map.setPaintProperty(props.uid, key, val)
    }
  }
})
const layoutBase = computed(() => {
  if (props.layerType === 'circle') {
    return {
      visibility: 'visible',
    }
  } else if (props.layerType === 'line') {
    return {
      visibility: 'visible',
      'line-cap': 'round',
      'line-join': 'round',
      'line-miter-limit': 2,
      'line-round-limit': 1.05,
    }
  } else if (props.layerType === 'fill') {
    return {
      visibility: 'visible',
    }
  } else if (props.layerType === 'heatmap') {
    return {
      visibility: 'visible',
    }
  } else if (props.layerType === 'fill-extrusion') {
    return {
      visibility: 'visible',
    }
  } else
    return console.warn(
      'layerType must match one of "circle", "line", "fill", "heatmap", or "fill-extrusion"'
    )
})
watchEffect(() => {
  if (props.visible) {
    layoutBase.value.visibility = 'visible'
    if (props.map && props.map.getLayer(props.uid)) {
      props.map.setLayoutProperty(props.uid, 'visibility', 'visible')
    }
  } else {
    layoutBase.value.visibility = 'none'
    if (props.map && props.map.getLayer(props.uid)) {
      props.map.setLayoutProperty(props.uid, 'visibility', 'none')
    }
  }
})
const animateFunc = ref(null)
watchEffect(() => {
  if (props.pulse) {
    if (props.layerType === 'circle') {
      animateFunc.value = animateCircle(paintMixed.value, props)
    } else if (props.layerType === 'line') {
      animateFunc.value = animateLine(paintMixed.value, props)
    } else if (props.layerType === 'fill') {
      animateFunc.value = animateFill(paintMixed.value, props)
    } else {
      animateFunc.value = null
    }
  } else {
    if (animateFunc.value) {
      animateFunc.value.pause()
      animateFunc.value = null
    }
  }
})
watchEffect(() => {
  //
  if (!props.feature) {
    cleanup()
  } else if (props.map.isStyleLoaded()) {
    setGeom()
  } else {
    props.map.on('style.load', () => {
      setGeom()
    })
  }
})
const setGeom = () => {
  if (props.map && props.map.getSource(props.uid)) {
    props.map.getSource(props.uid).setData(props.feature)
  } else if (props.map) {
    // addSource requires props.uid and source object
    props.map.addSource(props.uid, {
      type: 'geojson',
      data: props.feature,
    })
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
  } else {
    console.warn('NOTE -> unable to set feature collection geom')
  }
}
const cleanup = () => {
  if (props.map && props.map.getLayer(props.uid)) {
    emit('layer-removed', props.uid)
    props.map.removeLayer(props.uid)
  }
  if (props.map && props.map.getSource(props.uid)) {
    props.map.removeSource(props.uid)
  }
}
onUnmounted(() => {
  // important for cleaning up old layers and avoiding style clashes
  cleanup()
})
</script>
