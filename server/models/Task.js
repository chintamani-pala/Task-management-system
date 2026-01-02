import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    due_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    priority: {
        type: String,
        default: 'medium',
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Update updated_at on save
taskSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

export default mongoose.model('Task', taskSchema);
