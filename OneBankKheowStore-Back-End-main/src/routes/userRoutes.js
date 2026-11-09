const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/profile/:cID', verifyToken, userController.getProfile);
router.put('/profile/:cID', verifyToken, userController.updateProfile);

module.exports = router;
