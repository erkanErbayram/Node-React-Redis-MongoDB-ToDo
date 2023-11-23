import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateTodo() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/todos/${id}`);
        const todo = response.data;
        setTitle(todo.title);
        setDescription(todo.description);
      } catch (error) {
        console.error('Error fetching todo:', error);
      }
    };

    fetchTodo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}`, { title, description });
      navigate('/');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Update Todo</h2>
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
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Update Todo</button>
      </form>
    </div>
  );
}

export default UpdateTodo;
