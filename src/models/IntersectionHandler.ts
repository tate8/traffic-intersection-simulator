import Signal from "./Signal";
import { rulesMatrix } from "./Rules";


type Sensor = {
  active: boolean;
  timestamp: number;
};
type Sensors = Record<string, Sensor>;


export type LightStates = Record<string, "green" | "red" | "yellow">;

export default class IntersectionHandler {
  private GREEN_DURATION = 4000;
  private YELLOW_DURATION = 1000;
  private IN_BETWEEN_DURATION = 1000;
  private PEDESTRIAN_DURATION = 6000;

  private currentPhase: LightStates | null = null;
  private currentPhaseActiveLights: string[] | null = null
  private lastTimestamp: number = 0;

  private initialLightState: LightStates = {
    north_straight: "red",
    north_left: "red",
    south_straight: "red",
    south_left: "red",
    east_straight: "red",
    east_left: "red",
    west_straight: "red",
    west_left: "red",
    pedestrian: "red",
  };

  private lightState: LightStates = { ...this.initialLightState };

  private sensors: Sensors = {
    north_straight: { active: false, timestamp: Date.now() },
    north_left: { active: false, timestamp: Date.now() },
    south_straight: { active: false, timestamp: Date.now() },
    south_left: { active: false, timestamp: Date.now() },
    pedestrian: { active: false, timestamp: Date.now() },
    east_left: { active: false, timestamp: Date.now() },
    east_straight: { active: false, timestamp: Date.now() },
    west_left: { active: false, timestamp: Date.now() },
    west_straight: { active: false, timestamp: Date.now() },
  };

  public onLightChange = new Signal<LightStates>();

  constructor() {
    this.onLightChange.emit(this.lightState);
  }

  public sensorChange(sensor: string, newValue: boolean) {
    if (!Object.keys(this.sensors).some((key) => key === sensor)) {
      console.warn(`Sensor "${sensor}" does not exist.`);
      return;
    }

    // update the sensors
    let currentTime = Date.now();
    if (currentTime <= this.lastTimestamp) {
      currentTime = this.lastTimestamp + 1;
    }
    this.lastTimestamp = currentTime;

    this.sensors[sensor] = { active: newValue, timestamp: currentTime };

    // if there are no actions in progress, add the new one and schedule it
    // to be executed immediately.
    // if there is already an action in progress, it will automatically be handled
    if (!this.currentPhase) {
      this.startNewPhase();
    }
  }

  private findOldestActiveSensor(sensors: Sensors) {
    let oldestTimestamp = Infinity;
    let oldestActiveSensor: string | null = null;

    for (const [sensor, data] of Object.entries(sensors)) {
      if (data.active === true && data.timestamp < oldestTimestamp) {
        oldestTimestamp = data.timestamp;
        oldestActiveSensor = sensor;
      }
    }
      
    console.log(`Oldest: ${oldestActiveSensor}, t: ${oldestTimestamp}`)

    return oldestActiveSensor;
  }

  private buildPhaseFromSensor(primarySensor: string, sensors: Sensors) {
    // calculate the compatible lights with the current sensor
    // if there are multiple compatible configurations, pick the one
    // with the lowest average active time to ensure queue-like behavior
    const options = rulesMatrix[primarySensor].options;
    // console.log(`All options for ${primarySensor}: ${options}\nGiven ${JSON.stringify(sensors, undefined, 2)}`)
    const validOptions: string[][] = options.filter((phase) =>
      phase.every((sensor) => sensors[sensor].active)
    );
    let minimumAverageDate = Infinity;
    let minimumPhase: string[] = [];

    for (const phase of validOptions) {
      const averageDate =
        phase.reduce((sum, sensor) => sum + sensors[sensor].timestamp, 0) /
        phase.length;
      if (averageDate < minimumAverageDate) {
        minimumPhase = phase;
        minimumAverageDate = averageDate;
      }
    }

    // we didn't find any valid options, use default
    if (minimumPhase.length === 0) {
      return [primarySensor, ...rulesMatrix[primarySensor].default];
    } else {
      return [primarySensor, ...minimumPhase];
    }
  }

  private getLightStatesFromPhase(phase: string[], sensors: Sensors) {
    const states: LightStates = {};

    for (const sensor of Object.keys(sensors)) {
      states[sensor] = phase.includes(sensor) ? "green" : "red";
    }

    return states;
  }

  private startNewPhase() {
    // increment the sensors to ensure that they won't get served immmediately
    // after if they remain pressed.
    if (this.currentPhaseActiveLights) {
      const currentTime = Date.now();
      this.currentPhaseActiveLights.forEach((sensor) => {
        if (this.sensors[sensor]) {
          this.sensors[sensor].timestamp = currentTime;
        }
      });
    }

    const oldestSensor = this.findOldestActiveSensor(this.sensors);
    if (!oldestSensor) {
      this.onLightChange.emit(this.initialLightState);
      return;
    }
    console.log(oldestSensor);
    // build the phase based on the oldest sensor
    const phase = this.buildPhaseFromSensor(oldestSensor, this.sensors);
    this.currentPhaseActiveLights = phase

    // get light states based on the phase
    const lightStates = this.getLightStatesFromPhase(phase, this.sensors);
    this.currentPhase = lightStates;
    this.onLightChange.emit(lightStates);

    if (oldestSensor.startsWith("pedestrian")) {
      setTimeout(() => this.transitionToYellow(), this.PEDESTRIAN_DURATION);
    } else {
      setTimeout(() => this.transitionToYellow(), this.GREEN_DURATION);
    }
  }

  private transitionToYellow(): void {
    if (!this.currentPhase) return;

    const yellowState: LightStates = { ...this.currentPhase };
    Object.keys(yellowState).forEach((key) => {
      if (yellowState[key as keyof LightStates] === "green") {
        yellowState[key as keyof LightStates] = "yellow";
      }
    });

    this.currentPhase = yellowState;
    this.onLightChange.emit(this.currentPhase);

    // schedule transition to end phase after yellow duration
    setTimeout(() => this.endCurrentPhase(), this.YELLOW_DURATION);
  }

  private endCurrentPhase(): void {
    if (!this.currentPhase) return;

    // set to all red for a while
    this.currentPhase = { ...this.initialLightState };
    this.onLightChange.emit(this.currentPhase);

    setTimeout(() => {
      // if any sensor is active, schedule a new phase
      if (
        Object.values(this.sensors).some((sensor) => sensor.active === true)
      ) {
        this.startNewPhase();
      } else {
        this.currentPhase = { ...this.initialLightState };
        this.onLightChange.emit(this.currentPhase);
        this.currentPhase = null;
      }
    }, this.IN_BETWEEN_DURATION);
  }
}
