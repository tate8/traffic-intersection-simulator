import "./TrafficLight.css";

type TrafficLightProps = {
  leftColor?: "green" | "red" | "yellow";
  primaryColor?: "green" | "red" | "yellow";
};

/**
 * Component representing a traffic light. Each traffic light
 * has a 2x3 grid. The first column shows the state of the left
 * turn, and the second column the state of the straight or right turns
 */
function TrafficLight(props: TrafficLightProps) {
  return (
    <>
      <div className="container">
        <div className="leftSection">
          <div className={`light red${props.leftColor == "red" ? "-active" : "-inactive"}`}>
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div
            className={`light yellow${props.leftColor == "yellow" ? "-active" : "-inactive"}`}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div
            className={`light green${props.leftColor == "green" ? "-active" : "-inactive"}`}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </div>
        </div>
        <div className="primarySection">
          <div
            className={`light red${props.primaryColor == "red" ? "-active" : "-inactive"}`}
          ></div>
          <div
            className={`light yellow${
              props.primaryColor == "yellow" ? "-active" : "-inactive"
            }`}
          ></div>
          <div
            className={`light green${props.primaryColor == "green" ? "-active" : "-inactive"}`}
          ></div>
        </div>
      </div>
    </>
  );
}

export default TrafficLight;
