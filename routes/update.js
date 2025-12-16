import express from 'express';
import {
    getUpdates,
    getUpdate,
    getUpdateBySlug,
    createUpdate,
    updateUpdate,
    deleteUpdate
} from '../controllers/updateController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getUpdates);
router.get('/slug/:slug', getUpdateBySlug);
router.get('/:id', getUpdate);

// Protected routes
router.post('/', protect, upload.single('coverImage'), createUpdate);
router.put('/:id', protect, upload.single('coverImage'), updateUpdate);
router.delete('/:id', protect, deleteUpdate);

export default router;
