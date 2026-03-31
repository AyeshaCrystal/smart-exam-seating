const Seating = require('../models/Seating');
const Student = require('../models/Student');
const Hall = require('../models/Hall');
const Settings = require('../models/Settings');
const Staff = require('../models/Staff');

const generateSeating = async (req, res) => {
  try {
    const { examId, examType } = req.body;
    
    if (!examId || !examType) {
      return res.status(400).json({ message: 'examId and examType are required' });
    }

    await Seating.deleteMany({ examId });

    const students = await Student.find({}).sort({ registerNumber: 1 });
    const halls = await Hall.find({}).sort({ hallId: 1 });
    const staffMembers = await Staff.find({ available: true });

    let staffIndex = 0;

    // Based on user requirements:
    // IAT: 2 students per bench, flexible
    // Semester: 1 student per bench, strict department mixing
    const studentsPerBench = examType === 'IAT' ? 2 : 1;
    
    // Group students by department
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
    
    // Round-robin by department to avoid same-department adjacency
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
    let arrangements = [];

    for (const hall of halls) {
      if (studentIndex >= alternatedStudents.length) break;

      // Adjust capacity logic based on long/short if needed or just use studentsPerBench
      const capacity = hall.numberOfBenches * studentsPerBench;
      const hallStudents = [];
      
      for (let i = 0; i < capacity; i++) {
        if (studentIndex < alternatedStudents.length) {
          hallStudents.push({
            seatNumber: `B${Math.floor(i / studentsPerBench) + 1}-S${(i % studentsPerBench) + 1}`,
            studentId: alternatedStudents[studentIndex]._id,
            present: true
          });
          studentIndex++;
        } else {
          break;
        }
      }

      // Assign invigilator if available
      let invigilatorId = null;
      if (staffMembers.length > 0) {
        invigilatorId = staffMembers[staffIndex % staffMembers.length]._id;
        staffIndex++;
      }

      const seating = await Seating.create({
        examId,
        hallId: hall._id,
        examType,
        invigilator: invigilatorId,
        seatingArrangement: hallStudents
      });
      arrangements.push(seating);
    }

    res.status(201).json({ message: 'Seating generated successfully', arrangements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSeating = async (req, res) => {
  try {
    const seatings = await Seating.find({ examId: req.params.examId })
      .populate('hallId')
      .populate('invigilator')
      .populate('seatingArrangement.studentId');
    res.json(seatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateSeating, getSeating };
