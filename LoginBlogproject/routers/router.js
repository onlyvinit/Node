const express = require('express');
const router = express.Router();
const control = require('../controller/control');
const upload = require('../config/multer');
const passport = require('../middleware/passport');

router.get('/', control.login);
router.post('/register', upload.single('profileImage'), control.registerUser);
router.post('/login', passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/",
    failureFlash: false
}));

router.post('/logout', control.logout);
router.get('/main', passport.isAuthenticated, control.showLoggeduser);
module.exports = router;
