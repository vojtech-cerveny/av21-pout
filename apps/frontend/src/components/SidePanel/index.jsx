import React, { useState } from 'react'

import { Button } from 'antd'
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  PlusOutlined,
  InfoOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import { Form } from '../Form'
import { Timeline } from '../Timeline'

const panelWrapStyle = {
  background: 'url("sidebar-bg.png") white',
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
  right: ${({ isRotated }) => (isRotated ? '-472px' : '0')};
  z-index: 20;
  /* color: ${({ isRotated }) => (isRotated ? 'black' : '#06325e')}; */
  transition: 'transform 0.3s ease-out';
  align-self: center;
`

const PanelWrap = styled.div`
  width: ${(props) => (props.open ? (props.isDesktop ? '100%' : '700%') : '80px')};
  overflow: 'hidden';
`

const buttonStyle = {
  position: 'absolute',
  transition: '0.4s ease-out',
  background: '#FF5D3A',
  borderColor: '#FF5D3A',
  filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 0px 3px 3px)',
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
  const showAddRouteModal = () => setIsModalVisible("addRoute")
  const showInfo = () => setIsModalVisible("info")
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
          right: isOpen ? (width >= 768 ? '51%' : '90%') : '90px',
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
          right: isOpen ? (width >= 768 ? '51%' : '90%') : '90px',
        }}
        icon={<PlusOutlined />}
        onClick={() => showAddRouteModal()}
      />
      <Button
        top={162}
        type="primary"
        size="large"
        shape="circle"
        style={{
          ...buttonStyle,
          top: '162px',
          right: isOpen ? (width >= 768 ? '51%' : '90%') : '90px',
          backgroundColor: '#1FAAAA',
          borderColor: '#1FAAAA',
        }}
        icon={<InfoOutlined />}
        onClick={() => showInfo()}
      />

      <PanelWrap style={panelWrapStyle} open={isOpen} isDesktop={width >= 768}>
        <Header isRotated={!isOpen}>
          {' '}
          <img src="/logo.svg" alt="logo" width="40px" style={{ paddingRight: '10px' }} />
          <h2 className="av21" style={{ margin: 0, fontSize: 'xxx-large', paddingRight: '20px' }}>
            AV21
          </h2>
          Pouť Soluň ➡ Velehrad
        </Header>

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
