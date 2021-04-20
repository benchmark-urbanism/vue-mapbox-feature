<template lang="pug">
  div
    div#map-container
      ClientOnly
        div(v-if='mapInstance')
          VueMapboxFeature(
            :map="mapInstance"
            :uid="'circle-example'"
            :layer-type="'circle'"
            :feature="pointGeom"
            :paint="circlePaint"
            :pulse="true"
          )
          VueMapboxFeature(
            :map="mapInstance"
            :uid="'line-example'"
            :layer-type="'line'"
            :feature="lineGeom"
            :paint="linePaint"
            :pulse="false"
          )
          VueMapboxFeature(
            :map="mapInstance"
            :uid="'poly-example'"
            :layer-type="'fill'"
            :feature="polyGeom"
            :paint="fillPaint"
            :pulse="false"
          )
</template>

<style scoped>
#map-container {
  position: relative;
  margin: 20px 0 20px 0;
  width: 100%;
  min-height: 400px;
}
</style>

<script>
import bikeShelters from '../public/bikeShelters.json'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as turf from '@turf/turf'
import VueMapboxFeature from '../../../src/components/VueMapboxFeature'

export default {
  name: 'VueMapboxFeatureDemo',
  components: {
    VueMapboxFeature
  },
  data() {
    return {
      computing: false,
      mapInstance: null,
      accessToken:
        'pk.eyJ1Ijoic2hvbmdvbG9sbyIsImEiOiJja2lubnc4ZWcxNTI2MzJxajhsa3NxcWtxIn0.gg7J040GTgBNook7aNclMQ',
      lng: -73.99397182589848,
      lat: 40.687436325313655,
      zoom: 9,
      pitch: 0,
      baseBuffer: 0,
      buffer: 0,
      circlePaint: {
        'circle-radius': 5,
        'circle-color': '#29434e',
        'circle-opacity': 0.5,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#29434e',
        'circle-stroke-opacity': 0.8
      },
      linePaint: {
        'line-opacity': 1,
        'line-color': '#29434e',
        'line-width': 4,
        'line-dasharray': [1, 2],
        'line-blur': 0
      },
      fillPaint: {
        'fill-opacity': 0.2,
        'fill-color': '#a00037'
      }
    }
  },
  computed: {
    centreGeom() {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [this.lng, this.lat]
        }
      }
    },
    pointGeom() {
      return bikeShelters
    },
    lineGeom() {
      return turf.polygonToLine(this.polyGeom)
    },
    polyGeom() {
      let c = turf.concave(this.pointGeom)
      return turf.buffer(c, -this.buffer)
    }
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken
    this.mapInstance = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [this.lng, this.lat],
      zoom: this.zoom,
      pitch: this.pitch
    })
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      // https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
      if (!this.computing) {
        // use RAF to throttle function
        // use arrow function for "this" context
        // NB - avoid calls that will reflow the page...!
        window.requestAnimationFrame(() => {
          let off = Math.round(window.document.documentElement.scrollTop || document.body.scrollTop)
          this.buffer = this.baseBuffer + Math.sin(off / 100) * 5
          // reset
          this.computing = false
        })
        this.computing = true
      }
    }
  }
}
</script>
