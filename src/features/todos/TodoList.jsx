import React from 'react';
import { useSelector } from 'react-redux';
import TodoListItem from './TodoListItem';
import { selectFilteredTodoIds } from './todosSlice';

const TodoList = () => {
    const todoIds = useSelector(selectFilteredTodoIds);
    const loadingStatus = useSelector((state) => state.todos.status);

    if (loadingStatus === 'loading') {
        return (
            <div className='todo-list'>
                <div className='loader' />
            </div>
        );
    }

    return (
        <ul className='todo-list'>
            {todoIds.map((item) => {
                return <TodoListItem key={item} todoId={item} />;
            })}
        </ul>
    );
};

export default TodoList;
