'use strict'


let ConnectionHandler = require('./server/connectionHandler');
let express = require('express');

let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

server.listen(9090);
app.use(express.static('public'));

// gpio installieren
let gpio = require('pi-gpio')
// let gpio = undefined

io.on('connection', function (socket) {
    new ConnectionHandler(socket, gpio);
});
