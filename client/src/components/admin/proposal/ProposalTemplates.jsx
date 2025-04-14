import React from 'react';
import { X } from 'lucide-react';

const templates = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Complete website development proposal template',
    sections: ['Introduction', 'Scope', 'Timeline', 'Pricing'],
  },
  {
    id: 2,
    title: 'Design Project',
    description: 'UI/UX design project proposal template',
    sections: ['Project Overview', 'Deliverables', 'Process', 'Investment'],
  },
  {
    id: 3,
    title: 'Marketing Campaign',
    description: 'Digital marketing campaign proposal template',
    sections: ['Strategy', 'Channels', 'Timeline', 'ROI Projection'],
  },
];

const ProposalTemplates = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-surface rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-neutral-border">
          <h2 className="text-xl font-semibold text-neutral-text-primary font-jakarta">
            Choose a Template
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-text-secondary hover:bg-neutral-bg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="text-left p-4 rounded-xl border border-neutral-border hover:border-primary/20 bg-neutral-bg hover:bg-neutral-surface transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-neutral-text-primary mb-2">
                  {template.title}
                </h3>
                <p className="text-sm text-neutral-text-secondary mb-4">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.sections.map((section, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalTemplates;