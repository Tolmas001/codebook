const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide client name'],
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    position: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: 'default-avatar.png'
    },
    message: {
        type: String,
        required: [true, 'Please provide testimonial message']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
