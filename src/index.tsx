import React from 'react'
import ReactDOM from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'

import 'normalize.css'
import '@assets/css/bootstrap-spacing.css'
import '@assets/css/bootstrap-grid.css'
import '@assets/css/fonts.scss'
import './index.scss'

import App from './App'

import { SoundManager, SoundProvider } from '@services/sounds'

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <SoundProvider ref={el => SoundManager.setTopLevelInstance(el)}>
        <App />
      </SoundProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
