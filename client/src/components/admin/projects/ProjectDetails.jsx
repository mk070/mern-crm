import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  Users,
  Clock,
  MoreVertical,
  Share2,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import AIAutoSummary from './AIAutoSummary';
import DeliverablesSection from './DeliverablesSection';
import LinkedInvoices from './LinkedInvoices';

const mockProject = {
  id: 1,
  name: "E-commerce Redesign",
  client: "TechStart Inc",
  startDate: "2024-03-01",
  dueDate: "2024-04-15",
  progress: 75,
  status: "active",
  description: "Complete redesign of client's e-commerce platform with focus on user experience and conversion optimization. Including new checkout flow and product recommendations.",
  budget: 15000,
  hoursLogged: 120,
  totalHours: 160
};

const tabs = [
  { id: 'summary', label: 'Progress Summary', icon: CheckCircle2 },
  { id: 'deliverables', label: 'Deliverables', icon: Download },
  { id: 'invoices', label: 'Invoices & Payments', icon: Send }
];

export default function ProjectDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('summary');
  const [showActions, setShowActions] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <AIAutoSummary projectId={id} />;
      case 'deliverables':
        return <DeliverablesSection projectId={id} />;
      case 'invoices':
        return <LinkedInvoices projectId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Project Info */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-jakarta font-bold text-gray-900">
                  {mockProject.name}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{mockProject.client}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due {format(new Date(mockProject.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{mockProject.hoursLogged}/{mockProject.totalHours} hours</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {showActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Edit2 className="h-4 w-4" />
                        Edit Project
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={clsx(
            "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2",
            notification.type === 'error' ? "bg-red-500 text-white" : "bg-green-500 text-white"
          )}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
          {notification.message}
        </div>
      )}
    </div>
  );
}