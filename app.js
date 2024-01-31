const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const usernames = [];

io.on('connection', (socket) => {
  console.log('a user connected');

  // Add user to usernames array
  usernames.push(socket.id);
  io.emit('usernames', usernames);

  socket.on('disconnect', () => {
    console.log('user disconnected');

    // Remove user from usernames array
    const index = usernames.indexOf(socket.id);
    if (index !== -1) {
      usernames.splice(index, 1);
      io.emit('usernames', usernames);
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('username', (username) => {
    const index = usernames.indexOf(socket.id);
    if (index !== -1) {
      usernames[index] = username;
      io.emit('usernames', usernames);
    }
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});