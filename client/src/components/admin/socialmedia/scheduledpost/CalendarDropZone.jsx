import React from 'react';

const CalendarDropZone = ({ date, children, onDrop }) => {
  return (
    <div
      className="min-h-[120px] bg-gray-50 rounded p-2 border border-gray-200"
      onDrop={(e) => {
        const postId = e.dataTransfer.getData('postId');
        onDrop(postId, date);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
};

export default CalendarDropZone;
