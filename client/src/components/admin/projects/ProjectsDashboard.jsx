import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  List as ListIcon,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  Clock,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const mockProjects = [
  {
    id: 1,
    name: "E-commerce Redesign",
    client: "TechStart Inc",
    startDate: "2024-03-01",
    dueDate: "2024-04-15",
    progress: 75,
    status: "active",
    description: "Complete redesign of client's e-commerce platform"
  },
  {
    id: 2,
    name: "Brand Identity",
    client: "Green Foods Co",
    startDate: "2024-02-15",
    dueDate: "2024-03-30",
    progress: 90,
    status: "active",
    description: "New brand identity including logo and style guide"
  },
  {
    id: 3,
    name: "Mobile App Development",
    client: "FitTrack",
    startDate: "2024-01-01",
    dueDate: "2024-03-15",
    progress: 100,
    status: "completed",
    description: "Fitness tracking mobile application"
  }
];

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-700',
  overdue: 'bg-red-100 text-red-700'
};

export default function ProjectsDashboard() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projects, setProjects] = useState(mockProjects);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const CircularProgress = ({ value }) => (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="3"
          strokeDasharray={`${value}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {value}%
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-jakarta font-bold text-gray-900">
              Projects
            </h1>
            <p className="mt-1 text-gray-600">
              Manage and track all your client projects
            </p>
          </div>
          <Link
            to="/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Project
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                "p-2 rounded-lg transition-colors",
                viewMode === 'grid'
                  ? "bg-primary/10 text-primary"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                "p-2 rounded-lg transition-colors",
                viewMode === 'list'
                  ? "bg-primary/10 text-primary"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <ListIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={clsx(
        viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      )}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={clsx(
              "bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow",
              viewMode === 'list' ? "p-4" : "p-6"
            )}
          >
            <div className={clsx(
              viewMode === 'list'
                ? "flex items-center gap-6"
                : "space-y-4"
            )}>
              <div className={clsx(
                "flex-1",
                viewMode === 'list' ? "flex items-center gap-6" : ""
              )}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.client}</p>
                    </div>
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      statusColors[project.status]
                    )}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>

                  {viewMode === 'grid' && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due {format(new Date(project.dueDate), 'MMM d')}</span>
                    </div>
                    {viewMode === 'list' && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.client}</span>
                      </div>
                    )}
                  </div>
                </div>

                {viewMode === 'list' ? (
                  <div className="flex items-center gap-6">
                    <CircularProgress value={project.progress} />
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/projects/${project.id}`}
                        className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        View Details
                      </Link>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <CircularProgress value={project.progress} />
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/projects/${project.id}`}
                        className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        View Details
                      </Link>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}