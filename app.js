// Global variables
let socket = null;
let canvas = null;
let ctx = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';
let currentBrushSize = 5;
let currentRoom = null;
let userNumber = null;
let remoteCursorElement = null;

// Generate a random 6-character room code
// I'm using Math.random() and converting to base-36 to get alphanumeric characters
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create a new room
function createRoom() {
    const roomCode = generateRoomCode();
    currentRoom = roomCode;
    showCanvasPage();
    connectToRoom(roomCode);
}

// Join an existing room
function joinRoom() {
    const roomCode = document.getElementById('room-code-input').value.trim().toUpperCase();
    
    if (!roomCode) {
        alert('Please enter a room code');
        return;
    }
    
    if (roomCode.length !== 6) {
        alert('Room code must be 6 characters');
        return;
    }
    
    currentRoom = roomCode;
    showCanvasPage();
    connectToRoom(roomCode);
}

// Leave the current room
function leaveRoom() {
    if (socket) {
        socket.disconnect();
    }
    
    // Reset everything
    currentRoom = null;
    userNumber = null;
    
    // Clear the canvas
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Show landing page
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('canvas-page').style.display = 'none';
    
    // Clear room code input
    document.getElementById('room-code-input').value = '';
}

// Show the canvas page and hide landing page
function showCanvasPage() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('canvas-page').style.display = 'block';
    document.getElementById('room-code').textContent = currentRoom;
    
    // Initialize canvas if not already done
    if (!canvas) {
        initCanvas();
    }
}

// Initialize the canvas
function initCanvas() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    // Set up drawing event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Set up brush size slider
    const brushSizeSlider = document.getElementById('brush-size');
    brushSizeSlider.addEventListener('input', (e) => {
        currentBrushSize = e.target.value;
        document.getElementById('brush-size-display').textContent = currentBrushSize + 'px';
    });
}

// Connect to the WebSocket server and join a room
function connectToRoom(roomCode) {
    // Connect to Socket.IO server
    socket = io();
    
    // When connected, join the room
    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('join-room', roomCode);
    });
    
    // Server tells us our user number
    socket.on('user-number', (data) => {
        userNumber = data.userNumber;
        console.log('I am User', userNumber);
        updateUserStatus();
    });
    
    // Room status update (how many users are in the room)
    socket.on('room-status', (data) => {
        console.log('Room status:', data);
        updateUserStatus(data.totalUsers);
    });
    
    // Room is full - can't join
    socket.on('room-full', (data) => {
        alert('This room is full (maximum 2 users)');
        leaveRoom();
    });
    
    // Receive drawing data from the other user
    socket.on('draw', (data) => {
        drawLine(data.x1, data.y1, data.x2, data.y2, data.color, data.size);
    });
    
    // Receive cursor position from the other user
    socket.on('cursor-move', (data) => {
        updateRemoteCursor(data.x, data.y, data.userNumber);
    });
    
    // Other user cleared the canvas
    socket.on('clear-canvas', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

// Update the user status display
function updateUserStatus(totalUsers) {
    const statusElement = document.getElementById('user-status');
    
    if (userNumber) {
        let status = `You are User ${userNumber}`;
        if (totalUsers) {
            status += ` | ${totalUsers}/2 users in room`;
        }
        statusElement.textContent = status;
    } else {
        statusElement.textContent = 'Connecting...';
    }
}

// Start drawing
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

// Draw on the canvas
function draw(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Send cursor position to other user (even when not drawing)
    if (socket) {
        socket.emit('cursor-move', { x, y });
    }
    
    // Only draw if mouse is pressed
    if (!isDrawing) return;
    
    // Draw locally first (for immediate feedback)
    drawLine(lastX, lastY, x, y, currentColor, currentBrushSize);
    
    // Send drawing data to server
    if (socket) {
        socket.emit('draw', {
            x1: lastX,
            y1: lastY,
            x2: x,
            y2: y,
            color: currentColor,
            size: currentBrushSize
        });
    }
    
    // Update last position
    lastX = x;
    lastY = y;
}

// Stop drawing
function stopDrawing() {
    isDrawing = false;
}

// Draw a line on the canvas
// This function is used for both local and remote drawing
function drawLine(x1, y1, x2, y2, color, size) {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tell the other user to clear too
    if (socket) {
        socket.emit('clear-canvas');
    }
}

// Select a color
function selectColor(color) {
    currentColor = color;
    
    // Update active state on color buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Update the remote cursor position
function updateRemoteCursor(x, y, userNum) {
    // Create cursor element if it doesn't exist
    if (!remoteCursorElement) {
        remoteCursorElement = document.createElement('div');
        remoteCursorElement.className = 'remote-cursor';
        remoteCursorElement.innerHTML = '<div class="cursor-label">User ' + userNum + '</div>';
        document.getElementById('canvas-container').appendChild(remoteCursorElement);
    }
    
    // Update cursor position
    // I need to account for the canvas position and padding
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = document.getElementById('canvas-container').getBoundingClientRect();
    
    remoteCursorElement.style.left = (x + (canvasRect.left - containerRect.left)) + 'px';
    remoteCursorElement.style.top = (y + (canvasRect.top - containerRect.top)) + 'px';
    remoteCursorElement.style.display = 'block';
}
