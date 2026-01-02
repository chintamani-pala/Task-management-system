import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    settings: {
        statuses: {
            type: [{
                label: String,
                value: String,
                color: String
            }],
            default: [
                { label: 'Pending', value: 'pending', color: '#EF4444' }, // red
                { label: 'Completed', value: 'completed', color: '#10B981' } // green
            ]
        },
        priorities: {
            type: [{
                label: String,
                value: String,
                color: String
            }],
            default: [
                { label: 'High', value: 'high', color: '#EF4444' }, // red
                { label: 'Medium', value: 'medium', color: '#F59E0B' }, // orange/yellow
                { label: 'Low', value: 'low', color: '#10B981' } // green
            ]
        }
    }
});

export default mongoose.model('User', userSchema);
