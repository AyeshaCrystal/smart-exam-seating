const Hall = require('../models/Hall');

const getHalls = async (req, res) => {
  try {
    const halls = await Hall.find({});
    res.json(halls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addHall = async (req, res) => {
  const { hallId, numberOfBenches, benchType } = req.body;
  try {
    const hall = await Hall.create({ hallId, numberOfBenches, benchType });
    res.status(201).json(hall);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteHall = async (req, res) => {
  try {
    await Hall.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hall removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getHalls, addHall, deleteHall };
