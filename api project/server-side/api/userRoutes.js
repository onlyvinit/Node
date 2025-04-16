// api/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const userRoutes = express.Router();
const userDetails = require('../model/usermodel');
const { createToken } = require('./auth');

// ✅ REGISTER Route
userRoutes.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if email already exists
        const existing = await userDetails.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save user
        const newUser = new userDetails({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ error: 'Something went wrong on server' });
    }
});

// ✅ LOGIN Route
userRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await userDetails.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        res.json({ message: 'Login successful', token });  // Ensure this sends the token
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


module.exports = userRoutes;
