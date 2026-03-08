const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getTestimonials,
    getAllTestimonialsAdmin,
    getFeaturedTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} = require('../controllers/testimonialController');

// Public routes
router.get('/', getTestimonials);
router.get('/featured', getFeaturedTestimonials);

// Public - submit testimonial
router.post('/', createTestimonial);

// Admin routes - protected
router.get('/admin/all', protect, getAllTestimonialsAdmin);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
