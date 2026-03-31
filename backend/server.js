const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/halls', require('./routes/hallRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/seating', require('./routes/seatingRoutes'));
app.use('/api/automation', require('./routes/automationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api', require('./routes/portalRoutes')); // student and faculty portals

// Basic Route

app.get('/', (req, res) => {
  res.send('Smart Exam Seating System API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
