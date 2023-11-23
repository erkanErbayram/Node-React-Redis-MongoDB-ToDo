import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IncompleteTodos() {
  const [incompleteTodos, setIncompleteTodos] = useState([]);

  useEffect(() => {
    const fetchIncompleteTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/todos/incomplete');
        setIncompleteTodos(response.data);
      } catch (error) {
        console.error('Error fetching incomplete todos:', error);
      }
    };

    fetchIncompleteTodos();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Incomplete Todos</h2>
      <ul className="list-disc pl-4">
        {incompleteTodos.map((todo) => (
          <li key={todo._id} className="mb-2">{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default IncompleteTodos;
