import React, { useState } from 'react'
import { Chrono } from 'react-chrono'

export const Timeline = ({ routes }) => {
  const [width, setWidth] = useState(window.innerWidth)
  const isMobile = width < 768
  let distance = 0
  const routeItems = routes.map((route) => {
    distance += route.distance
    return {
      title: isMobile
        ? ``
        : `Část ${route.distance === distance ? 0 : distance - route.distance} - ${distance} km. Přidáno ${
            route.distance
          } km`,
    }
  })
  let distance2 = 0
  return (
    <>
      <h2 style={{ padding: '0 2rem' }}>Společně jsme ušli {distance} km z 1040 km!</h2>
      <div style={{ width: '100%', overflowY: 'auto' }}>
        <Chrono
          items={routeItems}
          slideShow
          mode={width >= 768 ? 'VERTICAL_ALTERNATING' : 'VERTICAL'}
          theme={{ primary: '#2D4552', secondary: '#FF5D3A' }}
        >
          {routes.map((route) => {
            distance2 += route.distance
            return (
              <div key={route.id}>
                <h2
                  style={{
                    color: '#06325e',
                    paddingTop: '20px',
                    fontSize: 'xx-large',
                  }}
                >
                  {route.user}
                </h2>
                <h3
                  style={{
                    color: '#262626',
                    fontSize: 'x-large',
                  }}
                >
                  {route.startPoint} ➡ {route.endPoint}
                </h3>
                {isMobile && (
                  <p>
                    Část poutě {route.distance === distance2 ? 0 : distance2 - route.distance}-
                    {distance2} km. Přidáno {route.distance} km
                  </p>
                )}
                <img
                  src={`${process.env.REACT_APP_SERVER}/images/${route.imagePathSmall}`}
                  width="100%"
                  alt="from route"
                />

                {route.note && (
                  <p
                    style={{
                      fontStyle: 'italic',
                      fontSize: 'larger',
                      marginTop: '20px',
                      color: '#262626',
                    }}
                  >
                    {route.note}
                  </p>
                )}
              </div>
            )
          })}
        </Chrono>
      </div>
    </>
  )
}
