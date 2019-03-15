vue-mapbox-feature
==================

A minimalist [Vue](https://vuejs.org/) component for displaying dynamic geojson on a [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) map.

::: tip
See the complementary [vue-mapbox-map](https://cityseer.github.io/vue-mapbox-map/) repo for dynamic Mapbox GL JS maps.
:::


Demo
----

<Demo/>


Setup for web usage
-------------------

For direct usage from a webpage, import the Mapbox GL JS scripts & stylesheets as well as [ES6 Tween](https://es6-tween.js.org/): then import the `VueMapboxFeature` script. This will add `VueMapboxFeature` to the global namespace, which in-turn depends on `TWEEN` and is displayed via a `VueMapboxMap` instance:

```html
<!-- mapbox -->
<link rel='stylesheet' type='text/css' href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css'/>
<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.js'></script>
<!-- VueMapboxMap -->
<script src='https://unpkg.com/vue-mapbox-map@latest/dist/VueMapboxMap.umd.js'></script>
<!-- vue-mapbox-feature -->
<script src='https://unpkg.com/es6-tween@latest/bundled/Tween.min.js'></script>
<script src='https://npmcdn.com/@turf/turf/turf.min.js'></script>
<script src='https://unpkg.com/vue-mapbox-feature@latest/dist/VueMapboxFeature.umd.js'></script>
```

Web usage [example](https://cityseer.github.io/vue-mapbox-feature/test.html) and [source](https://github.com/cityseer/vue-mapbox-feature/blob/master/docs/.vuepress/public/test.html).


Setup for module usage
----------------------

To use the module in your application, install via `yarn` or `npm`:
```
yarn add vue-mapbox-feature
```

Import the component
```javascript
import VueMapboxFeature from 'vue-mapbox-feature'
```

::: tip

See [vue-mapbox-map](https://cityseer.github.io/vue-mapbox-map/) for how to import and instance `VueMapboxMap`.

:::


General Usage
-------------

Register the component:
```js
components: {
  'vue-mapbox-feature': VueMapboxFeature
}
```

When using the component in your `html`, use a `v-if` directive to stall the feature from loading until the target map instance is ready. Else, if you are using multiple `vue-mapbox-features`, then place these inside a parent `div` with a `v-if` directive:
```html
<vue-mapbox-map id='map-container'
  :access-token='accessToken'
  :lng='lng'
  :lat='lat'
  @mapbox-ready='setMap'
></vue-mapbox-map>

<vue-mapbox-feature
  v-if='map'
  :map='map'
  :uid='"circle-example"'
  :layer-type='"circle"'
  :feature='pointGeom'
  :paint='circlePaint'
></vue-mapbox-feature>
```

Provide a unique ID to each `vue-mapbox-feature` and specify whether the `layer-type` is a `circle`, `line`, or `fill`.

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

API
---
The component's props / API is as follows:
```javascript
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
}
```

Paint Styles
------------
Default no-frills paint styles are provided by default, you'll probably want to override these with your own styling, which can also be updated dynamically.

The following default values can be overriden by passing an object to the `paint-style` directive:
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
```

Additional Functionality
------------------------
Please use the issues tracker to request exposing any additional functionality.