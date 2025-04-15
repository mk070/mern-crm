import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Info } from 'lucide-react';

const permissions = {
  manage_team: {
    name: 'Manage Team',
    description: 'Add, edit, and remove team members',
    category: 'Team Management'
  },
  manage_billing: {
    name: 'Manage Billing',
    description: 'Access to billing and subscription settings',
    category: 'Administration'
  },
  manage_settings: {
    name: 'Manage Settings',
    description: 'Modify system and organization settings',
    category: 'Administration'
  },
  manage_projects: {
    name: 'Manage Projects',
    description: 'Create and manage all projects',
    category: 'Project Management'
  },
  view_reports: {
    name: 'View Reports',
    description: 'Access to analytics and reporting',
    category: 'Reporting'
  },
  edit_assigned_tasks: {
    name: 'Edit Assigned Tasks',
    description: 'Modify tasks assigned to them',
    category: 'Project Management'
  }
};

const categories = [
  'Team Management',
  'Administration',
  'Project Management',
  'Reporting'
];

export function EmployeePermissions({ selectedPermissions, onChange }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const permissionsByCategory = categories.reduce((acc, category) => {
    acc[category] = Object.entries(permissions)
      .filter(([_, permission]) => permission.category === category)
      .map(([key, permission]) => ({
        key,
        ...permission
      }));
    return acc;
  }, {});

  const handlePermissionToggle = (permissionKey) => {
    const newPermissions = new Set(selectedPermissions);
    if (newPermissions.has(permissionKey)) {
      newPermissions.delete(permissionKey);
    } else {
      newPermissions.add(permissionKey);
    }
    onChange(newPermissions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <Info className="w-4 h-4" />
        <p>
          Customize access levels by selecting specific permissions below
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedCategory(
              expandedCategory === category ? null : category
            )}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">{category}</span>
            </div>
            <div className="text-sm text-gray-500">
              {permissionsByCategory[category].filter(
                permission => selectedPermissions.has(permission.key)
              ).length} of {permissionsByCategory[category].length} enabled
            </div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: expandedCategory === category ? 'auto' : 0,
              opacity: expandedCategory === category ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {permissionsByCategory[category].map((permission) => (
                <label
                  key={permission.key}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.has(permission.key)}
                    onChange={() => handlePermissionToggle(permission.key)}
                    className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {permission.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {permission.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}