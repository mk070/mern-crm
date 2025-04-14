import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  User,
  ListChecks,
  FileEdit,
  Send,
  Plus,
  Trash2,
  Image as ImageIcon,
  Calendar,
  Save,
  Clock,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import "react-datepicker/dist/react-datepicker.css";

const invoiceTemplates = [
  { id: 1, name: 'Professional (Default)', preview: '/templates/professional.png' },
  { id: 2, name: 'Minimal', preview: '/templates/minimal.png' },
  { id: 3, name: 'Creative', preview: '/templates/creative.png' },
];

const steps = [
  { id: 'client', title: 'Client Details', icon: User },
  { id: 'items', title: 'Invoice Items', icon: ListChecks },
  { id: 'details', title: 'Additional Details', icon: FileEdit },
  { id: 'preview', title: 'Preview & Send', icon: Send }
];

const mockClients = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', company: 'Tech Solutions Inc' },
  { id: 2, name: 'Alex Chen', email: 'alex@email.com', company: 'Design Studio Pro' },
];

export function InvoiceGenerator() {
  const [currentStep, setCurrentStep] = useState('client');
  const [selectedTemplate, setSelectedTemplate] = useState(invoiceTemplates[0]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, rate: 0 }]);
  const [logo, setLogo] = useState(null);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2024-001');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Logo uploaded successfully!');
    } else {
      toast.error('Please upload an image file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const addItem = () => {
    setItems([...items, { 
      id: items.length + 1, 
      description: '', 
      quantity: 1, 
      rate: 0 
    }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * tax) / 100;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  const handleClientSelect = (clientId) => {
    const client = mockClients.find(c => c.id === parseInt(clientId));
    setSelectedClient(client);
    // Autofill other fields based on client data
    // This would typically come from your CRM system
  };

  const handleSaveAsDraft = () => {
    toast.success('Invoice saved as draft');
  };

  const handleSchedule = () => {
    toast.success('Invoice scheduled for sending');
  };

  const handleSendNow = () => {
    toast.success('Invoice sent successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate a professional invoice in minutes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Steps Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentStep === step.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-full h-1 mx-4 bg-gray-200">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width:
                            steps.findIndex(s => s.id === currentStep) > index
                              ? '100%'
                              : '0%'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`text-sm ${
                    currentStep === step.id
                      ? 'text-primary font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            {currentStep === 'client' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Template
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {invoiceTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`relative rounded-lg border-2 p-2 ${
                          selectedTemplate.id === template.id
                            ? 'border-primary'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="aspect-video bg-gray-100 rounded-md mb-2">
                          {template.preview ? (
                            <img
                              src={template.preview}
                              alt={template.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {template.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    onChange={(e) => handleClientSelect(e.target.value)}
                  >
                    <option value="">Select a client</option>
                    {mockClients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} - {client.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary-50' : 'border-gray-300'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {logo ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={logo}
                          alt="Company logo"
                          className="w-32 h-32 object-contain mb-4"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLogo(null);
                          }}
                        >
                          Remove Logo
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag & drop your logo here, or click to select
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Supports PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'items' && (
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-error"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>

                <div className="border-t pt-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          value={tax}
                          onChange={(e) => setTax(parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-base font-medium text-gray-900">Total</span>
                      <span className="text-base font-medium text-gray-900">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'details' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes or payment instructions..."
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Terms
                  </label>
                  <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                    <option>Due on receipt</option>
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Net 60</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  {/* Invoice Preview */}
                  <div className="flex justify-between items-start mb-8">
                    {logo && (
                      <img
                        src={logo}
                        alt="Company logo"
                        className="w-32 h-32 object-contain"
                      />
                    )}
                    <div className="text-right">
                      <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                      <p className="text-gray-500">{invoiceNumber}</p>
                    </div>
                  </div>

                  {selectedClient && (
                    <div className="mb-8">
                      <h3 className="font-medium text-gray-900">Bill To:</h3>
                      <p>{selectedClient.name}</p>
                      <p>{selectedClient.company}</p>
                      <p>{selectedClient.email}</p>
                    </div>
                  )}

                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Quantity</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">{item.description}</td>
                          <td className="text-right">{item.quantity}</td>
                          <td className="text-right">${item.rate}</td>
                          <td className="text-right">
                            ${(item.quantity * item.rate).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-right py-2">Subtotal:</td>
                        <td className="text-right">${calculateSubtotal().toFixed(2)}</td>
                      </tr>
                      {tax > 0 && (
                        <tr>
                          <td colSpan="3" className="text-right py-2">Tax ({tax}%):</td>
                          <td className="text-right">
                            ${((calculateSubtotal() * tax) / 100).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {discount > 0 && (
                        <tr>
                          <td colSpan="3" className="text-right py-2">Discount ({discount}%):</td>
                          <td className="text-right">
                            -${((calculateSubtotal() * discount) / 100).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      <tr className="font-bold">
                        <td colSpan="3" className="text-right py-2">Total:</td>
                        <td className="text-right">${calculateTotal().toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>

                  {notes && (
                    <div className="mb-8">
                      <h3 className="font-medium text-gray-900 mb-2">Notes:</h3>
                      <p className="text-gray-600">{notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              disabled={currentStep === steps[0].id}
              onClick={() => {
                const currentIndex = steps.findIndex(s => s.id === currentStep);
                setCurrentStep(steps[currentIndex - 1].id);
              }}
            >
              Previous
            </Button>
            {currentStep === steps[steps.length - 1].id ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSaveAsDraft}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save as Draft
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSchedule}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Schedule
                </Button>
                <Button
                  onClick={handleSendNow}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Now
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  const currentIndex = steps.findIndex(s => s.id === currentStep);
                  setCurrentStep(steps[currentIndex + 1].id);
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
            {/* Live preview content */}
            <div className="space-y-4">
              {logo ? (
                <img
                  src={logo}
                  alt="Company logo"
                  className="w-32 h-32 object-contain mx-auto"
                />
              ) : (
                <div className="w-32 h-32 mx-auto flex items-center justify-center bg-gray-50 rounded-lg">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {invoiceNumber}
                </h3>
                <p className="text-sm text-gray-500">
                  Due: {dueDate.toLocaleDateString()}
                </p>
              </div>

              {selectedClient && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedClient.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedClient.company}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-primary">
                  ${calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}