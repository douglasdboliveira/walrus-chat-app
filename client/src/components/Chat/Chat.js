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

    const readMessages = (room) => {
        messages.filter((message) => message.room === room).forEach((message) => message.read = true);
    }

    const changeRoom = (room) => {
        setName(name);
        setRoom(room);

        readMessages(room);

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
            return {text: `${lastMessage.user}: ${lastMessage.text}`, time: lastMessage.date.toLocaleTimeString()};
    }

    return (
        <div className="outerContainer">
            <div className="roomsContainer">
                {rooms.map((roomElement) => (
                    <div className="room" key={roomElement} onClick={() => changeRoom(roomElement)}>
                        <h3 className="roomName">{roomElement}</h3>
                        <h6 className="messageTime">{getLastMessage(roomElement) ? getLastMessage(roomElement).time : null}</h6>
                        {roomElement === room || !getNotReadMessages(roomElement) ? null : <h5 className="notification">{getNotReadMessages(roomElement)}</h5>}
                        <h5 className="lastMessage">{getLastMessage(roomElement) ? getLastMessage(roomElement).text : null}</h5>
                    </div>
                ))}
            </div>
            <div className="container">
                <InfoBar room={room}/>
                {<Messages messages={messages.filter((message) => message.room === room)} name={name}/>}
                <Input onFocus={() => {readMessages(room)}} message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <div className="myWalrusApp">
                <h1>My Walrus App &#127858;</h1>
                <h2><i>My Walrus App</i> delivers a live interactive experience for <em>learning</em> and <em>teaching</em>.</h2>
            </div>
            <div className="myWalrusContainer">
                <img className="myWalrusLogo" src="Logo.png" alt="walrus" />
                <h2 className="myWalrusName">walrus</h2>
            </div>
        </div>
    )
}

export default Chat;