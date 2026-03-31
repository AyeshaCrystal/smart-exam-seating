const Staff = require('../models/Staff');

const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({});
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addStaff = async (req, res) => {
  const { name, department, email, available } = req.body;
  try {
    const staff = await Staff.create({ name, department, email, available });
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStaff, addStaff, deleteStaff };
