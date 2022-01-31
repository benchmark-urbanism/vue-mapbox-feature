// base and prop paint properties need to be combined
const circlePaint = {
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
  'circle-stroke-opacity-transition': { duration: 0 },
}
const linePaint = {
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
  'line-opacity-transition': { duration: 0 },
}
const fillPaint = {
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
  'fill-opacity-transition': { duration: 0 },
}
const heatmapPaint = {
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
    0,
    'rgba(0, 0, 255, 0)',
    0.1,
    'royalblue',
    0.3,
    'cyan',
    0.5,
    'lime',
    0.7,
    'yellow',
    1,
    'red',
  ],
  // Optional number between 0 and 1 inclusive. Defaults to 1. Transitionable.
  // The global opacity at which the heatmap layer will be drawn
  'heatmap-opacity': 1,
}
const extrusionPaint = {
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
  'fill-extrusion-vertical-gradient': true,
}

export { circlePaint, extrusionPaint, fillPaint, heatmapPaint, linePaint }
