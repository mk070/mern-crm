import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function handleCallback() {
      try {
        // Parse the URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const urlError = searchParams.get('error');
        
        // Strip out the #_ if present in the code
        const cleanCode = code ? code.replace(/#_$/, '') : null;
        
        if (urlError) {
          setStatus(`Authentication failed: ${urlError}`);
          setError(urlError);
          return;
        }
        
        if (!cleanCode) {
          setStatus('No authentication code provided');
          setError('Missing code parameter');
          return;
        }
        
        setStatus('Connecting to Instagram...');
        
        // Server URL from environment with fallback
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        // Send code to backend
        const response = await axios.post(
          `${apiUrl}/api/oauth/instagram`,
          { code: cleanCode }, 
          {
            headers: {
              'Content-Type': 'application/json',
            },
            // Add timeout to prevent indefinite waiting
            timeout: 10000,
          }
        );
        
        if (response.data && response.status === 200) {
          setStatus('Authentication successful!');
          
          // Store tokens or user data in localStorage/sessionStorage if needed
          if (response.data.accessToken) {
            localStorage.setItem('instagram_access_token', response.data.accessToken);
          }
          
          // Success handling
          if (window.opener) {
            // If opened as popup
            window.opener.postMessage({ 
              type: 'INSTAGRAM_AUTH_SUCCESS', 
              data: response.data 
            }, window.origin);
            setTimeout(() => window.close(), 1500); // Close popup after a brief delay
          } else {
            // If direct navigation
            setTimeout(() => navigate('/dashboard'), 1500);
          }
        } else {
          throw new Error('Invalid server response');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        
        // Better error handling with more specific messages
        let errorMessage = 'Unknown error occurred';
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = `Server error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`;
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage = 'No response from server. Please check your internet connection.';
        } else {
          // Something happened in setting up the request
          errorMessage = err.message;
        }
        
        setStatus(`Authentication failed: ${errorMessage}`);
        setError(errorMessage);
      }
    }
    
    handleCallback();
  }, [location, navigate]);
  
  return (
    <div className="oauth-callback-container">
      <div className="oauth-callback-box">
        <h2>Instagram Authorization</h2>
        <div className={`status-message ${error ? 'error' : ''}`}>
          {status}
        </div>
        {!error && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Please wait while we complete the authentication process...</p>
          </div>
        )}
        {error && (
          <button 
            className="retry-button"
            onClick={() => window.location.href = '/connect-instagram'}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}