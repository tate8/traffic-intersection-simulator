import IntersectionHandler from "./IntersectionHandler"

let ih = new IntersectionHandler()
ih.onLightChange.connect((s) => console.log(`Light Change:\n${JSON.stringify(s, null, 2)}`))

// ih.sensorChange("north_straight", true)
// ih.sensorChange("north_left", true)
// ih.sensorChange("south_straight", true)

ih.sensorChange("north_straight", true)
ih.sensorChange("pedestrian_east", true)