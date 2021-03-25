import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducer'

const initialState = {
  settings: {
    soundsEnabled: true,
    tiltEnabled: true,
  },
  monogatari: {
    active: false,
    label: null,
  },
}

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunk)))

export default store
