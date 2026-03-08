const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials (public - approved only)
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isApproved: true })
            .sort({ isFeatured: -1, createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all testimonials (admin - all)
// @route   GET /api/testimonials/admin/all
// @access  Private
exports.getAllTestimonialsAdmin = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get featured testimonials
// @route   GET /api/testimonials/featured
// @access  Public
exports.getFeaturedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isFeatured: true, isApproved: true })
            .limit(5);
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Public
exports.createTestimonial = async (req, res) => {
    try {
        const { name, company, position, image, message, rating } = req.body;

        const testimonial = await Testimonial.create({
            name,
            company,
            position,
            image,
            message,
            rating: rating || 5,
            isApproved: false,
            isFeatured: false
        });

        res.status(201).json(testimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedTestimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        await testimonial.deleteOne();
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
