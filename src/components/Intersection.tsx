import { useState, useEffect } from 'react'
import "./Intersection.css"
import TrafficLight from './TrafficLight'
import IntersectionHandler from '../models/IntersectionHandler'
import { LightState } from '../models/LightState'

const intersection = new IntersectionHandler()

function Intersection() {
  const [lightState, setLightState] = useState<LightState | null>(null)

  
  useEffect(() => {
    // Define the callback function
    const handleLightChange = (s: LightState) => {
      console.log(`Light Change:\n${JSON.stringify(s, null, 2)}`)
      setLightState(s)
    }

    // Connect to state changes with the callback
    intersection.onLightChange.connect(handleLightChange)

    // Cleanup with the same callback reference
    return () => {
      intersection.onLightChange.disconnect(handleLightChange)
    }
  }, [])

  const handleClick = (sensor: "EW" | "NS", leftLaneActive: boolean, anyPrimaryLanesActive: boolean) => {
    console.log(`Clicked on ${sensor} - Left Lane Active: ${leftLaneActive}, Primary Lane Active: ${anyPrimaryLanesActive}`)
    intersection.sensorChange({
      leftLaneActive,
      anyPrimaryLanesActive,
      sensor,
    })
  }
  

  return (
    <>
      <h1>Intersection</h1>
      <div className='grid'>
        <div className='grid-item'></div>
        <div className='grid-item'>
        <div className='grid-item'>
          <button onClick={() => handleClick("NS", false, true)}>Add car primary (NS)</button>
          <button onClick={() => handleClick("NS", true, false)}>Add car left (NS)</button>
        </div>
        </div>
        <div className='grid-item'></div>
        <div className='grid-item'>
        <button onClick={() => handleClick("EW", false, true)}>Add car primary (EW)</button>
        <button onClick={() => handleClick("EW", true, false)}>Add car left (EW)</button>
        </div>
        <div className='grid-item'>
          <div className='NB-light'>
            <TrafficLight orientation={1} leftColor={lightState?.NSLeftIndicatorStatus} primaryColor={lightState?.NSStraightIndicatorStatus} />
          </div>
          <div className='SB-light'>
            <TrafficLight orientation={2} leftColor={lightState?.NSLeftIndicatorStatus} primaryColor={lightState?.NSStraightIndicatorStatus}  />
          </div>
          <div className='EB-light'>
            <TrafficLight orientation={3} leftColor={lightState?.EWLeftIndicatorStatus} primaryColor={lightState?.EWStraightIndicatorStatus}  />
          </div>
          <div className='WB-light'>
            <TrafficLight orientation={4} leftColor={lightState?.EWLeftIndicatorStatus} primaryColor={lightState?.EWStraightIndicatorStatus}  />
          </div>
        </div>
        <div className='grid-item'></div>
        <div className='grid-item'></div>
        <div className='grid-item'></div>
        <div className='grid-item'></div>
      </div>
    </>
  )
}

export default Intersection
