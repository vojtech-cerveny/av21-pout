import './App.css'
import React, { useState, useEffect } from 'react'
import GoogleMap from './components/GoogleMap'
import RouteContext from './RouteContext'

import gpsCoordinates from './data/points.json'
import { SidePanel } from './components/SidePanel'
function App() {
  const [context, setContext] = useState({
    lat: gpsCoordinates[0][0],
    lng: gpsCoordinates[0][1],
  })

  const [routes, setRoutes] = useState(null)
  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    async function fetchRoutes() {
      let response = await fetch('http://192.168.0.50:3200/routes')
      response = await response.json()
      setRoutes(response)
    }
    fetchRoutes()
  }, [refresh])

  return (
    <RouteContext.Provider value={[context, setContext]}>
      <div className="App" style={{ display: 'flex' }}>
        {routes && (
          <>
            <GoogleMap routes={routes} />
            <SidePanel routes={routes} setRefresh={setRefresh} />
          </>
        )}
      </div>
    </RouteContext.Provider>
  )
}

export default App
