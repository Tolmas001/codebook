const Portfolio = require('../models/Portfolio');

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
exports.getPortfolioItems = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        const portfolio = await Portfolio.find(query).sort({ createdAt: -1 });
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:id
// @access  Public
exports.getPortfolioItem = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new portfolio item
// @route   POST /api/portfolio
// @access  Private (Admin)
exports.createPortfolioItem = async (req, res) => {
    try {
        const { title, description, image, category, client, liveUrl, technologies, featured } = req.body;

        const portfolio = await Portfolio.create({
            title,
            description,
            image,
            category,
            client,
            liveUrl,
            technologies,
            featured,
        });

        res.status(201).json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private (Admin)
exports.updatePortfolioItem = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        const updatedPortfolio = await Portfolio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedPortfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private (Admin)
exports.deletePortfolioItem = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        await portfolio.deleteOne();
        res.json({ message: 'Portfolio item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get featured portfolio items
// @route   GET /api/portfolio/featured
// @access  Public
exports.getFeaturedPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ featured: true }).limit(6);
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
