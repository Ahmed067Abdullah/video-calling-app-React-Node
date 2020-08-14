const express = require("express");
const path = require("path");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 5000;

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

app.get("/home", (req, res) => res.json({ "hello": "world" }));

// for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))