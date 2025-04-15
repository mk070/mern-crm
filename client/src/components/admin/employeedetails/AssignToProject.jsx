import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Users } from 'lucide-react';

const mockProjects = [
  { id: 1, name: 'Website Redesign', description: 'Company website overhaul' },
  { id: 2, name: 'Mobile App', description: 'iOS and Android development' },
  { id: 3, name: 'CRM Development', description: 'Internal CRM system' },
  { id: 4, name: 'Content Strategy', description: 'Content planning and creation' }
];

export function AssignToProject({ employee, onAssign, onUnassign, assignedProjects = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProject = (projectId) => {
    if (assignedProjects.includes(projectId)) {
      onUnassign(projectId);
    } else {
      onAssign(projectId);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <Users className="w-4 h-4" />
        Assign to Projects
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 border border-gray-200"
            >
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => toggleProject(project.id)}
                    className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {project.description}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {assignedProjects.includes(project.id) ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  No projects found
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}