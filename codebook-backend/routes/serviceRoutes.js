const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    getFeaturedServices,
} = require('../controllers/serviceController');

// Public routes
router.get('/', getServices);
router.get('/featured', getFeaturedServices);
router.get('/:id', getService);

// Private routes (Admin) - protected
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
