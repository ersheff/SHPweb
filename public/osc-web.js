'use strict';
var osc = require('node-osc');

var oscServer, oscClient;
// var test = {
//   server.port = 8888;
//   server.host = "localhost";
//   client.host = "localhost";
//   client.port = 82;
// }

io.on('connection', function (socket) {
  socket.on('config', function (obj) {
    console.log('config', obj);
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);

    oscClient.send('/status', socket.id + ' connected');

    oscServer.on('message', function(msg, rinfo) {
      socket.emit('message', msg);
      console.log('sent OSC message to WS', msg, rinfo);
    });
  });
  socket.on('message', function (obj) {
    var toSend = obj.split(' ');
    oscClient.send(...toSend);
    console.log('sent WS message to OSC', toSend);
  });
  socket.on("disconnect", function () {
    oscServer.kill();
  })
});
