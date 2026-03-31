const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/smart_exam_seating')
  .then(async () => {
    // Admin
    await Admin.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const p = await bcrypt.hash('admin123', salt);
    await Admin.collection.insertOne({username: 'admin', password: p});
    
    // Student
    await Student.deleteMany({ registerNumber: '101' });
    await Student.create({
      name: 'John Doe',
      registerNumber: '101',
      department: 'Computer Science',
      section: 'A'
    });

    // Staff
    await Staff.deleteMany({ staffId: 'STF001' });
    await Staff.create({
      name: 'Dr. Smith',
      staffId: 'STF001',
      department: 'Computer Science',
      email: 'smith@example.com',
      available: true
    });

    console.log('Seeded auto-login credentials');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
