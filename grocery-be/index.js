import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";
const app = express();
app.use(express.json());
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL,
  },
});
// if we want listen any even that coming from frontend then use (on) method for that
// jevha pan aapan kahi listen karto tevha he socket ch (on) method use krych aani jevha pan konta emit karto tevha io ch (on) use krych

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on('identity',(data)=>{
    console.log(data,'joined data')
  })
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
server.listen(port, () => {
  console.log("server started at", port);
});
