/**
 * The SensorState type represents the state of a sensor on a
 * road in an intersection. Each road has a separate sensor
 * for each of its lanes.
 */
export type SensorState = {
  sensor: "NS" | "EW",
  leftLaneActive: boolean,
  anyPrimaryLanesActive: boolean,
}