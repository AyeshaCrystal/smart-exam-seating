const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Student = require('./models/Student');
const Hall = require('./models/Hall');
const Staff = require('./models/Staff');
const Exam = require('./models/Exam');
const Seating = require('./models/Seating');
const Complaint = require('./models/Complaint');
const bcrypt = require('bcryptjs');

// Realistic Indian Names
const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Ananya', 'Diya', 'Saanvi', 'Priya', 'Kavya', 'Avni', 'Neha', 'Riya', 'Sneha', 'Aarohi', 'Rahul', 'Rohit', 'Siddharth', 'Vikram', 'Karan', 'Abhishek', 'Varun', 'Rohan', 'Akhil', 'Nikhil', 'Pooja', 'Shruti', 'Swati', 'Preeti', 'Divya', 'Nisha', 'Aarti', 'Anjali', 'Megha', 'Priyanka'];
const lastNames = ['Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Das', 'Shah', 'Nair', 'Reddy', 'Rao', 'Iyer', 'Pillai', 'Chauhan', 'Yadav', 'Joshi', 'Pandey', 'Mishra', 'Tiwari', 'Desai'];

const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH'];
const sections = ['A', 'B'];

function getRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/smart_exam_seating');
    console.log('Connected to MongoDB. Clearing old data...');

    await Admin.deleteMany({});
    await Student.deleteMany({});
    await Hall.deleteMany({});
    await Staff.deleteMany({});
    await Exam.deleteMany({});
    await Seating.deleteMany({});
    await Complaint.deleteMany({});

    // 1. Admin
    const salt = await bcrypt.genSalt(10);
    const p = await bcrypt.hash('admin123', salt);
    await Admin.collection.insertOne({ username: 'admin', password: p });
    console.log('Admin created.');

    // 2. Students
    console.log('Generating Students...');
    const studentsData = [];
    let regCounter = 2023001;
    for (let i = 0; i < 125; i++) {
      const dept = departments[i % departments.length];
      const sec = sections[Math.floor(Math.random() * sections.length)];
      
      // Ensure '101' is our default student test account
      let regNo = String(regCounter++);
      if (i === 0) regNo = '101'; 

      studentsData.push({
        name: getRandomName(),
        registerNumber: regNo,
        department: dept,
        section: sec
      });
    }
    const students = await Student.insertMany(studentsData);
    console.log(`Created ${students.length} students.`);

    // 3. Staff (Faculty)
    console.log('Generating Staff...');
    const staffData = [];
    for (let i = 0; i < 15; i++) {
      const dept = departments[i % departments.length];
      const name = `Prof. ${getRandomName()}`;
      
      // Ensure 'STF001' is our default staff test account
      let staffId = `STF${(i + 1).toString().padStart(3, '0')}`;
      
      staffData.push({
        name,
        staffId: staffId,
        department: dept,
        email: `${name.replace('Prof. ', '').replace(' ', '.').toLowerCase()}@college.edu`,
        available: true
      });
    }
    const staffMembers = await Staff.insertMany(staffData);
    console.log(`Created ${staffMembers.length} staff members.`);

    // 4. Halls
    console.log('Generating Halls...');
    const hallData = [];
    const benchTypes = ['long', 'short'];
    for (let i = 1; i <= 6; i++) {
      hallData.push({
        hallId: `H10${i}`,
        numberOfBenches: Math.floor(Math.random() * 11) + 20, // 20-30 benches
        benchType: benchTypes[i % 2]
      });
    }
    const halls = await Hall.insertMany(hallData);
    console.log(`Created ${halls.length} halls.`);

    // 5. Exams
    console.log('Generating Exams...');
    const examList = [
      { subjectName: 'Data Structures and Algorithms', subjectCode: 'CS101' },
      { subjectName: 'Database Management Systems', subjectCode: 'CS102' },
      { subjectName: 'Operating Systems', subjectCode: 'CS103' },
      { subjectName: 'Computer Networks', subjectCode: 'CS104' },
    ];
    
    const examData = examList.map((ex, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1); // Next few days
      return {
        ...ex,
        date: date,
        session: i % 2 === 0 ? 'FN' : 'AN'
      };
    });
    const exams = await Exam.insertMany(examData);
    console.log(`Created ${exams.length} exams.`);

    // 6. Pre-generate Seating for One Exam (IAT Demo)
    console.log('Generating Seating for the first exam (IAT Demo)...');
    const demoExam = exams[0];
    const examType = 'IAT';
    const studentsPerBench = 2; // IAT
    
    // Group by dept for alternation
    const deptGroups = {};
    students.forEach(student => {
      if (!deptGroups[student.department]) deptGroups[student.department] = [];
      deptGroups[student.department].push(student);
    });

    let alternatedStudents = [];
    const deptKeys = Object.keys(deptGroups);
    let pointers = {};
    deptKeys.forEach(k => pointers[k] = 0);
    
    let totalAssigned = 0;
    let currentDeptIndex = 0;
    while (totalAssigned < students.length) {
      const dept = deptKeys[currentDeptIndex];
      if (pointers[dept] < deptGroups[dept].length) {
        alternatedStudents.push(deptGroups[dept][pointers[dept]]);
        pointers[dept]++;
        totalAssigned++;
      }
      currentDeptIndex = (currentDeptIndex + 1) % deptKeys.length;
    }

    let studentIndex = 0;
    let staffIndex = 0;
    for (const hall of halls) {
      if (studentIndex >= alternatedStudents.length) break;

      const capacity = hall.numberOfBenches * studentsPerBench;
      const hallStudents = [];
      
      for (let i = 0; i < capacity; i++) {
        if (studentIndex < alternatedStudents.length) {
          const benchNo = Math.floor(i / studentsPerBench) + 1;
          const pos = (i % studentsPerBench) === 0 ? 'Left' : 'Right';
          hallStudents.push({
            seatNumber: `B${benchNo}-${pos}`, // Bench Left/Right Demo
            studentId: alternatedStudents[studentIndex]._id,
            present: true
          });
          studentIndex++;
        } else {
          break;
        }
      }

      let invigilatorId = staffMembers[staffIndex % staffMembers.length]._id;
      staffIndex++;

      await Seating.create({
        examId: demoExam._id,
        hallId: hall._id,
        examType: 'IAT',
        invigilator: invigilatorId,
        seatingArrangement: hallStudents
      });
    }
    console.log('Seating mapped for the first exam.');

    // 7. Complaints
    console.log('Generating Complaints...');
    const complaintData = [
      { studentId: students[0]._id, message: 'Wrong seat assigned for the Data Structures exam.', status: 'pending' },
      { studentId: students[1]._id, message: 'Hall number mismatch in my admit card vs actual seating layout.', status: 'resolved' },
      { studentId: students[2]._id, message: 'Bench is broken in Hall H101 near B5.', status: 'pending' },
      { staffId: staffMembers[0]._id, message: 'Student 2023015 caught with a mobile phone in H101.', status: 'pending' },
      { staffId: staffMembers[1]._id, message: 'Require more answer sheets for Hall H102.', status: 'resolved' }
    ];
    await Complaint.insertMany(complaintData);
    console.log(`Created ${complaintData.length} complaints.`);

    console.log('\n--- SUCCESS ---');
    console.log('Database seeded with realistic demo data successfully.');
    console.log('Admin login: admin / admin123');
    console.log('Student login: 101');
    console.log('Faculty login: STF001');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
