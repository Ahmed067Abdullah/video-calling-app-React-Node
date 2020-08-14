const app = require("express")();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 5000;

const users = {};

io.on('connection', socket => {
  socket.on('user-registered', name => {
    if (!users[socket.id]) {
      users[socket.id] = {
        name,
        id: socket.id
      };
    }
    socket.emit("your-id", socket.id);
    io.sockets.emit("all-users", users);
  });

  socket.on("initiate-call", data => {
    io.to(data.userToCall).emit('incoming-call', { signal: data.signalData, from: data.from });
  });

  socket.on("accept-call", data => {
    io.to(data.to).emit('call-accepted', data.signal);
  });

  socket.on("reject-call", data => {
    io.to(data.caller.id).emit('call-rejected', {});
  });
  
  socket.on("disconnect-call", data => {
    io.to(data.inCallWith).emit('call-disconnected', {});
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete users[socket.id];
    io.sockets.emit("all-users", users);
  });
});

app.get("/", (req, res) => res.json({ "hello": "world" }))

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))