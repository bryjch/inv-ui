// Simple util to sleep x milliseconds

export const sleep = (millis: number) =>
  new Promise(resolve => {
    return setTimeout(resolve, millis)
  })
