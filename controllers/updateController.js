import Update from '../models/Update.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'siamese-updates') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 1920, height: 1080, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

// @desc    Get all updates
// @route   GET /api/updates
// @access  Public
export const getUpdates = async (req, res, next) => {
    try {
        const { active, featured, category } = req.query;
        const filter = {};

        if (active !== undefined) filter.active = active === 'true';
        if (featured !== undefined) filter.featured = featured === 'true';
        if (category) filter.category = category;

        const updates = await Update.find(filter).sort({ date: -1, order: 1 });

        res.json({
            success: true,
            count: updates.length,
            data: updates
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single update by ID
// @route   GET /api/updates/:id
// @access  Public
export const getUpdate = async (req, res, next) => {
    try {
        const update = await Update.findById(req.params.id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Update not found'
            });
        }

        res.json({
            success: true,
            data: update
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single update by slug
// @route   GET /api/updates/slug/:slug
// @access  Public
export const getUpdateBySlug = async (req, res, next) => {
    try {
        const update = await Update.findOne({ slug: req.params.slug });

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Update not found'
            });
        }

        res.json({
            success: true,
            data: update
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create update
// @route   POST /api/updates
// @access  Private
export const createUpdate = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a cover image'
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);

        // Parse tags if it's a string
        let tags = [];
        if (req.body.tags) {
            tags = typeof req.body.tags === 'string'
                ? req.body.tags.split(',').map(tag => tag.trim())
                : req.body.tags;
        }

        // Create update
        const update = await Update.create({
            title: req.body.title,
            excerpt: req.body.excerpt,
            content: req.body.content,
            coverImage: result.secure_url,
            cloudinaryId: result.public_id,
            category: req.body.category || 'Other',
            date: req.body.date || Date.now(),
            readTime: req.body.readTime || '5 min read',
            tags: tags,
            author: {
                name: req.body.authorName || 'Siamese FilmArt Team',
                avatar: req.body.authorAvatar || '/assets/logo.png'
            },
            active: req.body.active !== 'false',
            featured: req.body.featured === 'true',
            order: req.body.order || 0
        });

        res.status(201).json({
            success: true,
            data: update
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update update
// @route   PUT /api/updates/:id
// @access  Private
export const updateUpdate = async (req, res, next) => {
    try {
        let update = await Update.findById(req.params.id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Update not found'
            });
        }

        // If new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(update.cloudinaryId);

            // Upload new image
            const result = await uploadToCloudinary(req.file.buffer);
            req.body.coverImage = result.secure_url;
            req.body.cloudinaryId = result.public_id;
        }

        // Parse tags if it's a string
        if (req.body.tags && typeof req.body.tags === 'string') {
            req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
        }

        // Update author if provided
        if (req.body.authorName || req.body.authorAvatar) {
            req.body.author = {
                name: req.body.authorName || update.author.name,
                avatar: req.body.authorAvatar || update.author.avatar
            };
        }

        update = await Update.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            data: update
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete update
// @route   DELETE /api/updates/:id
// @access  Private
export const deleteUpdate = async (req, res, next) => {
    try {
        const update = await Update.findById(req.params.id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Update not found'
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(update.cloudinaryId);

        // Delete from database
        await update.deleteOne();

        res.json({
            success: true,
            message: 'Update deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
