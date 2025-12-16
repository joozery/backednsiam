import Gallery from '../models/Gallery.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'siamese-gallery') => {
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

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGalleryImages = async (req, res, next) => {
    try {
        const { category, year, featured } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (year) filter.year = parseInt(year);
        if (featured) filter.featured = featured === 'true';

        const images = await Gallery.find(filter)
            .populate('uploadedBy', 'name email')
            .sort('-createdAt');

        res.json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryImage = async (req, res, next) => {
    try {
        const image = await Gallery.findById(req.params.id)
            .populate('uploadedBy', 'name email');

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Increment views
        image.views += 1;
        await image.save();

        res.json({
            success: true,
            data: image
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload gallery image(s)
// @route   POST /api/gallery
// @access  Private
export const uploadGalleryImage = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        const uploadedImages = [];
        const errors = [];

        // Upload each image
        for (const file of req.files) {
            try {
                // Upload to Cloudinary
                const result = await uploadToCloudinary(file.buffer);

                // Create gallery entry
                const image = await Gallery.create({
                    title: req.body.title || file.originalname,
                    description: req.body.description || '',
                    imageUrl: result.secure_url,
                    cloudinaryId: result.public_id,
                    category: req.body.category || 'other',
                    tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
                    year: req.body.year || new Date().getFullYear(),
                    featured: req.body.featured === 'true',
                    uploadedBy: req.user.id
                });

                uploadedImages.push(image);
            } catch (error) {
                errors.push({
                    file: file.originalname,
                    error: error.message
                });
            }
        }

        res.status(201).json({
            success: true,
            count: uploadedImages.length,
            data: uploadedImages,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private
export const updateGalleryImage = async (req, res, next) => {
    try {
        let image = await Gallery.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // If new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(image.cloudinaryId);

            // Upload new image
            const result = await uploadToCloudinary(req.file.buffer);
            req.body.imageUrl = result.secure_url;
            req.body.cloudinaryId = result.public_id;
        }

        // Update tags if provided
        if (req.body.tags) {
            req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
        }

        image = await Gallery.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            data: image
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
export const deleteGalleryImage = async (req, res, next) => {
    try {
        const image = await Gallery.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinaryId);

        // Delete from database
        await image.deleteOne();

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get gallery statistics
// @route   GET /api/gallery/stats
// @access  Public
export const getGalleryStats = async (req, res, next) => {
    try {
        const totalImages = await Gallery.countDocuments();
        const featuredImages = await Gallery.countDocuments({ featured: true });
        const categoryCounts = await Gallery.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalImages,
                featuredImages,
                categoryCounts
            }
        });
    } catch (error) {
        next(error);
    }
};
