const ProjectRequest = require('../models/ProjectRequest');

// @desc    Get all project requests
// @route   GET /api/project-request
// @access  Private
exports.getProjectRequests = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const requests = await ProjectRequest.find(query).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project request
// @route   GET /api/project-request/:id
// @access  Private
exports.getProjectRequest = async (req, res) => {
    try {
        const request = await ProjectRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Project request not found' });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new project request
// @route   POST /api/project-request
// @access  Public
exports.createProjectRequest = async (req, res) => {
    try {
        const { name, email, phone, company, projectType, budget, projectDescription, timeline } = req.body;

        const request = await ProjectRequest.create({
            name,
            email,
            phone,
            company,
            projectType,
            budget,
            projectDescription,
            timeline
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update project request status
// @route   PUT /api/project-request/:id
// @access  Private
exports.updateProjectRequest = async (req, res) => {
    try {
        const request = await ProjectRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Project request not found' });
        }

        const updatedRequest = await ProjectRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete project request
// @route   DELETE /api/project-request/:id
// @access  Private
exports.deleteProjectRequest = async (req, res) => {
    try {
        const request = await ProjectRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Project request not found' });
        }

        await request.deleteOne();
        res.json({ message: 'Project request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unread count
// @route   GET /api/project-request/unread/count
// @access  Private
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await ProjectRequest.countDocuments({ isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
