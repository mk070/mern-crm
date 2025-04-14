import React from 'react';
import {
  Bold,
  Italic,
  List,
  Heading,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckSquare,
  Quote,
  Code,
  Table,
  Sparkles,
} from 'lucide-react';

const ProposalToolbar = ({ editor, onAIGenerate }) => {
  if (!editor) return null;

  const tools = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: 'Bold',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: 'Italic',
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: 'Bullet List',
    },
    {
      icon: Heading,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading'),
      tooltip: 'Heading',
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      tooltip: 'Quote',
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      tooltip: 'Code Block',
    },
    {
      icon: Table,
      action: () => editor.chain().focus().insertTable().run(),
      tooltip: 'Insert Table',
    },
    {
      icon: CheckSquare,
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList'),
      tooltip: 'Task List',
    },
  ];

  const handleImageUpload = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleLinkAdd = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-t border-neutral-border bg-neutral-surface px-6 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.action}
            className={`p-2 rounded-lg transition-colors ${
              tool.isActive
                ? 'bg-primary text-white'
                : 'text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary'
            }`}
            title={tool.tooltip}
          >
            <tool.icon className="h-5 w-5" />
          </button>
        ))}
        <button
          onClick={handleImageUpload}
          className="p-2 rounded-lg text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleLinkAdd}
          className="p-2 rounded-lg text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
          title="Insert Link"
        >
          <LinkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <button
        onClick={() => onAIGenerate('current section')}
        className="flex items-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        AI Assist
      </button>
    </div>
  );
};

export default ProposalToolbar;