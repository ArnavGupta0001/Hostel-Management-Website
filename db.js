const mongoose = require('mongoose');

// MongoDB connection string - replace with your own connection string
const mongoURI = 'mongodb://localhost:27017/loginDemo';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
