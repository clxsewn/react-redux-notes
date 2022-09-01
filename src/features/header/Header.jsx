import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveNewTodo } from '../todos/todosSlice';

function Header() {
    const [text, setText] = useState('');
    const dispatch = useDispatch();

    const handleChange = (e) => setText(e.target.value);

    const handleKeyDown = (e) => {
        const trimmedText = e.target.value.trim();
        if (e.key === 'Enter' && trimmedText) {
            dispatch(saveNewTodo(trimmedText));
            setText('');
        }
    };

    return (
        <header>
            <input
                className='new-todo'
                placeholder='What needs to be done?'
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </header>
    );
}

export default Header;
