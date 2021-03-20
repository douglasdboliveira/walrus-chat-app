import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Link } from 'react-router-dom';

import './Rooms.css';

const Rooms = ({ rooms, user }) => {

    return (
            <div>
                {rooms.map((room) => (
                    <Link key={room.name} to={`/chat?name=${user}&room=${room.name}`}>
                        <div>
                            <h2>{room.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
    )
}
export default Rooms;