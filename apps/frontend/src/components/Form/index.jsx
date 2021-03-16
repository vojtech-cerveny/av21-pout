import React, { useState } from 'react'
import ImageUploader from 'react-images-upload'
import axios from 'axios'
import styled from 'styled-components'
import { Input, Button, Modal } from 'antd'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { TextArea } = Input

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
  const [isSending, setSending] = useState(false)
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
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    }
    const bodyFormData = new FormData()
    bodyFormData.set('routeInfo', JSON.stringify(form))
    bodyFormData.append('image', form.picture)

    await axios
      .post(`${process.env.REACT_APP_SERVER}/register`, bodyFormData, config)
      .then((res) => {
        if (res.statusText === 'OK') {
          setRefresh((prev) => !prev)
          setForm({
            user: null,
            startPoint: null,
            endPoint: null,
            distance: null,
            picture: null,
            note: null,
          })
          showSuccessToast()
          onOk()
        } else {
          showErrorToast()
        }
      })
  }

  const handleCancel = () => {
    setForm({
      user: null,
      startPoint: null,
      endPoint: null,
      distance: null,
      picture: null,
      note: null,
    })
    onCancel()
  }

  const handleOk = async () => {
    setSending(true)
    await sendData()
    setSending(false)
  }

  const handleInfoOk = () => {
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
      {visible === 'addRoute' && (
        <Modal
          title={
            <>
              <h2>
                <img src="/logo.svg" alt="logo" width="40px" style={{ paddingRight: '10px' }} />
                Přidej svoji pouť!
              </h2>
            </>
          }
          visible={visible}
          onOk={() => handleOk}
          onCancel={handleCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              style={{ background: '#1FAAAA', borderColor: '#1FAAAA' }}
              onClick={handleOk}
              loading={isSending}
            >
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
              placeholder="Tvé výchozí místo"
              value={form.startPoint}
              onChange={(e) => setForm({ ...form, startPoint: e.target.value })}
            />
            <Input
              placeholder="Tvé cílové místo"
              value={form.endPoint}
              onChange={(e) => setForm({ ...form, endPoint: e.target.value })}
            />
            <Input
              placeholder="Počet km"
              value={form.distance}
              type="number"
              onChange={(e) => setForm({ ...form, distance: e.target.value })}
            />
            <div style={{ margin: '10px 0px 25px' }}>
              <TextArea
                placeholder="Poznámka"
                value={form.note}
                showCount
                maxLength={144}
                autoSize={{ minRows: 2, maxRows: 4 }}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            {form.picture ? (
              <div>
                <img
                  src={URL.createObjectURL(form.picture)}
                  alt="Tvoje fotečka"
                  width="100%"
                  style={{ margin: '10px' }}
                />
              </div>
            ) : (
              <ImageUploader
                withIcon={false}
                buttonText="Vyber svoji fotku z pouti!"
                onChange={(pict) => onDrop(pict)}
                label="Max 10MB, akceptujeme .JPG, .JPEG a .PNG"
                imgExtension={['.jpg', '.png', '.jpeg']}
                maxFileSize={10242880}
                singleImage={true}
                style={{ textAlign: 'center', borderShadow: 'none' }}
                buttonStyles={{
                  color: '#fff',
                  background: '#1FAAAA',
                  borderColor: '#1FAAAA',
                  textShadow: '0 -1px 0 rgba(0, 0, 0, 0.12)',
                  borderRadius: '2px',
                }}
              />
            )}
          </Box>
        </Modal>
      )}
      {visible === 'info' && (
        <Modal
          title={
            <>
              <h2>
                <img src="/logo.svg" alt="logo" width="40px" style={{ paddingRight: '10px' }} />
                Informace
              </h2>
            </>
          }
          visible={visible}
          onOk={() => handleInfoOk}
          onCancel={onCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              style={{ background: '#1FAAAA', borderColor: '#1FAAAA' }}
              onClick={handleInfoOk}
            >
              OK
            </Button>,
          ]}
        >
          <Box>
            <p>
              Vydej se s námi na pouť. Vycházíme ze Soluně a cílem je Velehrad. Místo, kde se, dá-li
              Pán, potkáme i letos v srpnu na AV21. Čeká nás krásných 1040 km. Pro jednoho nemožné.
              Když spojíme síly, cíle dosáhneme. Jak to bude probíhat? Každý se sám ve svém okolí
              vypraví na pouť nebo i několik poutí.
              <b>Cílem může být poutní místo, kříž, boží muka.</b>
            </p>
            <p>
              Pokud ve Tvém okolí nic podobného není, nevadí. Důležité je vyjít. Tam, kam dojdeš,
              pak postav alespoň malý křížek. Nakonec vyfoť fotku sebe a svého cíle putování. Fotku
              společně s počtem ušlých kilometrů nahraj do poutní aplikace. Tvé kilometry se
              připočtou k naší společné cestě a posunou nás blíže k Velehradu. Ke svým úmyslům můžeš
              mimo jiné připojit i modlitbu za zdárný průběh AV21.
            </p>
          </Box>
        </Modal>
      )}
    </>
  )
}
