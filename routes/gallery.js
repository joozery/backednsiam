import express from 'express';
import {
    getGalleryImages,
    getGalleryImage,
    uploadGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    getGalleryStats
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);
router.get('/stats', getGalleryStats);
router.get('/:id', getGalleryImage);

// Protected routes
router.post('/', protect, upload.array('images', 10), uploadGalleryImage); // Max 10 images
router.put('/:id', protect, upload.single('image'), updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

export default router;
