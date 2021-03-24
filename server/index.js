const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }) => {
        socket.emit('message', { user: 'admin', text: `${name}, welcome to the room ${room}`, room }); // Emitir mensagem ao admin
        socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} has joined!`, room }); // Emitir mensagem aos outros usuários

        socket.join(room);
    });

    socket.on('sendMessage', (user, room, message, callback) => {
        io.emit('message', { user, room, text: message });

        callback();
    });
})

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));