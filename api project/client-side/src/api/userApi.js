import API from "./api";

// User registration
export const registerUser = async (name, email, password) => {
  try {
    const response = await API.post('/user/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/user/login', { email, password });
    localStorage.setItem('token', response.data.token); // Save token to localStorage
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Check if user is logged in (check for token)
export const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};
