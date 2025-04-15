import { useState, useEffect } from 'react';

const mockClients = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    platform: 'Upwork',
    tags: ['High-Paying', 'Long-Term'],
    status: 'active',
    lastInteraction: '2024-03-15T10:30:00',
    notes: 'Website redesign project',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 8901',
    platform: 'Fiverr',
    tags: ['VIP'],
    status: 'pending',
    lastInteraction: '2024-03-14T15:45:00',
    notes: 'Logo design project',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 234 567 8902',
    platform: 'Referral',
    tags: ['High-Paying'],
    status: 'inactive',
    lastInteraction: '2024-03-13T09:15:00',
    notes: 'Mobile app development',
  },
];

export function useClients(filters) {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        let filteredClients = [...mockClients];

        // Apply filters
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredClients = filteredClients.filter(
            client =>
              client.name.toLowerCase().includes(searchLower) ||
              client.email.toLowerCase().includes(searchLower)
          );
        }

        if (filters.status !== 'all') {
          filteredClients = filteredClients.filter(
            client => client.status === filters.status
          );
        }

        // Apply sorting
        switch (filters.sort) {
          case 'latest':
            filteredClients.sort((a, b) =>
              new Date(b.lastInteraction) - new Date(a.lastInteraction)
            );
            break;
          case 'oldest':
            filteredClients.sort((a, b) =>
              new Date(a.lastInteraction) - new Date(b.lastInteraction)
            );
            break;
          case 'name':
            filteredClients.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filteredClients.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            break;
        }

        setClients(filteredClients);
        setError(null);
      } catch (err) {
        setError('Failed to fetch clients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [filters]);

  return { clients, isLoading, error };
}