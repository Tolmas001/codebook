const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    projectType: {
        type: String,
        required: [true, 'Please select project type'],
        enum: ['website', 'mobile', 'ecommerce', 'webapp', 'design', 'consulting', 'other']
    },
    budget: {
        type: String,
        enum: ['less-500', '500-1000', '1000-5000', '5000-10000', 'more-10000', 'not-sure']
    },
    projectDescription: {
        type: String,
        required: [true, 'Please describe your project']
    },
    timeline: {
        type: String,
        enum: ['asap', '1-month', '2-3-months', '3-6-months', 'flexible']
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'in-progress', 'completed', 'cancelled'],
        default: 'new'
    },
    notes: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);
