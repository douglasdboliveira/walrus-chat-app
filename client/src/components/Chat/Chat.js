import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

/*
 * queryString é um objeto importado do módulo de mesmo nome
 * queryString.parse() é um método que retorna um objeto a partir de uma string
 * Isso é possível porque ele usa um formato específico para extrair os atributos
 */
// location é um objeto e search é um atributo
// location vem de 'Router'

let socket;

const Chat = ( props ) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const { location } = props;
    // same as: const location = props.location; (from JS)

    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
       const { name, room } = queryString.parse(location.search);

       socket = io.connect(ENDPOINT,connectionOptions);

       setName(name);
       setRoom(room);

       console.log(socket);
    });

    return (
        <h1>Chat</h1>
    )
}

export default Chat;