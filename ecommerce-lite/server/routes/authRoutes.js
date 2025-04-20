const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/google', authController.googleAuth);
router.post('/phone', authController.phoneAuth);
router.get('/me', protect, authController.getUserProfile);
router.put('/me', protect, authController.updateUserProfile);
router.post('/logout', protect, authController.logoutUser);

module.exports = router;
