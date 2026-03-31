const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

const protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      const role = decoded.role || 'admin';
      
      if (role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
      } else if (role === 'student') {
        req.user = await Student.findById(decoded.id);
      } else if (role === 'staff') {
        req.user = await Staff.findById(decoded.id);
      }
      
      req.user.role = role;
      
      // Keep req.admin for backwards compatibility if role is admin
      if (role === 'admin') req.admin = req.user;
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const protect = protectUser; // alias for existing routes

module.exports = { protect, protectUser };
