// stores/useProposalStore.js
import create from 'zustand';

const useProposalStore = create((set) => ({
  proposals: [],
  currentProposal: null,
  versions: [],
  
  createProposal: (template) => set(state => ({
    proposals: [...state.proposals, template],
    currentProposal: template
  })),
  
  updateContent: (content) => set(state => ({
    currentProposal: {
      ...state.currentProposal,
      content,
      updatedAt: new Date().toISOString()
    }
  })),
  
  saveVersion: () => set(state => ({
    versions: [...state.versions, state.currentProposal]
  }))
}));

export default useProposalStore;