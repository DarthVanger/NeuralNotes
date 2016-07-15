var path = require('path');

module.exports = {
    entry: "./src/app-start.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
        libraryTarget: 'amd'
    },
    resolve: {
      root: path.resolve('./src'),
      extensions: ['', '.js']
    }
};
