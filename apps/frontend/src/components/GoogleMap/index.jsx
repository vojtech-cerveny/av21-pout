import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api'
import { Modal, Button } from 'antd'
import { random_rgba } from '../../utils/color'
import gpsCoordinates from '../../data/points.json'

const containerStyle = {
  width: '100vw',
  height: '100vh',
}

function MyComponent() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [lastMarker, setLastMarker] = useState(0)
  const showModal = (route) => {
    setIsModalVisible(route)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const [routes, setRoutes] = useState([])

  useEffect(() => {
    async function fetchRoutes() {
      let response = await fetch('http://192.168.0.50:3200/routes')
      response = await response.json()
      setRoutes(response)

    }

    fetchRoutes()
    routes.forEach((route) => {
      console.log(route.distance)
      setLastMarker(prevState => prevState + route.distance)
    })
  }, [])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds()
    // bounds.extend(new window.google.maps.LatLng(gpsCoordinates[lastMarker][0],gpsCoordinates[lastMarker][1]))
    // map.fitBounds(bounds)


    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  let currentDistance = 0
  console.log({ lat: gpsCoordinates[lastMarker][0], lng: gpsCoordinates[lastMarker][1] })

  return isLoaded ? (
    <>
      <Modal
        title={`${isModalVisible.user} šel pouť ${isModalVisible.startPoint} - ${isModalVisible.endPoint}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <p>Vzdálenost: {isModalVisible?.distance || 0}</p>
        <p>
          <img
            src={`http://localhost:3200/images/${isModalVisible.imagePath}`}
            width="100%"
            alt="obr"
          />
        </p>
      </Modal>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: gpsCoordinates[lastMarker][0], lng: gpsCoordinates[lastMarker][1] }}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {routes.map((route, index, arr) => {
          const startPosition = {
            lat: gpsCoordinates[currentDistance][0],
            lng: gpsCoordinates[currentDistance][1],
          }
          const endPosition = {
            lat: gpsCoordinates[currentDistance + route.distance][0],
            lng: gpsCoordinates[currentDistance + route.distance][1],
          }

          currentDistance += route.distance

          return (
            <>
              <Polyline
                path={[startPosition, endPosition]}
                onClick={() => alert('wohou')}
                options={{
                  strokeColor: random_rgba(),
                  strokeOpacity: 0.8,
                  strokeWeight: 10,
                  fillOpacity: 0.35,
                  clickable: false,
                  draggable: false,
                  editable: false,
                  visible: true,
                  zIndex: 1,
                  fillColor: random_rgba(),
                }}
              />
              <Marker position={endPosition} onClick={() => showModal(route)} />
            </>
          )
        })}
        <Polyline
          path={[
            {
              lat: gpsCoordinates[currentDistance][0],
              lng: gpsCoordinates[currentDistance][1],
            },
            {
              lat: gpsCoordinates[gpsCoordinates.length - 1][0],
              lng: gpsCoordinates[gpsCoordinates.length - 1][1],
            },
          ]}
          options={{
            strokeColor: 'grey',
            strokeOpacity: 0.3,
            strokeWeight: 5,
            fillOpacity: 0.3,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 30000,
            zIndex: 1,
            fillColor: 'grey',
          }}
        />
      </GoogleMap>
    </>
  ) : (
    <></>
  )
}

export default React.memo(MyComponent)
