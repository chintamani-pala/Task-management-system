import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Task, Settings } from '../types';
import { api } from '../api';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { TaskDetails } from './TaskDetails';
import { DeleteConfirmation } from './DeleteConfirmation';
import { Pagination } from './Pagination';
import { PriorityView } from './PriorityView';
import { StatusView } from './StatusView';
import { Settings as SettingsIcon, Plus, LogOut, List, LayoutGrid, Filter, Kanban } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { StatusSelectModal } from './StatusSelectModal';

export function Dashboard() {
  const queryClient = useQueryClient();
  const { user, signOut } = useAuth();


  const [showSettings, setShowSettings] = useState(false);


  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'priority' | 'status'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [tasksPerPage, setTasksPerPage] = useState(10);
  const [updatingStatusTask, setUpdatingStatusTask] = useState<Task | null>(null);



  // Settings Query
  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<Settings> => {
      const { data } = await api.settings.get();
      return data;
    },
  });

  const statuses = settingsData?.statuses || [];
  const priorities = settingsData?.priorities || [];

  const { data: tasksData, isLoading: loading } = useQuery({
    queryKey: ['tasks', currentPage, statusFilter, priorityFilter, tasksPerPage],
    queryFn: async () => {
      const { data } = await api.tasks.list({
        page: currentPage,
        limit: tasksPerPage,
        status: statusFilter,
        priority: priorityFilter
      });
      return data as { tasks: Task[], totalPages: number, totalTasks: number };
    },
  });

  const tasks = tasksData?.tasks || [];
  const totalPages = tasksData?.totalPages || 1;
  const totalTasks = tasksData?.totalTasks || 0;

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const { error } = await api.tasks.create(taskData);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;

    try {
      const { error } = await api.tasks.update(editingTask.id, taskData);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;

    try {
      const { error } = await api.tasks.delete(deletingTaskId);
      if (error) throw error;
      if (tasks.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setDeletingTaskId(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  const handleStatusClick = (task: Task) => {
    setUpdatingStatusTask(task);
  };

  const handleStatusUpdate = async (statusValue: string) => {
    if (!updatingStatusTask) return;

    const task = updatingStatusTask;
    setUpdatingStatusTask(null);

    try {
      const { error } = await api.tasks.update(task.id, { status: statusValue });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleChangePriority = async (taskId: string, newPriority: string) => {
    try {
      const { error } = await api.tasks.update(taskId, { priority: newPriority });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };



  const handleDragStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await api.tasks.update(taskId, { status: newStatus });
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <List size={20} />
                  List
                </button>
                <button
                  onClick={() => setViewMode('status')}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${viewMode === 'status'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Kanban size={20} />
                  Board
                </button>
                <button
                  onClick={() => setViewMode('priority')}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${viewMode === 'priority'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <LayoutGrid size={20} />
                  Priority
                </button>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                New Task
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <SettingsIcon size={20} />
              </button>

              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              {priorities.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>

            <select
              value={tasksPerPage}
              onChange={(e) => {
                setTasksPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>

            <div className="ml-auto text-sm text-gray-600">
              {totalTasks > 0 ? (
                <>
                  Showing <span className="font-medium">{(currentPage - 1) * tasksPerPage + 1}</span>-
                  <span className="font-medium">{Math.min(currentPage * tasksPerPage, totalTasks)}</span> of{' '}
                  <span className="font-medium">{totalTasks}</span> tasks
                </>
              ) : (
                'No tasks found'
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {viewMode === 'list' && (
            <TaskList
              tasks={tasks}
              onView={setViewingTask}
              onEdit={setEditingTask}
              onDelete={setDeletingTaskId}
              onToggleStatus={handleStatusClick}
              statuses={statuses}
              priorities={priorities}
            />
          )}

          {viewMode === 'priority' && (
            <PriorityView
              tasks={tasks}
              onView={setViewingTask}
              onEdit={setEditingTask}
              onDelete={setDeletingTaskId}
              onToggleStatus={handleStatusClick}
              onChangePriority={handleChangePriority}
              statuses={statuses}
              priorities={priorities}
            />
          )}

          {viewMode === 'status' && (
            <StatusView
              tasks={tasks}
              onView={setViewingTask}
              onEdit={setEditingTask}
              onDelete={setDeletingTaskId}
              onToggleStatus={handleStatusClick}
              onChangeStatus={handleDragStatusChange}
              statuses={statuses}
            />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {showForm && (
        <TaskForm
          onSave={handleCreateTask}
          onCancel={() => setShowForm(false)}
          statuses={statuses}
          priorities={priorities}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSave={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          statuses={statuses}
          priorities={priorities}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onUpdate={async () => {
            await queryClient.invalidateQueries({ queryKey: ['settings'] });
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
          }}
        />
      )}

      {viewingTask && (
        <TaskDetails
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={() => {
            setEditingTask(viewingTask);
            setViewingTask(null);
          }}
          statuses={statuses}
          priorities={priorities}
        />
      )}

      {updatingStatusTask && (
        <StatusSelectModal
          task={updatingStatusTask}
          statuses={statuses}
          onSelect={handleStatusUpdate}
          onClose={() => setUpdatingStatusTask(null)}
        />
      )}

      {deletingTaskId && (
        <DeleteConfirmation
          taskTitle={tasks.find((t) => t.id === deletingTaskId)?.title || ''}
          onConfirm={handleDeleteTask}
          onCancel={() => setDeletingTaskId(null)}
        />
      )}
    </div>
  );
}
