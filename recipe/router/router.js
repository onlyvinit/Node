const express = require('express');
const control = require('../controllers/control');
const users = require('../models/User');
const Recipe = require('../models/recipe');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.render('register');
});


// Register Route
router.post('/register', control.register);

// Login Route
router.post('/login', control.login);

router.get('/admin-dashboard', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await users.findById(decoded.id);
    if (!user || user.role !== 'admin') return res.status(403).send('Access denied');

    const allUsers = await users.find();
    const allRecipes = await Recipe.find();

    res.render('adminDashboard', { user, allUsers, allRecipes, loggedInUserId: user._id });
  } catch (err) {
    res.status(400).send('Invalid token');
  }
});

router.get('/user-dashboard', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await users.findById(decoded.id);
    const allRecipes = await Recipe.find(); 

    res.render('userDashboard', { user, allRecipes });
  } catch (err) {
    res.status(400).send('Invalid token');
  }
});



router.post('/create-recipe', control.createRecipe);

router.post('/delete-recipe/:id', control.deleteRecipe);

router.post('/delete-user/:id', control.deleteUser);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});



module.exports = router;