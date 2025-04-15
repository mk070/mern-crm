import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import {
  X,
  Upload,
  Mail,
  Lock,
  User,
  Phone,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import React, { useEffect } from "react"; // 

const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all features and settings',
    permissions: ['manage_team', 'manage_billing', 'manage_settings', 'view_reports']
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage projects and team members',
    permissions: ['manage_projects', 'manage_team', 'view_reports']
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Basic access to assigned projects',
    permissions: ['view_projects', 'edit_assigned_tasks']
  }
];

const permissions = {
  manage_team: {
    name: 'Manage Team',
    description: 'Add, edit, and remove team members'
  },
  manage_billing: {
    name: 'Manage Billing',
    description: 'Access to billing and subscription settings'
  },
  manage_settings: {
    name: 'Manage Settings',
    description: 'Modify system and organization settings'
  },
  manage_projects: {
    name: 'Manage Projects',
    description: 'Create and manage all projects'
  },
  view_reports: {
    name: 'View Reports',
    description: 'Access to analytics and reporting'
  },
  edit_assigned_tasks: {
    name: 'Edit Assigned Tasks',
    description: 'Modify tasks assigned to them'
  },
  view_projects: {
    name: 'View Projects',
    description: 'View project details and progress'
  }
};



export function AddEmployeeForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    avatar: null,
    customPermissions: new Set()
  });
  const [sendInvite, setSendInvite] = useState(true);
  const [step, setStep] = useState(1);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    toast.success('Team member added successfully!');
    if (sendInvite) {
      toast.success('Invitation email sent!');
    }
    onClose();
  };

  const selectedRole = roles.find(r => r.id === formData.role);

  useEffect(() => {
    if (!isOpen) {
      setStep(1); // reset only after the dialog fully closes
    }
  }, [isOpen]);
  return (
    <Dialog
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Add New Team Member
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {step === 1 && (
              <div className="px-6 py-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary-50' : 'border-gray-300'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {formData.avatar ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={formData.avatar}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover mb-4"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, avatar: null }));
                          }}
                        >
                          Remove Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag & drop a profile picture or click to select
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Supports PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone (Optional)
                    </label>
                    <div className="mt-1 relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="px-6 py-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.role === role.id
                            ? 'border-primary bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">
                              {role.name}
                            </h3>
                            {formData.role === role.id && (
                              <CheckCircle2 className="ml-2 h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {role.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {permissions[permission].name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendInvite"
                    checked={sendInvite}
                    onChange={(e) => setSendInvite(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="sendInvite" className="ml-2 text-sm text-gray-600">
                    Send invitation email with temporary password
                  </label>
                </div>
              </div>
            )}

            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              {step === 2 ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit">
                    Add Team Member
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault(); 
                        console.log("Step before:", step);
                        setStep(2);
                    }}
                  >
                    Next
                    </Button>
                </>
              )}
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}