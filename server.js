const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve HTML, CSS, images, etc.

// MongoDB user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Seed demo users
const seedUsers = async () => {
  const existing = await User.findOne({ email: 'student@gmail.com' });
  if (!existing) {
    await User.create([
      { email: 'student@gmail.com', password: '123456' },
      { email: 'warden@gmail.com', password: 'adminpass' }
    ]);
    console.log('✅ Demo users created');
  }
};
seedUsers();

// Serve login.html from root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login attempt:', email);

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {
      console.log('❌ Login failed');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login success');
    res.json({ message: 'Login successful' });

  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
