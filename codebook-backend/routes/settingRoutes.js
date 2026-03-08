const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getSettings,
    getSettingsByCategory,
    updateSettings,
    bulkUpdateSettings,
    deleteSetting,
    initSettings
} = require('../controllers/settingController');

// Public routes
router.get('/', getSettings);
router.get('/category/:category', getSettingsByCategory);

// Protected routes
router.put('/', protect, updateSettings);
router.put('/bulk', protect, bulkUpdateSettings);
router.post('/init', protect, initSettings);
router.delete('/:key', protect, deleteSetting);

module.exports = router;
