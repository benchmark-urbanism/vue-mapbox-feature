<template lang='pug'>
    div
</template>

<style lang='scss'>

</style>

<script>
  import * as TWEEN from 'es6-tween'

  TWEEN.autoPlay(true)

  export default {
    name: 'VueMapboxFeature',
    destroyed () {
      this.cleanup()
    },
    data () {
      return {
        animation: null
      }
    },
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
      // set the layer type to circle, line, or fill
      layerType: {
        type: String,
        required: true,
        validator: function (val) {
          return (val === 'circle' || val === 'line' || val === 'fill')
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
      pulse: {
        type: Boolean,
        default: false
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
        }
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
            'circle-radius-transition': {duration: 0},
            'circle-opacity-transition': {duration: 0},
            'circle-stroke-opacity-transition': {duration: 0}
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
            //'line-dasharray': [],
            // optional image sprite -> pass from calling component
            //'line-pattern': '',
            // required for animating
            'line-width-transition': {duration: 0},
            'line-opacity-transition': {duration: 0}
          }
        } else if (this.layerType === 'fill') {
          return {
            'fill-antialias': true,
            'fill-opacity': 1,
            'fill-color': '#000000',
            // disabled by fill-pattern, requires antialias
            // optional -> pass from calling component
            //'fill-outline-color': '#000000',
            'fill-translate': [0, 0],
            'fill-translate-anchor': 'map',
            // optional image sprite -> pass from calling component
            //'fill-pattern': '',
            // required for animating
            'fill-opacity-transition': {duration: 0}
          }
        }
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
              radius: this.paintMixed['circle-radius'] * 2 ,
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
            update: ({width, opacity}) => {
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
            update: ({opacity }) => {
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
        }
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
        handler (newVal) {
          this.setPaint()
        }
      },
      visible: {
        immediate: true,
        handler (newVal) {
          this.setVisibility()
        }
      },
      pulse: {
        // force with immediate
        immediate: true,
        handler(newVal) {
          this.setPulse()
        }
      }
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
              "duration": 0,
              "delay": 0
            }
          })
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
        if (this.pulse) {
          // removed nextTick prior to start - seems to work fine with autoPlay(true) ?
          this.animate = new TWEEN.Tween(this.tweenState.from)
            .to(this.tweenState.to, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
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
          this.map.removeLayer(this.uid)
        }
        if (this.map && this.map.getSource(this.uid)) {
          this.map.removeSource(this.uid)
        }
      }
    },
    destroyed () {
      // important for cleaning up old layers and avoiding style clashes
      this.cleanup()
    }
  }
</script>