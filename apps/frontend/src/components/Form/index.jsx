import React, { useState } from 'react'
import ImageUploader from 'react-images-upload'
import axios from 'axios'
import styled from 'styled-components'
import { Input, Button, Modal } from 'antd'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Box = styled.div`
  & > input,
  button {
    margin-top: 10px;
  }
`

const toastOptions = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

export const Form = ({ visible, onOk, onCancel, setRefresh }) => {
  const showSuccessToast = () => toast.success('🚶‍♂️Tvá pouť byla úspěšně vložena! 🎉', toastOptions)
  const showErrorToast = () => toast.error('Neco se pokazilo! 😱', toastOptions)
  const showMissingInfoToast = () => toast.warning('Musis vyplnit vsechny pole! 😱', toastOptions)
  const [form, setForm] = useState({
    user: null,
    startPoint: null,
    endPoint: null,
    distance: null,
    picture: null,
  })

  const onDrop = (picture) => {
    setForm({ ...form, picture: picture[0] })
  }

  const sendData = async () => {
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(form)) {
      if (value == null) {
        showMissingInfoToast()
        return
      }
    }

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }
    const bodyFormData = new FormData()
    bodyFormData.set('routeInfo', JSON.stringify(form))
    bodyFormData.append('image', form.picture)
    // TODO: Add URL of server somehow.
    await axios.post('http://192.168.0.50:3200/register', bodyFormData, config).then((res) => {
      if (res.statusText === 'OK') {
        setRefresh((prev) => !prev)
        setForm({
          user: null,
          startPoint: null,
          endPoint: null,
          distance: null,
          picture: null,
        })
        showSuccessToast()
      } else {
        showErrorToast()
      }
    })
  }

  const handleOk = () => {
    sendData()
    onOk()
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Modal
        title={'blabla'}
        visible={visible}
        onOk={() => handleOk}
        onCancel={onCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Přidej mojí pouť!
          </Button>,
        ]}
      >
        <Box>
          <Input
            placeholder="Jméno"
            value={form.user}
            onChange={(e) => setForm({ ...form, user: e.target.value })}
          />
          <Input
            placeholder="Výchozí místo"
            value={form.startPoint}
            onChange={(e) => setForm({ ...form, startPoint: e.target.value })}
          />
          <Input
            placeholder="Cilove misto"
            value={form.endPoint}
            onChange={(e) => setForm({ ...form, endPoint: e.target.value })}
          />
          <Input
            placeholder="Pocet km"
            value={form.distance}
            type="number"
            onChange={(e) => setForm({ ...form, distance: e.target.value })}
          />
          {form.picture ? (
            <div>
              <img
                src={URL.createObjectURL(form.picture)}
                alt="Tvoje fotecka"
                width="100%"
                style={{ paddingTop: '10px' }}
              />
            </div>
          ) : (
            <ImageUploader
              withIcon={false}
              buttonText="Vyber svoji fotku z pouti!"
              onChange={(pict) => onDrop(pict)}
              label="Max 10MB, akceptujeme .JPG a .PNG "
              imgExtension={['.jpg', '.png']}
              maxFileSize={10242880}
              singleImage={true}
            />
          )}
        </Box>
      </Modal>
    </>
  )
}
