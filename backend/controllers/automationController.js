const Exam = require('../models/Exam');
const Staff = require('../models/Staff');
const Hall = require('../models/Hall');

const generateTimetable = async (req, res) => {
  try {
    const exams = await Exam.find({}).sort({ date: 1, session: 1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const allocateInvigilators = async (req, res) => {
  try {
    const { date, session } = req.body;
    
    const halls = await Hall.find({});
    const staff = await Staff.find({ available: true });
    
    const allocations = [];
    
    for (let i = 0; i < Math.min(halls.length, staff.length); i++) {
      allocations.push({
        hall: halls[i],
        invigilator: staff[i]
      });
    }

    res.json({ date, session, allocations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateTimetable, allocateInvigilators };
