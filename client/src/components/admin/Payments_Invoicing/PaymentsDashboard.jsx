import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Bell,
  ArrowRight,
  DollarSign
} from 'lucide-react';
// import { Button } from '../ui/Button';

const metrics = [
  {
    title: 'Total Invoices',
    value: '24',
    icon: FileText,
    color: 'bg-primary-50 text-primary',
    trend: '+12% from last month'
  },
  {
    title: 'Pending Payments',
    value: '$12,450',
    icon: Clock,
    color: 'bg-warning-50 text-warning',
    trend: '4 invoices pending'
  },
  {
    title: 'Paid Invoices',
    value: '$45,230',
    icon: CheckCircle2,
    color: 'bg-success-50 text-success',
    trend: '18 invoices this month'
  },
  {
    title: 'Overdue Invoices',
    value: '$2,150',
    icon: AlertCircle,
    color: 'bg-error-50 text-error',
    trend: '2 invoices overdue'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'sent',
    invoice: '#INV-2024-001',
    client: 'Sarah Johnson',
    amount: '$1,200',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    type: 'paid',
    invoice: '#INV-2024-002',
    client: 'Tech Corp Ltd',
    amount: '$3,450',
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    type: 'reminder',
    invoice: '#INV-2024-003',
    client: 'Design Studio X',
    amount: '$850',
    timestamp: 'Yesterday'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function PaymentsDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Invoicing</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track, manage, and create invoices for your clients
          </p>
        </div>
        <Button size="lg" className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Invoice
        </Button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {metrics.map((metric) => (
          <motion.div
            key={metric.title}
            variants={item}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${metric.color}`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-gray-500">{metric.trend}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.client} - {activity.invoice}
                    </p>
                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
                <span className="font-medium text-gray-900">{activity.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">New Invoice</span>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-600">Send Reminders</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}