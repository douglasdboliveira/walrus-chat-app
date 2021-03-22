import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Link } from 'react-router-dom';

import './Rooms.css';

const Rooms = ({ rooms, user, lastMessages }) => (
    <div>
        {rooms.map((room, index) => (
            <Link key={room.name} to={`/chat?name=${user}&room=${room.name}`}>
                <div>
                    <h2>{room.name}</h2>
                    <h5>{lastMessages[index]}</h5>
                </div>
            </Link>
        ))}
    </div>
)

export default Rooms;