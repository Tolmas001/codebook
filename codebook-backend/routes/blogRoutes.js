const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getBlogs,
    getBlog,
    getAllBlogsAdmin,
    createBlog,
    updateBlog,
    deleteBlog,
    getFeaturedBlogs,
    getCategories
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/categories', getCategories);
router.get('/:slug', getBlog);

// Admin routes - protected
router.get('/admin/all', protect, getAllBlogsAdmin);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
