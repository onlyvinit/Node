const mongoose = require('mongoose');

const connections = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/BooksData", {
    });
    console.log("Database is connected");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = connections;