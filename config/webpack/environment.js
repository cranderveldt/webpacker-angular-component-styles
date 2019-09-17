const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')

environment.loaders.prepend('typescript', typescript)

const webpack = require('webpack')
const { resolve } = require('path')

environment.plugins.append('ContextReplacement', new webpack.ContextReplacementPlugin(
  new RegExp(/\@angular(\\|\/)core(\\|\/)(\@angular|fesm5)/),
  resolve(__dirname, './ClientApp')
))

environment.loaders.append('html', {
  test: /\.html$/,
  use: [{
    loader: 'html-loader',
    options: {
      minimize: true,
      exportAsEs6Default: 'es6',
      removeAttributeQuotes: false,
      caseSensitive: true,
      customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
      customAttrAssign: [ /\)?\]?=/ ]
    }
  }]
})

environment.loaders.insert('sass', {
  test: /\.scss$/,
  use: [
    { loader: 'to-string-loader' },
    { loader: 'css-loader' },
    { loader: 'postcss-loader' },
    { loader: 'resolve-url-loader' },
    { loader: 'sass-loader' },
  ]
})


module.exports = environment
