const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase(); // Ex.: Douglas de Brito = douglasdebrito
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name);

    if(existingUser) {
        return { error: 'Username is taken' };
    }

    const user = { id, name, room };

    users.push(user);
    // console.log(users);

    return { user };
}

const verifyExistingRoom = (room) => {
    const user = users.find((user) => user.room === room); 
    // Se não achar nenhum usuário na mesma sala, retorna undefined

    if(!user) {
        return room;
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);

module.exports = { addUser, verifyExistingRoom, removeUser, getUser };