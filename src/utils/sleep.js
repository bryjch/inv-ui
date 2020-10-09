// Simple util to sleep x milliseconds

export const sleep = millis =>
  new Promise(resolve => {
    return setTimeout(resolve, millis)
  })
