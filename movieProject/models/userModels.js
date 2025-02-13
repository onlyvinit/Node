const mongoose = require('mongoose');
const multer = require('multer');
const { type } = require('os');
const path = require('path');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const movieSchema= mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    releaseDate:{
        type:Date,
        required:true
    },
    picture:{
        type:String,
        required:true
    },
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const movieModel = mongoose.model('movies', movieSchema);
const upload = multer({ storage: storage });
const userModel = mongoose.model('users', userSchema);
module.exports = { userModel, upload, movieModel };