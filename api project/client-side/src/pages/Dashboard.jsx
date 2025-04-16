import React, { useEffect, useState } from 'react';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../api/todoApi';

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Add error state to capture error messages

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);  // Set loading to true while the request is being made
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        setError(err.message || 'Error fetching todos');  // Capture any errors here
        console.error('Error fetching todos:', err);
      } finally {
        setLoading(false);  // Set loading to false after the request is done
      }
    };

    fetchTodos();
  }, []);  // Empty dependency array ensures this runs only once when component mounts

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const newTodo = await createTodo(newTitle, newDescription);
      setTodos((prev) => [...prev, newTodo]);
      setNewTitle('');
      setNewDescription('');
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  };

  // Delete a todo
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📝 Todo Dashboard</h2>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
        />
        <textarea
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Add Todo
        </button>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Todo List */}
      {loading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo._id}
              style={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                borderRadius: '6px',
              }}
            >
              <strong>{todo.title}</strong>
              {todo.description && <p>{todo.description}</p>}
              <button
                onClick={() => handleDelete(todo._id)}
                style={{
                  background: 'crimson',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;