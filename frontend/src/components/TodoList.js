import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/todos');
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Todo List</h2>
      <ul className="list-disc pl-4">
        {todos.map((todo) => (
          <li key={todo._id} className="mb-2">{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
