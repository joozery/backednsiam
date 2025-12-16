import Agenda from '../models/Agenda.js';

// @desc    Get all agenda items
// @route   GET /api/agenda
// @access  Public
export const getAgendaItems = async (req, res, next) => {
    try {
        const { status, date } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            filter.date = { $gte: startDate, $lt: endDate };
        }

        const agendaItems = await Agenda.find(filter)
            .populate('createdBy', 'name email')
            .sort('date time');

        res.json({
            success: true,
            count: agendaItems.length,
            data: agendaItems
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single agenda item
// @route   GET /api/agenda/:id
// @access  Public
export const getAgendaItem = async (req, res, next) => {
    try {
        const agendaItem = await Agenda.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!agendaItem) {
            return res.status(404).json({
                success: false,
                message: 'Agenda item not found'
            });
        }

        res.json({
            success: true,
            data: agendaItem
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create agenda item
// @route   POST /api/agenda
// @access  Private
export const createAgendaItem = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        const agendaItem = await Agenda.create(req.body);

        res.status(201).json({
            success: true,
            data: agendaItem
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update agenda item
// @route   PUT /api/agenda/:id
// @access  Private
export const updateAgendaItem = async (req, res, next) => {
    try {
        const agendaItem = await Agenda.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!agendaItem) {
            return res.status(404).json({
                success: false,
                message: 'Agenda item not found'
            });
        }

        res.json({
            success: true,
            data: agendaItem
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete agenda item
// @route   DELETE /api/agenda/:id
// @access  Private
export const deleteAgendaItem = async (req, res, next) => {
    try {
        const agendaItem = await Agenda.findById(req.params.id);

        if (!agendaItem) {
            return res.status(404).json({
                success: false,
                message: 'Agenda item not found'
            });
        }

        await agendaItem.deleteOne();

        res.json({
            success: true,
            message: 'Agenda item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
