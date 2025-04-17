import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Authenticating...');
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Make sure your .env file has this set correctly
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  useEffect(() => {
    async function handleCallback() {
      try {
        // Parse the URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const urlError = searchParams.get('error');
        
        // Strip out the #_ if present in the code (as mentioned in Instagram docs)
        const cleanCode = code ? code.replace(/#_$/, '') : null;
        
        if (urlError) {
          throw new Error(`Instagram returned an error: ${urlError}`);
        }
        
        if (!cleanCode) {
          throw new Error('No authentication code provided');
        }
        
        setStatus('Connecting to Instagram...');
        
        console.log(`Sending request to: ${API_URL}/api/oauth/instagram`);
        
        // Send code to backend
        const response = await axios.post(
          `${API_URL}/api/oauth/instagram`,
          { code: cleanCode }, 
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          }
        );
        
        if (response.data && response.status === 200) {
          setStatus('Authentication successful!');
          setIsLoading(false);
          
          // Store auth data
          if (response.data.accessToken) {
            localStorage.setItem('instagram_auth', JSON.stringify({
              accessToken: response.data.accessToken,
              userId: response.data.userId,
              username: response.data.username
            }));
          }
          
          // Redirect after a brief delay
          setTimeout(() => {
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'INSTAGRAM_AUTH_SUCCESS', 
                data: response.data 
              }, window.origin);
              window.close();
            } else {
              navigate('/dashboard');
            }
          }, 1500);
        } else {
          throw new Error('Invalid server response');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setIsLoading(false);
        setErrorOccurred(true);
        
        // More detailed error handling
        let errorMessage = 'Unknown error occurred';
        
        if (err.response) {
          // Server responded with error
          const statusCode = err.response.status;
          
          if (statusCode === 404) {
            errorMessage = 'API endpoint not found. Check server configuration.';
            console.error('API URL being used:', `${API_URL}/api/oauth/instagram`);
          } else {
            const errorData = err.response.data;
            errorMessage = `Server error: ${statusCode} - ${errorData?.message || 'Unknown server error'}`;
          }
        } else if (err.request) {
          // No response received
          errorMessage = 'Server did not respond. Check your connection or server status.';
        } else {
          // Request setup error
          errorMessage = err.message;
        }
        
        setStatus(`Authentication failed: ${errorMessage}`);
      }
    }
    
    handleCallback();
  }, [location, navigate, API_URL]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
        {/* Header with Instagram-inspired gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Instagram Authentication</h2>
        </div>
        
        <div className="p-8 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              {/* Loading spinner with Instagram colors */}
              <div className="mb-6">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-gray-800 mb-2">{status}</p>
              <p className="text-gray-500">This will only take a moment...</p>
            </div>
          ) : errorOccurred ? (
            <div className="flex flex-col items-center">
              <div className="mb-6 text-red-500 text-5xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-red-600 mb-6">{status}</p>
              <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                <button 
                  onClick={() => window.location.href = '/connect-instagram'} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back to Dashboard
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                If this problem persists, please contact support.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-6 text-green-500 text-5xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-green-600 mb-2">{status}</p>
              <p className="text-gray-500">Redirecting you to the dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}