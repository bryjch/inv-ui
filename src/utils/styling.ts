/**
 * Convert a hex value to rgba value with optional opacity
 *
 * Reference: https://gist.github.com/danieliser/b4b24c9f772066bcf0a6
 */

export const hexToRgba = (hexCode: string, opacity: number = 1): string => {
  try {
    let hex = hexCode.replace('#', '')

    let r, g, b

    if (hex.length === 3) {
      r = parseInt(hex.substring(0, 1), 16)
      g = parseInt(hex.substring(1, 2), 16)
      b = parseInt(hex.substring(2, 3), 16)
    } else {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  } catch (error) {
    console.error(error)
    return hexCode
  }
}

/**
 * Get the contrasting color for any hex color
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */

export const getContrastColor = (hexCode: string): string => {
  // If a leading # is provided, remove it
  if (hexCode.slice(0, 1) === '#') {
    hexCode = hexCode.slice(1)
  }

  // If a three-character hexcode, make six-character
  if (hexCode.length === 3) {
    hexCode = hexCode
      .split('')
      .map(function (hex) {
        return hex + hex
      })
      .join('')
  }

  // Convert to RGB value
  let r = parseInt(hexCode.substr(0, 2), 16)
  let g = parseInt(hexCode.substr(2, 2), 16)
  let b = parseInt(hexCode.substr(4, 2), 16)

  // Get YIQ ratio
  let yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Check contrast
  return yiq >= 128 ? 'black' : 'white'
}
