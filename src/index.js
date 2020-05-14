import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'

import 'normalize.css'
import 'fomantic-ui-css/semantic.min.css'
import '@assets/css/bootstrap-spacing.css'
import '@assets/css/bootstrap-grid.css'
import './index.css'

import store from '@redux/store'

import App from './App'

import { SoundManager, SoundProvider } from '@services/sounds'

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
      <SoundProvider ref={el => SoundManager.setTopLevelInstance(el)} />
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
