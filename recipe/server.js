const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Make sure db.js is in the 'config' folder
const router = require('./router/router'); // Ensure router.js is properly set in 'router' folder
const path = require('path')
const cookieParser = require('cookie-parser');

dotenv.config();

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true })); 

connectDB(); // Establish DB connection first

app.use(cookieParser());

app.use(router); // Use the routes from router.js

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
