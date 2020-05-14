// config-overrides.js for React App Rewired
// https://github.com/timarney/react-app-rewired/

const { override, addBabelPlugin, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addBabelPlugin(['styled-jsx/babel', { plugins: ['styled-jsx-plugin-sass'] }]),
  addWebpackAlias({
    '@views': path.join('./src/views'),
    '@redux': path.join('./src/redux'),
    '@utils': path.join('./src/utils'),
    '@assets': path.join('./src/assets'),
    '@services': path.join('./src/services'),
  })
)
