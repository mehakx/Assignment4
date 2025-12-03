// Import required modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS enabled
// CORS lets the client connect from different ports during development
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the client directory
// This makes index.html and client files accessible
app.use(express.static('client'));
app.use(express.static('.'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Store active rooms and their users
// I'm using an object to keep track of who's in each room
const rooms = {};
const MAX_USERS = 2; // Assignment requirement: only 2 users per room

// When a user connects to the WebSocket server
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining a room
  socket.on('join-room', (roomId) => {
    console.log(`User ${socket.id} wants to join room ${roomId}`);

    // Create the room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        createdAt: new Date()
      };
    }

    const room = rooms[roomId];

    // Check if room is full
    if (room.users.length >= MAX_USERS) {
      console.log(`Room ${roomId} is full`);
      socket.emit('room-full', { roomId });
      return;
    }

    // Add user to the room
    room.users.push(socket.id);
    socket.join(roomId);
    
    // Assign user number (1 or 2)
    const userNumber = room.users.length;
    
    console.log(`User ${socket.id} joined room ${roomId} as User ${userNumber}`);

    // Tell this user their number
    socket.emit('user-number', { userNumber });

    // Tell everyone in the room about the new user
    io.to(roomId).emit('room-status', {
      totalUsers: room.users.length,
      users: room.users
    });

    // Store the room ID on the socket so we can use it later
    socket.roomId = roomId;
    socket.userNumber = userNumber;
  });

  // Handle drawing events
  // When one user draws, I send it to the other user in the room
  socket.on('draw', (data) => {
    if (socket.roomId) {
      // Broadcast to everyone in the room EXCEPT the sender
      // This prevents the user from seeing their own drawing twice
      socket.to(socket.roomId).emit('draw', data);
    }
  });

  // Handle cursor movement
  // I'm tracking where each user's cursor is so they can see each other
  socket.on('cursor-move', (data) => {
    if (socket.roomId) {
      // Send cursor position to the other user
      socket.to(socket.roomId).emit('cursor-move', {
        ...data,
        userId: socket.id,
        userNumber: socket.userNumber
      });
    }
  });

  // Handle clear canvas
  // When one user clears, both canvases should clear
  socket.on('clear-canvas', () => {
    if (socket.roomId) {
      // Tell everyone in the room (including sender) to clear
      io.to(socket.roomId).emit('clear-canvas');
    }
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove user from their room
    if (socket.roomId && rooms[socket.roomId]) {
      const room = rooms[socket.roomId];
      room.users = room.users.filter(id => id !== socket.id);

      // Notify remaining users
      io.to(socket.roomId).emit('room-status', {
        totalUsers: room.users.length,
        users: room.users
      });

      // Delete empty rooms to save memory
      if (room.users.length === 0) {
        delete rooms[socket.roomId];
        console.log(`Room ${socket.roomId} deleted (empty)`);
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
