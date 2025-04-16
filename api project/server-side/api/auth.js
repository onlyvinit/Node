// api/auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'yoursecretkey';

const createToken = (userId) => {
    return jwt.sign({ userId }, SECRET, { expiresIn: '1d' });
};

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.userId;  // Add userId to request object
    next();  // Pass the request to the next handler
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = { createToken, authMiddleware };
