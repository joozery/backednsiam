import Sponsor from '../models/Sponsor.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to upload logo to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'siamese-sponsors') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 500, height: 500, crop: 'limit' },
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

// @desc    Get all sponsors
// @route   GET /api/sponsors
// @access  Public
export const getSponsors = async (req, res, next) => {
    try {
        const { tier, active } = req.query;
        const filter = {};

        if (tier) filter.tier = tier;
        if (active !== undefined) filter.active = active === 'true';

        const sponsors = await Sponsor.find(filter).sort({ tier: 1, order: 1 });

        res.json({
            success: true,
            count: sponsors.length,
            data: sponsors
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single sponsor
// @route   GET /api/sponsors/:id
// @access  Public
export const getSponsor = async (req, res, next) => {
    try {
        const sponsor = await Sponsor.findById(req.params.id);

        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: 'Sponsor not found'
            });
        }

        res.json({
            success: true,
            data: sponsor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create sponsor
// @route   POST /api/sponsors
// @access  Private
export const createSponsor = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a logo'
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);

        // Create sponsor
        const sponsor = await Sponsor.create({
            name: req.body.name,
            logoUrl: result.secure_url,
            cloudinaryId: result.public_id,
            website: req.body.website,
            tier: req.body.tier || 'partner',
            order: req.body.order || 0,
            active: req.body.active !== 'false',
            description: req.body.description
        });

        res.status(201).json({
            success: true,
            data: sponsor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update sponsor
// @route   PUT /api/sponsors/:id
// @access  Private
export const updateSponsor = async (req, res, next) => {
    try {
        let sponsor = await Sponsor.findById(req.params.id);

        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: 'Sponsor not found'
            });
        }

        // If new logo is uploaded
        if (req.file) {
            // Delete old logo from Cloudinary
            await cloudinary.uploader.destroy(sponsor.cloudinaryId);

            // Upload new logo
            const result = await uploadToCloudinary(req.file.buffer);
            req.body.logoUrl = result.secure_url;
            req.body.cloudinaryId = result.public_id;
        }

        sponsor = await Sponsor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            data: sponsor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete sponsor
// @route   DELETE /api/sponsors/:id
// @access  Private
export const deleteSponsor = async (req, res, next) => {
    try {
        const sponsor = await Sponsor.findById(req.params.id);

        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: 'Sponsor not found'
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(sponsor.cloudinaryId);

        // Delete from database
        await sponsor.deleteOne();

        res.json({
            success: true,
            message: 'Sponsor deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get sponsors by tier
// @route   GET /api/sponsors/tier/:tier
// @access  Public
export const getSponsorsByTier = async (req, res, next) => {
    try {
        const sponsors = await Sponsor.find({
            tier: req.params.tier,
            active: true
        }).sort({ order: 1 });

        res.json({
            success: true,
            count: sponsors.length,
            data: sponsors
        });
    } catch (error) {
        next(error);
    }
};
