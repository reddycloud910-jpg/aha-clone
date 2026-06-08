const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" },
  watchlist: { type: Array, default: [] },
  history: { type: Array, default: [] }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  profiles: [ProfileSchema], // Array of sub-profiles
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);