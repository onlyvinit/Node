const port = 8001;
const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let tasks = [];

app.get("/", (req, res) => {
    res.render("form", { tasks, editingIndex: null });
});

app.post("/add", (req, res) => {
    const { task } = req.body;
    if (task) {
        tasks.push(task); 
    }
    res.redirect("/"); 
});

app.post("/delete/:index", (req, res) => {
    const index = req.params.index;
    tasks.splice(index, 1); 
    res.redirect("/"); 
});

app.get("/edit/:index", (req, res) => {
    const index = req.params.index;
    res.render("form", { tasks, editingIndex: index });
});

app.post("/edit/:index", (req, res) => {
    const index = req.params.index;
    const { task } = req.body;
    if (task) {
        tasks[index] = task; 
    }
    res.redirect("/"); 
});

app.listen(port, (error) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log(`Server is running on port ${port}`);
});
