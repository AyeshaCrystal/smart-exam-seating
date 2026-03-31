const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      role: 'admin',
      token: generateToken(admin._id, 'admin')
    });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

const loginStudent = async (req, res) => {
  const { registerNumber } = req.body;
  const student = await Student.findOne({ registerNumber });

  if (student) {
    res.json({
      _id: student._id,
      name: student.name,
      registerNumber: student.registerNumber,
      department: student.department,
      role: 'student',
      token: generateToken(student._id, 'student')
    });
  } else {
    res.status(401).json({ message: 'Invalid Register Number' });
  }
};

const loginStaff = async (req, res) => {
  const { staffId } = req.body;
  const staff = await Staff.findOne({ staffId });

  if (staff) {
    res.json({
      _id: staff._id,
      name: staff.name,
      staffId: staff.staffId,
      department: staff.department,
      role: 'staff',
      token: generateToken(staff._id, 'staff')
    });
  } else {
    res.status(401).json({ message: 'Invalid Staff ID' });
  }
};

const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  const adminExists = await Admin.findOne({ username });
  
  if (adminExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const admin = await Admin.create({ username, password });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      role: 'admin',
      token: generateToken(admin._id, 'admin')
    });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};

module.exports = { loginAdmin, loginStudent, loginStaff, registerAdmin };
