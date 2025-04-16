import API from './api';  // import the Axios instance

// Helper to get the user token from localStorage
const getUserToken = () => localStorage.getItem('token');

// Create a new todo
export const createTodo = async (title, description = '') => {
  const token = getUserToken();
  if (!token) {
    throw new Error('No token found, please log in');
  }
  try {
    const response = await API.post('/todos', 
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get all todos
export const getTodos = async () => {
  const token = getUserToken();
  if (!token) {
    throw new Error('No token found, please log in');
  }
  try {
    const response = await API.get('/todos', { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update a todo
export const updateTodo = async (id, title, description = '') => {
  const token = getUserToken();
  if (!token) {
    throw new Error('No token found, please log in');
  }
  try {
    const response = await API.put(`/todos/${id}`, { title, description }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Delete a todo
export const deleteTodo = async (id) => {
  const token = getUserToken();
  if (!token) {
    throw new Error('No token found, please log in');
  }
  try {
    const response = await API.delete(`/todos/${id}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
