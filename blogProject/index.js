const express = require('express')
const app = express();
const port = 8070;
const path = require('path');
const connection = require('./config/db');
const dashBoard = require('./router/dashBoard');
const cookieParser = require('cookie-parser');


app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use(cookieParser());
app.use(dashBoard);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
  connection();
})