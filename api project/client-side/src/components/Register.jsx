// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/userApi';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Reset error message before submission

    // Simple validation
    if (!form.name || !form.email || !form.password) {
      return setError('All fields are required');
    }

    try {
      await registerUser(form.name, form.email, form.password);  // Use registerUser from userApi.js
      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (err) {
      setError(err.error || 'Registration failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message if any */}

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
