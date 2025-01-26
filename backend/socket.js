const socketIO = require('socket.io');

const socketServer = (server) => {
  const io = socketIO(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('sendMessage', (message) => {
      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = socketServer;
