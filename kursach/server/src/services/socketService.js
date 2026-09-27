let io = null;

export const setIO = (instance) => {
  io = instance;
};

export const emitToAll = (event, data) => {
  if (io) io.emit(event, data);
};

export const emitToUser = (userId, event, data) => {
  if (io) io.to(`user:${userId}`).emit(event, data);
};