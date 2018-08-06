(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('es6-tween')) :
  typeof define === 'function' && define.amd ? define(['es6-tween'], factory) :
  (global.VueMapboxFeature = factory(global.TWEEN));
}(this, (function (TWEEN) { 'use strict';

  //

  TWEEN.autoPlay(true);

  var script = {
    name: 'VueMapboxFeature',
    destroyed: function destroyed () {
      this.cleanup();
    },
    data: function data () {
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
        default: function () {}
      },
      // object of key - value pairs for the mapbox paint style (dynamic)
      paint: {
        type: Object,
        default: function () {}
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
      paintMixed: function paintMixed () {
        return Object.assign(this.paintBase, this.paint)
      },
      layoutBase: function layoutBase () {
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
      paintBase: function paintBase () {
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
      tweenState: function tweenState () {
        var this$1 = this;

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
            update: function (ref) {
              var radius = ref.radius;
              var opacity = ref.opacity;
              var strokeOpacity = ref.strokeOpacity;

              if (this$1.map && this$1.map.getLayer(this$1.uid)) {
                this$1.map.setPaintProperty(this$1.uid, 'circle-radius', radius);
                this$1.map.setPaintProperty(this$1.uid, 'circle-opacity', opacity);
                this$1.map.setPaintProperty(this$1.uid, 'circle-stroke-opacity', strokeOpacity);
              }
            },
            complete: function () {
              if (this$1.map && this$1.map.getLayer(this$1.uid)) {
                this$1.map.setPaintProperty(this$1.uid, 'circle-radius', this$1.paintMixed['circle-radius']);
                this$1.map.setPaintProperty(this$1.uid, 'circle-opacity', this$1.paintMixed['circle-opacity']);
                this$1.map.setPaintProperty(this$1.uid, 'circle-stroke-opacity', this$1.paintMixed['circle-stroke-opacity']);
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
            update: function (ref) {
              var width = ref.width;
              var opacity = ref.opacity;

              if (this$1.map && this$1.map.getLayer(this$1.uid)) {
                this$1.map.setPaintProperty(this$1.uid, 'line-width', width);
                this$1.map.setPaintProperty(this$1.uid, 'line-opacity', opacity);
              }
            },
            complete: function () {
              if (this$1.map && this$1.map.getLayer(this$1.uid)) {
                this$1.map.setPaintProperty(this$1.uid, 'line-width', this$1.paintMixed['line-width']);
                this$1.map.setPaintProperty(this$1.uid, 'line-opacity', this$1.paintMixed['line-opacity']);
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
            update: function (ref) {
              var opacity = ref.opacity;

              if (this$1.map && this$1.map.getLayer(this$1.uid)) {
                this$1.map.setPaintProperty(this$1.uid, 'fill-opacity', opacity);
              }
            },
            complete: function () {
              if (this$1.map && this$1.map.getLayer(this$1.uid)) {
                this$1.map.setPaintProperty(this$1.uid, 'fill-opacity', this$1.paintMixed['fill-opacity']);
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
        handler: function handler (newVal, oldVal) {
          if (newVal && (newVal !== oldVal)) {
            this.setGeom();
          } else if (!newVal) {
            this.cleanup();
          }
        }
      },
      paint: {
        immediate: true,
        handler: function handler (newVal) {
          this.setPaint();
        }
      },
      visible: {
        immediate: true,
        handler: function handler (newVal) {
          this.setVisibility();
        }
      },
      pulse: {
        // force with immediate
        immediate: true,
        handler: function handler(newVal) {
          this.setPulse();
        }
      }
    },
    methods: {
      setGeom: function setGeom () {
        if (this.map && this.map.getSource(this.uid)) {
          this.map.getSource(this.uid).setData(this.feature);
        } else if (this.map) {
          // addSource requires uid and source object
          this.map.addSource(this.uid, {
            'type': 'geojson',
            'data': this.feature
          });
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
          });
        } else {
          console.warn('NOTE -> unable to set feature collection geom');
        }
      },
      // needs testing
      setPaint: function setPaint () {
        var this$1 = this;

        if (this.paint) {
          for (var i = 0, list = Object.entries(this$1.paint); i < list.length; i += 1) {
            // update base paint object
            var ref = list[i];
            var key = ref[0];
            var value = ref[1];

            this$1.paintBase[key] = value;
            if (this$1.map && this$1.map.getLayer(this$1.uid)) {
              // update current layer
              this$1.map.setPaintProperty(this$1.uid, key, value);
            }
          }
        }
      },
      setVisibility: function setVisibility () {
        if (this.visible) {
          this.layoutBase.visibility = 'visible';
          if (this.map && this.map.getLayer(this.uid)) {
            this.map.setLayoutProperty(this.uid, 'visibility', 'visible');
          }
        } else {
          this.layoutBase.visibility = 'none';
          if (this.map && this.map.getLayer(this.uid)) {
            this.map.setLayoutProperty(this.uid, 'visibility', 'none');
          }
        }
      },
      setPulse: function setPulse () {
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
            .start();
        } else if (this.animate) {
          this.animate.stop();
        }
      },
      cleanup: function cleanup () {
        if (this.map && this.map.getLayer(this.uid)) {
          this.map.removeLayer(this.uid);
        }
        if (this.map && this.map.getSource(this.uid)) {
          this.map.removeSource(this.uid);
        }
      }
    },
    destroyed: function destroyed () {
      // important for cleaning up old layers and avoiding style clashes
      this.cleanup();
    }
  };

  /* script */
              var __vue_script__ = script;
              
  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: "geojsonFeatureDiv" })
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-3f72160a_0", { source: "\n/*# sourceMappingURL=VueMapboxFeature.vue.map */", map: {"version":3,"sources":["VueMapboxFeature.vue"],"names":[],"mappings":";AACA,gDAAgD","file":"VueMapboxFeature.vue"}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* component normalizer */
    function __vue_normalize__(
      template, style, script$$1,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "/Users/gareth/dev/github/vue-mapbox-feature/src/VueMapboxFeature.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      {
        var hook;
        if (style) {
          hook = function(context) {
            style.call(this, createInjector(context));
          };
        }

        if (hook !== undefined) {
          if (component.functional) {
            // register for functional component in vue file
            var originalRender = component.render;
            component.render = function renderWithStyleInjection(h, context) {
              hook.call(context);
              return originalRender(h, context)
            };
          } else {
            // inject component registration as beforeCreate hook
            var existing = component.beforeCreate;
            component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
        }
      }

      return component
    }
    /* style inject */
    function __vue_create_injector__() {
      var head = document.head || document.getElementsByTagName('head')[0];
      var styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
      var isOldIE =
        typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

      return function addStyle(id, css) {
        if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

        var group = isOldIE ? css.media || 'default' : id;
        var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

        if (!style.ids.includes(id)) {
          var code = css.source;
          var index = style.ids.length;

          style.ids.push(id);

          if (isOldIE) {
            style.element = style.element || document.querySelector('style[data-group=' + group + ']');
          }

          if (!style.element) {
            var el = style.element = document.createElement('style');
            el.type = 'text/css';

            if (css.media) { el.setAttribute('media', css.media); }
            if (isOldIE) {
              el.setAttribute('data-group', group);
              el.setAttribute('data-next-index', '0');
            }

            head.appendChild(el);
          }

          if (isOldIE) {
            index = parseInt(style.element.getAttribute('data-next-index'));
            style.element.setAttribute('data-next-index', index + 1);
          }

          if (style.element.styleSheet) {
            style.parts.push(code);
            style.element.styleSheet.cssText = style.parts
              .filter(Boolean)
              .join('\n');
          } else {
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index]) { style.element.removeChild(nodes[index]); }
            if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
            else { style.element.appendChild(textNode); }
          }
        }
      }
    }
    /* style inject SSR */
    

    
    var VueMapboxFeature = __vue_normalize__(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      __vue_create_injector__,
      undefined
    );

  return VueMapboxFeature;

})));
