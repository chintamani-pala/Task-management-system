
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationProps {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({ taskTitle, onConfirm, onCancel }: DeleteConfirmationProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Task</h2>
          </div>

          <p className="text-gray-700 mb-2">
            Are you sure you want to delete this task?
          </p>
          <p className="text-gray-900 font-semibold mb-6 break-all">"{taskTitle}"</p>
          <p className="text-sm text-gray-600 mb-6">
            This action cannot be undone. The task will be permanently removed from your task list.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete Task
            </button>
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
