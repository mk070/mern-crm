import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Send,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const mockInvoices = [
  {
    id: 'INV-001',
    amount: 5000,
    status: 'paid',
    dueDate: '2024-03-20',
    paidDate: '2024-03-18'
  },
  {
    id: 'INV-002',
    amount: 3500,
    status: 'unpaid',
    dueDate: '2024-04-01'
  },
  {
    id: 'INV-003',
    amount: 2500,
    status: 'overdue',
    dueDate: '2024-03-15'
  }
];

const statusColors = {
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700'
};

export default function LinkedInvoices({ projectId }) {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSendReminder = (invoiceId) => {
    showNotification('Payment reminder sent successfully');
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Amount Paid</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                ${(totalAmount - paidAmount).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/invoices/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create New Invoice
        </Link>
        <Link
          to="/invoices"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          View All Invoices
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {invoice.id}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">
                      Due {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                    </span>
                    <span className={clsx(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium",
                      statusColors[invoice.status]
                    )}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </p>
                  {invoice.paidDate && (
                    <p className="text-sm text-gray-500">
                      Paid {format(new Date(invoice.paidDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                  {invoice.status !== 'paid' && (
                    <button
                      onClick={() => handleSendReminder(invoice.id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span className="text-sm font-medium">Send Reminder</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={clsx(
            "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2",
            notification.type === 'error' ? "bg-red-500 text-white" : "bg-green-500 text-white"
          )}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
          {notification.message}
        </div>
      )}
    </div>
  );
}