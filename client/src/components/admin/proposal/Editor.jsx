import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Wand2, FileDown, Loader2, ChevronDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './App.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': ['Arial', 'Georgia', 'Times New Roman'] }],
  [{ 'align': [] }],
  ['clean']
];

function Editor() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const quillRef = useRef(null);
  const editorRef = useRef(null);
    const [isSidebar, setIsSidebar] = useState(true);
  

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: { toolbar: toolbarOptions }
      });
    }
  }, []);

  const handleGeneratePDF = () => {
    if (!quillRef.current) return;

    const content = quillRef.current.root.innerHTML;
    const container = document.createElement('div');

    // Add company logo
    const logoUrl = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop";
    const logoImage = document.createElement('img');
    logoImage.src = logoUrl;
    logoImage.style.cssText = 'display: flex; margin: 0 auto; width: 80px;';
    container.appendChild(logoImage);

    // Add title
    const titleElement = document.createElement('h2');
    titleElement.innerText = 'Business Proposal';
    titleElement.style.cssText = 'text-align: center; margin: 20px 0;';
    container.appendChild(titleElement);

    // Add content
    const contentElement = document.createElement('div');
    contentElement.innerHTML = content;
    container.appendChild(contentElement);

    const opt = {
      margin: 10,
      filename: 'proposal.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(container).set(opt).save();
  };

//   const generateAIProposal = async (type) => {
//     setIsGenerating(true);
//     setShowAIOptions(false);
    
//     // Simulate AI generation delay
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     const proposals = {
//       'sales': 'Dear [Client],\n\nThank you for considering our services. Based on our discussion, we are pleased to present this comprehensive proposal...',
//       'marketing': 'Marketing Strategy Proposal\n\nExecutive Summary:\nWe propose a data-driven marketing strategy focused on increasing brand awareness and engagement...',
//       'project': 'Project Implementation Proposal\n\nScope:\nThis document outlines the proposed implementation plan for [Project Name], including timeline, resources, and deliverables...'
//     };
    
//     if (quillRef.current) {
//       quillRef.current.setText(proposals[type]);
//     }
    
//     setIsGenerating(false);
//   };
    const generateAIProposal = async (type) => {
        setIsGenerating(true);
        setShowAIOptions(false);

        try {
            const response = await fetch("http://localhost:5000/api/generate-proposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type })
            });

            const data = await response.json();
            if (quillRef.current) {
                quillRef.current.setText(data.proposal);
            }
        } catch (error) {
            console.error("Error generating proposal:", error);
        } finally {
            setIsGenerating(false);
        }
    };

  return (
    <div className="app">
      

        <div className="editor-container" style={{marginLeft:"270px"}}>
            <div className="editor-wrapper">
                {/* Header */}
                <div className="editor-header">
                <h1>Create Proposal</h1>
                <div className="button-group">
                    <button
                    onClick={() => setShowAIOptions(!showAIOptions)}
                    className="btn btn-primary"
                    disabled={isGenerating}
                    >
                    {isGenerating ? <Loader2 className="icon spin" /> : <Wand2 className="icon" />}
                    AI Generate
                    <ChevronDown className="icon-small" />
                    </button>
                    <button
                    onClick={handleGeneratePDF}
                    className="btn btn-secondary"
                    >
                    <FileDown className="icon" />
                    Export PDF
                    </button>
                </div>
                </div>

                {/* AI Options Dropdown */}
                {showAIOptions && (
                <div className="ai-dropdown">
                    <div className="dropdown-content">
                    <button
                        onClick={() => generateAIProposal('sales')}
                        className="dropdown-item"
                    >
                        Sales Proposal
                    </button>
                    <button
                        onClick={() => generateAIProposal('marketing')}
                        className="dropdown-item"
                    >
                        Marketing Proposal
                    </button>
                    <button
                        onClick={() => generateAIProposal('project')}
                        className="dropdown-item"
                    >
                        Project Proposal
                    </button>
                    </div>
                </div>
                )}

                {/* Editor */}
                <div className="editor-box">
                <div className="editor-content">
                    <div ref={editorRef} className="quill-editor" />
                </div>
                </div>

                {/* Loading Overlay */}
                {isGenerating && (
                <div className="loading-overlay">
                    <div className="loading-content">
                    <Loader2 className="icon spin" />
                    <span>Generating your proposal...</span>
                    </div>
                </div>
                )}
            </div>
        </div>
     </div>
  );
}

export default Editor;