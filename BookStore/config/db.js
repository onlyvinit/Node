const mongoose = require("mongoose")

const connection = async () => {
    await mongoose.connect("mongodb://127.0.0.1/vinit")
    console.log("Connected to Server");
};
module.exports = connection;
