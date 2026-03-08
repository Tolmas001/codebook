const Newsletter = require('../models/Newsletter');

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private
exports.getSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ isActive: true })
            .sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
exports.subscribe = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        // Check if already subscribed
        const existingSubscriber = await Newsletter.findOne({ email });

        if (existingSubscriber) {
            if (!existingSubscriber.isActive) {
                existingSubscriber.isActive = true;
                await existingSubscriber.save();
                return res.json({ message: 'You have been resubscribed!' });
            }
            return res.status(400).json({ message: 'This email is already subscribed' });
        }

        const subscriber = await Newsletter.create({
            email,
            name
        });

        res.status(201).json({ message: 'Successfully subscribed!' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Unsubscribe
// @route   DELETE /api/newsletter/:email
// @access  Public
exports.unsubscribe = async (req, res) => {
    try {
        const subscriber = await Newsletter.findOne({ email: req.params.email });

        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        subscriber.isActive = false;
        await subscriber.save();

        res.json({ message: 'Successfully unsubscribed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete subscriber
// @route   DELETE /api/newsletter/admin/:id
// @access  Private
exports.deleteSubscriber = async (req, res) => {
    try {
        const subscriber = await Newsletter.findById(req.params.id);

        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        await subscriber.deleteOne();
        res.json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get subscriber count
// @route   GET /api/newsletter/count
// @access  Private
exports.getSubscriberCount = async (req, res) => {
    try {
        const count = await Newsletter.countDocuments({ isActive: true });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
