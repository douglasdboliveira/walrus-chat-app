const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, verifyExistingRoom, removeUser, getUser } = require('./users.js');
const { addRooms, addMessages, removeRooms, readMessages } = require('./rooms.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        // Um ou outro
        const { error, user } = addUser({ id: socket.id, name, room }); 

        if(error) return callback(error);

        const addedRoom = addRooms(room);
        console.log(addedRoom);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` }); // Emitir mensagem ao admin
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` }); // Emitir mensagem aos outros usuários

        socket.join(user.room);

        callback();
    });

    socket.on('readMessages', (callback) => {
        const user = getUser(socket.id);
        readMessages(user); // Tentar enviar o usuário completo - OK
        // console.log(user.room);

        callback('Voltei!');
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        const rooms = addMessages(message, user.room, user.name); 
        // Tentar enviar o usuário também - OK

        rooms.forEach((room) => {
            console.log(room);
        })

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id); // ok      

        const searchResult = verifyExistingRoom(user.room); // ok
        // Pra ver se ainda tem usuários na sala

        const deletedRoom = removeRooms(searchResult); // ou o nome da sala, ou undefined

        console.log(`Deleted room: ${deletedRoom}`);
        // Se nenhuma sala for deletada, vai ser "Deleted room: undefined"

        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
        }
    })
})

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));