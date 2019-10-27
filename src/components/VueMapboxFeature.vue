<template>
  <div ref="geojsonFeatureDiv" />
</template>

<script>
import { Tween, Easing, autoPlay } from 'es6-tween'

export default {
  name: 'VueMapboxFeature',
  props: {
    // a mapbox GL JS instance
    map: {
      type: Object,
      required: true
    },
    // provide a unique ID for each feature
    uid: {
      type: String,
      required: true
    },
    // set the layer type to circle, line, fill, heatmap, or fill-extrusion
    // access as "layer-type"
    layerType: {
      type: String,
      required: true,
      validator: function (val) {
        return ['circle', 'line', 'fill', 'heatmap', 'fill-extrusion'].indexOf(val) !== -1
      }
    },
    // geoJson feature (dynamic)
    feature: {
      type: Object,
      default: () => {}
    },
    // object of key - value pairs for the mapbox paint style (dynamic)
    paint: {
      type: Object,
      default: () => {}
    },
    // whether the object should be visible (dynamic)
    visible: {
      type: Boolean,
      default: true
    },
    // whether to pulse the object (dynamic)
    // does not apply to heatmaps or fill-extrusions
    pulse: {
      type: Boolean,
      default: false
    },
    // optional: an existing layer behind which to place this layer
    // access as "behind-layer"
    behindLayer: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      animation: null
    }
  },
  computed: {
    // base and prop paint properties need to be combined
    paintMixed () {
      return Object.assign(this.paintBase, this.paint)
    },
    layoutBase () {
      if (this.layerType === 'circle') {
        return {
          'visibility': 'visible'
        }
      } else if (this.layerType === 'line') {
        return {
          'visibility': 'visible',
          'line-cap': 'round',
          'line-join': 'round',
          'line-miter-limit': 2,
          'line-round-limit': 1.05
        }
      } else if (this.layerType === 'fill') {
        return {
          'visibility': 'visible'
        }
      } else if (this.layerType === 'heatmap') {
        return {
          'visibility': 'visible'
        }
      } else if (this.layerType === 'fill-extrusion') {
        return {
          'visibility': 'visible'
        }
      } else return console.warn('layerType must match one of "circle", "line", "fill", "heatmap", or "fill-extrusion"')
    },
    paintBase () {
      if (this.layerType === 'circle') {
        return {
          'circle-radius': 5,
          'circle-color': '#000000',
          'circle-blur': 0,
          'circle-opacity': 1,
          'circle-translate': [0, 0],
          'circle-translate-anchor': 'map',
          'circle-pitch-scale': 'map',
          'circle-stroke-width': 0,
          'circle-stroke-color': '#000000',
          'circle-stroke-opacity': 1,
          // required for animating
          'circle-radius-transition': { duration: 0 },
          'circle-opacity-transition': { duration: 0 },
          'circle-stroke-opacity-transition': { duration: 0 }
        }
      } else if (this.layerType === 'line') {
        return {
          'line-opacity': 1,
          'line-color': '#000000',
          'line-translate': [0, 0],
          'line-translate-anchor': 'map',
          'line-width': 1,
          'line-gap-width': 0,
          'line-offset': 0,
          'line-blur': 0,
          // optional dasharray -> pass from calling component
          // 'line-dasharray': [],
          // optional image sprite -> pass from calling component
          // 'line-pattern': '',
          // required for animating
          'line-width-transition': { duration: 0 },
          'line-opacity-transition': { duration: 0 }
        }
      } else if (this.layerType === 'fill') {
        return {
          'fill-antialias': true,
          'fill-opacity': 1,
          'fill-color': '#000000',
          // disabled by fill-pattern, requires antialias
          // optional -> pass from calling component
          // 'fill-outline-color': '#000000',
          'fill-translate': [0, 0],
          'fill-translate-anchor': 'map',
          // optional image sprite -> pass from calling component
          // 'fill-pattern': '',
          // required for animating
          'fill-opacity-transition': { duration: 0 }
        }
      } else if (this.layerType === 'heatmap') {
        return {
          // Optional number greater than or equal to 1. Units in pixels. Defaults to 30. Transitionable.
          // Radius of influence of one heatmap point in pixels.
          // Increasing the value makes the heatmap smoother, but less detailed.
          'heatmap-radius': 30,
          // Optional number greater than or equal to 0. Defaults to 1.
          // A measure of how much an individual point contributes to the heatmap.
          // A value of 10 would be equivalent to having 10 points of weight 1 in the same spot.
          // Especially useful when combined with clustering.
          'heatmap-weight': 1,
          // Optional number greater than or equal to 0. Defaults to 1. Transitionable.
          // Similar to heatmap-weight but controls the intensity of the heatmap globally.
          // Primarily used for adjusting the heatmap based on zoom level.
          'heatmap-intensity': 1,
          // Defines the color of each pixel based on its density value in a heatmap.
          // Should be an expression that uses ["heatmap-density"] as input.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.1, 'royalblue',
            0.3, 'cyan',
            0.5, 'lime',
            0.7, 'yellow',
            1, 'red'
          ],
          // Optional number between 0 and 1 inclusive. Defaults to 1. Transitionable.
          // The global opacity at which the heatmap layer will be drawn
          'heatmap-opacity': 1
        }
      } else if (this.layerType === 'fill-extrusion') {
        return {
          // Optional number between 0 and 1 inclusive. Defaults to 1. Transitionable.
          // The opacity of the entire fill extrusion layer.
          // This is rendered on a per-layer, not per-feature, basis, and data-driven styling is not available.
          'fill-extrusion-opacity': 1,
          // Optional color. Defaults to "#000000". Disabled by fill-extrusion-pattern. Transitionable.
          // The base color of the extruded fill.
          // The extrusion's surfaces will be shaded differently based on this color in combination with the root light settings.
          // If this color is specified as rgba with an alpha component, the alpha component will be ignored;
          // use fill-extrusion-opacity to set layer opacity.
          'fill-extrusion-color': '#000000',
          // Optional array of numbers. Units in pixels. Defaults to [0,0]. Transitionable.
          // The geometry's offset. Values are [x, y] where negatives indicate left and up (on the flat plane), respectively.
          'fill-extrusion-translate': [0, 0],
          // Optional enum. One of "map", "viewport". Defaults to "map". Requires fill-extrusion-translate.
          // Controls the frame of reference for fill-extrusion-translate.
          // "map": The fill extrusion is translated relative to the map.
          // "viewport": The fill extrusion is translated relative to the viewport.
          'fill-extrusion-translate-anchor': 'map',
          // Optional string. Transitionable.
          // Name of image in sprite to use for drawing images on extruded fills.
          // For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512).
          // Note that zoom-dependent expressions will be evaluated only at integer zoom levels.
          // 'fill-extrusion-pattern': '',
          // Optional number greater than or equal to 0. Units in meters. Defaults to 0. Transitionable.
          // The height with which to extrude this layer.
          'fill-extrusion-height': 0,
          // Optional number greater than or equal to 0. Units in meters. Defaults to 0.
          // Requires fill-extrusion-height. Transitionable.
          // The height with which to extrude the base of this layer. Must be less than or equal to fill-extrusion-height.
          'fill-extrusion-base': 0,
          // Optional boolean. Defaults to true.
          // Whether to apply a vertical gradient to the sides of a fill-extrusion layer.
          // If true, sides will be shaded slightly darker farther down.
          'fill-extrusion-vertical-gradient': true
        }
      } else return console.warn('layerType must match one of "circle", "line", "fill", "heatmap", or "fill-extrusion"')
    },
    tweenState () {
      if (this.layerType === 'circle') {
        return {
          from: {
            radius: this.paintMixed['circle-radius'],
            opacity: this.paintMixed['circle-opacity'],
            strokeOpacity: this.paintMixed['circle-stroke-opacity']
          },
          to: {
            radius: this.paintMixed['circle-radius'] * 2,
            opacity: this.paintMixed['circle-opacity'] / 4,
            strokeOpacity: this.paintMixed['circle-stroke-opacity'] / 2
          },
          update: ({ radius, opacity, strokeOpacity }) => {
            if (this.map && this.map.getLayer(this.uid)) {
              this.map.setPaintProperty(this.uid, 'circle-radius', radius)
              this.map.setPaintProperty(this.uid, 'circle-opacity', opacity)
              this.map.setPaintProperty(this.uid, 'circle-stroke-opacity', strokeOpacity)
            }
          },
          complete: () => {
            if (this.map && this.map.getLayer(this.uid)) {
              this.map.setPaintProperty(this.uid, 'circle-radius', this.paintMixed['circle-radius'])
              this.map.setPaintProperty(this.uid, 'circle-opacity', this.paintMixed['circle-opacity'])
              this.map.setPaintProperty(this.uid, 'circle-stroke-opacity', this.paintMixed['circle-stroke-opacity'])
            }
          },
          yoyo: true
        }
      } else if (this.layerType === 'line') {
        return {
          from: {
            width: this.paintMixed['line-width'],
            opacity: this.paintMixed['line-opacity']
          },
          to: {
            width: this.paintMixed['line-width'] * 1.1,
            opacity: this.paintMixed['line-opacity'] / 2
          },
          update: ({ width, opacity }) => {
            if (this.map && this.map.getLayer(this.uid)) {
              this.map.setPaintProperty(this.uid, 'line-width', width)
              this.map.setPaintProperty(this.uid, 'line-opacity', opacity)
            }
          },
          complete: () => {
            if (this.map && this.map.getLayer(this.uid)) {
              this.map.setPaintProperty(this.uid, 'line-width', this.paintMixed['line-width'])
              this.map.setPaintProperty(this.uid, 'line-opacity', this.paintMixed['line-opacity'])
            }
          },
          yoyo: true
        }
      } else if (this.layerType === 'fill') {
        return {
          from: {
            opacity: this.paintMixed['fill-opacity']
          },
          to: {
            opacity: this.paintMixed['fill-opacity'] * 0.75
          },
          update: ({ opacity }) => {
            if (this.map && this.map.getLayer(this.uid)) {
              this.map.setPaintProperty(this.uid, 'fill-opacity', opacity)
            }
          },
          complete: () => {
            if (this.map && this.map.getLayer(this.uid)) {
              this.map.setPaintProperty(this.uid, 'fill-opacity', this.paintMixed['fill-opacity'])
            }
          },
          yoyo: true
        }
      } else if (this.layerType === 'heatmap') {
        return null
      } else if (this.layerType === 'fill-extrusion') {
        return null
      } else return console.warn('layerType must match one of "circle", "line", "fill", "heatmap", or "fill-extrusion"')
    }
  },
  watch: {
    feature: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal && (newVal !== oldVal)) {
          this.setGeom()
        } else if (!newVal) {
          this.cleanup()
        }
      }
    },
    paint: {
      immediate: true,
      handler () {
        this.setPaint()
      }
    },
    visible: {
      immediate: true,
      handler () {
        this.setVisibility()
      }
    },
    pulse () {
      // no need for immediate - autoPlay has to load first, so trigger from mounted...
      this.setPulse()
    }
  },
  mounted () {
    autoPlay(true)
    this.setPulse()
  },
  destroyed () {
    // important for cleaning up old layers and avoiding style clashes
    this.cleanup()
  },
  methods: {
    setGeom () {
      if (this.map && this.map.getSource(this.uid)) {
        this.map.getSource(this.uid).setData(this.feature)
      } else if (this.map) {
        // addSource requires uid and source object
        this.map.addSource(this.uid, {
          'type': 'geojson',
          'data': this.feature
        })
        this.map.addLayer({
          'id': this.uid,
          'type': this.layerType,
          'source': this.uid,
          'layout': this.layoutBase,
          'paint': this.paintMixed,
          'transition': {
            'duration': 0,
            'delay': 0
          }
        }, this.behindLayer)
        // return the layer for reference from parent component
        this.$emit('layer-added', this.uid)
      } else {
        console.warn('NOTE -> unable to set feature collection geom')
      }
    },
    // needs testing
    setPaint () {
      if (this.paint) {
        for (let [key, value] of Object.entries(this.paint)) {
          // update base paint object
          this.paintBase[key] = value
          if (this.map && this.map.getLayer(this.uid)) {
            // update current layer
            this.map.setPaintProperty(this.uid, key, value)
          }
        }
      }
    },
    setVisibility () {
      if (this.visible) {
        this.layoutBase.visibility = 'visible'
        if (this.map && this.map.getLayer(this.uid)) {
          this.map.setLayoutProperty(this.uid, 'visibility', 'visible')
        }
      } else {
        this.layoutBase.visibility = 'none'
        if (this.map && this.map.getLayer(this.uid)) {
          this.map.setLayoutProperty(this.uid, 'visibility', 'none')
        }
      }
    },
    setPulse () {
      if (this.pulse && ['circle', 'line', 'fill'].indexOf(this.layerType) !== -1) {
        // removed nextTick prior to start - seems to work fine with autoPlay(true) ?
        this.animate = new Tween(this.tweenState.from)
          .to(this.tweenState.to, 1000)
          .easing(Easing.Quadratic.InOut)
          .repeat(Infinity)
          .yoyo(this.tweenState.yoyo)
          .on('update', this.tweenState.update)
          .on('stop', this.tweenState.complete)
          .on('complete', this.tweenState.complete)
          .start()
      } else if (this.animate) {
        this.animate.stop()
      }
    },
    cleanup () {
      if (this.map && this.map.getLayer(this.uid)) {
        this.$emit('layer-removed', this.uid)
        this.map.removeLayer(this.uid)
      }
      if (this.map && this.map.getSource(this.uid)) {
        this.map.removeSource(this.uid)
      }
    }
  }
}
</script>
