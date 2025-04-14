import React from 'react';
import { FaEdit, FaTrash, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';

const DraggablePostItem = ({ post, onEdit, onDelete }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('postId', post.id.toString());
  };
  
  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      className="p-2 mb-2 rounded-md bg-white shadow-sm border-l-4 border-blue-500 
                cursor-move transition-all hover:shadow-md"
    >
      <div className="flex justify-between items-start">
        <div className="font-medium text-sm text-gray-800 truncate w-3/4">{post.title}</div>
        <div className="flex space-x-1">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
      <div className="flex items-center mt-1 text-xs text-gray-500">
        <FaClock className="mr-1" size={10} />
        {format(new Date(post.scheduledDate), 'hh:mm a')}
      </div>
    </div>
  );
};

export default DraggablePostItem;
