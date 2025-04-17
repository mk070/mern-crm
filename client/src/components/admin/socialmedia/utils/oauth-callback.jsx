// src/pages/OAuthCallback.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Processing authentication...');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function handleCallback() {
      // Parse the URL query parameters
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      if (error) {
        setStatus(`Authentication failed: ${error}`);
        return;
      }
      
      if (code) {
        try {
          setStatus('Connecting to Instagram...');
          
          // Send code to backend
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/oauth/instagram`,
            { code }, // This is the POST body
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (response.status === 200) {
            setStatus('Authentication successful!');
            
            // Success handling
            if (window.opener) {
              // If opened as popup
              window.opener.postMessage({ type: 'INSTAGRAM_AUTH_SUCCESS', data: response.data }, window.origin);
              setTimeout(() => window.close(), 1000); // Close popup after a brief delay
            } else {
              // If direct navigation
              setTimeout(() => navigate('/dashboard'), 1000);
            }
          } else {
            throw new Error('Server returned an error');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          setStatus(`Authentication failed: ${error.message || 'Unknown error'}`);
        }
      } else {
        setStatus('No authentication code provided');
      }
    }
    
    handleCallback();
  }, [location, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-bg">
      <div className="p-8 bg-neutral-surface rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-semibold text-neutral-text-primary mb-2">
          {status}
        </h1>
        <p className="text-neutral-text-secondary">
          Please wait while we complete the authentication process...
        </p>
      </div>
    </div>
  );
}