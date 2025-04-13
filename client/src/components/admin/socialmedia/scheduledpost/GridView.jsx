import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  ArrowUpDown,
  Calendar,
  Type,
  Share2,
  Edit,
  Trash2,
  ImageIcon,
  AlertCircle,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle2,
  Clock,
  XCircle,
  Info
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

const PlatformIcon = ({ platform, className }) => {
    const icons = {
      instagram: Instagram,
      linkedin: Linkedin,
      twitter: Twitter,
      x: Twitter, // or use a different icon if you have one for 'x'
    };
  
    const Icon = icons[platform?.toLowerCase()] || Share2;
    return <Icon className={className} />;
  };
  

const StatusIndicator = ({ status, errorMessage }) => {
  const indicators = {
    scheduled: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    pending: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50' },
    failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  };

  const { icon: Icon, color, bg } = indicators[status] || indicators.pending;

  return (
    <div className="relative group">
      <div className={`flex items-center gap-1.5 ${color} ${bg} rounded-full px-2 py-1`}>
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium capitalize">{status}</span>
      </div>
      {status === 'failed' && errorMessage && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-xs rounded p-2">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, postTitle }) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Delete Scheduled Post
              </Dialog.Title>
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{postTitle}"? This action cannot be undone.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const GridView = ({ posts, onEditPost, onDeletePost }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('scheduledDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, post: null });

  const platforms = useMemo(() => {
    const allPlatforms = posts.flatMap(post => post.platforms || []);
    const uniquePlatforms = Array.from(new Set(allPlatforms));
    return ['all', ...uniquePlatforms];
  }, [posts]);
  

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    console.log('Filtered Posts:', result);
    // Platform filter
    if (selectedPlatform !== 'all') {
        if (selectedPlatform !== 'all') {
            result = result.filter(post =>
              post.platforms?.some(p => p.toLowerCase() === selectedPlatform.toLowerCase())
            );
          }
              }

    // Date range filter
    if (dateRange[0] && dateRange[1]) {
      result = result.filter(post => { 
        const postDate = new Date(post.scheduledDate);
        return isWithinInterval(postDate, { start: dateRange[0], end: dateRange[1] });
      });
    }

    // Search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    result.sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';

      if (sortBy === 'scheduledDate') {
        return sortOrder === 'asc'
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      return sortOrder === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return result;
  }, [posts, searchTerm, sortBy, sortOrder, selectedPlatform, dateRange]);

  const handleQuickDateFilter = (filter) => {
    const today = new Date();
    switch (filter) {
      case 'today':
        setDateRange([today, today]);
        break;
      case 'thisWeek':
        setDateRange([startOfWeek(today), endOfWeek(today)]);
        break;
      case 'custom':
        // Keep current date range for custom selection
        break;
      default:
        setDateRange([null, null]);
    }
  };

  const handleDeleteClick = (post) => {
    setDeleteModal({ isOpen: true, post });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.post) {
      onDeletePost(deleteModal.post.id);
      setDeleteModal({ isOpen: false, post: null });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <DatePicker
                selectsRange
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(update) => setDateRange(update)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholderText="Filter by date range"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickDateFilter('today')}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Today
                </button>
                <button
                  onClick={() => handleQuickDateFilter('thisWeek')}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  This Week
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'All Platforms' : platform}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Date</span>
              <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      <AnimatePresence>
        {filteredPosts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="relative aspect-video">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-t-xl flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusIndicator 
                      status={post.status} 
                      errorMessage={post.errorMessage}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(post.scheduledDate), 'MMM d, yyyy • hh:mm a')}
                    </div>
                    <div className="flex items-center gap-1">
                    {post.platforms.map((platform) => (
                        <span key={platform} title={platform}>
                        <PlatformIcon
                            platform={platform}
                            className="h-5 w-5 text-gray-600 hover:text-blue-600"
                        />
                        </span>
                    ))}
                    </div>

                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {post.title}
                  </h3>

                  {post.content && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {post.content}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditPost(post)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, post: null })}
        onConfirm={handleDeleteConfirm}
        postTitle={deleteModal.post?.title}
      />
    </div>
  );
};

export default GridView;