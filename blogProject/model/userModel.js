const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const uploadsDir = path.join(__dirname, "../uploads");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: true
    }
});

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    picture:{
        type:String,
        required:true
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const uploadProduct = multer({ storage: productStorage });
const upload = multer({ storage: storage }); 

const product = mongoose.model("Product", productSchema);
const userModule = mongoose.model("userData", userSchema);

module.exports = { userModule, upload, product, uploadProduct }; 
