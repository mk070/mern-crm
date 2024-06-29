import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaDownload } from 'react-icons/fa';

import Navbar from '../Navbar'; 
import BackgroundImage from '../../home/1.jpg'


const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;

const Container = styled.div`
    text-align: center;
    padding: 20px;
`;

const ContentAboveButton = styled.div`
    margin-bottom: 20px;
    font-weight: bold; /* Change font weight */
    font-family: Arial, sans-serif; /* Change font type */
    font-size: 38px;
    color: #333;
   
    
    border-radius: 5px;
   
`;

const DownloadButton = styled.a`
    display: inline-block;
    background-color:  #3396e1;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
        background-color: blue;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const PDFViewer = () => {
    const [pdfUrl, setPdfUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState('');

    const handleInputChange = (e) => {
        setUserId(e.target.value);
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserId(user._id); // Assuming user ID is stored as '_id' in user object
        }
    }, []);

    useEffect(() => {
        const fetchPDFUrl = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:5000/api/assign/pdf/${userId}`, {
                        responseType: 'blob'
                    });
                    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    setPdfUrl(pdfUrl);
                    setErrorMessage('');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setErrorMessage('PDF not found for this user.');
                } else {
                    setErrorMessage('Error retrieving PDF.');
                }
                setPdfUrl('');
            }
        };

        fetchPDFUrl();
    }, [userId]);

    return (
        <>
        <AnimatedBackground>
        <Navbar />
        
    
        <Container>
            <ContentAboveButton>
            Here you can download Your lead details in PDF format.   
            </ContentAboveButton>
            {errorMessage && <div>{errorMessage}</div>}
            {pdfUrl && (
                <DownloadButton href={pdfUrl} download="Lead.pdf">
                    <FaDownload style={{ marginRight: '5px' }} />
                    Download PDF
                </DownloadButton>
            )}
        </Container>
      
        </AnimatedBackground>
       
        </>
    );
};

export default PDFViewer;
