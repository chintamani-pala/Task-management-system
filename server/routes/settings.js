import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user settings
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('settings');
        if (!user) return res.status(404).json({ error: 'User not found' });

        // If user was created before settings were added, return defaults manually or rely on mongoose defaults if save() was called? 
        // Better to return the defaults defined in schema if empty array (though mongoose should handle defaults on creation, existing users might have empty settings)

        // Actually, if we just accessing `user.settings`, mongoose might not auto-populate defaults for existing docs unless we access them specifically or migrate.
        // For simplicity, let's trust mongoose defaults or return defaults if empty.

        // However, existing users won't have 'settings' field. Mongoose 'default' applies on creation.
        // We can do a quick check and returning default structure if missing.
        let settings = user.settings;
        if (!settings || !settings.statuses || settings.statuses.length === 0) {
            // Fallback for existing users (could also save these to DB here)
            settings = {
                statuses: [
                    { label: 'Pending', value: 'pending', color: '#EF4444' },
                    { label: 'Completed', value: 'completed', color: '#10B981' }
                ],
                priorities: [
                    { label: 'High', value: 'high', color: '#EF4444' },
                    { label: 'Medium', value: 'medium', color: '#F59E0B' },
                    { label: 'Low', value: 'low', color: '#10B981' }
                ]
            };
        }

        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user settings
router.put('/', auth, async (req, res) => {
    try {
        const { statuses, priorities } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (statuses) user.settings.statuses = statuses;
        if (priorities) user.settings.priorities = priorities;

        await user.save();
        res.json(user.settings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
