const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://avalonconnect.herokuapp.com/",
    methods: ["GET", "POST"],
  },
});

let count = 0;

io.on("connection", (socket) => {
  count += 1;
  io.emit("count", count);

  socket.on("here", () => {
    console.log("YESS");
  });

  socket.on("disconnect", () => {
    count -= 1;
    io.emit("count", count);
  });
});

app.use(router);

server.listen(process.env.PORT || 3333, () =>
  console.log(`AvalonConnect is listening on port ${process.env.PORT || 3333}`)
);
