// File: models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous' },
  rollno: { type: String, default: '' },
  room: { type: String, required: true },
  year: { type: String, required: true },
  hostel: { type: String, required: true },
  incidentType: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);

// -----------------------------------------------
// File: routes/reportRoute.js
const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.post('/submit-report', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (err) {
    console.error('Error saving report:', err);
    res.status(500).json({ message: 'Failed to submit report' });
  }
});

module.exports = router;

// -----------------------------------------------
// File: db.js
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

// -----------------------------------------------
// File: server.js
const express = require('express');
const connectDB = require('./db');
const reportRoutes = require('./routes/reportRoute');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', reportRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
