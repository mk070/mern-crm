// pages/oauth-callback.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function OAuthCallback() {
  const router = useRouter();
  
  useEffect(() => {
    async function handleCallback() {
      const { code, error } = router.query;
      
      if (code) {
        try {
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
          
          if (response.ok) {
            // Success handling
            if (window.opener) {
              window.close(); // Close popup
            } else {
              router.push('/dashboard'); // Redirect if not in popup
            }
          } else {
            throw new Error('Failed to authenticate');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          // Display error
        }
      }
    }
    
    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);
  
  return <div>Processing Instagram authentication...</div>;
}