import Inquiry from '../models/Inquiry.js';

// @desc    Submit new inquiry (Public)
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res, next) => {
    try {
        const { name, email, phone, title, message } = req.body;

        const inquiry = await Inquiry.create({
            name,
            email,
            phone,
            title,
            message
        });

        res.status(201).json({
            success: true,
            data: inquiry,
            message: 'Your message has been sent successfully!'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
// @access  Private (Admin)
export const getInquiries = async (req, res, next) => {
    try {
        const { status, search } = req.query;
        const filter = {};

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ];
        }

        const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private (Admin)
export const getInquiry = async (req, res, next) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Auto mark as read if pending
        if (inquiry.status === 'pending') {
            inquiry.status = 'read';
            inquiry.readAt = Date.now();
            await inquiry.save();
        }

        res.json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private (Admin)
export const updateInquiryStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        res.json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
export const deleteInquiry = async (req, res, next) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        await inquiry.deleteOne();

        res.json({
            success: true,
            message: 'Inquiry deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
