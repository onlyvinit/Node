const express = require('express');
const todoRoutes = express.Router();
const { authMiddleware } = require('./auth');
const Todo = require('../model/todoSchema');

// ➕ Create a new todo
todoRoutes.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId; // Assuming you're storing the userId from the JWT token
  
  // Validate the incoming data
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  try {
    // Create the new Todo with userId
    const newTodo = new Todo({
      title,
      description,
      user: userId, // Store userId to associate the Todo with the logged-in user
    });
    
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating todo:', err); // Log error to console for debugging
    res.status(500).json({ error: 'Error creating todo' });
  }
});


// 📄 Get all todos for logged-in user
todoRoutes.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).populate('user', 'name email');
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

// ✏️ Update a todo by ID
todoRoutes.put('/:id', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const todoId = req.params.id;

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: req.userId }, // make sure the todo belongs to the user
      { title, description },
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Error updating todo' });
  }
});

// ❌ Delete a todo by ID
todoRoutes.delete('/:id', authMiddleware, async (req, res) => {
  const todoId = req.params.id;

  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: req.userId });

    if (!deletedTodo) return res.status(404).json({ error: 'Todo not found or unauthorized' });

    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting todo' });
  }
});

module.exports = todoRoutes;
