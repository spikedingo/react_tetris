var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    "webpack-dev-server/client?http://0.0.0.0:3000/",
    "webpack/hot/only-dev-server",
    "./app/app.js"
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath:'/build/'
  },
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015']
    }, 
    {
      test: /\.(png|jpg|segif)$/,
      loader: 'url-loader?limit=8192'
    }, 
    {
      test: /\.css$/,
      loader: 'style!css'
    }]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ]
}
