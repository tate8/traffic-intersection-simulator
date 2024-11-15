/**
 * The LightState type represents the current state of a light in
 * an intersection. Each light has a straight (no turn) indicator
 * and a left turn indicator.
 */
export type LightState = {
  NSStraightIndicatorStatus: LightStatus,
  NSLeftIndicatorStatus: LightStatus,
  EWStraightIndicatorStatus: LightStatus,
  EWLeftIndicatorStatus: LightStatus,
}

type LightStatus = "green" | "red" | "yellow";