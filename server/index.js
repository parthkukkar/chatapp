const express = require("express");
//created an instance of express
const app = express();
const http = require("http");
const cors = require("cors");

// imported the Server class from the "socket.io"
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  
  io.on("connection", (socket) => {
    //evry piece of code for socket io will be inside this cause u should only be listening to socket events when user has connected  
    //eache user gets a specific id(socket.id) when they connect to the socket server
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
      socket.emit('userid',socket.id)
    });
  
    socket.on("send_message", (data) => {

        //emitted msg only to guys in room
      socket.to(data.room).emit("receive_message", data);
    });
  
    //listening to an event disconnect 
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
  
  server.listen(3001, () => {
    console.log("SERVER RUNNING");
  });