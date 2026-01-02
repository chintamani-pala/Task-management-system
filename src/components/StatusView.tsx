import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { useState } from 'react';
import { Task, StatusOption } from '../types';
import { DroppableColumn, DraggableTaskCard } from './PriorityViewComponents';

interface StatusViewProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (task: Task) => void;
  onChangeStatus: (taskId: string, newStatus: string) => void;
  statuses: StatusOption[];
}

export function StatusView({
  tasks,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangeStatus,
  statuses
}: StatusViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: any) => {
    setActiveTask(event.active.data.current.task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as string;

      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== newStatus) {
        onChangeStatus(taskId, newStatus);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
        {statuses.map((status) => {
          const statusTasks = tasks.filter((t) => t.status === status.value);
          return (
            <DroppableColumn
              key={status.value}
              id={status.value}
              title={status.label}
              count={statusTasks.length}
              tasks={statusTasks}
              colorClass=""
              headerColorClass=""
              dotColorClass=""
              customColor={status.color}
            >
              {statusTasks.map((task) => (
                <DraggableTaskCard
                  key={task.id}
                  task={task}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                  statuses={statuses}
                />
              ))}
              {statusTasks.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-8">No {status.label.toLowerCase()} tasks</p>
              )}
            </DroppableColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 rotate-2 scale-105 cursor-grabbing pointer-events-none">
            <DraggableTaskCard
              task={activeTask}
              onView={() => { }}
              onEdit={() => { }}
              onDelete={() => { }}
              onToggleStatus={() => { }}
              statuses={statuses}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
