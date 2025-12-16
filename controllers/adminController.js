import Admin from '../models/Admin.js';

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private
export const getAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find().select('-password').sort('-createdAt');

        res.json({
            success: true,
            count: admins.length,
            data: admins
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single admin
// @route   GET /api/admins/:id
// @access  Private
export const getAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.json({
            success: true,
            data: admin
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new admin
// @route   POST /api/admins
// @access  Private (Super Admin only)
export const createAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.create(req.body);

        res.status(201).json({
            success: true,
            data: admin
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private
export const updateAdmin = async (req, res, next) => {
    try {
        // Don't allow password update through this route
        delete req.body.password;

        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.json({
            success: true,
            data: admin
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private (Super Admin only)
export const deleteAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Prevent deleting yourself
        if (admin._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await admin.deleteOne();

        res.json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
