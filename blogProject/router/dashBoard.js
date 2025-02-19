const express = require("express");
const dashBoard = express.Router();
const cookieParser = require("cookie-parser"); 
const { userModule, upload, product, uploadProduct } = require("../model/userModel");

// Middleware to check authentication
const checkAuth = async (req, res, next) => {
    if (!req.signedCookies.userId) {
        return res.redirect("/");
    }
    
    try {
        const user = await userModule.findById(req.signedCookies.userId);
        if (!user) {
            res.clearCookie("userId");
            return res.redirect("/");
        }
        req.user = user; // Attach user data to request
        next();
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
};

// Home/Login Page
dashBoard.get("/", (req, res) => {
    res.render("login");
});

// Login as a user
dashBoard.post('/login', async (req, res) => {
    try {
        console.log(req.body); // ✅ Log request data to check if it's coming properly
        const { username, password } = req.body;
        const user = await userModule.findOne({ username });

        if (!user) {
            console.log("User not found");
            return res.render('login', { error: "Invalid username or password" });
        }

        if (user.password !== password) {
            console.log("Incorrect password");
            return res.render('login', { error: "Invalid username or password" });
        }

        console.log("Login successful:", user);

        // ✅ Set user data in cookies correctly
        res.cookie("userData", JSON.stringify(user), { httpOnly: true, maxAge: 300000 }); 

        res.redirect('/main');
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Internal Server Error");
    }
});



// Logout and clear cookie
dashBoard.get("/logout", (req, res) => {
    res.clearCookie("userData", { path: '/' });
    res.redirect("/");
});

// Create a new user
dashBoard.post("/register", upload.single("image"), async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    try {
        await userModule.create({
            username: req.body.username,
            password: req.body.password,
            number: req.body.number,
            image: req.file ? req.file.filename : null
        });

        console.log("User created successfully!");
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

// Update user
dashBoard.put("/updateUser/:id", upload.single("image"), async (req, res) => {
    try {
        const { username, number } = req.body;
        const updatedData = { username, number };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        const updatedUser = await userModule.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully!", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete user
dashBoard.post("/deleteUser", async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModule.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.redirect("back");
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Protected Route - Display products
dashBoard.get('/main', async (req, res) => {
    try {
        const products = await product.find();
        const users = await userModule.find();

        // ✅ Read user data from cookies
        const userData = req.cookies.userData ? JSON.parse(req.cookies.userData) : null;

        console.log("Logged-in User Data:", userData); // Debugging step

        res.render("main", { products, users, loggedInUser: userData });
    } catch (error) {
        res.status(500).send("Failed to load data");
    }
});
// Protected Route - Edit products
dashBoard.get('/product', async (req, res) => {
    try {
        const products = await product.find(); 
        res.render('products', { products });  // Render the 'products' view
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching products");
    }
});


// Protected Route - Add product
// Add Product Route with Authentication Middleware
dashBoard.post("/addProduct", uploadProduct.single("picture"), async (req, res) => {
    try {
        // Log the form data and the file to ensure they are correctly received
        console.log(req.body);
        console.log(req.file);

        await product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            picture: req.file ? req.file.filename : null
        });

        console.log("Product added successfully!");
        res.redirect("/product");  // Redirect to product page after successful insertion
    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding product");
    }
});

// Delete Product
dashBoard.post("/deleteProduct", async (req, res) => {
    try {
        const { productIds } = req.body;
        await product.deleteMany({ _id: { $in: productIds } });
        res.status(200).send("Products deleted successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting products.");
    }
});


// Get Product Details for Editing
dashBoard.get("/getProduct/:id", async (req, res) => {
    try {
        const foundProduct = await product.findById(req.params.id);
        if (!foundProduct) return res.status(404).json({ error: "Product not found" });

        res.json(foundProduct);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Edit Product
dashBoard.post("/editProduct/:id", upload.single("picture"), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        let updatedData = { name, description, price, category };

        if (req.file) {
            updatedData.picture = req.file.filename;
        }

        await product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        console.log("Product updated successfully!");
        res.redirect("/product");
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Failed to update product");
    }
});


module.exports = dashBoard;
