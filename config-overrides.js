// config-overrides.js for React App Rewired
// https://github.com/timarney/react-app-rewired/

const { override, addBabelPlugin, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addBabelPlugin([
    'styled-jsx/babel',
    {
      plugins: [
        [
          'styled-jsx-plugin-sass',
          {
            sassOptions: { includePaths: ['src'] },
          },
        ],
      ],
    },
  ]),
  addWebpackAlias({
    ['@assets']: path.resolve(__dirname, './src/assets'),
    ['@constants']: path.resolve(__dirname, './src/constants'),
    ['@pages']: path.resolve(__dirname, './src/pages'),
    ['@services']: path.resolve(__dirname, './src/services'),
    ['@shared']: path.resolve(__dirname, './src/shared'),
    ['@utils']: path.resolve(__dirname, './src/utils'),
    ['@zus']: path.resolve(__dirname, './src/zustand'),
  })
)
