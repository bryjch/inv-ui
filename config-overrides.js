// config-overrides.js for React App Rewired
// https://github.com/timarney/react-app-rewired/

const { override, addBabelPlugin, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addBabelPlugin(['styled-jsx/babel', { plugins: ['styled-jsx-plugin-sass'] }]),
  addWebpackAlias({
    ['@views']: path.resolve(__dirname, './src/views'),
    ['@redux']: path.resolve(__dirname, './src/redux'),
    ['@utils']: path.resolve(__dirname, './src/utils'),
    ['@assets']: path.resolve(__dirname, './src/assets'),
    ['@services']: path.resolve(__dirname, './src/services'),
  })
)
