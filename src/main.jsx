import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppContextProvider } from './context/AppContext.jsx'
import App from './App.jsx'
import './index.css'

// Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Client ID from Google Cloud Console
const clientId = "671401621818-nb2silm5pomusqgrua0oq9g20lpdgr3p.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)