const Blog = require('../models/Blog');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
exports.getBlogs = async (req, res) => {
    try {
        const { category, tag, page = 1, limit = 10 } = req.query;
        let query = { isPublished: true };

        if (category) {
            query.category = category;
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single blog post
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
            isPublished: true
        });

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all blog posts (including drafts - admin)
// @route   GET /api/blog/admin/all
// @access  Private
exports.getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private
exports.createBlog = async (req, res) => {
    try {
        const { title, description, content, image, category, tags, author, isPublished, featured, seoTitle, seoDescription, seoKeywords } = req.body;

        const blog = await Blog.create({
            title,
            description,
            content,
            image,
            category,
            tags,
            author,
            isPublished,
            featured,
            seoTitle,
            seoDescription,
            seoKeywords
        });

        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        await blog.deleteOne();
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get featured blogs
// @route   GET /api/blog/featured
// @access  Public
exports.getFeaturedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ featured: true, isPublished: true })
            .sort({ createdAt: -1 })
            .limit(3);
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get blog categories
// @route   GET /api/blog/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Blog.aggregate([
            { $match: { isPublished: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
