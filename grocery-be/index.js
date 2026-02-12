import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
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
  socket.on("identity", async (userId) => {
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
      userId,
      socketId: socket.id,
    });
  });
  socket.on("updateLocation", async ({ userId, latitude, longitude }) => {
   
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
server.listen(port, () => {
  console.log("server started at", port);
});
