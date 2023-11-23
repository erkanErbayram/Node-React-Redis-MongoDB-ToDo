import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function NewTodo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/todos', { title, description });
      history.push('/');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">New Todo</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2"
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Todo</button>
      </form>
    </div>
  );
}

export default NewTodo;
