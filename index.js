const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo.listen(server);
const port = 5000;

app.use(express.static(path.resolve(__dirname, "public")));

server.listen(port, () => {
  console.log(`This server is running at port ${port}`);
});

const history = [];

io.on("connection", (socket) => {
  console.log("New conection");
  history.forEach((line) => {
    socket.emit("isDrawing", line);
  });
  socket.on("isDrawing", (line) => {
    history.push(line);
    io.emit("isDrawing", line);
  });
});
