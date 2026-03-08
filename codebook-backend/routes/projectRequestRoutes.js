const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getProjectRequests,
    getProjectRequest,
    createProjectRequest,
    updateProjectRequest,
    deleteProjectRequest,
    getUnreadCount
} = require('../controllers/projectRequestController');

// Public route - submit project request
router.post('/', createProjectRequest);

// Protected routes (Admin)
router.get('/', protect, getProjectRequests);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:id', protect, getProjectRequest);
router.put('/:id', protect, updateProjectRequest);
router.delete('/:id', protect, deleteProjectRequest);

module.exports = router;
