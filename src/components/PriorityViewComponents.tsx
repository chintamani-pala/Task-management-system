import { useDraggable } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { Task, StatusOption } from '../types';
import { Calendar, Eye, Trash2 } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';

interface DraggableTaskCardProps {
    task: Task;
    onView: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onToggleStatus: (task: Task) => void;
    statuses?: StatusOption[];
}

export function DraggableTaskCard({ task, onView, onEdit, onDelete, onToggleStatus, statuses }: DraggableTaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task },
    });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        touchAction: 'none',
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const statusInfo = statuses?.find(s => s.value === task.status);
    const isCompleted = task.status === 'completed' || statusInfo?.label.toLowerCase().includes('complete') || statusInfo?.label.toLowerCase().includes('done');

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow mb-3 touch-none select-none active:cursor-grabbing"
        >
            <div className="flex items-start gap-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(task);
                    }}
                    className="mt-1 transition-transform hover:scale-110 focus:outline-none"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div
                        className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: statusInfo?.color || '#cbd5e1' }}
                        title={`Current Status: ${statusInfo?.label || task.status}`}
                    />
                </button>

                <div className="flex-1 min-w-0">
                    <h4
                        className={`font-medium mb-1 break-words ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}
                    >
                        {task.title}
                    </h4>
                    {task.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        {formatDate(task.due_date)}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onView(task); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                        title="Edit"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
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
                        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

interface DroppableColumnProps {
    id: string;
    title: string;
    count: number;
    tasks: Task[];
    colorClass: string;
    headerColorClass: string;
    dotColorClass: string;
    children: React.ReactNode;
    customColor?: string;
}

export function DroppableColumn({
    id,
    title,
    count,
    colorClass,
    headerColorClass,
    dotColorClass,
    children,
    customColor
}: DroppableColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const style = {
        backgroundColor: customColor ? `${customColor}08` : (isOver ? 'rgba(0, 0, 0, 0.05)' : undefined), // 5% opacity
        borderColor: isOver ? (customColor || '#60A5FA') : 'transparent',
    };

    const headerStyle = customColor ? { color: customColor } : {};
    const dotStyle = customColor ? { backgroundColor: customColor } : {};
    const countStyle = customColor ? { backgroundColor: 'rgba(0,0,0,0.8)', color: 'white' } : {};

    return (
        <div
            ref={setNodeRef}
            className={`${!customColor ? colorClass : ''} rounded-xl p-6 border-2 border-transparent transition-colors min-w-[320px] max-w-[320px] flex-shrink-0 snap-center ${!customColor && isOver ? 'ring-2 ring-blue-400 border-blue-400' : ''}`}
            style={style}
        >
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 ${!customColor ? dotColorClass : ''} rounded-full`} style={dotStyle}></div>
                <h3 className={`text-lg font-bold ${!customColor ? headerColorClass : ''}`} style={headerStyle}>{title}</h3>
                <span className={`ml-auto ${!customColor ? headerColorClass + ' bg-opacity-20 bg-black' : ''} px-2 py-1 rounded-full text-sm font-semibold`} style={countStyle}>
                    {count}
                </span>
            </div>
            <div className="space-y-3 min-h-[200px]">
                {children}
            </div>
        </div>
    );
}
