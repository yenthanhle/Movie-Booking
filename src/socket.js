let io
module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer)
    if (!io) throw new Error('Socket Error')
    return io
  },
  getIO: () => {
    if (!io) throw new Error('Socket does not exist!!!')
    return io
  },
}

// const error = throw new...
// error.httpStatusCode = 500
