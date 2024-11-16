import IntersectionHandler from "./IntersectionHandler"

let ih = new IntersectionHandler()
ih.onLightChange.connect((s) => console.log(`Light Change:\n${JSON.stringify(s, null, 2)}`))

ih.sensorChange({
  leftLaneActive: true,
  anyPrimaryLanesActive: false,
  sensor: "NS",
})

// ih.sensorChange({
//   leftLaneActive: true,
//   anyPrimaryLanesActive: false,
//   sensor: "NS",
// })

setTimeout(() => {
  ih.sensorChange({
    leftLaneActive: false,
    anyPrimaryLanesActive: true,
    sensor: "EW",
  })
}, 5000)

ih.sensorChange({
  leftLaneActive: false,
  anyPrimaryLanesActive: true,
  sensor: "NS",
})

