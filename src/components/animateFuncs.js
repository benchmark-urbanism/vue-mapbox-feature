import anime from 'animejs/lib/anime.es.js'

const animData = {}
const animateCircle = function (paintMixed, props) {
  anime({
    targets: animData,
    'circle-radius': paintMixed['circle-radius'] * 2,
    'circle-opacity': paintMixed['circle-opacity'] / 4,
    'circle-stroke-opacity': paintMixed['circle-stroke-opacity'] / 2,
    duration: 1000,
    loop: true,
    easing: 'easeInOutSine',
    autoplay: true,
    begin: function () {
      Object.assign(animData, {}, paintMixed)
    },
    update: function () {
      if (props.map && props.map.getLayer(props.uid)) {
        props.map.setPaintProperty(props.uid, 'circle-radius', animData['circle-radius'])
        props.map.setPaintProperty(props.uid, 'circle-opacity', animData['circle-opacity'])
        props.map.setPaintProperty(
          props.uid,
          'circle-stroke-opacity',
          animData['circle-stroke-opacity']
        )
      }
    },
    complete: function () {
      props.map.setPaintProperty(props.uid, 'circle-radius', paintMixed['circle-radius'])
      props.map.setPaintProperty(props.uid, 'circle-opacity', paintMixed['circle-opacity'])
      props.map.setPaintProperty(
        props.uid,
        'circle-stroke-opacity',
        paintMixed['circle-stroke-opacity']
      )
    },
  })
}
const animateLine = function (paintMixed, props) {
  anime({
    targets: animData,
    'line-width': paintMixed['line-width'] * 1.1,
    'line-opacity': paintMixed['line-opacity'] / 2,
    duration: 1000,
    loop: true,
    easing: 'easeInOutSine',
    autoplay: true,
    begin: function () {
      Object.assign(animData, {}, paintMixed)
    },
    update: function () {
      if (props.map && props.map.getLayer(props.uid)) {
        props.map.setPaintProperty(props.uid, 'line-width', animData['line-width'])
        props.map.setPaintProperty(props.uid, 'line-opacity', animData['line-opacity'])
      }
    },
    complete: function () {
      props.map.setPaintProperty(props.uid, 'line-width', paintMixed['line-width'])
      props.map.setPaintProperty(props.uid, 'line-opacity', paintMixed['line-opacity'])
    },
  })
}
const animateFill = function (paintMixed, props) {
  anime({
    targets: animData,
    'fill-opacity': paintMixed['fill-opacity'] * 0.75,
    duration: 1000,
    loop: true,
    easing: 'easeInOutSine',
    autoplay: true,
    begin: function () {
      Object.assign(animData, {}, paintMixed)
    },
    update: function () {
      if (props.map && props.map.getLayer(props.uid)) {
        props.map.setPaintProperty(props.uid, 'fill-opacity', animData['fill-opacity'])
      }
    },
    complete: function () {
      props.map.setPaintProperty(props.uid, 'fill-opacity', paintMixed['fill-opacity'])
    },
  })
}

export { animateCircle, animateFill, animateLine }
