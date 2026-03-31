const Student = require('../models/Student');
const xlsx = require('xlsx');

const getStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addStudent = async (req, res) => {
  const { name, registerNumber, department, section } = req.body;
  try {
    const student = await Student.create({ name, registerNumber, department, section });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const uploadStudents = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const studentsToInsert = data.map(row => ({
      name: row['Name'] || row['name'] || '',
      registerNumber: String(row['Register Number'] || row['registerNumber'] || row['Reg No'] || ''),
      department: row['Department'] || row['department'] || '',
      section: String(row['Section'] || row['section'] || '')
    })).filter(s => s.name && s.registerNumber && s.department && s.section);

    await Student.insertMany(studentsToInsert, { ordered: false }).catch(err => err);
    res.status(201).json({ message: 'Students uploaded successfully', count: studentsToInsert.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllStudents = async (req, res) => {
  try {
    await Student.deleteMany({});
    res.json({ message: 'All students removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, addStudent, uploadStudents, deleteStudent, deleteAllStudents };
