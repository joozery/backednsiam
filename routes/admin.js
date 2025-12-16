import express from 'express';
import {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET all admins - public for development (should be protected in production)
router.get('/', getAdmins);

// POST create admin - requires Super Admin
router.post('/', protect, authorize('Super Admin'), createAdmin);

// GET single admin - public for development
router.get('/:id', getAdmin);

// PUT update admin - requires authentication
router.put('/:id', protect, updateAdmin);

// DELETE admin - requires Super Admin
router.delete('/:id', protect, authorize('Super Admin'), deleteAdmin);

export default router;
