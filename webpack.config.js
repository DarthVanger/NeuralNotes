const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack')

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    publicPath: ASSET_PATH,
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        use: 'babel-loader',
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
  devtool: 'source-map',
  // mode: 'production',
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
  optimization: {
    minimizer: [
      new UglifyJsPlugin()
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ // reduces the size of react dependencies by 1mb 
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new LiveReloadPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/**/*.jpg' },
      { from: 'src/**/*.png' },
    ]),
    new CompressionPlugin({ 
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new BundleAnalyzerPlugin()
  ]
};
