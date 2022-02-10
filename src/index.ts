import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 } from "uuid";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4000;

const { ExpressPeerServer } = require("peer");

const p = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", p);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.send(v4());
});

app.get("/:room", (req, res) => {
  res.render("index", { RoomId: req.params.room });
});

io.on("connection", socket => {
  socket.on("newUser", (id, room) => {
    socket.join(room);

    console.log(`${id} has joined ${room}`);

    socket.to(room).emit("userJoined", id);
    socket.on("disconnect", () => {
      socket.to(room).emit("userDisconnect", id);
    });
  });
});
server.listen(port, () => {
  console.log("Server running on port : " + port);
});
