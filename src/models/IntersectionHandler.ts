import { LightState } from "./LightState"
import Signal from "./Signal"
import { SensorState } from "./SensorState"

export default class IntersectionHandler {
  private GREEN_DURATION = 5000
  private YELLOW_DURATION = 1000
  private IN_BETWEEN_DURATION = 1000

  private currentPhase: LightState | null = null
  private pendingPhases: LightState[] = []

  private initialLightState: LightState = {
    NSStraightIndicatorStatus: "red",
    NSLeftIndicatorStatus: "red",
    EWStraightIndicatorStatus: "red",
    EWLeftIndicatorStatus: "red",
  }

  private lightState: LightState = { ...this.initialLightState }

  public onLightChange = new Signal<LightState>()

  constructor() {
    this.onLightChange.emit(this.lightState)
  }

  public sensorChange(state: SensorState) {
    let nextPhase = this.determineNextPhase(state)
    if (nextPhase === null) return;

    // if there are no actions in progress, add the new one and schedule it
    // to be executed immediately
    if (!this.currentPhase) {
      this.startNewPhase(nextPhase)
    } else {
      // if there is already an action in progress, append the new one to the queue
      this.queuePhase(nextPhase)
    }
  }

  private determineNextPhase(state: SensorState): LightState | null {
    if (state.leftLaneActive && state.sensor == "NS") {
      return {
        NSStraightIndicatorStatus: "red",
        NSLeftIndicatorStatus: "green",
        EWLeftIndicatorStatus: "red",
        EWStraightIndicatorStatus: "red",
      }
    } else if (state.leftLaneActive && state.sensor == "EW") {
      return {
        NSStraightIndicatorStatus: "red",
        NSLeftIndicatorStatus: "red",
        EWLeftIndicatorStatus: "green",
        EWStraightIndicatorStatus: "red",
      }
    } else if (state.anyPrimaryLanesActive && state.sensor == "NS") {
      return {
        NSStraightIndicatorStatus: "green",
        NSLeftIndicatorStatus: "red",
        EWLeftIndicatorStatus: "red",
        EWStraightIndicatorStatus: "red",
      }
    } else if (state.anyPrimaryLanesActive && state.sensor == "EW") {
      return {
        NSStraightIndicatorStatus: "red",
        NSLeftIndicatorStatus: "red",
        EWLeftIndicatorStatus: "red",
        EWStraightIndicatorStatus: "green",
      }
    } else return null
  }

  private startNewPhase(phase: LightState) {
    this.currentPhase = phase
    this.onLightChange.emit(phase)
    setTimeout(() => this.transitionToYellow(), this.GREEN_DURATION)
  }

  private queuePhase(phase: LightState): void {
    // Only queue if it's different from the current and only phase
    if (this.pendingPhases.length === 0) {
      if (this.currentPhase && !this.areStatesEqual(this.currentPhase, phase)) {
        this.pendingPhases.push(phase);
      }
    }
    // Or different from the last of the queued phases
    else if (!this.areStatesEqual(this.pendingPhases[this.pendingPhases.length - 1], phase)) {
      this.pendingPhases.push(phase);
    }
  }

  private transitionToYellow(): void {
    if (!this.currentPhase) return
    // Create yellow state based on current green lights
    const yellowState: LightState = { ...this.currentPhase };
    Object.keys(yellowState).forEach(key => {
        if (yellowState[key as keyof LightState] === "green") {
            yellowState[key as keyof LightState] = "yellow";
        }
    });

    this.currentPhase = yellowState;
    this.onLightChange.emit(this.currentPhase);

    // Schedule transition to end phase after yellow duration
    setTimeout(() => this.endCurrentPhase(), this.YELLOW_DURATION);
}

  private areStatesEqual(state1: LightState, state2: LightState): boolean {
    return Object.entries(state1).every(([key, value]) => 
        state2[key as keyof LightState] === value
    );
  }

  private endCurrentPhase(): void {
    if (!this.currentPhase) return

    // set to all red for a while
    this.currentPhase = { ...this.initialLightState };
    this.onLightChange.emit(this.currentPhase);

    setTimeout(() => {
      if (this.pendingPhases.length > 0) {
        const nextPhase = this.pendingPhases.shift()!;
        this.startNewPhase(nextPhase);
      } else {
        this.currentPhase = { ...this.initialLightState };
        this.onLightChange.emit(this.currentPhase);
        this.currentPhase = null
      }
    }, this.IN_BETWEEN_DURATION)
  }
}