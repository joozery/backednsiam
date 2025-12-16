import express from 'express';
import {
    getSponsors,
    getSponsor,
    createSponsor,
    updateSponsor,
    deleteSponsor,
    getSponsorsByTier
} from '../controllers/sponsorController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getSponsors);
router.get('/tier/:tier', getSponsorsByTier);
router.get('/:id', getSponsor);

// Protected routes
router.post('/', protect, upload.single('logo'), createSponsor);
router.put('/:id', protect, upload.single('logo'), updateSponsor);
router.delete('/:id', protect, deleteSponsor);

export default router;
