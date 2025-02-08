const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config();

// Import routes
// const userRoutes = require('./routes/userRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const grievanceRoutes = require('./routes/grievanceRoutes');
// const communityRoutes = require('./routes/communityRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const communityRoutes = require('./routes/communityRoutes');


// Import middleware
// const { errorHandler } = require('./middleware/errorHandler');
// const { authMiddleware } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const { protect, authorize } = require('./middleware/authMiddleware');



// Initialize express
const app = express();
const server = http.createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
require('./config/database');

// WebSocket connection handling
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Broadcast updates to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', protect, projectRoutes);
app.use('/api/grievances', protect, grievanceRoutes);
app.use('/api/community', protect, communityRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;