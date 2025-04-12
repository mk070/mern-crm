import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, Target, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, LineChart, Line } from 'recharts';
import Sidebar from './Sidebar';
import StatCard from './StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState({
    userCount: 0,
    clientCount: 0,
    taskCount: 0,
    leadCount: 0,
    queryCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, clients, tasks, leads, queries] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/count`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/taskcount`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/taskcount/leadcount`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/clientcount`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/taskcount/querycount`)
        ]);

        setStats({
          userCount: users.data.userCount,
          clientCount: clients.data.clientCount,
          taskCount: tasks.data.taskCount,
          leadCount: leads.data.leadCount,
          queryCount: queries.data.queryCount
        });
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: 'Employees', value: stats.userCount },
    { name: 'Clients', value: stats.clientCount },
    { name: 'Tasks', value: stats.taskCount },
    { name: 'Leads', value: stats.leadCount }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-bg">
        <div className="text-status-error bg-status-error/10 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
  
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-jakarta font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's what's happening with your business today.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Total Employees"
              value={stats.userCount}
              trend="up"
            />
            <StatCard
              icon={Briefcase}
              title="Active Clients"
              value={stats.clientCount}
              trend="up"
            />
            <StatCard
              icon={Target}
              title="Open Tasks"
              value={stats.taskCount}
              trend="down"
            />
            <StatCard
              icon={MessageSquare}
              title="New Leads"
              value={stats.leadCount}
              trend="up"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#14B8A6"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
   
  );
}