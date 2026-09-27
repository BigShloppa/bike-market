import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket;

const getSocket = () => {
  if (!socket) {
    socket = io('/', { transports: ['websocket'] });
    socket.on('connect', () => {
      const token = localStorage.getItem('token');
      if (token) socket.emit('auth', token);
    });
  }
  return socket;
};

const EVENTS = ['bike:new', 'bike:deleted', 'message:new'];

export const useSocket = (handlers = {}) => {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const s = getSocket();

    const token = localStorage.getItem('token');
    if (token && s.connected) s.emit('auth', token);

    const fns = {};
    EVENTS.forEach((evt) => {
      fns[evt] = (data) => ref.current[evt]?.(data);
      s.on(evt, fns[evt]);
    });

    return () => EVENTS.forEach((evt) => s.off(evt, fns[evt]));
  }, []);
};