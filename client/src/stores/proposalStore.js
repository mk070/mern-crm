// stores/proposalStore.js
import { create } from 'zustand';

export const useProposalStore = create((set) => ({
  proposals: [
    // Sample dummy data
    {
      id: 1,
      title: 'Website Redesign',
      client: 'ABC Corp',
      status: 'Pending',
      date: '2025-04-01'
    },
    {
      id: 2,
      title: 'Mobile App Development',
      client: 'XYZ Inc',
      status: 'Approved',
      date: '2025-03-28'
    },
  ],

  // Actions
  addProposal: (proposal) =>
    set((state) => ({
      proposals: [...state.proposals, proposal],
    })),

  updateProposal: (id, updatedProposal) =>
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === id ? { ...p, ...updatedProposal } : p
      ),
    })),

  removeProposal: (id) =>
    set((state) => ({
      proposals: state.proposals.filter((p) => p.id !== id),
    })),

  setProposals: (newProposals) => set({ proposals: newProposals }),
}));
