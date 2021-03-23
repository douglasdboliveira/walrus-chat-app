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
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);

    const { location } = props;
    // same as: const location = props.location; (from JS)

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io.connect(ENDPOINT,connectionOptions); 
        // 'socket' é um objeto. O soquete foi conectado ao cliente.

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error);
            }
        });

        socket.on('rooms', (rooms) => {
            setRooms(rooms);
        });

        socket.on('lastMessages', (lastMessages) => {
            setLastMessages(lastMessages);
        });

        socket.emit('readMessages');

        return () => {
            setMessages([]);
            setMessage('');
            socket.emit('leaveRoom'); 
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

    const readMessages = () => {
        socket.emit('readMessages');
    }

    return (
        <div className="outerContainer">
            <Rooms rooms={rooms} user={name} lastMessages={lastMessages} />
            <div className="container">
                <InfoBar room={room}/>
                {<Messages messages={messages} name={name}/>}
                <Input readMessages={readMessages} message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    )
}

export default Chat;