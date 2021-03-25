import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import ROOMS from '../../rooms';

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
        };
    }, []);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, {...message, read: false, date: new Date()}]);
        });
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', name, room, message, () => setMessage(''));
        }
    }

    const changeRoom = (room) => {
        setName(name);
        setRoom(room);

        messages.filter((message) => message.room === room).forEach((message) => message.read = true);

        socket.emit('join', { name, room });
    }

    const rooms = Object.values(ROOMS);

    const findMessages = (room) => {
        return messages.filter((message) => message.room === room);
    }

    const getNotReadMessages = (room) => {
        const messages = findMessages(room);
        const notRead = messages.filter((message) => message.read === false && message.user !== 'admin').length;

        return notRead;
    }

    const getLastMessage = (room) => {
        const currentRoomMessages = findMessages(room);
        const lastMessage = currentRoomMessages[currentRoomMessages.length-1];

        if(lastMessage)
            return `${lastMessage.user}: ${lastMessage.text}`;
    }

    return (
        <div className="outerContainer">
            <div>
                {rooms.map((roomElement) => (
                    <div key={roomElement} onClick={() => changeRoom(roomElement)}>
                        <h2>{roomElement}</h2>
                        <h5>{roomElement === room ? null : getNotReadMessages(roomElement)}</h5>
                        <h5>{getLastMessage(roomElement)}</h5>
                    </div>
                ))}
            </div>
            <div className="container">
                <InfoBar room={room}/>
                {<Messages messages={messages.filter((message) => message.room === room)} name={name}/>}
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    )
}

export default Chat;