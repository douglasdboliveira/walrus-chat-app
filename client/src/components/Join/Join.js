import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';
import ROOMS from '../../rooms';

const Join = () => {
    const [name, setName] = useState('');

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
            <img src="Logo.png" alt="" width="81" height="93" />
                <h1 className="heading">Hello Walrus</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}/></div>
                <Link onClick={event => (!name) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${ROOMS.ROOM_1}`}>
                    <button className="button mt-20" type="submit">Sign In</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;