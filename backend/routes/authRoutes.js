const express = require('express');
const router = express.Router();
const { loginAdmin, loginStudent, loginStaff, registerAdmin } = require('../controllers/authController');

router.post('/login', loginAdmin);
router.post('/login/student', loginStudent);
router.post('/login/staff', loginStaff);
router.post('/register', registerAdmin);

module.exports = router;
