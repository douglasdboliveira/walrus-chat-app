import React, { useState, useEffect } from 'react';
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";

import './Input.css';

// a = () => { return 'A'; }
// outroA = () => ('A');

const Input = ({ message, setMessage, sendMessage }) => {
    const [show, setShow] = useState(false);

    return (
        <form className="form">
            <input 
                className="input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                onClick={() => setShow(false)}   
            />
            <img 
                id="emoji"
                src="emoji.png" 
                alt="Select an emoji" 
                width="50" 
                height="50"
                onClick={() => show ? setShow(false) : setShow(true)}>    
            </img>
            <div id="emoji-selector">{
                show ?
                    <Picker
                        onEmojiClick={(event, emojiObject) => {setMessage(emojiObject.emoji)}}
                        disableAutoFocus={true}
                        skinTone={SKIN_TONE_MEDIUM_DARK}
                        groupNames={{ smileys_people: "PEOPLE" }}
                        native
                    />
                : null
            }</div>
        <button className="sendButton" onClick={(event) => sendMessage(event)}>Send</button>
        </form>
    )
}

export default Input;