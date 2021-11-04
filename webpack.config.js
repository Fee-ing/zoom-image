const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'index.js',
    library: 'fee-zoom-image',
    libraryTarget: 'umd'
  }
}