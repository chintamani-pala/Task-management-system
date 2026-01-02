import express from 'express';
import Task from '../models/Task.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks with pagination and filters
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, priority } = req.query;

        const query = {
            created_by: req.user.id
        };

        if (status && status !== 'all') {
            query.status = status;
        }

        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        const tasks = await Task.find(query)
            .sort({ created_at: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await Task.countDocuments(query);

        // Map _id to id to match frontend interface
        const formattedTasks = tasks.map(task => ({
            ...task.toObject(),
            id: task._id
        }));

        res.json({
            tasks: formattedTasks,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalTasks: count
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create task
router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            created_by: req.user.id,
        });

        await task.save();

        res.json({ ...task.toObject(), id: task._id });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update task
router.patch('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, created_by: req.user.id },
            { $set: req.body },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ ...task.toObject(), id: task._id });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, created_by: req.user.id });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
