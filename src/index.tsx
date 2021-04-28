import React from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import '@assets/css/bootstrap-spacing.css'
import '@assets/css/bootstrap-grid.css'
import './index.scss'

import App from './App'

import { SoundManager, SoundProvider } from '@services/sounds'

ReactDOM.render(
  <React.StrictMode>
    <SoundProvider ref={el => SoundManager.setTopLevelInstance(el)}>
      <App />
    </SoundProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
