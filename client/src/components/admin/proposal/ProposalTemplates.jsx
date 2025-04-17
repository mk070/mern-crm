import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getTemplates, getTemplateById } from './api/proposalTemplateApi';

const ProposalTemplates = ({ onSelect, onClose, clientInfo }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await getTemplates();
        setTemplates(data);
        setError(null);
      } catch (err) {
        setError('Failed to load templates. Please try again.');
        console.error('Error loading templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateClick = async (template) => {
    try {
      setLoading(true);
      const fullTemplate = await getTemplateById(template.id);
      
      // Replace placeholders with client info
      let content = fullTemplate.content;
      console.log('Client Info:', clientInfo);
      console.log('Template Content:', content);
      if (clientInfo) {
        content = content.replace(/{{name}}/g, clientInfo.name || '[Client Name]');
        content = content.replace(/{{email}}/g, clientInfo.email || '[Client Email]');
        content = content.replace(/{{company}}/g, clientInfo.company || '[Company Name]');
        content = content.replace(/{{deadline}}/g, clientInfo.deadline || '[Project Deadline]');
      }
      
      onSelect({
        ...fullTemplate,
        content: content
      });
    } catch (err) {
      setError(`Failed to load template: ${template.title}`);
      console.error('Error loading template:', err);
    } finally {
      setLoading(false);
    }
  };

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
          {loading && <div className="text-center py-8">Loading templates...</div>}
          
          {error && (
            <div className="text-center py-8 text-red-500">
              {error}
              <button 
                className="block mx-auto mt-2 text-primary underline" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalTemplates;
