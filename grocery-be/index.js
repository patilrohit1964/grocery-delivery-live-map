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
// if we want listen any event that coming from frontend then use (on) method for that
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
    const location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    await axios.post(
      `${process.env.NEXT_BASE_URL}/api/socket/update-location`,
      {
        userId,
        location,
      },
    );
    io.emit("update-deliveryBoy-location", { userId, location });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.post("/notify", (req, res) => {
  const { event, data, socketId } = req.body;
  if (socketId) {
    // if we want event only particular user or id then use to(socketId) and use emit for event know
    io.to(socketId).emit(event, data);
  } else {
    // if socket id not peresent then listen this event all
    io.emit("new-order", data);
  }
  return res.status(200).json({
    success: true,
  });
});

server.listen(port, () => {
  console.log("server started at", port);
});
