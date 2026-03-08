const express = require('express');
const router = express.Router();
const {
    login,
    getProfile,
    setup,
    register
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/setup', setup);

// Protected routes
router.get('/profile', protect, getProfile);
router.post('/register', protect, register);

module.exports = router;
