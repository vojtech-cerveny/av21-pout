import { Card } from 'antd'
import React from 'react'
import { Chrono } from 'react-chrono'

export const Timeline = ({ routes }) => {
  let distance = 0
  const routeItems = routes.map((route) => {
    distance += route.distance
    return {
      title: `Vzdálenost ${distance}`,
    }
  })

  return (
    <>
      <div>Vzdálenost {distance} / 1200 km</div>
      <div style={{ width: '100%', overflowY: 'auto' }}>
        <Chrono
          items={routeItems}
          slideShow
          mode="VERTICAL_ALTERNATING"
          theme={{ primary: '#2D4552', secondary: '#FF5D3A' }}
        >
          {routes.map((route) => {
            return (
              <Card>
                <h2>
                  {route.user} šel z {route.startPoint} na poutí místo {route.endPoint}
                </h2>
                <img
                  src={`http://192.168.0.50:3200/images/${route.imagePath}`}
                  width="100%"
                  alt="Obrazek z poute"
                />
              </Card>
            )
          })}
        </Chrono>
      </div>
    </>
  )
}
