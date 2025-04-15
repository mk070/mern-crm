import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import ClientCard from './ClientCard';
import ClientFilters from './ClientFilters';
import AddClientForm from './AddClientForm';
import EditClientDrawer from './EditClientDrawer';
import { useClients } from './ClientService';

const viewTypes = {
  GRID: 'grid',
  LIST: 'list',
};

export default function ClientsDashboard() {
  const [viewType, setViewType] = useState(viewTypes.GRID);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    tags: [],
    sort: 'latest',
  });

  const { clients, isLoading, error } = useClients(filters);

  const handleEditClient = useCallback((client) => {
    setEditingClient(client);
  }, []);

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-neutral-text-primary font-jakarta">
            Clients
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-neutral-bg rounded-lg p-1">
              <button
                onClick={() => setViewType(viewTypes.GRID)}
                className={`p-2 rounded-lg transition-colors ${
                  viewType === viewTypes.GRID
                    ? 'bg-primary text-white'
                    : 'text-neutral-text-secondary hover:text-neutral-text-primary'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewType(viewTypes.LIST)}
                className={`p-2 rounded-lg transition-colors ${
                  viewType === viewTypes.LIST
                    ? 'bg-primary text-white'
                    : 'text-neutral-text-secondary hover:text-neutral-text-primary'
                }`}
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setShowAddClient(true)}
              className="inline-flex items-center px-4 py-2 rounded-xl text-white bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary transition-all duration-200 shadow-lg shadow-primary/25 font-inter"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Client
            </button>
          </div>
        </div>

        {/* Filters */}
        <ClientFilters filters={filters} onChange={setFilters} />

        {/* Client Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-status-error">
            {error}
          </div>
        ) : (
          <AnimatePresence>
            <div
              className={
                viewType === viewTypes.GRID
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {clients.map((client) => (
                <motion.div
                  key={client.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ClientCard
                    client={client}
                    viewType={viewType}
                    onEdit={handleEditClient}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Add Client Modal */}
      <AddClientForm
        isOpen={showAddClient}
        onClose={() => setShowAddClient(false)}
      />

      {/* Edit Client Drawer */}
      <EditClientDrawer
        client={editingClient}
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
      />
    </div>
  );
}