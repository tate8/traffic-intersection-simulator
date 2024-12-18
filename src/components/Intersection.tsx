import { useState, useEffect } from "react";
import "./Intersection.css";
import TrafficLight from "./TrafficLight";
import IntersectionHandler, {
  LightStates,
} from "../models/IntersectionHandler";

const intersection = new IntersectionHandler();

/**
 * This component models the view of a traffic intersection. It uses a 3x3
 * grid with checkboxes by different components for user interaction.
 * It sends inputs to the IntersectionHandler and listens for changes.
 */
function Intersection() {
  const [lightState, setLightState] = useState<LightStates | null>(null);

  // subscribe to onLightChange events
  useEffect(() => {
    const handleLightChange = (s: LightStates) => {
      setLightState(s);
    };

    intersection.onLightChange.connect(handleLightChange);

    return () => {
      intersection.onLightChange.disconnect(handleLightChange);
    };
  }, []);

  const changeSensor = (sensor: string, active: boolean) => {
    console.log(`Clicked on ${sensor} - active: ${active}`);
    intersection.sensorChange(sensor, active);
  };

  return (
    <div className="grid-and-instructions">
      <div className="grid">
        <div className="grid-item"></div>
        {/* Crosswalk border for the north road */}
        <div
          className="grid-item"
          style={{
            borderBottom: `10px dashed ${
              lightState?.["pedestrian"] === "green" ? "green" : "gray"
            }`,
          }}
        >
          {/* North-Bound Light UI */}
          <div className="NB-light">
            <TrafficLight
              leftColor={lightState?.["north_left"]}
              primaryColor={lightState?.["north_straight"]}
            />
          </div>

          {/* Maps each lane on the north road to a checkbox */}
          <div className="SB-traffic-sensors">
            {[
              {
                sensor: "south_left",
                icon: "fa-arrow-left",
                condition: lightState?.["south_left"],
              },
              {
                sensor: "south_straight",
                icon: "fa-arrow-up",
                condition: lightState?.["south_straight"],
              },
              {
                sensor: "south_straight",
                icon: "fa-arrow-up",
                condition: lightState?.["south_straight"],
              },
              {
                sensor: "south_straight",
                icon: "fa-arrow-right",
                condition: lightState?.["south_straight"],
              },
            ].map((data, index) => (
              <div className="column" key={index}>
                {index !== 1 && index !== 3 && (
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeSensor(data.sensor, e.target.checked)
                    }
                  />
                )}
                <i
                  className={`fa-solid ${data.icon} ${
                    data.condition === "green" ? "green-active" : ""
                  }`}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <div className="grid-item"></div>
        {/* Crosswalk border for the west road */}
        <div
          className="grid-item"
          style={{
            borderRight: `10px dashed ${
              lightState?.["pedestrian"] === "green" ? "green" : "gray"
            }`,
          }}
        >
          {/* West-Bound Light UI */}
          <div className="WB-light">
            <TrafficLight
              leftColor={lightState?.["east_left"]}
              primaryColor={lightState?.["east_straight"]}
            />
          </div>
          {/* Maps each lane on the west road to a checkbox */}
          <div className="EB-traffic-sensors">
            {[
              {
                sensor: "west_left",
                icon: "fa-arrow-left",
                condition: lightState?.["west_left"],
              },
              {
                sensor: "west_straight",
                icon: "fa-arrow-up",
                condition: lightState?.["west_straight"],
              },
              {
                sensor: "west_straight",
                icon: "fa-arrow-up",
                condition: lightState?.["west_straight"],
              },
              {
                sensor: "west_straight",
                icon: "fa-arrow-right",
                condition: lightState?.["west_straight"],
              },
            ].map((data, index) => (
              <div className="column" key={index}>
                {index !== 1 && index !== 3 && (
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeSensor(data.sensor, e.target.checked)
                    }
                  />
                )}
                <i
                  className={`fa-solid ${data.icon} ${
                    data.condition === "green" ? "green-active" : ""
                  }`}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <div className="grid-item">
          <div className={`pedestrian${lightState?.["pedestrian"]}`}>
            <input
              type="checkbox"
              onChange={(e) => changeSensor("pedestrian", e.target.checked)}
            />
            <i className="fa-solid fa-person-walking"></i>
          </div>
        </div>
        {/* Crosswalk border for the easst road */}
        <div
          className="grid-item"
          style={{
            borderLeft: `10px dashed ${
              lightState?.["pedestrian"] === "green" ? "green" : "gray"
            }`,
          }}
        >
          {/* East-Bound Light UI */}
          <div className="EB-light">
            <TrafficLight
              leftColor={lightState?.["west_left"]}
              primaryColor={lightState?.["west_straight"]}
            />
          </div>
          {/* Maps each lane on the east road to a checkbox */}
          <div className="WB-traffic-sensors">
            {[
              {
                sensor: "east_left",
                icon: "fa-arrow-left",
                condition: lightState?.["east_left"],
              },
              {
                sensor: "east_straight",
                icon: "fa-arrow-up",
                condition: lightState?.["east_straight"],
              },
              {
                sensor: "east_straight",
                icon: "fa-arrow-up",
                condition: lightState?.["east_straight"],
              },
              {
                sensor: "east_straight",
                icon: "fa-arrow-right",
                condition: lightState?.["east_straight"],
              },
            ].map((data, index) => (
              <div className="column" key={index}>
                {index !== 1 && index !== 3 && (
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeSensor(data.sensor, e.target.checked)
                    }
                  />
                )}
                <i
                  className={`fa-solid ${data.icon} ${
                    data.condition === "green" ? "green-active" : ""
                  }`}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <div className="grid-item"></div>
        {/* Crosswalk border for the south road */}
        <div
          className="grid-item"
          style={{
            borderTop: `10px dashed ${
              lightState?.["pedestrian"] === "green" ? "green" : "gray"
            }`,
          }}
        >
          {/* South-Bound Light UI */}
          <div className="SB-light">
            <TrafficLight
              leftColor={lightState?.["south_left"]}
              primaryColor={lightState?.["south_straight"]}
            />
          </div>
          {/* Maps each lane on the south road to a checkbox */}
          <div className="NB-traffic-sensors">
            {[
              {
                sensor: "north_left",
                icon: "fa-arrow-left",
                condition: lightState?.["north_left"],
              },
              {
                sensor: "north_straight",
                icon: "fa-arrow-up",
                condition: lightState?.["north_straight"],
              },
              {
                sensor: "north_straight",
                icon: "fa-arrow-up",
                condition: lightState?.["north_straight"],
              },
              {
                sensor: "north_straight",
                icon: "fa-arrow-right",
                condition: lightState?.["north_straight"],
              },
            ].map((data, index) => (
              <div className="column" key={index}>
                {index !== 1 && index !== 3 && (
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeSensor(data.sensor, e.target.checked)
                    }
                  />
                )}
                <i
                  className={`fa-solid ${data.icon} ${
                    data.condition === "green" ? "green-active" : ""
                  }`}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <div className="grid-item"></div>
      </div>
      <div className="instructions">
        <h1>Instructions:</h1>
        <p>
          Simulate the traffic intersection by clicking on a traffic sensor you
          would like to toggle.
        </p>

        <h3>Features:</h3>
        <ol>
          <li>
            <strong>Traffic lights adjust in real-time</strong> based on sensor
            data, considering the current state and the triggered sensors to
            optimize traffic flow.
          </li>
          <li>
            <strong>
              The traffic phase scheduler optimizes new traffic light
              configurations
            </strong>{" "}
            to serve the largest amount of waiting entities while prioritizing
            old requests.
          </li>
          <li>
            <strong>Pedestrian traffic phases are longer than default</strong>{" "}
            to accomodate the time it takes to walk across the intersection.
          </li>
          <li>
            <strong>If multiple sensors are triggered quickly,</strong> the
            system queues sensors to be serviced quickly and efficiently.
          </li>
          <li>
            <strong>
              Each traffic phase includes timed "green", "yellow", and
              "in-between" states,
            </strong>{" "}
            with the "in-between" phase ensuring safe transitions between
            signals.
          </li>
          <li>
            <strong>Right turn sensors</strong> follow the same rules as straight ones.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Intersection;
