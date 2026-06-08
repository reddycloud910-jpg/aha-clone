const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 🚪 BYPASS CHECK: Allow public authentication requests to pass through without checking for a token
  if (req.path.includes('/login') || req.path.includes('/register')) {
    return next();
  }

  // Grab the Authorization entry out of the request headers
  const authHeader = req.header('Authorization') || req.header('authorization');

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ msg: 'Authorization header missing, access denied' });
  }

  // Check if it follows the standard "Bearer <token>" format
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Header format must be Bearer <token>' });
  }

  try {
    // Splits the space between "Bearer" and your token string cleanly
    const token = authHeader.split(' ')[1];
    
    // Decodes payload using your secret verification hash key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "MySuperSecretNetflixKey2026!");
    
    // 💡 SYNCHRONIZATION FIX: Attach to req.user AND req.userId so it satisfies all router configurations
    req.user = decoded.user || decoded;
    req.userId = decoded.id || decoded.user?.id || decoded.user;
    
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: 'Token signature invalid or expired' });
  }
};