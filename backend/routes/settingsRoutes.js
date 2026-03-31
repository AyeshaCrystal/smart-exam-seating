const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getSettings)
  .post(protect, updateSettings);

module.exports = router;
