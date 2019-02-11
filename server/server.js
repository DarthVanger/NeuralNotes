const log = require('./logger');
const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config.js');

log.info('Starting express server');

app.use(webpackMiddleware(webpack(webpackConfig)));

app.listen(3000, () => {
  log.info('listening on *:3000')
});
