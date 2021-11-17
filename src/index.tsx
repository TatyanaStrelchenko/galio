import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import './index.css'

import { api } from './services/api'
import { applyInterceptors } from './services/interceptors'
import { theme } from './theme/theme'
import App from './App'
import { AuthProvider } from './components/Auth/AuthProvider'
import { GlobalStyle } from './components/Style/GlobalStyle'

import reportWebVitals from './reportWebVitals'

applyInterceptors(api)

ReactDOM.render(
  // <React.StrictMode>
  <ThemeProvider theme={{ mode: 'light', ...theme }}>
    <GlobalStyle />
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
