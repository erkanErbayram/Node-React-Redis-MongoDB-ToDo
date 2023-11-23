import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CompletedTodos() {
  const [completedTodos, setCompletedTodos] = useState([]);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/todos/completed');
        setCompletedTodos(response.data);
      } catch (error) {
        console.error('Error fetching completed todos:', error);
      }
    };

    fetchCompletedTodos();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Completed Todos</h2>
      <ul className="list-disc pl-4">
        {completedTodos.map((todo) => (
          <li key={todo._id} className="mb-2 line-through">{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default CompletedTodos;
