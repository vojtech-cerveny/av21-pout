import './App.css'
import GoogleMap from './components/GoogleMap'
import { AddRoute } from './components/AddRoute'

function App() {
  return (
    <div className="App">
      <AddRoute />
      <GoogleMap />
    </div>
  )
}

export default App
