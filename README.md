# Collaborative Canvas - WebSocket Drawing Application

A real-time collaborative drawing application that allows two users to draw together on a shared canvas using WebSockets.

## Project Overview

This application demonstrates real-time collaboration using Node.js and WebSockets. Two users can join the same room using a unique code and draw together, seeing each other's strokes and cursor positions in real-time.

## Features

- **Real-Time Drawing**: Draw on a shared canvas with instant synchronization
- **Room System**: Create or join rooms using 6-character codes
- **Two-User Limit**: Each room supports exactly 2 users (assignment requirement)
- **Cursor Tracking**: See where your collaborator's cursor is positioned
- **Drawing Tools**: Color picker with 10 colors and adjustable brush size (1-20px)
- **Clear Canvas**: Synchronized canvas clearing for both users
- **No Authentication**: Simple room code system, no login required

## Technology Stack

- **Backend**: Node.js with Express
- **WebSocket Library**: Socket.IO for real-time bidirectional communication
- **Frontend**: Vanilla JavaScript with HTML5 Canvas API
- **Styling**: Custom CSS with gradient backgrounds

## Installation

1. **Clone or download this repository**

2. **Install dependencies**:
```bash
npm install
```

3. **Start the server**:
```bash
npm start
```

4. **Open your browser**:
Navigate to `http://localhost:3000`

## How to Use

### Creating a Room
1. Click "Create New Room" on the landing page
2. Share the generated 6-character room code with a friend
3. Start drawing on the canvas

### Joining a Room
1. Enter the room code provided by your friend
2. Click "Join Room"
3. You'll see your friend's drawings in real-time

### Drawing
1. Select a color from the color palette
2. Adjust brush size using the slider
3. Click and drag on the canvas to draw
4. Your drawings appear instantly on your collaborator's screen

### Clearing the Canvas
- Click "Clear Canvas" to erase all drawings
- This action affects both users in the room

## Project Structure

```
websocket-demo/
├── server.js           # Node.js WebSocket server
├── index.html          # Main HTML page with UI
├── client/
│   └── app.js         # Client-side JavaScript
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── PROTOCOL.md        # WebSocket protocol documentation
```

## Assignment Requirements Met

✅ **Real-Time Collaboration**: WebSockets connect two users in real-time  
✅ **Node.js Server**: Express server handles WebSocket signaling  
✅ **Shared State**: Drawing actions update both users' views instantly  
✅ **Basic UI**: Clean interface with clear indicators  
✅ **Two Users Only**: Room management enforces 2-user limit  
✅ **No Authentication**: Simple room code system

## WebSocket Events

### Client → Server
- `join-room`: Join a specific room
- `draw`: Send drawing data
- `cursor-move`: Send cursor position
- `clear-canvas`: Clear the canvas

### Server → Client
- `user-number`: Receive assigned user number (1 or 2)
- `room-status`: Receive current room status
- `room-full`: Notification when room is at capacity
- `draw`: Receive drawing data from other user
- `cursor-move`: Receive cursor position from other user
- `clear-canvas`: Receive clear canvas command

## Development Notes

- The server runs on port 3000 by default (configurable via PORT environment variable)
- Rooms are stored in memory and automatically cleaned up when empty
- Canvas size is 1200x600 pixels for optimal drawing space
- Socket.IO provides automatic reconnection if connection drops

## Testing

To test the collaboration feature:
1. Open the application in one browser window
2. Create a room and note the room code
3. Open the application in another browser window (or incognito mode)
4. Join using the room code
5. Draw in one window and watch it appear in the other

## Future Enhancements

- Undo/redo functionality
- Save drawings as PNG images
- More drawing tools (shapes, text, eraser)
- Support for more than 2 users
- Persistent room storage

## License

MIT License - Created for educational purposes

## Author

Created as part of a real-time collaboration assignment demonstrating WebSocket technology.
