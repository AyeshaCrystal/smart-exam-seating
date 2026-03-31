const Exam = require('../models/Exam');

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addExam = async (req, res) => {
  const { subjectName, subjectCode, date, session } = req.body;
  try {
    const exam = await Exam.create({ subjectName, subjectCode, date, session });
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExams, addExam, deleteExam };
