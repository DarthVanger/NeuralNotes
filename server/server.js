import webpack from 'webpack';
import path from 'path';
import webpackConfig from '../webpack.config.js';
import WebpackDevServer from 'webpack-dev-server';
import log from './logger';

const options = {
  hot: true,
  publicPath: path.resolve(__dirname, '/dist'),
  port: 3000,
  host: 'localhost',
};

log.info('Starting dev server');

WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);

const server = new WebpackDevServer(webpack(webpackConfig));
server.listen(options.port, () => log.info('listening on *:3000'));
