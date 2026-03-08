const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide team member name'],
        trim: true,
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        trim: true,
    },
    bio: {
        type: String,
    },
    image: {
        type: String,
        default: 'default-avatar.png',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    socialLinks: {
        linkedin: { type: String, trim: true },
        github: { type: String, trim: true },
        twitter: { type: String, trim: true },
        instagram: { type: String, trim: true },
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Team', teamSchema);
