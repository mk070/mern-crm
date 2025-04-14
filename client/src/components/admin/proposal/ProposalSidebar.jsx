import React from 'react';
import {
  FileText,
  User,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  CalendarIcon,
} from 'lucide-react';

const ProposalSidebar = ({ clientInfo, setClientInfo, onTemplateClick, onSectionClick }) => {
  const sections = [
    { icon: FileText, label: 'Introduction', id: 'introduction' },
    { icon: User, label: 'Scope of Work', id: 'scope' },
    { icon: Calendar, label: 'Timeline', id: 'timeline' },
    { icon: DollarSign, label: 'Pricing', id: 'pricing' },
    { icon: Clock, label: 'Deliverables', id: 'deliverables' },
  ];

  return (
    <div className="w-72 border-r border-neutral-border bg-white p-6">
      <div className="mb-8">
        <button
          onClick={onTemplateClick}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-white bg-[#0066FF] hover:bg-[#0052CC] transition-colors font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          New from Template
        </button>
      </div>

      <div className="space-y-8">
        {/* Client Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-4">
            Client Information
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Client Name"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] text-gray-700"
            />
            <input
              type="email"
              placeholder="Client Email"
              value={clientInfo.email}
              onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] text-gray-700"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={clientInfo.company}
              onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] text-gray-700"
            />
            <div className="relative">
              <input
                type="date"
                value={clientInfo.deadline}
                onChange={(e) => setClientInfo({ ...clientInfo, deadline: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] text-gray-700"
              />
              <CalendarIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-4">
            Sections
          </h3>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <section.icon className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalSidebar;