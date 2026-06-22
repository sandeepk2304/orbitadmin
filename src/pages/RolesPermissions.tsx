import { useState } from 'react';
import { z } from 'zod';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import type { Role } from '../types';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import FormBuilder from '../components/FormBuilder';
import type { FormFieldConfig } from '../components/FormBuilder';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, Shield, Pencil, Trash2, Check, CheckSquare, Info } from 'lucide-react';

const roleValidationSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().min(5, 'Provide a description of at least 5 characters'),
});

type RoleFormData = z.infer<typeof roleValidationSchema>;

export default function RolesPermissions() {
  const { roles, addRole, updateRole, deleteRole } = useRoles();
  const { permissions, togglePermissionForRole } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    // Cannot delete administrator role
    if (id === 'r-admin') return;
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleFormSubmit = (data: RoleFormData) => {
    if (editingRole) {
      updateRole(editingRole.id, data);
    } else {
      addRole(data);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteRole(deletingId);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const formFields: FormFieldConfig[] = [
    { name: 'name', label: 'Role Title', type: 'text', placeholder: 'Product Owner' },
    { name: 'description', label: 'Functional Scope', type: 'textarea', placeholder: 'Functional access to...' },
  ];

  const defaultValues: RoleFormData = editingRole
    ? { name: editingRole.name, description: editingRole.description }
    : { name: '', description: '' };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Configure system access role types, write functional scope descriptions, and toggle the permission matrix grid."
        action={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus size={16} /> Configure Access Role
          </button>
        }
      />

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Shield size={18} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(role)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer"
                    title="Edit Role Scope"
                  >
                    <Pencil size={14} />
                  </button>
                  {role.id !== 'r-admin' && (
                    <button
                      onClick={() => handleOpenDelete(role.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Access Role"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-base font-bold text-[#11191f] dark:text-white">{role.name}</h3>
              <p className="text-xs text-gray-400 dark:text-[#8a8a9e] leading-relaxed">
                {role.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-gray-400 dark:text-[#8a8a9e]">
              <span>Active Permissions</span>
              <span className="text-indigo-500 dark:text-indigo-400 font-bold">
                {role.permissions.length} / {permissions.length}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix Grid Card */}
      <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
          <CheckSquare size={18} className="text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-[#11191f] dark:text-white">
              Role-Permission Matrix
            </h3>
            <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">
              Toggle checkboxes to modify system authorization limits dynamically.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#242435] border-b border-gray-100 dark:border-white/5 transition-colors">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-[#8a8a9e] uppercase tracking-wider">
                  Permission Name / Category
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-[#8a8a9e] uppercase tracking-wider text-center"
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 transition-colors">
              {permissions.map((perm) => (
                <tr
                  key={perm.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-[#11191f] dark:text-white text-sm">{perm.name}</p>
                      <p className="text-xs text-gray-400 dark:text-[#8a8a9e] mt-0.5 font-medium">
                        {perm.description}
                      </p>
                    </div>
                  </td>
                  {roles.map((role) => {
                    const isChecked = role.permissions.includes(perm.id);
                    const isReadOnly = role.id === 'r-admin'; // Admin gets everything, read-only
                    return (
                      <td key={role.id} className="px-6 py-4 text-center">
                        <label className="inline-flex items-center justify-center p-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isReadOnly}
                            onChange={() => togglePermissionForRole(role.id, perm.id)}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                                : 'border-gray-300 dark:border-white/10'
                            } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isChecked && <Check size={12} strokeWidth={3} />}
                          </div>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-500/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center gap-2.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold px-6">
          <Info size={14} className="shrink-0" />
          <span>The Administrator role possesses locked core rights that cannot be deselected.</span>
        </div>
      </div>

      {/* Add / Edit Role Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRole ? 'Update Role Settings' : 'Create Access Role'}
        size="sm"
      >
        <FormBuilder
          fields={formFields}
          validationSchema={roleValidationSchema}
          defaultValues={defaultValues}
          onSubmit={handleFormSubmit}
          submitText={editingRole ? 'Update Role' : 'Create Role'}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Delete Role Confirmation Alert */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Remove Access Role?"
        message="Removing this access role will revoke it from all members. Any active sessions bound to this role will fallback to ReadOnly Viewer scope."
        confirmText="Remove Role"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}
