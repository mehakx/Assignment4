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


