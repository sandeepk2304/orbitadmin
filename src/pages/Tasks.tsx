import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useUsers } from '../hooks/useUsers';
import type { Task } from '../types';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { ColumnDef } from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, Pencil, Trash2, Calendar, FolderKanban } from 'lucide-react';

const taskValidationSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  description: z.string().min(5, 'Provide a description of at least 5 characters'),
  projectId: z.string().min(1, 'Assign to a project'),
  assigneeId: z.string().min(1, 'Assign to a team member'),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Todo', 'In Progress', 'Review', 'Done']),
  dueDate: z.string().min(1, 'Select a target due date'),
});

type TaskFormData = z.infer<typeof taskValidationSchema>;

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();
  const { users } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskValidationSchema),
    defaultValues: { title: '', description: '', projectId: '', assigneeId: '', priority: 'Medium', status: 'Todo', dueDate: '' },
  });

  const handleOpenAdd = () => {
    setEditingTask(null);
    reset({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assigneeId: users[0]?.id || '',
      priority: 'Medium',
      status: 'Todo',
      dueDate: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      assigneeId: task.assigneeId,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    });
    setModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteTask(deletingId);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // DataTable column definitions
  const columns: ColumnDef<Task>[] = [
    {
      key: 'title',
      header: 'Task Title',
      sortable: true,
      render: (_, task) => (
        <div className="space-y-0.5">
          <p className="font-bold text-[#11191f] dark:text-white leading-tight">{task.title}</p>
          <p className="text-xs text-gray-400 dark:text-[#8a8a9e] line-clamp-1 max-w-xs">
            {task.description}
          </p>
        </div>
      ),
    },
    {
      key: 'projectId',
      header: 'Project Scope',
      sortable: true,
      render: (projId) => {
        const proj = projects.find((p) => p.id === projId);
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-bold">
            <FolderKanban size={13} className="text-indigo-500" />
            {proj ? proj.name : 'Unknown Project'}
          </span>
        );
      },
    },
    {
      key: 'assigneeId',
      header: 'Assignee',
      sortable: true,
      render: (assId) => {
        const u = users.find((user) => user.id === assId);
        return u ? (
          <div className="flex items-center gap-2">
            <img
              src={u.avatar}
              alt={u.name}
              className="w-7 h-7 rounded-full object-cover border border-gray-100 dark:border-white/10"
            />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{u.name}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 font-semibold">Unassigned</span>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (priority) => <StatusBadge status={priority} />,
    },
    {
      key: 'status',
      header: 'Task Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-[#8a8a9e] font-semibold">
          <Calendar size={12} /> {val}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Actions Trigger',
      align: 'center',
      render: (_, task) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => handleOpenEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer"
            title="Modify Task"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleOpenDelete(task.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Board"
        description="Review active workflow task items, assign staff members, set priorities, and update project progress statuses."
        action={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus size={16} /> Assign Workflow Task
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={tasks}
        searchKey="title"
        searchPlaceholder="Search task board..."
        filterOptions={[
          { key: 'status', label: 'Statuses', options: ['Todo', 'In Progress', 'Review', 'Done'] },
          { key: 'priority', label: 'Priorities', options: ['Low', 'Medium', 'High'] },
        ]}
        itemsPerPage={10}
      />

      {/* Task Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Modify Task Details' : 'Assign Workflow Task'}
        size="md"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Audit Session Authentication"
                {...register('title')}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white transition-colors ${
                  errors.title ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500/30'
                }`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                Description / Details
              </label>
              <textarea
                placeholder="Outline details, requirements..."
                rows={3}
                {...register('description')}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white resize-none transition-colors ${
                  errors.description ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500/30'
                }`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                  Linked Project
                </label>
                <select
                  {...register('projectId')}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                  Team Assignee
                </label>
                <select
                  {...register('assigneeId')}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                  Priority level
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                  Workflow Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                  Deadline Date
                </label>
                <input
                  type="date"
                  {...register('dueDate')}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white transition-colors ${
                    errors.dueDate ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500/30'
                  }`}
                />
                {errors.dueDate && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.dueDate.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!isDirty}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {editingTask ? 'Save Task' : 'Assign Task'}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-semibold text-[#11191f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Alert */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Remove Workflow Task?"
        message="This task will be deleted from the system tracker, and project progress metrics will be recalculated automatically."
        confirmText="Remove Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}
