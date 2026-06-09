const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Pass authentication endpoints freely
  if (req.path.includes('/login') || req.path.includes('/register')) {
    return next();
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Access denied. Token verification missing.' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "mySuperSecretNetflixCloneKey2026!@#";
    const decoded = jwt.verify(token, secretKey);
    
    req.userId = decoded.id || decoded.user?.id || decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Session expired or token signature invalid.' });
  }
};