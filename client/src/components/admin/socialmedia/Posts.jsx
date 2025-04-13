import React, { useState } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import {
  Search,
  Filter,
  Instagram,
  Twitter,
  Linkedin,
  CheckCircle,
  XCircle,
  ArrowDownward,
  ArrowUpward,
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { X as XIcon } from 'lucide-react';
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@mui/icons-material';

const mockPostedPosts = [
  {
    id: 1,
    content: "🌟 Experience innovation at its finest! Join us on this exciting journey as we transform ideas into reality. #Innovation #Technology #Future",
    media: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
    postedAt: "2024-03-20T15:30:00",
    platforms: [
      { platform: 'instagram', status: 'posted' },
      { platform: 'twitter', status: 'posted' },
      { platform: 'linkedin', status: 'failed', error: 'Token expired' },
    ],
    postedBy: 'Admin',
  },
  {
    id: 2,
    content: "Transform your business with our cutting-edge solutions. Book a demo today! 🚀 #BusinessGrowth #Innovation",
    postedAt: "2024-03-21T10:00:00",
    platforms: [
      { platform: 'twitter', status: 'posted' },
      { platform: 'linkedin', status: 'posted' },
    ],
    postedBy: 'Admin',
  },
];

const platformIcons = {
  instagram: { icon: Instagram, color: 'text-pink-500' },
  twitter: { icon: Twitter, color: 'text-blue-400' },
  linkedin: { icon: Linkedin, color: 'text-blue-700' },
};

const statusStyles = {
  posted: { icon: CheckCircle, color: 'text-green-500' },
  failed: { icon: XCircle, color: 'text-red-500' },
};

export default function Posts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = mockPostedPosts
    .filter(post =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedPlatform === 'all' || post.platforms.some(p => p.platform === selectedPlatform)) &&
      (!startDate || (post.postedAt && isValid(parseISO(post.postedAt)) && parseISO(post.postedAt) >= parseISO(startDate))) &&
      (!endDate || (post.postedAt && isValid(parseISO(post.postedAt)) && parseISO(post.postedAt) <= parseISO(endDate)))
    )
    .sort((a, b) => {
      const dateA = a.postedAt ? parseISO(a.postedAt) : new Date(0);
      const dateB = b.postedAt ? parseISO(b.postedAt) : new Date(0);
      if (sortOrder === 'newest') return dateB - dateA;
      return dateA - dateB;
    });

  const handleViewDetails = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Posted Posts</h1>
        </div>

        {/* Filters and Sort Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortOrder('newest')}
              className={`p-2 rounded-lg transition-colors ${sortOrder === 'newest' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:text-gray-800'}`}
            >
              <ArrowDownwardOutlined className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`p-2 rounded-lg transition-colors ${sortOrder === 'oldest' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:text-gray-800'}`}
            >
              <ArrowUpwardOutlined className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-transform transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {post.platforms.map((platform, idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        {/* <platformIcons[platform.platform].icon className={`h-5 w-5 ${platformIcons[platform.platform].color}`} /> */}
                        <span className={`text-xs ${statusStyles[platform.status].color}`}>
                          {platform.status.charAt(0).toUpperCase() + platform.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {post.postedAt ? format(parseISO(post.postedAt), 'PPP') : 'N/A'}
                  </span>
                </div>
                {post.media && (
                  <img
                    src={post.media}
                    alt="Post media"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-800 font-inter mb-2 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-1">Posted by:</span>
                    <span className="font-semibold">{post.postedBy}</span>
                  </div>
                  <button
                    onClick={() => handleViewDetails(post)}
                    className="text-indigo-600 hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <img
              src="https://via.placeholder.com/150"
              alt="No posts illustration"
              className="w-32 h-32 mb-4"
            />
            <p className="text-gray-600">
              You haven’t posted anything yet. Start by creating your first post.
            </p>
          </div>
        )}

        {/* View Details Modal */}
        <Transition.Root show={selectedPost !== null} as={React.Fragment}>
          <Dialog as="div"  className="relative z-10 ml-32" onClose={closeModal}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className=" bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="absolute inset-0 transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Post Details
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{selectedPost?.content}</p>
                      {selectedPost?.media && (
                        <img
                          src={selectedPost.media}
                          alt="Post media"
                          className="w-full h-64 object-cover rounded-lg mt-4"
                        />
                      )}
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Posted at: {selectedPost?.postedAt ? format(parseISO(selectedPost.postedAt), 'PPP') : 'N/A'}</p>
                        <p className="text-sm text-gray-500">Posted by: {selectedPost?.postedBy}</p>
                        <p className="text-sm text-gray-500">
                          Platforms:
                          {selectedPost?.platforms.map((platform, idx) => (
                            <span key={idx} className={`ml-2 ${statusStyles[platform.status].color}`}>
                              {platform.platform} ({platform.status})
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
}
