import anime from 'animejs/lib/anime.js'

type specObj = { [key: string]: any }

const animateCircle = function (paintMixed: specObj, mapRaw: any, mapUid: string) {
  const animData = Object.assign({}, paintMixed)
  return anime({
    targets: animData,
    'circle-radius': animData['circle-radius'] * 1.1,
    'circle-opacity': animData['circle-opacity'] * 0.8,
    'circle-stroke-opacity': animData['circle-stroke-opacity'] * 0.9,
    duration: 500,
    loop: true,
    direction: 'alternate',
    easing: 'easeOutSine',
    autoplay: true,
    update: function () {
      if (mapRaw && mapRaw.getLayer(mapUid)) {
        mapRaw.setPaintProperty(mapUid, 'circle-radius', animData['circle-radius'])
        mapRaw.setPaintProperty(mapUid, 'circle-opacity', animData['circle-opacity'])
        mapRaw.setPaintProperty(mapUid, 'circle-stroke-opacity', animData['circle-stroke-opacity'])
      }
    },
    complete: function () {
      mapRaw.setPaintProperty(mapUid, 'circle-radius', paintMixed['circle-radius'])
      mapRaw.setPaintProperty(mapUid, 'circle-opacity', paintMixed['circle-opacity'])
      mapRaw.setPaintProperty(mapUid, 'circle-stroke-opacity', paintMixed['circle-stroke-opacity'])
    },
  })
}
const animateLine = function (paintMixed: specObj, mapRaw: any, mapUid: string) {
  const animData = Object.assign({}, paintMixed)
  return anime({
    targets: animData,
    'line-width': animData['line-width'] * 1.01,
    'line-opacity': animData['line-opacity'] * 0.8,
    duration: 1000,
    loop: true,
    direction: 'alternate',
    easing: 'easeOutSine',
    autoplay: true,
    update: function () {
      if (mapRaw && mapRaw.getLayer(mapUid)) {
        mapRaw.setPaintProperty(mapUid, 'line-width', animData['line-width'])
        mapRaw.setPaintProperty(mapUid, 'line-opacity', animData['line-opacity'])
      }
    },
    complete: function () {
      mapRaw.setPaintProperty(mapUid, 'line-width', paintMixed['line-width'])
      mapRaw.setPaintProperty(mapUid, 'line-opacity', paintMixed['line-opacity'])
    },
  })
}
const animateFill = function (paintMixed: specObj, mapRaw: any, mapUid: string) {
  const animData = Object.assign({}, paintMixed)
  return anime({
    targets: animData,
    'fill-opacity': animData['fill-opacity'] * 0.8,
    duration: 1000,
    loop: true,
    direction: 'alternate',
    easing: 'easeOutSine',
    autoplay: true,
    update: function () {
      if (mapRaw && mapRaw.getLayer(mapUid)) {
        mapRaw.setPaintProperty(mapUid, 'fill-opacity', animData['fill-opacity'])
      }
    },
    complete: function () {
      mapRaw.setPaintProperty(mapUid, 'fill-opacity', paintMixed['fill-opacity'])
    },
  })
}

export { animateCircle, animateFill, animateLine }
