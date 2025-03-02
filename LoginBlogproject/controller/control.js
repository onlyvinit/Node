const users = require("../models/User");

const control = {
    login: (req, res) => {
        res.render("login")
    },

    // user registration 
    registerUser: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const existingUser = await users.findOne({ email });
            if (existingUser) {
                console.log("User already exists.");
                return res.redirect("back");
            }
    
            const profileImage = req.file ? req.file.filename : null
            const newUser = new users({
                username,
                email,
                password,
                profileImage
            });
    
            await newUser.save();
            console.log(newUser);
            res.redirect("/");
        } catch (error) {
            console.error(error);
        }
    },

    // login user 
    loginUser : async (req, res) => {
        try {
            const { username, password } = req.body;
            const userLogin = await users.findOne({ username });
            if (!userLogin) {
                return res.redirect("back");
            }
            if (userLogin.password !== password) {
                return res.redirect("back");
            }
            console.log("User logged in:", userLogin);
            res.redirect("/main"); 
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).send("Error logging in");
        }
    },

    // show users
    dataDisplay : async (req, res) => {
        try {
            const allUsers = await users.find({}); 
    
            res.render("main", { allUsers }); 
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Error retrieving user data");
        }
    },

    showLoggeduser: async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/'); // Redirect if no user is logged in
            }
    
            const allUsers = await users.find({}); // Fetch all users
    
            res.render("main", { loggedUser: req.user, allUsers }); 
        } catch (error) {
            console.log(error);
            res.status(500).send("Error retrieving user data");
        }
    },
    
    // logout
    logout: async (req, res, next) => {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    }    
    
};

module.exports = control;
