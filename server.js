const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();
let messages = [];
let adminUsers = {}; // Store admin users by room ID
const io = new Server(httpServer, {
  cors: {
    origin: true, // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (data) => {
    const { roomId, isAdmin } = data;

    if (isAdmin) {
      // If the user is an admin, they can create a room
      if (!adminUsers[roomId]) {
        adminUsers[roomId] = socket.id;
        socket.join(roomId);
        console.log(
          `Admin user with id-${socket.id} created and joined room - ${roomId}`
        );
      } else {
        // Admin already exists for this room
        socket.emit("admin_already_exists", { roomId });
      }
    } else {
      // If the user is not an admin, they can join an existing room
      if (adminUsers[roomId]) {
        socket.join(roomId);
        console.log(
          `Non-admin user with id-${socket.id} joined room - ${roomId}`
        );
      } else {
        // Admin doesn't exist for this room
        socket.emit("admin_not_found", { roomId });
      }
    }
  });

  socket.on("send_msg", (data) => {
    console.log(data, "DATA");
    // This will send a message to a specific room ID
    socket.to(data.roomId).emit("receive_msg", data);
    messages.push(data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
