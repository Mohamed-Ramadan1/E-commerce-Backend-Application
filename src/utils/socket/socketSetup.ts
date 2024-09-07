// socketSetup.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import Notification from "../../models/notification/notificationModal";

let io: Server;

export function initializeSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // Replace with your React app URL
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });

    // Implementing logic to handle missed notifications when a user reconnects
    socket.on("join", async (userId: string) => {
      socket.join(userId);

      // Fetch unread notifications and emit them
      const unreadNotifications = await Notification.find({
        user: userId,
        read: false,
      });
      if (unreadNotifications.length > 0) {
        socket.emit("notification", {
          type: "MISSED_NOTIFICATIONS",
          payload: unreadNotifications,
        });
      }
    });
  });
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}
