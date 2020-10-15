// config-overrides.js for React App Rewired
// https://github.com/timarney/react-app-rewired/

const { override, addBabelPlugin, addWebpackPlugin, addWebpackAlias } = require('customize-cra')
const webpack = require('webpack')
const path = require('path')

module.exports = override(
  addBabelPlugin(['styled-jsx/babel', { plugins: ['styled-jsx-plugin-sass'] }]),

  // Webpack appears to work poorly with libraries bundles with Parcel and throws:
  // "Critical dependency: the request of a dependency is an expression"
  // https://github.com/parcel-bundler/parcel/issues/2883
  // https://medium.com/tomincode/hiding-critical-dependency-warnings-from-webpack-c76ccdb1f6c1
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/\/@monogatari\/core\//, data => {
      delete data.dependencies[0].critical
      return data
    })
  ),

  addWebpackAlias({
    ['@views']: path.resolve(__dirname, './src/views'),
    ['@redux']: path.resolve(__dirname, './src/redux'),
    ['@utils']: path.resolve(__dirname, './src/utils'),
    ['@assets']: path.resolve(__dirname, './src/assets'),
    ['@services']: path.resolve(__dirname, './src/services'),
  })
)
