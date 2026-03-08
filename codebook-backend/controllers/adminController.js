const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'codebook_secret_key_2024', {
        expiresIn: '30d'
    });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const admin = await Admin.findOne({ username }).select('+password');

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!admin.isActive) {
            return res.status(401).json({ message: 'Account is disabled' });
        }

        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save({ validateBeforeSave: false });

        res.json({
            _id: admin._id,
            username: admin.username,
            name: admin.name,
            role: admin.role,
            token: generateToken(admin._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current admin profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({
            _id: admin._id,
            username: admin.username,
            name: admin.name,
            role: admin.role,
            lastLogin: admin.lastLogin
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create first admin (setup)
// @route   POST /api/auth/setup
// @access  Public (only if no admin exists)
exports.setup = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();

        if (adminCount > 0) {
            return res.status(400).json({ message: 'Admin already exists. Please login.' });
        }

        const { username, password, name } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const admin = await Admin.create({
            username,
            password,
            name,
            role: 'superadmin'
        });

        res.status(201).json({
            _id: admin._id,
            username: admin.username,
            name: admin.name,
            role: admin.role,
            token: generateToken(admin._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
