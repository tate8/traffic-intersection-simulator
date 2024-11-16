import "./TrafficLight.css";

type TrafficLightProps = {
  orientation: number;
  leftColor?: "green" | "red" | "yellow";
  primaryColor?: "green" | "red" | "yellow";
};

function TrafficLight(props: TrafficLightProps) {
  let container = "container";
  if (props.orientation == 3 || props.orientation == 4) {
    container += " swap";
  }


  return (
    <>
      <div className={container}>
        {props.orientation == 1 || props.orientation == 3 ? (
          <>
            <div className={`left ${props.leftColor}`}></div>
            <div className={`primary ${props.primaryColor}`}></div>
          </>
        ) : (
          <>
            <div className={`primary ${props.primaryColor}`}></div>
            <div className={`left ${props.leftColor}`}></div>
          </>
        )}
      </div>
    </>
  );
}

export default TrafficLight;
