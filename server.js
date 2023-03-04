const port = 3000;

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

//import the javascript
const formatMessage = require('./utils/messages.js') 


const app = express();
const server = http.createServer(app);
const io =socketio(server)

// Serve static files from the public directory
app.use(express.static('public'));

const mask = 'mask';

io.on('connection', socket => {
  //right when a connection happens
  console.log('hellow world');

  //sends to just the user client
  socket.emit('message', formatMessage(mask, 'Welcome to Chatroom'));

  //sends to other clients
  socket.broadcast.emit('message', formatMessage(mask,'A user has joined'));

  socket.on('disconnect', () => {
    io.emit('message', formatMessage(mask,'User left the Chat'));
  })

  //catch the message sent
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg));
  });
})

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
