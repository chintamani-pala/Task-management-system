
import { Task, StatusOption, PriorityOption } from '../types';
import { Calendar, Eye, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (task: Task) => void;
  statuses: StatusOption[];
  priorities: PriorityOption[];
}

export function TaskList({ tasks, onView, onEdit, onDelete, onToggleStatus, statuses, priorities }: TaskListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityInfo = (value: string) => priorities.find(p => p.value === value);
  const getStatusInfo = (value: string) => statuses.find(s => s.value === value);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => {
        const priorityInfo = getPriorityInfo(task.priority);
        const statusInfo = getStatusInfo(task.status);

        return (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-md border-l-4 transition-all hover:shadow-lg"
            style={{ borderLeftColor: priorityInfo?.color || '#ccc' }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => onToggleStatus(task)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: statusInfo?.color || '#cbd5e1' }}
                        title={`Current Status: ${statusInfo?.label || task.status}`}
                      />
                    </button>
                    <h3
                      className={`text-xl font-semibold break-all ${(task.status === 'completed' || statusInfo?.label.toLowerCase().includes('complete') || statusInfo?.label.toLowerCase().includes('done')) ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}
                    >
                      {task.title}
                    </h3>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex flex-wrap gap-3 items-center">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium border"
                      style={{
                        color: priorityInfo?.color,
                        borderColor: priorityInfo?.color,
                        backgroundColor: `${priorityInfo?.color}10`
                      }}
                    >
                      {priorityInfo?.label || task.priority}
                    </span>

                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        color: statusInfo?.color,
                        backgroundColor: `${statusInfo?.color}20`
                      }}
                    >
                      {statusInfo?.label || task.status}
                    </span>

                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar size={16} />
                      <span className="text-sm">{formatDate(task.due_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onView(task)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => onEdit(task)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
