import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { useState } from 'react';
import { Task, StatusOption, PriorityOption } from '../types';
import { DroppableColumn, DraggableTaskCard } from './PriorityViewComponents';

interface PriorityViewProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (task: Task) => void;
  onChangePriority: (taskId: string, newPriority: string) => void;
  statuses: StatusOption[];
  priorities: PriorityOption[];
}

export function PriorityView({
  tasks,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangePriority,
  statuses,
  priorities
}: PriorityViewProps) {
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
      const newPriority = over.id as string;

      const task = tasks.find(t => t.id === taskId);
      if (task && task.priority !== newPriority) {
        onChangePriority(taskId, newPriority);
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
        {priorities.map((priority) => {
          const priorityTasks = tasks.filter((t) => t.priority === priority.value);
          return (
            <DroppableColumn
              key={priority.value}
              id={priority.value}
              title={priority.label}
              count={priorityTasks.length}
              tasks={priorityTasks}
              colorClass=""
              headerColorClass=""
              dotColorClass=""
              customColor={priority.color}
            >
              {priorityTasks.map((task) => (
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
              {priorityTasks.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-8">No {priority.label.toLowerCase()} tasks</p>
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
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
