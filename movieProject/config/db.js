const mongoose = require('mongoose')

const connectData = async () =>{
    await mongoose.connect ("mongodb://localhost:27017/userInformation")
    console.log("Databases are connected.");
}

module.exports = connectData;