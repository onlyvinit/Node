const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../models/User.js');
const Recipe = require('../models/recipe');
require('dotenv').config();


const control = {
  // REGISTER
  register: async (req, res) => {
    try {
      const { email, password, confirmPassword, role } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
      }

      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).send('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new users({
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Server error during registration');
    }
  },

  // LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await users.findOne({ email });
      if (!user) {
        return res.status(400).send('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      if (user.role === 'admin') {
        res.redirect('/admin-dashboard');
      } else {
        res.redirect('/user-dashboard');
      }
    } catch (err) {
      res.status(500).send('Server error during login');
    }
  },
  // admin dashboard
  adminDashboard: async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect('/');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') return res.status(403).send('Access Denied');

      const user = await users.findById(decoded.id);
      const allUsers = await users.find({ role: 'user' });
      const allRecipes = await Recipe.find({ user: user._id });

      res.render('adminDashboard', {
        user,
        allUsers,
        allRecipes,
        loggedInUserId: user._id
      });
      
    } catch (err) {
      res.status(500).send('Error loading admin dashboard');
    }
  },
  createRecipe: async (req, res) => {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { title, description, ingredients } = req.body;

      const newRecipe = new Recipe({
        title,
        description,
        ingredients: ingredients.split(',').map(i => i.trim()),
        user: decoded.id,
      });

      await newRecipe.save();
      res.redirect('/admin-dashboard');
    } catch (err) {
      res.status(500).send('Error creating recipe');
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      await Recipe.findByIdAndDelete(req.params.id);
      res.redirect('/admin-dashboard');
    } catch (err) {
      res.status(500).send('Error deleting recipe');
    }
  },

  deleteUser: async (req, res) => {
    try {
      await users.findByIdAndDelete(req.params.id);
      res.redirect('/admin-dashboard');
    } catch (err) {
      res.status(500).send('Error deleting user');
    }
  },


};

module.exports = control;