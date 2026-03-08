const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide service title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide service description'],
    },
    icon: {
        type: String,
        default: 'code',
    },
    features: [{
        type: String,
    }],
    featured: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);
