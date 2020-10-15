import { default as monogatari } from '@monogatari/core'

import store from '@redux/store'
import { showMonogatari, hideMonogatari } from '@redux/actions'

export const jump = async (label = '') => {
  try {
    if (!label) {
      throw new Error(`No label provided. Ignoring jump...`)
    }

    if (!monogatari.script(label)) {
      throw new Error(`Label "${label}" not found. Ignoring jump...`)
    }

    await monogatari.run(`jump ${label}`)

    store.dispatch(showMonogatari(label))

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const hide = async () => {
  await monogatari.run(textSpeed('default'))
  await monogatari.run(`end`)

  store.dispatch(hideMonogatari())

  return true
}

export const textSpeed = (speed = 'default') => async () => {
  if (speed === 'default') speed = 20
  monogatari.preference('TextSpeed', speed)
  monogatari.action('Dialog').setup()
  return true
}
