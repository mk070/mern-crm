import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  Clock,
  AlertCircle,
  Send,
  Settings,
  ChevronRight,
  Mail,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@mui/material';

const reminderTemplates = [
  {
    id: 1,
    name: 'Friendly Reminder',
    subject: 'Friendly Payment Reminder for Invoice #{invoice_number}',
    content: 'Hi {client_name},\n\nI hope this email finds you well. This is a friendly reminder that invoice #{invoice_number} for ${amount} is due on {due_date}.\n\nBest regards,\n{your_name}'
  },
  {
    id: 2,
    name: 'Past Due Notice',
    subject: 'Past Due Notice - Invoice #{invoice_number}',
    content: 'Dear {client_name},\n\nThis is to remind you that invoice #{invoice_number} for ${amount} was due on {due_date} and is currently outstanding.\n\nKind regards,\n{your_name}'
  }
];

const overdueInvoices = [
  {
    id: 'INV-2024-001',
    client: 'Tech Corp Ltd',
    amount: 2500,
    dueDate: '2024-03-01',
    status: 'overdue',
    daysPastDue: 5
  },
  {
    id: 'INV-2024-002',
    client: 'Design Studio X',
    amount: 1800,
    dueDate: '2024-03-03',
    status: 'overdue',
    daysPastDue: 3
  }
];

const upcomingInvoices = [
  {
    id: 'INV-2024-003',
    client: 'Sarah Johnson',
    amount: 3200,
    dueDate: '2024-03-15',
    status: 'upcoming',
    daysUntilDue: 7
  },
  {
    id: 'INV-2024-004',
    client: 'Creative Agency Inc',
    amount: 4500,
    dueDate: '2024-03-18',
    status: 'upcoming',
    daysUntilDue: 10
  }
];

const reminderHistory = [
  {
    id: 1,
    invoiceId: 'INV-2024-001',
    client: 'Tech Corp Ltd',
    sentDate: '2024-03-05T10:30:00',
    status: 'sent',
    type: 'First Reminder'
  },
  {
    id: 2,
    invoiceId: 'INV-2024-002',
    client: 'Design Studio X',
    sentDate: '2024-03-04T15:45:00',
    status: 'opened',
    type: 'Past Due Notice'
  }
];

export function PaymentReminders() {
  const [selectedTemplate, setSelectedTemplate] = useState(reminderTemplates[0]);
  const [autoReminders, setAutoReminders] = useState({
    enabled: true,
    firstReminder: 3, // days before due
    followUp: 7, // days after due
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Reminders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and automate your payment reminder notifications
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Configure Templates
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Invoices */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Overdue Invoices</h2>
              <span className="text-sm text-error">
                {overdueInvoices.length} invoices overdue
              </span>
            </div>
            <div className="space-y-4">
              {overdueInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-error-50 border border-error-100"
                >
                  <div className="flex items-center gap-4">
                    <AlertCircle className="h-5 w-5 text-error" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {invoice.client} - {invoice.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${invoice.amount} • {invoice.daysPastDue} days past due
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Reminder
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Due Dates */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Due Dates</h2>
              <span className="text-sm text-warning">
                {upcomingInvoices.length} invoices due soon
              </span>
            </div>
            <div className="space-y-4">
              {upcomingInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-warning-50 border border-warning-100"
                >
                  <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {invoice.client} - {invoice.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${invoice.amount} • Due in {invoice.daysUntilDue} days
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule Reminder
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder History */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Reminders</h2>
            <div className="space-y-4">
              {reminderHistory.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {reminder.client} - {reminder.invoiceId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(reminder.sentDate), 'MMM d, yyyy • h:mm a')} •{' '}
                        {reminder.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminder.status === 'sent' ? (
                      <span className="flex items-center gap-1 text-sm text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        Sent
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-primary">
                        <Mail className="h-4 w-4" />
                        Opened
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Auto-Reminder Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Automated Reminders
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Enable Auto-Reminders</span>
                <button
                  onClick={() => setAutoReminders(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoReminders.enabled ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoReminders.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Reminder
                </label>
                <select
                  value={autoReminders.firstReminder}
                  onChange={(e) =>
                    setAutoReminders(prev => ({
                      ...prev,
                      firstReminder: parseInt(e.target.value)
                    }))
                  }
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value={1}>1 day before due</option>
                  <option value={3}>3 days before due</option>
                  <option value={7}>1 week before due</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Reminder
                </label>
                <select
                  value={autoReminders.followUp}
                  onChange={(e) =>
                    setAutoReminders(prev => ({
                      ...prev,
                      followUp: parseInt(e.target.value)
                    }))
                  }
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value={1}>1 day after due</option>
                  <option value={3}>3 days after due</option>
                  <option value={7}>1 week after due</option>
                </select>
              </div>
            </div>
          </div>

          {/* Email Templates */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Email Templates
            </h2>
            <div className="space-y-4">
              {reminderTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    selectedTemplate.id === template.id
                      ? 'bg-primary-50 border border-primary-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail
                      className={`h-5 w-5 ${
                        selectedTemplate.id === template.id
                          ? 'text-primary'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        selectedTemplate.id === template.id
                          ? 'text-primary'
                          : 'text-gray-700'
                      }`}
                    >
                      {template.name}
                    </span>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 ${
                      selectedTemplate.id === template.id
                        ? 'text-primary'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}