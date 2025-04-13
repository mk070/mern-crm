import React, { useState, useEffect } from 'react';
import CalendarView from './scheduledpost/CalendarView';
import GridView from './scheduledpost/GridView';
import EditPostSlider from './scheduledpost/EditPostSlider';
import ConfirmDialog from './scheduledpost/ConfirmDialog';
import { FaCalendarAlt, FaThLarge, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ScheduledPost = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'grid'
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [isEditSliderOpen, setIsEditSliderOpen] = useState(false);
  const [currentEditPost, setCurrentEditPost] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, postId: null });
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch scheduled posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration
        const mockPosts = [
          {
            id: 1,
            title: "Unwind in paradise",
            content: "Relax and enjoy your vacation in the Maldives!",
            scheduledDate: "2023-08-29T08:34:00",
            image: "/beach-image.jpg",
            platforms: ["instagram", "linkedin"],
            status: "scheduled",
          },
          {
            id: 2,
            title: "Product Launch",
            content: "We're excited to announce our new product!",
            scheduledDate: "2023-08-30T10:00:00",
            image: "/product-image.jpg",
            platforms: ["x"],
            status: "failed",
            error: "Access token expired",
          },
        ];
        
        
        setScheduledPosts(mockPosts);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Handle edit post
  const handleEditPost = (post) => {
    setCurrentEditPost(post);
    setIsEditSliderOpen(true);
  };
  
  // Handle delete post
  const handleInitiateDelete = (postId) => {
    setDeleteConfirmation({ isOpen: true, postId });
  };
  
  // Confirm delete post
  const handleConfirmDelete = () => {
    const { postId } = deleteConfirmation;
    setScheduledPosts(scheduledPosts.filter(post => post.id !== postId));
    setDeleteConfirmation({ isOpen: false, postId: null });
  };
  
  // Handle add new post
  const handleAddNewPost = () => {
  
  };
  
  // Handle update post
  const handleUpdatePost = (updatedPost) => {
    // Check if it's a new post or existing one
    if (scheduledPosts.some(post => post.id === updatedPost.id)) {
      // Update existing post
      setScheduledPosts(scheduledPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      ));
    } else {
      // Add new post
      setScheduledPosts([...scheduledPosts, updatedPost]);
    }
    
    setIsEditSliderOpen(false);
  };
  
  // Handle reschedule post via drag and drop
  const handleReschedulePost = (postId, newDate) => {
    setScheduledPosts(scheduledPosts.map(post => 
      post.id === postId ? {...post, scheduledDate: newDate} : post
    ));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-h-[90vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Scheduled Posts</h1>
        
        <div className="flex items-center space-x-4">
          {/* Add new post button */}
          <button
            onClick={handleAddNewPost}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Link to={"/socialmedia/create"}className="flex items-center space-x-1">
              <FaPlus size={14} />
              <span>New Post</span>
            </Link>
          </button>
          
          {/* View toggle buttons */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-1 px-3 py-2 rounded ${
                viewMode === 'calendar' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaCalendarAlt />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1 px-3 py-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaThLarge />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        viewMode === 'calendar' ? (
          <CalendarView
            posts={scheduledPosts}
            onEditPost={handleEditPost}
            onDeletePost={handleInitiateDelete}
            onReschedulePost={handleReschedulePost}
          />
        ) : (
          <GridView
            posts={scheduledPosts}
            onEditPost={handleEditPost}
            onDeletePost={handleInitiateDelete}
          />
        )
      )}
      
      {/* Edit Slider */}
      <EditPostSlider
        isOpen={isEditSliderOpen}
        post={currentEditPost}
        onClose={() => setIsEditSliderOpen(false)}
        onUpdate={handleUpdatePost}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        title="Delete Scheduled Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmation({ isOpen: false, postId: null })}
      />
    </div>
  );
};

export default ScheduledPost;
