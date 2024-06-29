import { useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Box, Button } from '@mui/material';
import styled from '@emotion/styled';
import html2pdf from 'html2pdf.js';
import logo from './logo.png'; // Import your logo image
import Side from '../../side/side';
const Component = styled.div`
    background: #F5F5F5;
`;

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': ['Arial', 'Georgia', 'Times New Roman'] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
];

const Editor = () => {
    const [quill, setQuill] = useState(null);
    const [isSidebar, setIsSidebar] = useState(true);

    useEffect(() => {
        if (!quill) {
            const quillInstance = new Quill('#container', { theme: 'snow', modules: { toolbar: toolbarOptions }});
            quillInstance.disable();
            quillInstance.setText('');
            setQuill(quillInstance);
        } else {
            quill.enable();
        }
    }, [quill]);

    const handleGeneratePDF = () => {
        if (!quill) return;
    
        const content = quill.root.innerHTML;
    
        const element = document.createElement('div');
        element.innerHTML = content;
    
        // Create a container for the content, logo, and title
        const container = document.createElement('div');
        container.style.position = 'relative'; // Set container position to relative
    
        // Create an image element for the logo
        const logoImage = document.createElement('img');
        logoImage.src = logo; // Set the source of the image to your logo
        logoImage.style.position = 'absolute'; // Set logo position to absolute
        logoImage.style.top = '10px'; // Adjust top position as needed
        logoImage.style.right = '10px'; // Adjust right position as needed
        logoImage.style.width = '50px'; // Adjust the width of the logo as needed
        container.appendChild(logoImage);
    
        // Create a title element
        const titleElement = document.createElement('div');
        titleElement.innerText = 'ARISTOSTECH PVT LTD'; // Set your title text
        titleElement.style.fontWeight = 'bold'; // Make the title text bold
        titleElement.style.textAlign = 'center';
        titleElement.style.fontSize = '24px'; // Adjust the font size as needed
        titleElement.style.marginBottom = '20px'; // Add margin bottom to create space between title and content
        container.appendChild(titleElement);
    
        container.appendChild(element);
    
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
    <>
      <div className="app">
       <Side isSidebar={isSidebar}/>
      <main className="content">
        <Component>
            <Box className='container' id='container'></Box>
            <Button onClick={handleGeneratePDF}>Generate PDF</Button>
        </Component>
        </main>
     </div>
  </>
    );
};

export default Editor;
