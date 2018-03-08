vue-mapbox-feature
==================
This is a [Vue](https://vuejs.org/) component for inserting dynamic `geoJSON` features into [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) maps.

Live demo: [vue-mapbox-feature](https://cityseer.github.io/vue-mapbox-feature/). (Source: [docs/index.html](docs/index.html))

See the complementary [vue-mapbox-map](https://github.com/cityseer/vue-mapbox-map) repo for dynamic Mapbox GL JS maps.

1. [Web Usage](#web-usage)
1. [Module Usage](#module-usage)
1. [General Usage](#general-usage)
1. [API](#api)
1. [Paint Styles](#paint-styles)
1. [Requests](#requests)

Web Usage
---------
To use from the web, import the es6 Tween script, then import the `vue-mapbox-feature` script. This will add `VueMapboxFeature` to the global namespace, which in turn depends on `TWEEN`:
```html
    <script src='https://unpkg.com/es6-tween@latest/bundled/Tween.min.js'></script>
    <script src='https://unpkg.com/vue-mapbox-feature@latest/dist/vue-mapbox-feature.umd.js'></script>
```

Module Usage
------------
To use the module in your application, install via `yarn` or `npm`:
```
yarn add vue-mapbox-feature
```
You can then import the component into your app:
```javascript
import VueMapboxFeature from 'vue-mapbox-feature'
````

General Usage
-------------

When using the component in your `html`, use a `v-if` directive to stall the feature from loading until the target `map` object is ready. (Or if you are using multiple `vue-mapbox-features`, then place these inside a parent `div` with a `v-if` directive)
```html
<body>
<div id='app'>
  <vue-mapbox-feature
      v-if='map'
      :map='map'
      :uid='"circle-example"'
      :layer-type='"circle"'
      :feature='pointGeom'
      :paint='circlePaint'
  ></vue-mapbox-feature>
</div>
```
Provide a unique ID to each `vue-mapbox-feature` and specify whether the `layer-type` is a `circle`, `line`, or `fill`.

When composing your `Vue` instance, add the `vue-mapbox-feature` to your components. You'll need to load or generate your `geoJSON` feature. You can also provide custom styling to the component's `v-bind:paint` directive, for example:
```javascript
// Vue instance
const app = new Vue({
  // DOM target element
  el: '#app',
  // Add components
  components: {
    'vue-mapbox-map': VueMapboxMap,
    'vue-mapbox-feature': VueMapboxFeature
  },
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
      return pointGeoJSON
    }
  }
...
})
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
  'layer-type': {
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