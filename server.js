const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    // origin: "http://avalonconnect.herokuapp.com", //! CHANGE BEFORE PUSHING
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let count = 0;

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ room, username }) => {
    const user = userJoin(socket.id, username, room.toUpperCase());
    socket.join(user.room);

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.use(router);

server.listen(process.env.PORT || 3333, () =>
  console.log(`AvalonConnect is listening on port ${process.env.PORT || 3333}`)
);
