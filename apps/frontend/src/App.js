import './App.css'
import React, { useState } from 'react'
import GoogleMap from './components/GoogleMap'
import RouteContext from './RouteContext'

import gpsCoordinates from './data/points.json'
import { Panel } from './components/Panel'
function App() {
  const [context, setContext] = useState({
    lat: gpsCoordinates[0][0],
    lng: gpsCoordinates[0][1],
  });
  return (
    <RouteContext.Provider value={[context, setContext]}>
      <div className="App">
        <Panel />
        <GoogleMap />
      </div>
    </RouteContext.Provider>
  )
}

export default App
