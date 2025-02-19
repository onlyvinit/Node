const mongoose = require("mongoose");

const connection = async ()=>{
await mongoose.connect("mongodb://localhost:27017/adminUserData");
console.log("Databases are connected");
}

module.exports = connection