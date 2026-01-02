import { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { StatusOption, PriorityOption } from '../types';

interface SettingsModalProps {
    onClose: () => void;
    onUpdate: () => void;
}

export function SettingsModal({ onClose, onUpdate }: SettingsModalProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [statuses, setStatuses] = useState<StatusOption[]>([]);
    const [priorities, setPriorities] = useState<PriorityOption[]>([]);



    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await api.settings.get();
            if (error) throw error;
            setStatuses(data.statuses || []);
            setPriorities(data.priorities || []);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const { error } = await api.settings.update({
                statuses,
                priorities
            });
            if (error) throw error;
            onUpdate();
            onClose();
        } catch (error) {
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const addStatus = () => {
        setStatuses([...statuses, { label: 'New Status', value: `status_${Date.now()}`, color: '#6B7280' }]);
    };

    const removeStatus = async (index: number) => {
        const statusToRemove = statuses[index];
        setError('');

        try {
            const { data } = await api.tasks.list({ status: statusToRemove.value, limit: 1 });
            if (data && data.totalTasks > 0) {
                setError(`Cannot delete status "${statusToRemove.label}" because it is used by ${data.totalTasks} task(s).`);
                return;
            }
        } catch (error) {
            console.error('Error checking status usage:', error);
            setError('Failed to verify if status is in use. Please try again.');
            return;
        }

        const newStatuses = [...statuses];
        newStatuses.splice(index, 1);
        setStatuses(newStatuses);
    };

    const updateStatus = (index: number, field: keyof StatusOption, value: string) => {
        const newStatuses = [...statuses];
        newStatuses[index] = { ...newStatuses[index], [field]: value };
        if (field === 'label') {
            newStatuses[index].value = value.toLowerCase().replace(/\s+/g, '_');
        }
        setStatuses(newStatuses);
    };

    const addPriority = () => {
        setPriorities([...priorities, { label: 'New Priority', value: `priority_${Date.now()}`, color: '#6B7280' }]);
    };

    const removePriority = async (index: number) => {
        const priorityToRemove = priorities[index];
        setError('');

        try {
            const { data } = await api.tasks.list({ priority: priorityToRemove.value, limit: 1 });
            if (data && data.totalTasks > 0) {
                setError(`Cannot delete priority "${priorityToRemove.label}" because it is used by ${data.totalTasks} task(s).`);
                return;
            }
        } catch (error) {
            console.error('Error checking priority usage:', error);
            setError('Failed to verify if priority is in use. Please try again.');
            return;
        }

        const newPriorities = [...priorities];
        newPriorities.splice(index, 1);
        setPriorities(newPriorities);
    };

    const updatePriority = (index: number, field: keyof PriorityOption, value: string) => {
        const newPriorities = [...priorities];
        newPriorities[index] = { ...newPriorities[index], [field]: value };
        if (field === 'label') {
            newPriorities[index].value = value.toLowerCase().replace(/\s+/g, '_');
        }
        setPriorities(newPriorities);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-8">Loading settings...</div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Workspace Settings</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Statuses Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Task Statuses</h3>
                                <button
                                    onClick={addStatus}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus size={16} /> Add Status
                                </button>
                            </div>
                            <div className="space-y-3">
                                {statuses.map((status, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <input
                                            type="color"
                                            value={status.color}
                                            onChange={(e) => updateStatus(index, 'color', e.target.value)}
                                            className="w-10 h-10 rounded cursor-pointer border-none"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={status.label}
                                                onChange={(e) => updateStatus(index, 'label', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-medium"
                                                placeholder="Status Name"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeStatus(index)}
                                            className="text-gray-400 hover:text-red-600 p-2"
                                            title="Remove Status"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Priorities Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Task Priorities</h3>
                                <button
                                    onClick={addPriority}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus size={16} /> Add Priority
                                </button>
                            </div>
                            <div className="space-y-3">
                                {priorities.map((priority, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <input
                                            type="color"
                                            value={priority.color}
                                            onChange={(e) => updatePriority(index, 'color', e.target.value)}
                                            className="w-10 h-10 rounded cursor-pointer border-none"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={priority.label}
                                                onChange={(e) => updatePriority(index, 'label', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-medium"
                                                placeholder="Priority Name"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removePriority(index)}
                                            className="text-gray-400 hover:text-red-600 p-2"
                                            title="Remove Priority"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
