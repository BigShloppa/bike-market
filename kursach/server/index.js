import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { setIO } from './src/services/socketService.js';
import { verifyToken } from './src/utils/token.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*' },
});

setIO(io);

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id);

  socket.on('auth', (token) => {
    try {
      const payload = verifyToken(token);
      socket.join(`user:${payload.id}`);
      socket.data.userId = payload.id;
    } catch {
      // ignore
    }
  });

  socket.on('disconnect', () => console.log('socket disconnected:', socket.id));
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});