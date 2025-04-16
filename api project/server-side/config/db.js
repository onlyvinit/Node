const mongoose = require('mongoose');

const connectDB = async (params) => {
    await mongoose.connect("mongodb://localhost:27017/todo");
    console.log("connected to mongoDB");
}

module.exports = connectDB;