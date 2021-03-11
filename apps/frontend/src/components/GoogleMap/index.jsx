import React, { useState, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api'
import { Modal, Button } from 'antd'
import gpsCoordinates from '../../data/points.json'

const containerStyle = {
  width: '100vw',
  height: '100vh',
}

function AvMap({ routes }) {
  
  //modal
  const [isModalVisible, setIsModalVisible] = useState(false)
  const handleOk = () => setIsModalVisible(false)
  const handleCancel = () => setIsModalVisible(false)
  const showModal = (route, point) => {
    setIsModalVisible(route)
    setPoint(point)
  }
  let sumDistance = 0
  routes.forEach((route) => (sumDistance += route.distance))
  let currentDistance = 0

  const [point, setPoint] = useState(
    routes.length === 0
      ? { lat: gpsCoordinates[0][0], lng: gpsCoordinates[0][1] }
      : { lat: gpsCoordinates[sumDistance][0], lng: gpsCoordinates[sumDistance][1] },
  )
  const [map, setMap] = React.useState(null)
  const mapRef = useRef(null)
  console.log(point)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  })

  const handleCenter = () => {
    if (!mapRef.current) return

    const newPos = mapRef.current.getCenter().toJSON()
    setPoint(newPos)
  }

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds()
    // bounds.extend(new window.google.maps.LatLng(gpsCoordinates[4][0],gpsCoordinates[4][1]))
    // map.fitBounds(bounds)
    mapRef.current = map
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

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
            src={`http://192.168.0.50:3200/images/${isModalVisible.imagePath}`}
            width="100%"
            alt="obr"
          />
        </p>
      </Modal>
      <GoogleMap
        onDragEnd={handleCenter}
        mapContainerStyle={containerStyle}
        center={point}
        zoom={8}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onZoomChanged={(e)=>console.log(e)}
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
                  strokeColor: route.color || 'blue',
                  strokeOpacity: 0.8,
                  strokeWeight: 10,
                  fillOpacity: 0.35,
                  clickable: false,
                  draggable: false,
                  editable: false,
                  visible: true,
                  zIndex: 1,
                  fillColor: route.color || 'blue',
                }}
              />
              <Marker
                position={endPosition}
                icon={'/marker.svg'}
                onClick={() => showModal(route, endPosition)}
              />
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

export default React.memo(AvMap)
