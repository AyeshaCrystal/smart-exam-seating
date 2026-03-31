const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/smart-exam-seating')
  .then(async () => {
    console.log('--- CREDENTIALS ---');
    
    // Create an override admin 
    const hashParams = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', hashParams);
    
    // We will just create a brand new admin just in case
    await Admin.deleteOne({ username: 'testadmin' });
    await Admin.create({ username: 'testadmin', password: 'password123' });
    console.log('Admin:');
    console.log('Username: testadmin');
    console.log('Password: password123');

    // Get a student
    const student = await Student.findOne();
    if (student) {
      console.log('\nStudent:');
      console.log('Register Number:', student.registerNumber);
    } else {
      console.log('\nStudent: No students found in database. Create one via Admin panel -> Manage Students.');
    }

    // Get a staff
    const staff = await Staff.findOne();
    if (staff) {
      console.log('\nFaculty/Staff:');
      console.log('Staff ID:', staff.staffId);
    } else {
      console.log('\nFaculty/Staff: No staff found in database. Create one via Admin panel -> Manage Staff.');
    }

    console.log('-------------------');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
