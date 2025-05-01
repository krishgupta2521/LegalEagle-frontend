import io from 'socket.io-client';

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io('/api', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }
  return socket;
};

export const authenticateSocket = (userId, role) => {
  const socketInstance = initSocket();
  socketInstance.emit('authenticate', { userId, role });
};

export const joinChatRoom = (chatId, userId, role) => {
  const socketInstance = initSocket();
  socketInstance.emit('joinRoom', { chatId, userId, role });
};

export const sendMessage = (chatId, sender, text, userId, lawyerId) => {
  const socketInstance = initSocket();
  socketInstance.emit('sendMessage', { chatId, sender, text, userId, lawyerId });
};

export const sendTypingStatus = (chatId, user) => {
  const socketInstance = initSocket();
  socketInstance.emit('typing', { chatId, user });
};

export const stopTypingStatus = (chatId) => {
  const socketInstance = initSocket();
  socketInstance.emit('stopTyping', { chatId });
};

export const onReceiveMessage = (callback) => {
  const socketInstance = initSocket();
  socketInstance.on('receiveMessage', (message) => {
    callback(message);
  });
};

export const onUserTyping = (callback) => {
  const socketInstance = initSocket();
  socketInstance.on('userTyping', ({ user }) => {
    callback(user);
  });
};

export const onUserStoppedTyping = (callback) => {
  const socketInstance = initSocket();
  socketInstance.on('userStoppedTyping', callback);
};

export const onNewMessageNotification = (callback) => {
  const socketInstance = initSocket();
  socketInstance.on('newMessageNotification', (data) => {
    callback(data);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
