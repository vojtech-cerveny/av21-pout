import React, { useState } from 'react'

import { Button } from 'antd'
import styled from 'styled-components'
import { Form } from '../Form'

// import { Form } from '../Form'

const boxStyle = {
  minHeight: '52px',
  position: 'absolute',
  background: 'white',
  zIndex: 2,
  right: '0px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  padding: '10px 10px 10px',
  textAlign: 'left',
  transition: '0.3s ease-out',
  height: '100vh',
  overflow: 'hidden',
}


const Header = styled.div`
  display: flex;
  align-items: center;
`
const PanelWrap = styled.div`
  width: ${props => props.open ? "300px" : "50px"};
  overflow: 'hidden';

`


export const Panel = () => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleVisibility = () => {
    setIsOpen(!isOpen)
  }

  return (
    <PanelWrap style={boxStyle} open={isOpen}>
      <Header onClick={() => toggleVisibility()}>
        <Button
          type="primary"
          style={{ width: '100%' }}
        >{isOpen? "> Schovat" : "<" }</Button>
      </Header>
      {isOpen && <Form />}
    </PanelWrap>
  )
}

