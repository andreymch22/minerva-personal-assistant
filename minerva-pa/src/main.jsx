import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import FacialRecognition from './FacialRecognition.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*<App />*/}
    <FacialRecognition />
    {/*<FacialRecognition />*/}
  </React.StrictMode>,
)
