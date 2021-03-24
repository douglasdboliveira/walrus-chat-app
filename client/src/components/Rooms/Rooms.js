import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Link } from 'react-router-dom';

import './Rooms.css';
import ROOMS from '../../rooms';

const Rooms = ({ name, room }) => {
    const rooms = Object.values(ROOMS);

    return (
        <div>
            {rooms.map((room) => (
                <Link key={room} to={`/chat?name=${name}&room=${room}`} >
                    <div>
                        <h2>{room}</h2>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Rooms;