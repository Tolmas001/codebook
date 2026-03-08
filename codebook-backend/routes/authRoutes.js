const express = require('express');
const router = express.Router();
const {
    login,
    getProfile,
    setup
} = require('../controllers/adminController');

// Public routes
router.post('/login', login);
router.post('/setup', setup);

// Protected routes
router.get('/profile', getProfile);

module.exports = router;
