import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const dropdownRef = useRef('');

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
            <img src="Logo.png" alt="" width="81" height="93" />
                <h1 className="heading">Hello Walrus</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}/></div>
                {/*<div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)}/></div>*/}
                <div>
                    <select className="dropdown" ref={dropdownRef} onClick={(event) => setRoom(event.target.value)}>   
                        <option>Select your room</option>   
                        <option>feijoada</option>   
                        <option>tapioca</option>   
                        <option>brigadeiro</option>   
                        <option>farofa</option>
                    </select>
                </div>
                <Link onClick={event => (!name || room == 'Select your room') ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                    <button className="button mt-20" type="submit">Sign In</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;