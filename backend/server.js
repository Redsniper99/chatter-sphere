// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const socketServer = require('./socket');
const messageRoutes = require('./src/routes/messageRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const errorHandler = require('./src/middleware/errorMiddleware');


dotenv.config();
connectDB();

const app = express();
app.use(
    cors({
      origin: "http://localhost:3000", // Allow requests from frontend
      credentials: true, // Allow cookies, authorization headers, etc.
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

const server = http.createServer(app);
socketServer(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
