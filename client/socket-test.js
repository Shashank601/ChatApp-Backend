// socket-test.js (JS, Socket.IO has NO C++ client)

import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjhjMGRjZGY1MzRjMjE1ZDQ1NjjzNCIsImlhdCI6MTc2ODQ4MDAyNCwiZXhwIjoxNzY4NDgxMjI0fQ.9EYvhwC0-Hc4esSBNmDi79I5J0YFQt_XFRj2J3f15Oo"
  }
});

// connection
socket.on("connect", () => {
  console.log("CONNECTED:", socket.id);

  // emit test event
  socket.emit("sendMessage", {
    recipientId: "USER_ID_2",
    text: "hello from socket test"
  });
});

// server responses
socket.on("messageReceived", (msg) => {
  console.log("MESSAGE RECEIVED:", msg);
});

// errors
socket.on("connect_error", (err) => {
  console.log("CONNECTION ERROR:", err.message);
});
