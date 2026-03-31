const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings.seatingType = req.body.seatingType || settings.seatingType;
      settings.mixDepartments = req.body.mixDepartments !== undefined ? req.body.mixDepartments : settings.mixDepartments;
      settings.avoidSameDeptAdjacent = req.body.avoidSameDeptAdjacent !== undefined ? req.body.avoidSameDeptAdjacent : settings.avoidSameDeptAdjacent;
    }
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
