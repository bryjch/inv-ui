/**
 * Super basic check to determine user's device type.
 * This is certainly not a robust way to check and can easily be spoofed
 * but it's not a big deal for this project (rather not add more dependencies)
 *
 * Reference: https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
 */

export const isDeviceDesktop = (): boolean => {
  return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isDeviceMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
