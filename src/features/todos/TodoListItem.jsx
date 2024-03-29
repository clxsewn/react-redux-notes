import React from 'react';
import { ReactComponent as TimesSolid } from './times-solid.svg';
import { availableColors, capitalize } from '../filters/colors';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectTodos,
    todoColorSelected,
    todoToggled,
    todoDeleted,
} from '../todos/todosSlice';

const selectTodoById = (state, todoId) => {
    return selectTodos(state).find((todo) => todo.id === todoId);
};

function TodoListItem({ todoId }) {
    const todo = useSelector((state) => selectTodoById(state, todoId));

    const { id, text, completed, color } = todo;
    const dispatch = useDispatch();

    const handleCompleteChanged = (e) => {
        dispatch(todoToggled(id));
    };

    const handleColorChanged = (e) =>
        dispatch(todoColorSelected(id, e.target.value));

    const colorOptions = availableColors.map((c) => (
        <option key={c} value={c}>
            {capitalize(c)}
        </option>
    ));

    const handleRemove = () => {
        dispatch(todoDeleted(todoId));
    };

    return (
        <li>
            <div className='view'>
                <div className='segment-label'>
                    <input
                        className='toggle'
                        type='checkbox'
                        checked={completed}
                        onChange={handleCompleteChanged}
                    />
                    <div className='todo-text'>{text}</div>
                </div>
                <div className='segment buttons'>
                    <select
                        className='colorPicker'
                        value={color}
                        style={{ color }}
                        onChange={handleColorChanged}
                    >
                        <option value=''></option>
                        {colorOptions}
                    </select>
                    <button className='destroy' onClick={handleRemove}>
                        <TimesSolid />
                    </button>
                </div>
            </div>
        </li>
    );
}

export default TodoListItem;
