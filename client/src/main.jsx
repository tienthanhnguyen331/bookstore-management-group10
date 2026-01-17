import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' 
import { InvoiceDraftProvider } from './context/InvoiceDraftContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InvoiceDraftProvider>
      <App />
    </InvoiceDraftProvider>
  </React.StrictMode>,
)