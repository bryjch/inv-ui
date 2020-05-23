// config-overrides.js for React App Rewired
// https://github.com/timarney/react-app-rewired/

const { override, addBabelPlugin, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addBabelPlugin(['styled-jsx/babel', { plugins: ['styled-jsx-plugin-sass'] }]),
  addWebpackAlias({
    '@views': path.join('/views'),
    '@redux': path.join('/redux'),
    '@utils': path.join('/utils'),
    '@assets': path.join('/assets'),
    '@services': path.join('/services'),
  })
)
