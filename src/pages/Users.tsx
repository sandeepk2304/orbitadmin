import { useState } from 'react';
import { z } from 'zod';
import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';
import type { User } from '../types';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { ColumnDef } from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormBuilder from '../components/FormBuilder';
import type { FormFieldConfig } from '../components/FormBuilder';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

// Zod validation schema for Users Form
const userValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(5, 'Enter a valid phone number'),
  website: z.string().optional().or(z.literal('')),
  role: z.string().min(1, 'Select a user role'),
  status: z.enum(['Active', 'Inactive', 'Pending']),
});

type UserFormData = z.infer<typeof userValidationSchema>;

export default function Users() {
  const { users, addUser, updateUser, deleteUser, toggleStatus } = useUsers();
  const { roles } = useRoles();

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleOpenView = (user: User) => {
    setViewingUser(user);
    setDetailModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleFormSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateUser(editingUser.id, data);
    } else {
      addUser(data);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteUser(deletingId);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // Build field options from dynamic roles hook
  const roleOptions = roles.map((r) => ({ value: r.name, label: r.name }));

  const formFields: FormFieldConfig[] = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Kristina Evans' },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'kristina' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'kristina@orbitadmin.com' },
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 0199' },
    { name: 'website', label: 'Website (Optional)', type: 'text', placeholder: 'https://orbitadmin.com' },
    { name: 'role', label: 'Access Role', type: 'select', options: roleOptions },
    {
      name: 'status',
      label: 'Membership Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Pending', label: 'Pending' },
      ],
    },
  ];

  // DataTable column definitions
  const columns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'User Profile',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-white/10 shrink-0"
          />
          <div>
            <p className="font-bold text-[#11191f] dark:text-white leading-tight">{user.name}</p>
            <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">@{user.username}</p>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Email Address', sortable: true },
    { key: 'role', header: 'Role Type', sortable: true },
    {
      key: 'status',
      header: 'Status Badge',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'spent',
      header: 'Total Spent',
      sortable: true,
      align: 'right',
      render: (val) => (
        <span className="font-bold text-[#11191f] dark:text-white">${val.toFixed(2)}</span>
      ),
    },
    {
      key: 'id',
      header: 'Actions Trigger',
      align: 'center',
      render: (_, user) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleOpenView(user)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
            title="Inspect Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => handleOpenEdit(user)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
            title="Modify Profile"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => toggleStatus(user.id)}
            className={`p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors`}
            title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
          >
            {user.status === 'Active' ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
          </button>
          <button
            onClick={() => handleOpenDelete(user.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Delete User"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const defaultValues: UserFormData = editingUser
    ? {
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone,
        website: editingUser.website || '',
        role: editingUser.role,
        status: editingUser.status,
      }
    : {
        name: '',
        username: '',
        email: '',
        phone: '',
        website: '',
        role: roles[0]?.name || 'Viewer',
        status: 'Pending',
      };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="User Management"
        description="Add, edit, and delete user profiles, manage their statuses, and inspect user engagement statistics."
        action={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus size={16} /> Add User Profile
          </button>
        }
      />

      {/* Main Roster Table */}
      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search team by name..."
        filterOptions={[
          { key: 'status', label: 'Statuses', options: ['Active', 'Inactive', 'Pending'] },
          { key: 'role', label: 'Roles', options: roles.map((r) => r.name) },
        ]}
        itemsPerPage={10}
      />

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Modify User Profile' : 'Configure New User'}
        size="md"
      >
        <FormBuilder
          fields={formFields}
          validationSchema={userValidationSchema}
          defaultValues={defaultValues}
          onSubmit={handleFormSubmit}
          submitText={editingUser ? 'Update Profile' : 'Create Account'}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* View User Profile Detail Drawer */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Inspect User Details"
        size="md"
      >
        {viewingUser && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 dark:border-white/5 transition-colors">
              <img
                src={viewingUser.avatar}
                alt={viewingUser.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md mb-3"
              />
              <h4 className="text-lg font-bold text-[#11191f] dark:text-white">
                {viewingUser.name}
              </h4>
              <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">@{viewingUser.username}</p>
              <div className="mt-3">
                <StatusBadge status={viewingUser.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">
                  Email Address
                </p>
                <p className="font-bold text-[#11191f] dark:text-white mt-0.5">
                  {viewingUser.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">
                  Phone Number
                </p>
                <p className="font-bold text-[#11191f] dark:text-white mt-0.5">
                  {viewingUser.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">Access Role</p>
                <p className="font-bold text-[#11191f] dark:text-white mt-0.5">
                  {viewingUser.role}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">Joined Date</p>
                <p className="font-bold text-[#11191f] dark:text-white mt-0.5">
                  {viewingUser.joinedDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">
                  Total Orders
                </p>
                <p className="font-bold text-[#11191f] dark:text-white mt-0.5">
                  {viewingUser.orders} orders
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">
                  Total Billing
                </p>
                <p className="font-bold text-emerald-500 mt-0.5">${viewingUser.spent.toFixed(2)}</p>
              </div>
            </div>

            {viewingUser.website && (
              <div className="pt-2 text-sm">
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e] font-semibold">Website</p>
                <a
                  href={viewingUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-500 hover:underline font-bold mt-0.5 block truncate"
                >
                  {viewingUser.website}
                </a>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-white/10 text-sm font-semibold rounded-lg text-[#11191f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Alert */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete User Account?"
        message="This action will permanently delete this user profile and cancel all their credentials. This cannot be undone."
        confirmText="Yes, delete account"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}
