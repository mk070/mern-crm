import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import ProposalTemplates from './ProposalTemplates';
import ProposalToolbar from './ProposalToolbar';
import ProposalSidebar from './ProposalSidebar';
import ProposalStatusBar from './ProposalStatusBar';

const TEMPLATES = {
  introduction: `# Introduction\n\nThank you for considering our services. This proposal outlines our approach to help you achieve your goals...`,
  scope: `# Scope of Work\n\n## Project Overview\n- Objective 1\n- Objective 2\n\n## Deliverables\n1. Deliverable 1\n2. Deliverable 2`,
  timeline: `# Project Timeline\n\n## Phase 1: Planning (Week 1-2)\n- Initial consultation\n- Requirements gathering\n\n## Phase 2: Development (Week 3-6)\n- Implementation\n- Testing`,
  pricing: `# Pricing\n\n## Package Options\n\n### Basic Package: $X,XXX\n- Feature 1\n- Feature 2\n\n### Premium Package: $XX,XXX\n- All Basic features\n- Additional features`,
  deliverables: `# Project Deliverables\n\n1. ## Main Deliverable 1\n   - Sub-item 1\n   - Sub-item 2\n\n2. ## Main Deliverable 2\n   - Sub-item 1\n   - Sub-item 2`,
};

const ProposalBuilder = () => {
  const [title, setTitle] = useState('Untitled Proposal');
  const [showTemplates, setShowTemplates] = useState(false);
  const [status, setStatus] = useState('draft');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    company: '',
    deadline: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start typing or choose a template...',
      }),
    ],
    content: '',
    autofocus: true,
  });

  const handleTemplateSelect = useCallback((template) => {
    if (editor) {
      editor.commands.setContent(template.content);
      setShowTemplates(false);
      toast.success('Template applied successfully!');
    }
  }, [editor]);

  const handleSectionClick = useCallback((sectionId) => {
    if (editor) {
      const template = TEMPLATES[sectionId];
      if (template) {
        const currentContent = editor.getHTML();
        editor.commands.setContent(currentContent + '\n\n' + template);
        toast.success(`${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} section added`);
      }
    }
  }, [editor]);

  const handleAIGenerate = useCallback(async () => {
    try {
      toast.loading('Generating content with AI...');
      // Simulated AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiContent = `# AI-Generated Content\n\nHere's a professionally written section based on your context...`;
      editor?.commands.insertContent(aiContent);
      
      toast.dismiss();
      toast.success('AI content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI content');
    }
  }, [editor]);

  const handleExport = useCallback(async (format) => {
    try {
      toast.loading('Preparing document...');
      
      const content = document.querySelector('.ProseMirror').innerHTML;
      const exportOptions = {
        margin: 10,
        filename: `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(exportOptions).from(content).save();
      
      toast.dismiss();
      toast.success('Document exported successfully!');
    } catch (error) {
      toast.error('Export failed. Please try again.');
    }
  }, [title]);

  const handleShare = useCallback(async (method) => {
    try {
      toast.loading(`Sharing via ${method}...`);
      
      // Simulated share API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('sent');
      toast.dismiss();
      toast.success(`Proposal shared via ${method}`);
    } catch (error) {
      toast.error('Failed to share proposal');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ProposalSidebar
          clientInfo={clientInfo}
          setClientInfo={setClientInfo}
          onTemplateClick={() => setShowTemplates(true)}
          onSectionClick={handleSectionClick}
        />

        <div className="flex-1 min-h-screen">
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="px-6 py-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-semibold bg-transparent border-none focus:outline-none w-full font-jakarta text-gray-900"
                placeholder="Untitled Proposal"
              />
            </div>
            <ProposalToolbar editor={editor} onAIGenerate={handleAIGenerate} />
          </div>

          <div className="max-w-4xl mx-auto px-6 py-8">
            <EditorContent editor={editor} className="prose max-w-none" />
          </div>
        </div>

        <ProposalStatusBar
          status={status}
          onExport={handleExport}
          onShare={handleShare}
        />
      </div>

      {showTemplates && (
        <ProposalTemplates
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default ProposalBuilder;