const myLogger = function (req, res, next) {
    const isAuth = true;
    if (isAuth) {
      next();
      return;
    }
    return res.send("Not authorized");
};

module.exports = myLogger;
