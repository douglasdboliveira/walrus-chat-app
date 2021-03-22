const rooms = [];

const addRooms = (room) => {
    const existingRoom = rooms.find((rooms) => rooms.name === room);

    if(!existingRoom) {
        rooms.push({name: room, messages: []});
        return rooms;
    }
}

const addMessages = (message, room, user) => {
    const index = rooms.indexOf(rooms.find((rooms) => rooms.name === room));

    rooms[index].messages.push({ message, read: false, sentBy: user });
    // Adicionar quem enviou a mensagem no array das mensagens
    const sender = rooms[index].messages[rooms[index].messages.length-1].sentBy;
    rooms[index].lastMessage = `${sender}: ${message}`;

    return rooms;
}

const removeRooms = (search) => {
    if (search) { // Se for undefined, não acontece nada
        const index = rooms.findIndex((r) => { r.name === search }); 
        // Achar o index pra poder deletar
        
        const removedRoom = rooms.splice(index, 1)[0];

        console.log(rooms);

        return removedRoom;
    }
}

const readMessages = ({ room, name }) => {
    // Só as mensagens que não foram enviadas por mim serão visualizadas

    const currentIndex = rooms.findIndex((rooms) => rooms.name === room); 

    // console.log(rooms[currentIndex].messages);

    rooms[currentIndex].messages.forEach((message) => {
        if(!message.read && message.sentBy != name) {
            message.read = true;
            console.log(message);
        }
    });
}

const getRooms = () => rooms;

const getLastMessages = () => {
    const lastMessages = [];

    rooms.forEach((room) => {
        lastMessages.push(room.lastMessage);
    })

    return lastMessages;
}

module.exports = { addRooms, addMessages, removeRooms, readMessages, getRooms, getLastMessages };