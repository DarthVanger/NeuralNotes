const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    publicPath: ASSET_PATH,
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        //   use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          }
        ]
      }, {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }, {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{
          loader: 'file-loader'
        }],
      }
    ]
  },
  devtool: 'eval',
  mode: 'production',
  amd: {jQuery: true},
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  resolveLoader: {
    alias: {
      text: 'text-loader'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new LiveReloadPlugin(),
    new CopyWebpackPlugin([
      {from: 'src/**/*.jpg'},
      {from: 'src/**/*.png'},
    ])
  ]
};
