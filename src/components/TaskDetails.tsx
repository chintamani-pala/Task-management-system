
import { Task, StatusOption, PriorityOption } from '../types';
import { X, Calendar, Flag, CheckCircle, Clock } from 'lucide-react';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  statuses: StatusOption[];
  priorities: PriorityOption[];
}

export function TaskDetails({ task, onClose, onEdit, statuses, priorities }: TaskDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const priorityInfo = priorities.find(p => p.value === task.priority);
  const statusInfo = statuses.find(s => s.value === task.status);

  // Naive check for completion based on value or label
  const isCompleted = task.status === 'completed' || statusInfo?.label.toLowerCase().includes('complete') || statusInfo?.label.toLowerCase().includes('done');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isCompleted ? (
                  <CheckCircle size={32} style={{ color: statusInfo?.color || '#10B981' }} />
                ) : (
                  <Clock size={32} style={{ color: statusInfo?.color || '#2563EB' }} />
                )}
                <h2 className="text-3xl font-bold text-gray-900">{task.title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Due Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{formatDate(task.due_date)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flag size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Priority</span>
                </div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    color: priorityInfo?.color,
                    backgroundColor: `${priorityInfo?.color}15`
                  }}
                >
                  {priorityInfo?.label || task.priority}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Status</span>
                </div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    color: statusInfo?.color,
                    backgroundColor: `${statusInfo?.color}15`
                  }}
                >
                  {statusInfo?.label || task.status}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {task.description || 'No description provided.'}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span> {formatDateTime(task.created_at)}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {formatDateTime(task.updated_at)}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onEdit}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                title="Edit Task"
              >
                Edit Task
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                title="Close Details"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
