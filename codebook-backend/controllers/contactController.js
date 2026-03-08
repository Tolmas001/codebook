const Contact = require('../models/Contact');

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message,
        });

        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Mark contact as read
// @route   PUT /api/contact/:id/read
// @access  Private (Admin)
exports.markAsRead = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        contact.isRead = true;
        await contact.save();

        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await contact.deleteOne();
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unread contact count
// @route   GET /api/contact/unread/count
// @access  Private (Admin)
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Contact.countDocuments({ isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
