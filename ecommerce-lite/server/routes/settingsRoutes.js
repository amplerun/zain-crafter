const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect, admin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.route('/')
  .get(settingsController.getSettings)
  .put(protect, admin, upload.single('logo'), settingsController.updateSettings);

module.exports = router;
