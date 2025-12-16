import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Placeholder routes - implement controllers later
router.get('/', (req, res) => {
    res.json({ success: true, data: [], message: 'Participant routes - to be implemented' });
});

router.post('/', protect, (req, res) => {
    res.json({ success: true, message: 'Create participant - to be implemented' });
});

export default router;
