import express from 'express';
import {
    getHeroSlides,
    getHeroSlide,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide
} from '../controllers/heroSlideController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getHeroSlides);
router.get('/:id', getHeroSlide);

// Protected routes
router.post('/', protect, upload.single('image'), createHeroSlide);
router.put('/:id', protect, upload.single('image'), updateHeroSlide);
router.delete('/:id', protect, deleteHeroSlide);

export default router;
