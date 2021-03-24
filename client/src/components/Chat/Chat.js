import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import Rooms from '../Rooms/Rooms';

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

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io.connect(ENDPOINT,connectionOptions); 

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room });  

        return () => {
            setMessages([]);
            socket.disconnect(true);
        }
    }, [location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, {...message, read: false, date: new Date() }]); 
        })
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', name, room, message, () => setMessage(''));
        }
    }

    return (
        <div className="outerContainer">
            <Rooms name={name} room={room} />
            <div className="container">
                <InfoBar room={room}/>
                {<Messages messages={messages.filter((message) => message.room === room)} name={name}/>}
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    )
}

export default Chat;