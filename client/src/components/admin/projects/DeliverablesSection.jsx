import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  File,
  Image,
  Video,
  Download,
  CheckCircle2,
  AlertCircle,
  Trash2,
  FolderPlus,
  Bell,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const mockDeliverables = [
  {
    id: 1,
    name: 'Homepage Design.fig',
    type: 'image',
    size: '2.4 MB',
    uploadedAt: '2024-03-15T10:30:00',
    delivered: true,
    folder: 'Design Assets'
  },
  {
    id: 2,
    name: 'User Flow Documentation.pdf',
    type: 'file',
    size: '1.1 MB',
    uploadedAt: '2024-03-14T15:45:00',
    delivered: false,
    folder: 'Documentation'
  },
  {
    id: 3,
    name: 'Product Demo.mp4',
    type: 'video',
    size: '24.8 MB',
    uploadedAt: '2024-03-13T09:15:00',
    delivered: false,
    folder: 'Videos'
  }
];

const fileIcons = {
  image: Image,
  video: Video,
  file: File
};

export default function DeliverablesSection({ projectId }) {
  const [deliverables, setDeliverables] = useState(mockDeliverables);
  const [notification, setNotification] = useState(null);
  const [notifyClient, setNotifyClient] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('all');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newDeliverables = acceptedFiles.map(file => ({
      id: Date.now(),
      name: file.name,
      type: file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : 'file',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString(),
      delivered: false,
      folder: selectedFolder === 'all' ? 'Uncategorized' : selectedFolder
    }));

    setDeliverables(prev => [...newDeliverables, ...prev]);
    
    if (notifyClient) {
      showNotification('Files uploaded and client notified');
    } else {
      showNotification('Files uploaded successfully');
    }
  }, [selectedFolder, notifyClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov'],
      'application/pdf': ['.pdf']
    }
  });

  const toggleDelivered = (id) => {
    setDeliverables(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, delivered: !d.delivered }
          : d
      )
    );
  };

  const handleDelete = (id) => {
    setDeliverables(prev => prev.filter(d => d.id !== id));
    showNotification('File deleted successfully');
  };

  const folders = ['all', ...new Set(deliverables.map(d => d.folder))];
  const filteredDeliverables = selectedFolder === 'all'
    ? deliverables
    : deliverables.filter(d => d.folder === selectedFolder);

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          Drag & drop files here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: Images, Videos, PDFs
        </p>
      </div>

      {/* Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          >
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder.charAt(0).toUpperCase() + folder.slice(1)}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FolderPlus className="h-5 w-5" />
            New Folder
          </button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notifyClient}
            onChange={(e) => setNotifyClient(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-600">Notify client on upload</span>
        </label>
      </div>

      {/* Deliverables List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredDeliverables.map((deliverable) => {
            const FileIcon = fileIcons[deliverable.type];
            
            return (
              <div
                key={deliverable.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "p-2 rounded-lg",
                    deliverable.type === 'image' ? "bg-blue-50 text-blue-500" :
                    deliverable.type === 'video' ? "bg-purple-50 text-purple-500" :
                    "bg-gray-50 text-gray-500"
                  )}>
                    <FileIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {deliverable.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>{deliverable.size}</span>
                      <span>•</span>
                      <span>{format(new Date(deliverable.uploadedAt), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{deliverable.folder}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDelivered(deliverable.id)}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      deliverable.delivered
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {deliverable.delivered ? 'Delivered' : 'Mark as Delivered'}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(deliverable.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
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