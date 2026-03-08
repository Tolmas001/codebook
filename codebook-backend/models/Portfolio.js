const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide project title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide project description'],
    },
    image: {
        type: String,
        required: [true, 'Please provide project image'],
    },
    category: {
        type: String,
        required: [true, 'Please provide project category'],
        enum: ['web', 'mobile', 'design', 'other'],
        default: 'web',
    },
    client: {
        type: String,
        trim: true,
    },
    liveUrl: {
        type: String,
        trim: true,
    },
    technologies: [{
        type: String,
        trim: true,
    }],
    featured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
