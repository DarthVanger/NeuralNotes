var log = require('./logger');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

log.info('Starting express server');

app.use(express.static('./'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

http.listen(3000, function(){
  log.info('listening on *:3000');
});
