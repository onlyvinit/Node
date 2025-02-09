const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upload = "/upload";  


const userSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: true   
    },
    autherName: {
        type: String,
        required: true   
    },
    year: {
        type: String,
        required: true   
    },
    genre: {
        type: String,
        required: true   
    },
    image: {
        type: String, 
        required: true 
    },
});

const storage = multer.diskStorage({
    destination : function (req,res,cb) {
        cb(null,path.join(__dirname,"..",upload))
    },
    filename: function (req,res,cb) {
        cb(null,file.filename + "-" + Date.now())
    }
});

userSchema.statics.imageUpload = upload;
const uploadMiddleware = multer({ storage: storage }).single("image");
userSchema.statics.multerImage = uploadMiddleware;
const userModel = mongoose.model("books",userSchema);

module.exports = userModel;