import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Download, 
  Edit, 
  FilePlus, 
  FileText, 
  Image as ImageIcon, 
  List, 
  Loader, 
  Menu as MenuIcon, 
  MoreHorizontal, 
  Plus, 
  Save, 
  Search, 
  Share2, 
  Trash, 
  Type, 
  Upload, 
  X, 
  Zap 
} from 'lucide-react';

// Main App Component
const ProposalBuilder = () => {
  // State management
  const [activeView, setActiveView] = useState('editor'); // 'editor', 'preview', 'dashboard'
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [slashCommandOpen, setSlashCommandOpen] = useState(false);
  const [slashCommandPos, setSlashCommandPos] = useState({ top: 0, left: 0 });
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [title, setTitle] = useState('Untitled Proposal');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [savedProposals, setSavedProposals] = useState([]);
  const [aiWriterPrompt, setAiWriterPrompt] = useState('');
  const [aiWriterModalOpen, setAiWriterModalOpen] = useState(false);
  const [aiImageModalOpen, setAiImageModalOpen] = useState(false);
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const [showCollaborateModal, setShowCollaborateModal] = useState(false);
  const [collaborateLink, setCollaborateLink] = useState('');
  const [aiStatus, setAiStatus] = useState(null);

  const editorRef = useRef(null);
  const autosaveTimerRef = useRef(null);

  // Load templates on mount
  useEffect(() => {
    fetchTemplates();
    fetchSavedProposals();
    // Initialize with a default block if empty
    if (blocks.length === 0) {
      setBlocks([
        {
          id: generateId(),
          type: 'h1',
          content: 'Your Proposal',
          children: []
        }
      ]);
    }
    
    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, []);

  // Set up autosave
  useEffect(() => {
    if (blocks.length > 0 && currentDraftId && activeView === 'editor') {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
      
      autosaveTimerRef.current = setInterval(() => {
        handleAutosave();
      }, 5000);
    }
    
    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [blocks, currentDraftId, activeView]);

  // Generate unique ID for blocks
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      // Simulated API call
      const sampleTemplates = [
        {
          id: 'template1',
          name: 'Client Introduction',
          description: 'A professional introduction to you and your services',
          icon: '👋',
          blocks: [
            { id: generateId(), type: 'h1', content: 'Introduction', children: [] },
            { id: generateId(), type: 'paragraph', content: 'Hello [Client Name],', children: [] },
            { id: generateId(), type: 'paragraph', content: 'Thank you for considering my services. I'm excited about the possibility of working together on your project.', children: [] },
            { id: generateId(), type: 'h2', content: 'About Me', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Your professional background and experience]', children: [] },
            { id: generateId(), type: 'h2', content: 'My Approach', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Describe your working style and philosophy]', children: [] },
          ]
        },
        {
          id: 'template2',
          name: 'Project Estimate',
          description: 'Detailed breakdown of project costs and timeline',
          icon: '💰',
          blocks: [
            { id: generateId(), type: 'h1', content: 'Project Estimate', children: [] },
            { id: generateId(), type: 'h2', content: 'Project Overview', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Brief description of the project scope]', children: [] },
            { id: generateId(), type: 'h2', content: 'Cost Breakdown', children: [] },
            { id: generateId(), type: 'bullet-list', content: 'Research and Planning: $X', children: [] },
            { id: generateId(), type: 'bullet-list', content: 'Development: $X', children: [] },
            { id: generateId(), type: 'bullet-list', content: 'Testing and Deployment: $X', children: [] },
            { id: generateId(), type: 'bullet-list', content: 'Revisions: $X', children: [] },
            { id: generateId(), type: 'h2', content: 'Total Estimate', children: [] },
            { id: generateId(), type: 'paragraph', content: '$X', children: [] },
            { id: generateId(), type: 'h2', content: 'Timeline', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Provide estimated timeline with milestones]', children: [] },
          ]
        },
        {
          id: 'template3',
          name: 'Scope of Work',
          description: 'Detailed breakdown of project deliverables and specifications',
          icon: '📋',
          blocks: [
            { id: generateId(), type: 'h1', content: 'Scope of Work', children: [] },
            { id: generateId(), type: 'h2', content: 'Project Goals', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Define the main objectives of the project]', children: [] },
            { id: generateId(), type: 'h2', content: 'Deliverables', children: [] },
            { id: generateId(), type: 'numbered-list', content: '[Deliverable 1]', children: [] },
            { id: generateId(), type: 'numbered-list', content: '[Deliverable 2]', children: [] },
            { id: generateId(), type: 'numbered-list', content: '[Deliverable 3]', children: [] },
            { id: generateId(), type: 'h2', content: 'Out of Scope', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Define what is not included in this project]', children: [] },
            { id: generateId(), type: 'h2', content: 'Technical Specifications', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Any technical requirements or specifications]', children: [] },
          ]
        },
        {
          id: 'template4',
          name: 'Portfolio Pitch',
          description: 'Showcase your best work and highlight relevant experience',
          icon: '✨',
          blocks: [
            { id: generateId(), type: 'h1', content: 'Portfolio Pitch', children: [] },
            { id: generateId(), type: 'h2', content: 'Relevant Experience', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Brief overview of your experience relevant to this project]', children: [] },
            { id: generateId(), type: 'h2', content: 'Case Studies', children: [] },
            { id: generateId(), type: 'h3', content: 'Project 1', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Description of project and your role]', children: [] },
            { id: generateId(), type: 'h3', content: 'Project 2', children: [] },
            { id: generateId(), type: 'paragraph', content: '[Description of project and your role]', children: [] },
            { id: generateId(), type: 'h2', content: 'Testimonials', children: [] },
            { id: generateId(), type: 'blockquote', content: '"[Client testimonial]" - Client Name, Company', children: [] },
          ]
        }
      ];
      
      setTemplates(sampleTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Fetch saved proposals
  const fetchSavedProposals = async () => {
    try {
      // Simulated API call
      const sampleProposals = [
        {
          id: 'draft1',
          title: 'Website Redesign for ABC Corp',
          lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          client: 'ABC Corporation',
          status: 'draft'
        },
        {
          id: 'draft2',
          title: 'Mobile App Development Proposal',
          lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          client: 'XYZ Startups',
          status: 'sent'
        },
        {
          id: 'draft3',
          title: 'Marketing Campaign Strategy',
          lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
          client: 'Global Media Inc.',
          status: 'accepted'
        }
      ];
      
      setSavedProposals(sampleProposals);
    } catch (error) {
      console.error('Error fetching saved proposals:', error);
    }
  };

  // Apply template
  const applyTemplate = (template) => {
    setBlocks(template.blocks);
    setCurrentDraftId(generateId());
    setTitle(`${template.name} - ${new Date().toLocaleDateString()}`);
    setTemplateModalOpen(false);
    setActiveView('editor');
  };

  // Create new proposal
  const createNewProposal = () => {
    setBlocks([
      {
        id: generateId(),
        type: 'h1',
        content: 'Your Proposal',
        children: []
      }
    ]);
    setCurrentDraftId(generateId());
    setTitle('Untitled Proposal');
    setActiveView('editor');
  };

  // Handle autosave
  const handleAutosave = async () => {
    if (blocks.length === 0 || !currentDraftId) return;
    
    setSaving(true);
    
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Autosaving...', {
        draftId: currentDraftId,
        title,
        content: blocks
      });
      
      setLastSaved(new Date());
      setSaving(false);
    } catch (error) {
      console.error('Error autosaving:', error);
      setSaving(false);
    }
  };

  // Explicitly save current draft
  const saveProposal = async () => {
    await handleAutosave();
  };

  // Handle export
  const handleExport = async (format) => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Exporting as ${format}...`, {
        draftId: currentDraftId,
        title,
        content: blocks
      });
      
      // Simulate file download
      alert(`Your proposal has been exported as ${format.toUpperCase()}`);
      
      setExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  // Handle AI writer
  const handleAiWriter = async () => {
    if (!aiWriterPrompt.trim()) return;
    
    setAiLoading(true);
    setAiStatus('Generating content...');
    
    try {
      // Simulated API call
      // In production: const response = await fetch('/api/ai/write', { method: 'POST', body: JSON.stringify({ prompt: aiWriterPrompt }) });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResult = `Based on your request "${aiWriterPrompt}", here's my suggestion:

This project aims to create a seamless user experience through intuitive design and robust functionality. Our approach will focus on understanding your users' needs first, then implementing solutions that align with your brand identity while providing exceptional value.

Key deliverables will include:
1. Comprehensive research and strategy documents
2. High-fidelity wireframes and prototypes
3. Fully responsive implementation
4. Detailed documentation for future maintenance

We'll maintain clear communication throughout the project, with regular check-ins and milestone reviews to ensure we're aligned with your vision.`;

      if (currentBlockId) {
        // Replace the content of the current block
        setBlocks(blocks.map(block => 
          block.id === currentBlockId 
            ? { ...block, type: 'paragraph', content: aiResult } 
            : block
        ));
      } else {
        // Add as a new block
        addBlock('paragraph', aiResult);
      }
      
      setAiWriterModalOpen(false);
      setAiWriterPrompt('');
      setCurrentBlockId(null);
    } catch (error) {
      console.error('Error using AI writer:', error);
      setAiStatus('Error generating content. Please try again.');
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiStatus(null), 3000);
    }
  };

  // Handle AI image generation
  const handleAiImage = async () => {
    if (!aiImagePrompt.trim()) return;
    
    setAiLoading(true);
    setAiStatus('Generating image...');
    
    try {
      // Simulated API call
      // In production: const response = await fetch('/api/ai/image', { method: 'POST', body: JSON.stringify({ description: aiImagePrompt }) });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder image URL - in production this would be the URL returned by the AI service
      const imageUrl = '/api/placeholder/800/400';
      
      if (currentBlockId) {
        // Replace the content of the current block
        setBlocks(blocks.map(block => 
          block.id === currentBlockId 
            ? { ...block, type: 'image', content: imageUrl, alt: aiImagePrompt } 
            : block
        ));
      } else {
        // Add as a new block
        addBlock('image', imageUrl, { alt: aiImagePrompt });
      }
      
      setAiImageModalOpen(false);
      setAiImagePrompt('');
      setCurrentBlockId(null);
    } catch (error) {
      console.error('Error generating AI image:', error);
      setAiStatus('Error generating image. Please try again.');
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiStatus(null), 3000);
    }
  };

  // Open slash command menu
  const openSlashCommand = (e, blockId) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSlashCommandPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
    
    setCurrentBlockId(blockId);
    setSlashCommandOpen(true);
  };

  // Handle block selection
  const selectBlock = (blockId) => {
    setSelectedBlockId(blockId);
  };

  // Add a new block
  const addBlock = (type, content = '', meta = {}) => {
    const newBlock = {
      id: generateId(),
      type,
      content,
      ...meta,
      children: []
    };
    
    const newBlocks = [...blocks];
    
    if (selectedBlockId) {
      // Find the index of the selected block
      const selectedIndex = newBlocks.findIndex(block => block.id === selectedBlockId);
      
      // Insert the new block after the selected block
      if (selectedIndex !== -1) {
        newBlocks.splice(selectedIndex + 1, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
    } else {
      // If no block is selected, add to the end
      newBlocks.push(newBlock);
    }
    
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    setSlashCommandOpen(false);
    return newBlock.id;
  };

  // Update block content
  const updateBlockContent = (blockId, content) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  // Change block type
  const changeBlockType = (blockId, newType) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, type: newType } : block
    ));
    setSlashCommandOpen(false);
  };

  // Delete block
  const deleteBlock = (blockId) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    setSelectedBlockId(null);
  };

  // Move block up
  const moveBlockUp = (blockId) => {
    const currentIndex = blocks.findIndex(block => block.id === blockId);
    if (currentIndex <= 0) return;
    
    const newBlocks = [...blocks];
    const temp = newBlocks[currentIndex];
    newBlocks[currentIndex] = newBlocks[currentIndex - 1];
    newBlocks[currentIndex - 1] = temp;
    
    setBlocks(newBlocks);
  };

  // Move block down
  const moveBlockDown = (blockId) => {
    const currentIndex = blocks.findIndex(block => block.id === blockId);
    if (currentIndex >= blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const temp = newBlocks[currentIndex];
    newBlocks[currentIndex] = newBlocks[currentIndex + 1];
    newBlocks[currentIndex + 1] = temp;
    
    setBlocks(newBlocks);
  };

  // Handle key commands
  const handleKeyDown = (e, blockId) => {
    if (e.key === '/') {
      openSlashCommand(e, blockId);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBlockId = addBlock('paragraph', '');
      setTimeout(() => {
        const element = document.getElementById(`block-${newBlockId}`);
        if (element) {
          element.focus();
        }
      }, 0);
    } else if (e.key === 'Backspace' && e.target.innerText === '') {
      e.preventDefault();
      deleteBlock(blockId);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      try {
        // Simulated image upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, upload the file to your server or cloud storage
        const imageUrl = URL.createObjectURL(file);
        
        addBlock('image', imageUrl, { alt: file.name });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // Generate share link
  const generateShareLink = () => {
    // In production, you would generate a real shareable link
    const link = `https://yourapp.com/share/${currentDraftId}`;
    setCollaborateLink(link);
    setShowCollaborateModal(true);
  };

  // Render block based on type
  const renderBlock = (block) => {
    const isSelected = selectedBlockId === block.id;
    
    switch (block.type) {
      case 'h1':
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <h1
              id={`block-${block.id}`}
              className="text-4xl font-bold my-4 px-4 py-1 outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.target.innerText)}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );
        
      case 'h2':
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <h2
              id={`block-${block.id}`}
              className="text-3xl font-semibold my-3 px-4 py-1 outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.target.innerText)}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );
        
      case 'h3':
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <h3
              id={`block-${block.id}`}
              className="text-2xl font-medium my-2 px-4 py-1 outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.target.innerText)}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );
        
      case 'paragraph':
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <p
              id={`block-${block.id}`}
              className="text-base my-2 px-4 py-1 outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.target.innerText)}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );
        
      case 'blockquote':
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <blockquote
              id={`block-${block.id}`}
              className="border-l-4 border-indigo-500 italic pl-4 py-1 my-4 text-gray-700 outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.target.innerText)}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );
        
      case 'bullet-list':
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <div className="flex items-start px-4 py-1">
              <span className="mr-2 mt-1">•</span>
              <div
                id={`block-${block.id}`}
                className="flex-1 outline-none"
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onBlur={(e) => updateBlockContent(block.id, e.target.innerText)}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          </div>
        );
        
      case 'numbered-list':
        const index = blocks.filter(b => b.type === 'numbered-list').findIndex(b => b.id === block.id) + 1;
        
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <div className="flex items-start px-4 py-1">
              <span className="mr-2 text-gray-500 min-w-[20px]">{index}.</span>
              <div
                id={`block-${block.id}`}
                className="flex-1 outline-none"
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onBlur={(e) => updateBlockContent(block.id, e.target.innerText)}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          </div>
        );
        
      case 'task-list':
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <div className="flex items-start px-4 py-1">
              <div className="mr-2 mt-1">
                <input 
                  type="checkbox" 
                  className="rounded-sm text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  checked={block.checked}
                  onChange={(e) => {
                    setBlocks(blocks.map(b => 
                      b.id === block.id ? { ...b, checked: e.target.checked } : b
                    ));
                  }}
                />
              </div>
              <div
                id={`block-${block.id}`}
                className={`flex-1 outline-none ${block.checked ? 'line-through text-gray-500' : ''}`}
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onBlur={(e) => updateBlockContent(block.id, e.target.innerText)}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          </div>
        );
        
      case 'toggle-list':
        return (
          <div 
            className={`relative group ${isSelected ? 'bg-indigo-50 rounded' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            {isSelected && (
              <BlockControls 
                blockId={block.id} 
                onMoveUp={() => moveBlockUp(block.id)} 
                onMoveDown={() => moveBlockDown(block.id)} 
                onDelete={() => deleteBlock(block.id)} 
              />
            )}
            <div className="px-4 py-1"></div>