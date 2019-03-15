<template>
  <div>
    <vue-mapbox-map
      id="map-container"
      :access-token="accessToken"
      :interactive="false"
      :geocoder="false"
      :lng="lng"
      :lat="lat"
      :zoom="zoom"
      :pitch="pitch"
      @mapbox-ready="setMap"
    />
    <div v-if="map">
      <vue-mapbox-feature
        :map="map"
        :uid="'circle-example'"
        :layer-type="'circle'"
        :feature="pointGeom"
        :paint="circlePaint"
        :pulse="true"
      />
      <vue-mapbox-feature
        :map="map"
        :uid="'line-example'"
        :layer-type="'line'"
        :feature="lineGeom"
        :paint="linePaint"
        :pulse="false"
      />
      <vue-mapbox-feature
        :map="map"
        :uid="'poly-example'"
        :layer-type="'fill'"
        :feature="polyGeom"
        :paint="fillPaint"
        :pulse="false"
      />
    </div>
  </div>
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
  // mapbox and related geocoder and css files loaded in config.js head scripts
  import VueMapboxMap from 'vue-mapbox-map'
  import VueMapboxFeature from '../../../src/components/VueMapboxFeature'
  import bikeShelters from '../public/bikeShelters.json'
  import * as turf from '@turf/turf'

  export default {
    name: 'VueMapboxFeatureDemo',
    components: {
      VueMapboxMap,
      VueMapboxFeature
    },
    data () {
      return {
        computing: false,
        map: null,
        accessToken: 'pk.eyJ1Ijoic2hvbmdvbG9sbyIsImEiOiJjamVoN25yYTQxMXBwMzNuc2ZkeGk5eGtzIn0.ZQNxwHhtZDBfsVNjDL0c7A',
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
          'fill-color': '#a00037',
        }
      }
    },
    computed: {
      centreGeom () {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [this.lng, this.lat]
          }
        }
      },
      pointGeom () {
        return bikeShelters
      },
      lineGeom () {
        return turf.polygonToLine(this.polyGeom)
      },
      polyGeom () {
        let c = turf.concave(this.pointGeom)
        return turf.buffer(c, -this.buffer)
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      setMap (map) {
        this.map = map
      },
      handleScroll () {
        // https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
        if (!this.computing) {
          // use RAF to throttle function
          // use arrow function for "this" context
          // NB - avoid calls that will reflow the page...!
          window.requestAnimationFrame(() => {
            let off = Math.round(window.document.documentElement.scrollTop || document.body.scrollTop)
            this.buffer = this.baseBuffer + (Math.sin(off / 100) * 5)
            // reset
            this.computing = false
          })
          this.computing = true
        }
      }
    }
  }
</script>
