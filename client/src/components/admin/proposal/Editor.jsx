import { useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Box, Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import html2pdf from 'html2pdf.js';
import logo from './logo.png';
import Side from '../side/side';
import Header from '../side/header';

const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #F5F5F5;
    padding: 20px;
    height:"100%"
`;

const EditorHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
`;

const EditorTitle = styled(Typography)`
    font-weight: bold;
    font-size: 24px;
`;

const EditorContent = styled.div`
    width: 100%;
    max-width: 100%x;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
`;

const EditorButton = styled(Button)`
    margin-top: 20px;
`;

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': ['Arial', 'Georgia', 'Times New Roman'] }],
    [{ 'align': [] }],
    ['clean']
];

const Editor = () => {
    const [quill, setQuill] = useState(null);

    useEffect(() => {
        if (!quill) {
            const quillInstance = new Quill('#editor', { theme: 'snow', modules: { toolbar: toolbarOptions }});
            setQuill(quillInstance);
        }
    }, [quill]);

    const handleGeneratePDF = () => {
        if (!quill) return;

        const content = quill.root.innerHTML;

        const container = document.createElement('div');
        container.style.position = 'relative';

        const logoImage = document.createElement('img');
        logoImage.src = logo;
        logoImage.style.position = 'absolute';
        logoImage.style.top = '10px';
        logoImage.style.right = '10px';
        logoImage.style.width = '50px';
        container.appendChild(logoImage);

        const titleElement = document.createElement('div');
        titleElement.innerText = 'Varloom PVT LTD';
        titleElement.style.fontWeight = 'bold';
        titleElement.style.textAlign = 'center';
        titleElement.style.fontSize = '24px';
        titleElement.style.marginBottom = '20px';
        container.appendChild(titleElement);

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

    return (
        <div className="app">
            <Side />
            <main className="content">
                <EditorContainer>
                    <EditorHeader>
                    <Header title="Create your Proposal" subtitle="" />
                    
                        <Button variant="contained" color="primary" onClick={handleGeneratePDF}>Generate PDF</Button>
                    </EditorHeader>
                    <EditorContent>
                        <Box id="editor" sx={{ minHeight: '400px' }} />
                    </EditorContent>
                </EditorContainer>
            </main>
        </div>
    );
};

export default Editor;
    