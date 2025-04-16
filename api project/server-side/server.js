const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./api/userRoutes');
const todoRoutes = require('./api/todoRoutes');


dotenv.config();
const app = express();


connectDB();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Mount API routes
app.use('/api/user', userRoutes);   // for /register, /login
app.use('/api/todos', todoRoutes);  // for CRUD todos

// Server listener
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
