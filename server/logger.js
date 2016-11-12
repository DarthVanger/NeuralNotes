var winston = require('winston');

/**
 * Using "winston" logger:
 * https://github.com/winstonjs/winston
 */
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        })
    ]
});

logger.info('yo niggas :) im your logger');

module.exports = logger;

