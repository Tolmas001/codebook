const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getPortfolioItems,
    getPortfolioItem,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    getFeaturedPortfolio,
} = require('../controllers/portfolioController');

// Public routes
router.get('/', getPortfolioItems);
router.get('/featured', getFeaturedPortfolio);
router.get('/:id', getPortfolioItem);

// Private routes (Admin) - protected
router.post('/', protect, createPortfolioItem);
router.put('/:id', protect, updatePortfolioItem);
router.delete('/:id', protect, deletePortfolioItem);

module.exports = router;
