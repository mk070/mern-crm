import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

const mockInvoices = [
  {
    id: 'INV-2024-001',
    client: 'Tech Corp Ltd',
    amount: 2500,
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    status: 'paid',
    email: 'billing@techcorp.com'
  },
  {
    id: 'INV-2024-002',
    client: 'Design Studio X',
    amount: 1800,
    issueDate: '2024-02-20',
    dueDate: '2024-03-20',
    status: 'pending',
    email: 'accounts@designx.com'
  },
  {
    id: 'INV-2024-003',
    client: 'Marketing Pro',
    amount: 3500,
    issueDate: '2024-02-10',
    dueDate: '2024-03-10',
    status: 'overdue',
    email: 'finance@marketingpro.com'
  },
  // Add more mock data as needed
];

const statusColors = {
  paid: 'bg-success-50 text-success border-success-100',
  pending: 'bg-warning-50 text-warning border-warning-100',
  overdue: 'bg-error-50 text-error border-error-100'
};

const statusIcons = {
  paid: CheckCircle,
  pending: Clock,
  overdue: AlertCircle
};

export function TrackInvoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 10;

  const filteredInvoices = useMemo(() => {
    let result = [...mockInvoices];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(invoice =>
        invoice.client.toLowerCase().includes(searchLower) ||
        invoice.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(invoice => invoice.status === selectedStatus);
    }

    // Date range filter
    if (dateRange[0] && dateRange[1]) {
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.issueDate);
        return (
          invoiceDate >= dateRange[0] &&
          invoiceDate <= dateRange[1]
        );
      });
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [mockInvoices, searchTerm, selectedStatus, dateRange, sortConfig]);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction:
        current.key === key && current.direction === 'asc'
          ? 'desc'
          : 'asc'
    }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.autoTable({
      head: [['Invoice ID', 'Client', 'Amount', 'Issue Date', 'Due Date', 'Status']],
      body: filteredInvoices.map(invoice => [
        invoice.id,
        invoice.client,
        `$${invoice.amount}`,
        format(new Date(invoice.issueDate), 'MMM d, yyyy'),
        format(new Date(invoice.dueDate), 'MMM d, yyyy'),
        invoice.status
      ]),
    });
    
    doc.save('invoices.pdf');
    toast.success('PDF exported successfully!');
  };

  const exportToCSV = () => {
    const data = filteredInvoices.map(invoice => ({
      'Invoice ID': invoice.id,
      'Client': invoice.client,
      'Amount': invoice.amount,
      'Issue Date': format(new Date(invoice.issueDate), 'MMM d, yyyy'),
      'Due Date': format(new Date(invoice.dueDate), 'MMM d, yyyy'),
      'Status': invoice.status,
      'Email': invoice.email
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV exported successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Track Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all your invoices in one place
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={exportToPDF}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
              placeholderText="Filter by date range"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    Invoice ID
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('client')}
                >
                  <div className="flex items-center gap-2">
                    Client
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('issueDate')}
                >
                  <div className="flex items-center gap-2">
                    Issue Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center gap-2">
                    Due Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInvoices.map((invoice) => {
                const StatusIcon = statusIcons[invoice.status];
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.client}</p>
                        <p className="text-gray-500">{invoice.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(invoice.issueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusColors[invoice.status]
                        }`}
                      >
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-gray-400 hover:text-gray-500"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-primary"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-error"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredInvoices.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{filteredInvoices.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {/* Page numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-primary border-primary text-white'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackInvoices;