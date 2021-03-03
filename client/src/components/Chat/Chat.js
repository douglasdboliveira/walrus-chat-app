import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

const connectionOptions =  {
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
const ENDPOINT = 'localhost:5000';

const Chat = ( props ) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const { location } = props;
    // same as: const location = props.location; (from JS)

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io.connect(ENDPOINT,connectionOptions); 
        // 'socket' é um objeto. O soquete foi conectado ao cliente.

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {});

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]); 
            /*
             * Ex.: 
             * arr1 = [1, 2, 3];
             * arr2 = [...arr1, 4, 5];
             * 
             * console.log(arr2); => (5) [1, 2, 3, 4, 5]
             */
        })
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    // console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    )
}

export default Chat;