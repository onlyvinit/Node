const express = require('express')
const app = express()
const port = 8069;
const multer = require('multer')
const unload = require('./config/multer')
const path = require('path');
const connectData = require('./config/db');
const { userModel, upload, movieModel } = require('./models/userModels');
const { log } = require('console');
const dashBoardRouter = require('./routers/dashBoardRouter');
const cookieParser = require('cookie-parser');
const passport = require('passport')


app.set("view engine", "ejs");
app.use(express.static("models"));
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());

app.use("/", dashBoardRouter);
app.use(cookieParser());


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  connectData();
})