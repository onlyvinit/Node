import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');  // Check if the user is logged in

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* If not logged in, redirect to login page */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
