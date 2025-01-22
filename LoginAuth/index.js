const express = require('express');
const myLogger = require('./middleware/middlware');

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get("/", (req, res) => {
    return res.render("log");
  });

  app.use(myLogger);
  
  app.post("/userData", (req, res) => {
    console.log("Received data:", req.body);  // Logs the submitted data
    return res.redirect("/about");  // Redirects to the 'about' page after submission
});


  app.get("/about", (req, res) => {
    return res.render("about");
  });
  
  app.get("/contact", (req, res) => {
    return res.send("Contact page");
  });
  
  app.listen(port, (error) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(`Server running on port ${port}`);
  });