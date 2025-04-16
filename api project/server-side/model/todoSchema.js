const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    required: true,
  },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
