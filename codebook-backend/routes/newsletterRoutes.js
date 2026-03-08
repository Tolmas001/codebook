const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getSubscribers,
    subscribe,
    unsubscribe,
    deleteSubscriber,
    getSubscriberCount
} = require('../controllers/newsletterController');

// Public routes
router.post('/', subscribe);
router.delete('/:email', unsubscribe);

// Protected routes (Admin)
router.get('/', protect, getSubscribers);
router.get('/count', protect, getSubscriberCount);
router.delete('/admin/:id', protect, deleteSubscriber);

module.exports = router;
