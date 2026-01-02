import { X } from 'lucide-react';
import { Task, StatusOption } from '../types';

interface StatusSelectModalProps {
    task: Task;
    statuses: StatusOption[];
    onSelect: (statusValue: string) => void;
    onClose: () => void;
}

export function StatusSelectModal({ task, statuses, onSelect, onClose }: StatusSelectModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Update Status</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-2">
                    {statuses.map((status) => {
                        const isSelected = task.status === status.value;
                        return (
                            <button
                                key={status.value}
                                onClick={() => onSelect(status.value)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div
                                    className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: status.color }}
                                />
                                <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                    {status.label}
                                </span>
                                {isSelected && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
