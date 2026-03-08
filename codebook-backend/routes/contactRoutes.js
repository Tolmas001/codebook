const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getContacts,
    createContact,
    markAsRead,
    deleteContact,
    getUnreadCount,
} = require('../controllers/contactController');

// Public route - submit contact form
router.post('/', createContact);

// Private routes (Admin) - protected
router.get('/', protect, getContacts);
router.get('/unread/count', protect, getUnreadCount);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteContact);

module.exports = router;
