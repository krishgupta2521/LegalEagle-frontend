import { io } from 'socket.io-client';

let socket = null;

// Hardcoded lawyer ID for fallback authentication
const DEFAULT_LAWYER_ID = '681587a83959e1fcc560dc0a';

export const initSocket = () => {
  console.log("Initializing socket connection");
  const serverUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : `${window.location.protocol}//${window.location.hostname}`;
  
  if (!socket) {
    socket = io(serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    socket.on('connect', () => {
      console.log('Socket connected successfully with ID:', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  
  return socket;
};

export const authenticateSocket = (userId, role) => {
  if (!socket) {
    console.warn("Socket not initialized, cannot authenticate");
    return;
  }
  
  if (!userId) {
    console.error("Missing userId for socket authentication");
    return;
  }
  
  // Get authentication token from localStorage
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error("No authentication token found in localStorage");
    return;
  }
  
  console.log(`Authenticating socket with token and user ${userId}, role ${role}`);
  
  // Remove previous listeners to avoid duplicates
  socket.off('authError');
  socket.off('authenticated');
  
  // Set up listeners for authentication events
  socket.on('authError', (error) => {
    console.error('Socket authentication error:', error);
  });
  
  socket.on('authenticated', () => {
    console.log('Socket authenticated successfully');
  });
  
  // Send authentication data to server
  socket.emit('authenticate', { userId, role, token });
};

export const joinChatRoom = (chatId) => {
  if (!socket) {
    console.warn("Socket not initialized, cannot join room");
    return;
  }
  
  console.log(`Joining chat room: ${chatId}`);
  socket.emit('joinRoom', { chatId });
};

export const sendMessage = (chatId, sender, text, userId, lawyerId) => {
  if (!socket) {
    console.warn("Socket not initialized, cannot send message");
    return;
  }
  
  console.log(`Sending message to chat ${chatId} as ${sender}`);
  socket.emit('sendMessage', { chatId, sender, text, userId, lawyerId });
};

export const onReceiveMessage = (callback) => {
  if (!socket) {
    console.warn("Socket not initialized, cannot set up listener");
    return;
  }
  
  socket.on('receiveMessage', callback);
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting socket");
    socket.off('authenticated');
    socket.off('authError');
    socket.off('receiveMessage');
    socket.disconnect();
    socket = null;
  }
};

export const startTyping = (chatId) => {
  if (!socket) return;
  socket.emit('typing', { chatId });
};

export const stopTyping = (chatId) => {
  if (!socket) return;
  socket.emit('stopTyping', { chatId });
};

export const markChatAsRead = (chatId) => {
  if (!socket) return;
  socket.emit('markAsRead', { chatId });
};
