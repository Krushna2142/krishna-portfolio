// utils/socket.js
// Socket.IO instance holder to avoid global variables

let io = null;

module.exports = {
  setIO: (socketIO) => {
    io = socketIO;
  },
  getIO: () => {
    return io;
  },
};
