// hooks/useProposalAI.js
import { useState } from 'react';

export const useProposalAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateProposal = async (prompt) => {
    setIsLoading(true);
    try {
      // In real implementation, replace with actual API call
      const response = await mockAICall(prompt);
      return response;
    } catch (err) {
      setError('Failed to generate proposal');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateProposal, isLoading, error };
};

const mockAICall = async (prompt) => ({
  projectTitle: 'Generated Web Development Proposal',
  content: `<h2>Project Overview</h2><p>${prompt}</p>`,
  timeline: '4-6 weeks',
  price: '$2,500 - $3,500'
});
