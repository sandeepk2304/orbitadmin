import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProjects } from '../hooks/useProjects';
import { useUsers } from '../hooks/useUsers';
import type { Project } from '../types';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { ColumnDef } from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, Pencil, Trash2, Calendar, DollarSign, Users } from 'lucide-react';

const projectValidationSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(5, 'Provide a description of at least 5 characters'),
  status: z.enum(['Planning', 'Active', 'On Hold', 'Completed']),
  dueDate: z.string().min(1, 'Select a target due date'),
  budget: z.number().min(1, 'Enter a valid project budget'),
  members: z.array(z.string()).min(1, 'Assign at least one team member'),
});

type ProjectFormData = z.infer<typeof projectValidationSchema>;

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { users } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectValidationSchema),
    defaultValues: { name: '', description: '', status: 'Planning', dueDate: '', budget: 0, members: [] },
  });

  const selectedMembers = useWatch({ control, name: 'members' }) || [];

  const handleOpenAdd = () => {
    setEditingProject(null);
    reset({ name: '', description: '', status: 'Planning', dueDate: '', budget: 0, members: [] });
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    reset({
      name: project.name,
      description: project.description,
      status: project.status,
      dueDate: project.dueDate,
      budget: project.budget,
      members: project.members,
    });
    setModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      addProject(data);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteProject(deletingId);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const toggleMemberSelection = (userId: string) => {
    const next = selectedMembers.includes(userId)
      ? selectedMembers.filter((id) => id !== userId)
      : [...selectedMembers, userId];
    setValue('members', next, { shouldDirty: true });
  };

  // DataTable column definitions
  const columns: ColumnDef<Project>[] = [
    {
      key: 'name',
      header: 'Project Details',
      sortable: true,
      render: (_, proj) => (
        <div className="space-y-1">
          <p className="font-bold text-[#11191f] dark:text-white leading-tight">{proj.name}</p>
          <p className="text-xs text-gray-400 dark:text-[#8a8a9e] line-clamp-1 max-w-sm">
            {proj.description}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status Badge',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'dueDate',
      header: 'Target Date',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-[#8a8a9e] font-semibold">
          <Calendar size={12} /> {val}
        </span>
      ),
    },
    {
      key: 'budget',
      header: 'Budget allocated',
      sortable: true,
      align: 'right',
      render: (val) => (
        <span className="font-bold text-[#11191f] dark:text-white">${val.toLocaleString()}</span>
      ),
    },
    {
      key: 'progress',
      header: 'Task Progress',
      sortable: true,
      render: (progress) => (
        <div className="w-full max-w-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-[#8a8a9e]">
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'members',
      header: 'Team Assigned',
      render: (memberIds: string[]) => (
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {memberIds.map((mid) => {
            const member = users.find((u) => u.id === mid);
            return member ? (
              <img
                key={mid}
                src={member.avatar}
                alt={member.name}
                className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1a1a27] object-cover shrink-0"
                title={member.name}
              />
            ) : null;
          })}
          {memberIds.length === 0 && (
            <span className="text-xs text-gray-400 dark:text-[#8a8a9e] font-medium">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'id',
      header: 'Actions Trigger',
      align: 'center',
      render: (_, proj) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => handleOpenEdit(proj)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer"
            title="Modify Project"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleOpenDelete(proj.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete Project"
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
        title="Project Ledger"
        description="Track active development plans, budget parameters, timelines, and task completion percentages."
        action={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus size={16} /> Create Project Plan
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={projects}
        searchKey="name"
        searchPlaceholder="Search project ledger..."
        filterOptions={[
          { key: 'status', label: 'Statuses', options: ['Planning', 'Active', 'On Hold', 'Completed'] },
        ]}
        itemsPerPage={5}
      />

      {/* Custom Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Modify Project Plan' : 'Setup Project Plan'}
        size="md"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Mobile App MVP"
                {...register('name')}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white transition-colors ${
                  errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500/30'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                Project Scope / Details
              </label>
              <textarea
                placeholder="Describe scope, objectives..."
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
                  Budget allocation ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><DollarSign size={14} /></span>
                  <input
                    type="number"
                    placeholder="25000"
                    {...register('budget', { valueAsNumber: true })}
                    className={`w-full pl-8 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white transition-colors ${
                      errors.budget ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500/30'
                    }`}
                  />
                </div>
                {errors.budget && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.budget.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                  Project Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1">
                  Timeline Due Date
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

            {/* Team checklist selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-2 flex items-center gap-1">
                <Users size={14} /> Assign Team Members
              </label>
              <div className="border border-gray-200 dark:border-white/10 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                {users.map((user) => {
                  const isChecked = selectedMembers.includes(user.id);
                  return (
                    <label
                      key={user.id}
                      onClick={() => toggleMemberSelection(user.id)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover border border-gray-100"
                        />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                          {user.name} ({user.role})
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="w-4 h-4 rounded accent-indigo-500"
                      />
                    </label>
                  );
                })}
              </div>
              {errors.members && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.members.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!isDirty}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {editingProject ? 'Save Plan' : 'Setup Project'}
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
        title="Remove Project Plan?"
        message="Removing this project will also delete all tasks associated with it. This cannot be undone."
        confirmText="Remove Project"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}
