import React, { useCallback, useRef } from 'react';
import { Search, Filter } from 'lucide-react';
import { debounce } from 'lodash';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
];

export default function ClientFilters({ filters, onChange }) {
  const debouncedSearch = useRef(
    debounce((value) => {
      onChange((prev) => ({ ...prev, search: value }));
    }, 300)
  ).current;

  const handleSearchChange = useCallback(
    (e) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const handleStatusChange = useCallback(
    (e) => {
      onChange((prev) => ({ ...prev, status: e.target.value }));
    },
    [onChange]
  );

  const handleSortChange = useCallback(
    (e) => {
      onChange((prev) => ({ ...prev, sort: e.target.value }));
    },
    [onChange]
  );

  return (
    <div className="bg-neutral-surface rounded-xl shadow-sm border border-neutral-border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-text-secondary" />
          <input
            type="text"
            placeholder="Search clients..."
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-neutral-border bg-neutral-bg focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <select
          value={filters.status}
          onChange={handleStatusChange}
          className="px-4 py-2 rounded-lg border border-neutral-border bg-neutral-bg focus:border-primary focus:ring-1 focus:ring-primary"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={handleSortChange}
          className="px-4 py-2 rounded-lg border border-neutral-border bg-neutral-bg focus:border-primary focus:ring-1 focus:ring-primary"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}