import React, { useState, useRef } from 'react';
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";

import './Input.css';

// a = () => { return 'A'; }
// outroA = () => ('A');

const Input = ({ readMessages, message, setMessage, sendMessage }) => {
    const [show, setShow] = useState(false);
    const inputRef = useRef('');

    const insertEmoji = (emoji) => {
        const start = inputRef.current.selectionStart;
        const end = inputRef.current.selectionEnd;
        const value = inputRef.current.value;
        const part1 = value.substring(0,start);
        const part2 = value.substring(end);
        inputRef.current.value = part1 + emoji + part2;

        return inputRef.current.value;
    }

    return (
        <form className="form">
            <input 
                ref={inputRef}
                className="input"
                type="text"
                placeholder="Type a message..."
                value={message || ''}
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                onClick={() => {setShow(false)}} 
                onFocus={() => {readMessages()}}
            />
            <img 
                id="emoji-guy"
                src="emoji.png" 
                alt="Select an emoji" 
                width="50" 
                height="50"
                onClick={() => setShow(!show)}>    
            </img>
            <div id="emoji-selector">{
                show ?
                    <Picker
                        onEmojiClick={(event, emojiObject) => {setMessage(insertEmoji(emojiObject.emoji)); setShow(false); }}
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