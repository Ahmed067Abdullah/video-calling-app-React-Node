const app = require("express")();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 5000;

io.on('connection', socket => {
  console.log('user connected')
});

app.get("/", (req, res) => res.json({ "msg": "Hello World" }))

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))