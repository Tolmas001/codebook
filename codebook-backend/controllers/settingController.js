const Setting = require('../models/Setting');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
    try {
        const settings = await Setting.find();

        // Convert to key-value object
        const settingsObj = {};
        settings.forEach(setting => {
            settingsObj[setting.key] = setting.value;
        });

        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get settings by category
// @route   GET /api/settings/category/:category
// @access  Public
exports.getSettingsByCategory = async (req, res) => {
    try {
        const settings = await Setting.find({ category: req.params.category });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update or create setting
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
    try {
        const { key, value, category, description } = req.body;

        let setting = await Setting.findOne({ key });

        if (setting) {
            setting.value = value;
            if (category) setting.category = category;
            if (description) setting.description = description;
            await setting.save();
        } else {
            setting = await Setting.create({
                key,
                value,
                category: category || 'general',
                description
            });
        }

        res.json(setting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Bulk update settings
// @route   PUT /api/settings/bulk
// @access  Private
exports.bulkUpdateSettings = async (req, res) => {
    try {
        const { settings } = req.body;

        if (!Array.isArray(settings)) {
            return res.status(400).json({ message: 'Settings must be an array' });
        }

        for (const item of settings) {
            await Setting.findOneAndUpdate(
                { key: item.key },
                {
                    value: item.value,
                    category: item.category || 'general',
                    description: item.description
                },
                { upsert: true, new: true }
            );
        }

        const allSettings = await Setting.find();
        res.json({ message: 'Settings updated successfully', settings: allSettings });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Private
exports.deleteSetting = async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });

        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        await setting.deleteOne();
        res.json({ message: 'Setting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Initialize default settings
// @route   POST /api/settings/init
// @access  Private
exports.initSettings = async (req, res) => {
    try {
        const defaultSettings = [
            { key: 'site_name', value: 'Codebook', category: 'general', description: 'Website name' },
            { key: 'site_description', value: 'Professional IT Solutions', category: 'general', description: 'Website description' },
            { key: 'site_logo', value: '', category: 'general', description: 'Website logo URL' },
            { key: 'email', value: 'info@codebook.uz', category: 'contact', description: 'Contact email' },
            { key: 'phone', value: '+998 90 123-45-67', category: 'contact', description: 'Contact phone' },
            { key: 'address', value: 'Toshkent, Chilonzor', category: 'contact', description: 'Company address' },
            { key: 'telegram', value: 'https://t.me/codebook', category: 'social', description: 'Telegram link' },
            { key: 'instagram', value: 'https://instagram.com/codebook', category: 'social', description: 'Instagram link' },
            { key: 'linkedin', value: 'https://linkedin.com/company/codebook', category: 'social', description: 'LinkedIn link' },
            { key: 'facebook', value: 'https://facebook.com/codebook', category: 'social', description: 'Facebook link' },
            { key: 'footer_text', value: '© 2024 Codebook. Barcha huquqlar himoyalangan.', category: 'footer', description: 'Footer copyright text' },
            { key: 'seo_title', value: 'Codebook - Professional IT Solutions', category: 'seo', description: 'Default SEO title' },
            { key: 'seo_description', value: 'Professional IT yechimlar yetkazib beruvchi kompaniya', category: 'seo', description: 'Default SEO description' },
            { key: 'seo_keywords', value: 'web development, mobile apps, IT solutions', category: 'seo', description: 'Default SEO keywords' }
        ];

        for (const setting of defaultSettings) {
            await Setting.findOneAndUpdate(
                { key: setting.key },
                setting,
                { upsert: true }
            );
        }

        res.json({ message: 'Default settings initialized' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
