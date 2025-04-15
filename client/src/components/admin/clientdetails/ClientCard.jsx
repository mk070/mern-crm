import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  MoreVertical,
  Edit2,
  Trash2,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const statusColors = {
  active: 'bg-status-success',
  inactive: 'bg-status-error',
  pending: 'bg-status-warning',
};

export default function ClientCard({ client, viewType, onEdit }) {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting client...');
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Client deleted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete client', { id: toastId });
    }
  };

  const handleMessage = () => {
    toast('Opening chat...', {
      icon: '💬',
    });
  };

  if (viewType === 'list') {
    return (
      <div className="bg-neutral-surface rounded-xl border border-neutral-border hover:border-primary/20 transition-all duration-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {client.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-neutral-text-primary font-medium">
                {client.name}
              </h3>
              <p className="text-neutral-text-secondary text-sm">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                statusColors[client.status]
              }`}
            />
            <span className="text-sm text-neutral-text-secondary">
              {format(new Date(client.lastInteraction), 'MMM d, yyyy')}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 rounded-lg hover:bg-neutral-bg transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-neutral-text-secondary" />
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-surface shadow-lg border border-neutral-border py-1 z-10">
                  <button
                    onClick={() => onEdit(client)}
                    className="w-full flex items-center px-4 py-2 text-sm text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleMessage}
                    className="w-full flex items-center px-4 py-2 text-sm text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center px-4 py-2 text-sm text-status-error hover:bg-status-error/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-neutral-surface rounded-xl border border-neutral-border hover:border-primary/20 transition-all duration-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-lg font-semibold">
              {client.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-neutral-text-primary font-medium">
              {client.name}
            </h3>
            <p className="text-neutral-text-secondary text-sm">{client.email}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg hover:bg-neutral-bg transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-neutral-text-secondary" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-surface shadow-lg border border-neutral-border py-1 z-10">
              <button
                onClick={() => onEdit(client)}
                className="w-full flex items-center px-4 py-2 text-sm text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleMessage}
                className="w-full flex items-center px-4 py-2 text-sm text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center px-4 py-2 text-sm text-status-error hover:bg-status-error/10 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {client.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                statusColors[client.status]
              }`}
            />
            <span className="text-neutral-text-secondary">
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </span>
          </div>
          <span className="text-neutral-text-secondary">
            Last interaction:{' '}
            {format(new Date(client.lastInteraction), 'MMM d, yyyy')}
          </span>
        </div>

        {client.platform && (
          <div className="flex items-center text-sm text-neutral-text-secondary">
            <ExternalLink className="h-4 w-4 mr-2" />
            {client.platform}
          </div>
        )}
      </div>
    </motion.div>
  );
}