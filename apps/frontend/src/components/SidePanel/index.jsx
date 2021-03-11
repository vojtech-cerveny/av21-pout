import React, { useState } from 'react'

import { Button } from 'antd'
import { CaretLeftOutlined, CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { Form } from '../Form'
import { Timeline } from '../Timeline'

const panelWrapStyle = {
  background: 'white',
  zIndex: 2,
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  padding: '10px 10px 10px',
  textAlign: 'left',
  transition: '0.3s ease-out',
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}

const Header = styled.h1`
  display: flex;
  align-items: center;
  transform-origin: 0 0;
  transform: ${({ isRotated }) => (isRotated ? 'rotate(90deg)' : 'rotate(0deg)')};
  position: ${({ isRotated }) => (isRotated ? 'absolute' : 'relative')};
  top: ${({ isRotated }) => (isRotated ? '20px' : '0')};
  right: ${({ isRotated }) => (isRotated ? '-394px' : '0')};
  z-index: 20;
  transition: 'transform 0.3s ease-out';
  align-self: center;
`
const PanelWrap = styled.div`
  width: ${(props) => (props.open ? (props.isDesktop ? '100%' : '700%') : '50px')};
  overflow: 'hidden';
`

const buttonStyle = {
  position: 'absolute',
  transition: '0.4s ease-out',
}

export const SidePanel = ({ routes, setRefresh }) => {
  const [width, setWidth] = useState(window.innerWidth)
  const [isOpen, setIsOpen] = useState(false)

  const toggleVisibility = () => {
    setIsOpen(!isOpen)
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const handleOk = () => setIsModalVisible(false)
  const handleCancel = () => setIsModalVisible(false)
  const showModal = () => setIsModalVisible(true)

  return (
    <>
      <Button
        top={62}
        type="primary"
        size="large"
        shape="circle"
        style={{
          ...buttonStyle,
          top: '62px',
          right: isOpen ? (width >= 768 ? '51%' : '90%') : '60px',
        }}
        onClick={() => toggleVisibility()}
      >
        {' '}
        {isOpen ? <CaretRightOutlined /> : <CaretLeftOutlined />}{' '}
      </Button>
      <Button
        top={112}
        type="primary"
        size="large"
        shape="circle"
        style={{
          ...buttonStyle,
          top: '112px',
          right: isOpen ? (width >= 768 ? '51%' : '90%') : '60px',
        }}
        icon={<PlusOutlined />}
        onClick={() => showModal()}
      />
      <PanelWrap style={panelWrapStyle} open={isOpen} isDesktop={width >= 768}>
        <Header isRotated={!isOpen}>AV21 - Pouť Soluň -{'>'} Velehrad</Header>

        {isOpen && (
          <>
            <Timeline routes={routes} />
          </>
        )}
      </PanelWrap>
      <Form
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        setRefresh={setRefresh}
      />
    </>
  )
}
