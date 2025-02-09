const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs')
const multer = require('multer');
const app = express();
const userModel = require('./models/userModel');
const connections = require('./config/db');
const port = 8054;
const upload = "/uploads";


app.set("view engine", "ejs");
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, upload));
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname;
        cb(null, fileName);
    }
});
const uploadMiddleware = multer({ storage: storage }).single("bookImage");

const bookSchema = mongoose.Schema({
    bookName: String,
    author: String,
    publishedYear: Number,
    genre: String,
    image: String
});
const Book = mongoose.model('Book', bookSchema);

app.get('/', async (req, res) => {
    const books = await Book.find();
    res.render('main', { books });
});

app.post('/addData', uploadMiddleware, async (req, res) => {
    try {
        const { bookName, author, publishedYear, genre } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : '';

        const newBook = new Book({
            bookName,
            author,
            publishedYear,
            genre,
            image
        });
        await newBook.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});



// DELETE route 
app.post('/deleteBook/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const userData = await userModel.findById(id);
        if (userData) {
            fs.unlinkSync(path.join(__dirname + userData.image));
        }
        await userModel.findByIdAndDelete(bookId);
        res.redirect('/');
    } catch (error) {
        console.log(error)
    }
});

// EDIT route
app.get('/editBook/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await userModel.findById(bookId);
        res.render('edit', { book });
    } catch (error) {
        console.log(error);
    }
});

// UPDATE route
app.post('/updateBook/:id', async (req, res) => {
    try {
        let userData = await userModel.findById(req.params.id);
        console.log(req.file)
        if (req.file) {
            fs.unlinkSync(path.join(__dirname + userData.image));
            req.body.image = userModel.imageUpload + "/" + req.file.filename;
        }
        await userModel.findByIdAndUpdate(req.params.id, req.body);
        console.log("user updated successfully");
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    connections();
});
