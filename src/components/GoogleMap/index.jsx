import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api'
import { random_rgba } from '../../utils/color'
import gpsCoordinates from '../../data/points.json'

const containerStyle = {
  width: '100vw',
  height: '100vh',
}

const center = {
  lat: gpsCoordinates[0][0],
  lng: gpsCoordinates[0][1],
}

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds()
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      {gpsCoordinates.map((values, index, array) => {
        if (index + 1 === array.length) return null
        const position = {
          lat: values[0],
          lng: values[1],
        }

        return (
          <Polyline
            path={[position, { lat: array[index + 1][0], lng: array[index + 1][1] }]}
            options={{
              strokeColor: random_rgba(),
              strokeOpacity: 0.8,
              strokeWeight: 10,
              fillOpacity: 0.35,
              clickable: false,
              draggable: false,
              editable: false,
              visible: true,
              radius: 30000,
              zIndex: 1,
              fillColor: random_rgba(),
            }}
          />
        )
      })}
      {/* <Marker position={position_start} />
      <Marker position={position_end} /> */}
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(MyComponent)
