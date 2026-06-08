require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// 1. CORS & PARSING MIDDLEWARE
app.use(cors({
  origin: ["http://localhost:5000", "http://localhost:5173"], // Support both standard React dev ports
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// 2. IN-LINE SECURITY MIDDLEWARE (No external file needed!)
const authMiddleware = (req, res, next) => {
  // 🚪 BYPASS GATEWAY: Allow public authentication requests to pass without checking for a token
  if (req.path.includes('/login') || req.path.includes('/register') || req.path.includes('/signup')) {
    return next();
  }

  // Grab the Authorization entry out of the request headers
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.split(' ')[1];

  // Check if header token exists
  if (!token) {
    return res.status(401).json({ msg: 'Authorization header token missing, access denied' });
  }

  try {
    // Decodes payload using your secret verification hash key
    const secretKey = process.env.JWT_SECRET || "MySuperSecretNetflixKey2026!";
    const decoded = jwt.verify(token, secretKey);
    
    // Attach values to both common naming systems so it satisfies all router variants
    req.user = decoded.user || decoded;
    req.userId = decoded.id || decoded.user?.id || decoded.user;
    
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: 'Token signature invalid or expired' });
  }
};

// Mount the security middleware globally
app.use(authMiddleware);

// 3. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MongoDB connected successfully!"))
  .catch((error) => console.error("❌ DB connection failed:", error.message));

// 4. REGISTER BACKEND ROUTES HOOK
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profile'));

// BASE HEALTH CHECK ENDPOINT
app.get('/', (req, res) => res.send("Netflix Clone API is running perfectly."));

// 5. APP STARTUP INSTANCE
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`📡 Server is running on port: ${PORT}`));

