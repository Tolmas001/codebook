const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide blog title'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Please provide description']
    },
    content: {
        type: String,
        required: [true, 'Please provide content']
    },
    image: {
        type: String,
        default: 'default-blog.jpg'
    },
    category: {
        type: String,
        required: [true, 'Please provide category'],
        enum: ['development', 'design', 'marketing', 'news', 'tutorial', 'other']
    },
    tags: [{
        type: String,
        lowercase: true
    }],
    author: {
        name: String,
        image: String
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    seoTitle: {
        type: String
    },
    seoDescription: {
        type: String
    },
    seoKeywords: {
        type: String
    }
}, {
    timestamps: true
});

// Create slug from title
blogSchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
