import HeroSlide from '../models/HeroSlide.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'siamese-hero') => {
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

// @desc    Get all hero slides
// @route   GET /api/hero-slides
// @access  Public
export const getHeroSlides = async (req, res, next) => {
    try {
        const { active } = req.query;
        const filter = {};

        if (active !== undefined) filter.active = active === 'true';

        const slides = await HeroSlide.find(filter).sort({ order: 1 });

        res.json({
            success: true,
            count: slides.length,
            data: slides
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single hero slide
// @route   GET /api/hero-slides/:id
// @access  Public
export const getHeroSlide = async (req, res, next) => {
    try {
        const slide = await HeroSlide.findById(req.params.id);

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Hero slide not found'
            });
        }

        res.json({
            success: true,
            data: slide
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create hero slide
// @route   POST /api/hero-slides
// @access  Private
export const createHeroSlide = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);

        // Create slide
        const slide = await HeroSlide.create({
            title: req.body.title,
            subtitle: req.body.subtitle,
            description: req.body.description,
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
            buttonText: req.body.buttonText || 'Learn More',
            buttonLink: req.body.buttonLink,
            order: req.body.order || 0,
            active: req.body.active !== 'false'
        });

        res.status(201).json({
            success: true,
            data: slide
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update hero slide
// @route   PUT /api/hero-slides/:id
// @access  Private
export const updateHeroSlide = async (req, res, next) => {
    try {
        let slide = await HeroSlide.findById(req.params.id);

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Hero slide not found'
            });
        }

        // If new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(slide.cloudinaryId);

            // Upload new image
            const result = await uploadToCloudinary(req.file.buffer);
            req.body.imageUrl = result.secure_url;
            req.body.cloudinaryId = result.public_id;
        }

        slide = await HeroSlide.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            data: slide
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete hero slide
// @route   DELETE /api/hero-slides/:id
// @access  Private
export const deleteHeroSlide = async (req, res, next) => {
    try {
        const slide = await HeroSlide.findById(req.params.id);

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Hero slide not found'
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(slide.cloudinaryId);

        // Delete from database
        await slide.deleteOne();

        res.json({
            success: true,
            message: 'Hero slide deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
