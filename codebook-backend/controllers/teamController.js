const Team = require('../models/Team');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
exports.getTeamMembers = async (req, res) => {
    try {
        const team = await Team.find().sort({ order: 1, createdAt: -1 });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
exports.getTeamMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new team member
// @route   POST /api/team
// @access  Private (Admin)
exports.createTeamMember = async (req, res) => {
    try {
        const { name, position, bio, image, email, phone, socialLinks, order } = req.body;

        const team = await Team.create({
            name,
            position,
            bio,
            image,
            email,
            phone,
            socialLinks,
            order,
        });

        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private (Admin)
exports.updateTeamMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private (Admin)
exports.deleteTeamMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        await team.deleteOne();
        res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
