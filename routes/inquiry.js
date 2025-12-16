import express from 'express';
import {
    createInquiry,
    getInquiries,
    getInquiry,
    updateInquiryStatus,
    deleteInquiry
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - Submit inquiry
router.post('/', createInquiry);

// Private routes - Admin management
router.get('/', protect, getInquiries);
router.get('/:id', protect, getInquiry);
router.put('/:id', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

export default router;
