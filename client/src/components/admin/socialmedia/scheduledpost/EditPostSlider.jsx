import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaTimes, FaUpload } from 'react-icons/fa';

const EditPostSlider = ({ isOpen, post, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    scheduledDate: '',
    scheduledTime: '',
    image: '',
  });
  
  // Initialize form when post changes
  useEffect(() => {
    if (post) {
      const postDate = new Date(post.scheduledDate);
      setFormData({
        title: post.title || '',
        content: post.content || '',
        scheduledDate: format(postDate, 'yyyy-MM-dd'),
        scheduledTime: format(postDate, 'HH:mm'),
        image: post.image || '',
      });
    }
  }, [post]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine date and time into a new Date object
    const [year, month, day] = formData.scheduledDate.split('-');
    const [hours, minutes] = formData.scheduledTime.split(':');
    const scheduledDate = new Date(year, month - 1, day, hours, minutes);
    
    // Call the parent update handler
    onUpdate({
      ...post,
      title: formData.title,
      content: formData.content,
      scheduledDate,
      image: formData.image,
    });
  };
  
  // If no post is selected, don't render
  if (!post) return null;
  
  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Scheduled Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Post Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Image
              </label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Post thumbnail"
                      className="h-32 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      onClick={() => setFormData({...formData, image: ''})}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                  >
                    <FaUpload className="inline mr-2" />
                    Upload Image
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostSlider;
