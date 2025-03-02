const passport = require("passport");
const users = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password"
        },
        async (username, password, done) => {
            try {
                const user = await users.findOne({ username });
                if (!user) {
                    console.log("User not found");
                    return done(null, false);
                }
                
                // Direct password comparison (without hashing)
                if (password !== user.password) {
                    console.log("Incorrect password");
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                console.error(error);
                return done(error, false);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await users.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

passport.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/'); 
};


passport.attachUser = (req, res, next) => {
    res.locals.user = req.user;
    next();
};

module.exports = passport;  