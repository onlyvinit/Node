const mongoose = require('mongoose')

const connections = async () => {
    await mongoose.connect('mongodb://localhost:27017/userMahiti');
    console.log("Data connected");
}

module.exports = connections;