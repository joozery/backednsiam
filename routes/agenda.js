import express from 'express';
import {
    getAgendaItems,
    getAgendaItem,
    createAgendaItem,
    updateAgendaItem,
    deleteAgendaItem
} from '../controllers/agendaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router
    .route('/')
    .get(getAgendaItems)
    .post(protect, createAgendaItem);

router
    .route('/:id')
    .get(getAgendaItem)
    .put(protect, updateAgendaItem)
    .delete(protect, deleteAgendaItem);

export default router;
