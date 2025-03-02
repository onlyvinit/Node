const express = require('express');
const session = require("express-session");
const passport = require("./middleware/passport"); 
const router = require('./routers/router');
const path = require('path');
const connections = require('./config/db');

const app = express();
const port = 5002;

app.set("view engine", "ejs");
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "vinit", 
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    connections(); 
});
