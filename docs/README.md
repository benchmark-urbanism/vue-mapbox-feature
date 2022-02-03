# VueMapboxFeature

A minimalist [Vue](https://vuejs.org/) component for displaying dynamic geojson on a [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) or [MapLibre GL](https://github.com/maplibre/maplibre-gl-js) maps.

::: tip
See the complementary [vue-mapbox-map](https://benchmark-urbanism.github.io/vue-mapbox-map/) repo for dynamic Mapbox GL JS maps.
:::

## Demo

<ClientOnly>
<Demo/>
</ClientOnly>

## Setup

> See the documentation's [demo](https://github.com/benchmark-urbanism/vue-mapbox-feature/blob/master/docs/.vuepress/components/Demo.vue) component for a complete example.

Install via `yarn` or `npm`:

```
yarn add @benchmark-urbanism/vue-mapbox-feature
```

## General Usage

Import the `VueMapboxFeature` component:

```js
import VueMapboxFeature from '@benchmark-urbanism/vue-mapbox-feature'
```

Once imported, the `VueMapboxFeature` tag will be available for use.

```html
<VueMapboxFeature
  :map="mapInstance"
  :uid='"circle-example"'
  :layer-type='"circle"'
  :feature="bikeShelters"
  :paint="circlePaint"
  :pulse="true"
></VueMapboxFeature>
```

A `mapbox-gl` or `maplibre-gl` instance must be provided: these should be installed and instanced in accordance with standard procedures. For example:

```js
mapboxgl.accessToken = this.accessToken
this.mapInstance = new mapboxgl.Map({
  container: 'map-container',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [this.lng, this.lat],
  zoom: this.zoom,
  bearing: this.bearing,
  pitch: this.pitch,
})
```

Provide a unique ID to each `VueMapboxFeature` and specify whether the `layer-type` is a `circle`, `line`, `fill`, `heatmap`, or `fill-extrusion`.

::: tip

Use `circle` layer types for `GeoJSON` points, `line` for linestrings, and `fill` for polygons.

:::

Load or generate a `geoJSON` feature for binding to the component's `v-bind:feature` directive. Custom styling can be provided to the component's `v-bind:paint` directive. These can be controlled from the component's data context, e.g.:

```javascript
data: {
  map: null,
  circlePaint: {
    'circle-radius': 5,
    'circle-color': '#29434e',
    'circle-opacity': 0.5,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#29434e',
    'circle-stroke-opacity': 0.8
  }
},
computed: {
  pointGeom () {
    // NOTE: you can use turf.js to dynamically generate geojson as computed properties
    return pointGeoJSON
  }
}
```

## API

The component's props / API is as follows:

```js
// a mapbox GL or MapLibre GL instance
map: {
  type: Object,
  default: () => {}
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
  validator: function(val) {
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
},
```

## Paint Styles

Default no-frills paint styles are provided by default, you'll probably want to override these with your own styling, which can also be updated dynamically.

The following default values can be overridden by passing an object to the `paint-style` directive:

```javascript
// circle layers:
{
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
  'circle-radius-transition': {duration: 0},
  'circle-opacity-transition': {duration: 0},
  'circle-stroke-opacity-transition': {duration: 0}
}

// line layers:
{
  'line-opacity': 1,
  'line-color': '#000000',
  'line-translate': [0, 0],
  'line-translate-anchor': 'map',
  'line-width': 1,
  'line-gap-width': 0,
  'line-offset': 0,
  'line-blur': 0,
  'line-width-transition': {duration: 0},
  'line-opacity-transition': {duration: 0}
}

// fill layers:
{
  'fill-antialias': true,
  'fill-opacity': 1,
  'fill-color': '#000000',
  'fill-translate': [0, 0],
  'fill-translate-anchor': 'map',
  'fill-opacity-transition': {duration: 0}
}

// heatmap layers:
{
  'heatmap-radius': 30,
  'heatmap-weight': 1,
  'heatmap-intensity': 1,
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
  'heatmap-opacity': 1
}

// fill-extrusion layers:
{
  'fill-extrusion-opacity': 1,
  'fill-extrusion-color': '#000000',
  'fill-extrusion-translate': [0, 0],
  'fill-extrusion-translate-anchor': 'map',
  'fill-extrusion-height': 0,
  'fill-extrusion-base': 0,
  'fill-extrusion-vertical-gradient': true
}
```

A `@layer-added` event, with layer uid as parameter, is emitted when the layer has been added to the map. This information can be used for subsequent interaction with the layer, such as adding layer specific events.

A `@layer-removed` event, again with layer uid as parameter, is emitted when the layer has been removed.
