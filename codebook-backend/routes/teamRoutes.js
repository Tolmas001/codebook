const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
} = require('../controllers/teamController');

// Public routes
router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);

// Private routes (Admin) - protected
router.post('/', protect, createTeamMember);
router.put('/:id', protect, updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

module.exports = router;
