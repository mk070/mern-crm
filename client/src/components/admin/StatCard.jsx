import React from 'react';

export default function StatCard({ icon: Icon, title, value, trend, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${trend === 'up' ? 'bg-green-50' : 'bg-primary-light'}`}>
          <Icon className={`h-6 w-6 ${trend === 'up' ? 'text-green-500' : 'text-primary'}`} />
        </div>
      </div>
    </div>
  );
}