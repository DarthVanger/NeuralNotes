var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require
});

var environment = requirejs('Environment');
var run = requirejs('Run');
console.log('env = ' + environment);

run.run();
