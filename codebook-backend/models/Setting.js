const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        default: ''
    },
    category: {
        type: String,
        enum: ['general', 'contact', 'social', 'seo', 'footer'],
        default: 'general'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
