import React, { useState, useEffect } from 'react';
import {
format,
startOfWeek,
endOfWeek,
eachDayOfInterval,
isSameDay,
isValid,
} from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggablePostItem from './DraggablePostItem';

const CalendarView = ({ posts, onEditPost, onDeletePost, onReschedulePost }) => {
const [currentWeek, setCurrentWeek] = useState(new Date());
const [calendarDays, setCalendarDays] = useState([]);

useEffect(() => {
 const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
 const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
 let days = eachDayOfInterval({ start, end });

 // Validate each date
 days = days.map(day => isValid(day) ? day : new Date('Invalid Date'));

 setCalendarDays(days);
}, [currentWeek]);

const goToPreviousWeek = () => {
 const newDate = new Date(currentWeek.setDate(currentWeek.getDate() - 7));
 if (isValid(newDate)) {
   setCurrentWeek(newDate);
 }
};

const goToNextWeek = () => {
 const newDate = new Date(currentWeek.setDate(currentWeek.getDate() + 7));
 if (isValid(newDate)) {
   setCurrentWeek(newDate);
 }
};

const goToToday = () => setCurrentWeek(new Date());

const handlePostDrop = (postId, date) => {
 const post = posts.find((p) => p.id === parseInt(postId));
 if (!post) return;

 const originalDate = new Date(post.scheduledDate);
 const newDate = new Date(date);

 if (isValid(newDate)) {
   newDate.setHours(originalDate.getHours());
   newDate.setMinutes(originalDate.getMinutes());
   onReschedulePost(parseInt(postId), newDate);
 }
};

return (
 <DndProvider backend={HTML5Backend}>
   <div className="calendar-container">
     <div className="flex justify-between items-center mb-4">
       <div className="flex space-x-2">
         <button
           onClick={goToPreviousWeek}
           className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
         >
           &lt;
         </button>
         <button
           onClick={goToToday}
           className="px-3 py-1 bg-blue-50 rounded hover:bg-blue-100 text-blue-600"
         >
           Today
         </button>
         <button
           onClick={goToNextWeek}
           className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
         >
           &gt;
         </button>
       </div>
       <h2 className="text-lg font-semibold text-gray-700">
         {calendarDays.length > 0 && isValid(calendarDays[0]) ? (
           format(calendarDays[0], 'MMM d', { useAdditionalDayOfYearTokens: true })
         ) : (
           'Loading...'
         )}
         {' - '}
         {calendarDays.length > 0 && isValid(calendarDays[6]) ? (
           format(calendarDays[6], 'MMM d, yyyy', { useAdditionalDayOfYearTokens: true })
         ) : (
           'Loading...'
         )}
       </h2>
     </div>

     <div className="grid grid-cols-7 gap-4">
       {calendarDays.map((day, index) => (
         <div key={`header-${index}`} className="text-center">
           <div className="font-medium text-gray-500">
             {format(day, 'EEE', { useAdditionalDayOfYearTokens: true })}
           </div>
           <div
             className={`mt-1 inline-block w-8 h-8 rounded-full flex items-center justify-center ${
               isSameDay(day, new Date())
                 ? 'bg-blue-600 text-white font-bold'
                 : 'font-bold text-gray-800'
             }`}
           >
             {format(day, 'd', { useAdditionalDayOfYearTokens: true })}
           </div>
         </div>
       ))}

       {calendarDays.map((day, dayIndex) => {
         const dayPosts = posts.filter((post) => {
           const postDate = new Date(post.scheduledDate);
           return isValid(postDate) && isSameDay(postDate, day);
         });

         return (
           <div
             key={`cell-${dayIndex}`}
             className="min-h-[120px] bg-gray-50 rounded p-2 border border-gray-200"
             onDrop={(e) => {
               const postId = e.dataTransfer.getData('postId');
               handlePostDrop(postId, day);
             }}
             onDragOver={(e) => e.preventDefault()}
           >
             {dayPosts.map((post) => {
               const postDate = new Date(post.scheduledDate);
               const formattedTime = isValid(postDate)
                 ? format(postDate, 'hh:mm a', {
                     useAdditionalDayOfYearTokens: true,
                   })
                 : 'Invalid Date';

               return (
                 <DraggablePostItem
                   key={post.id}
                   post={{ ...post, formattedTime }}
                   onEdit={() => onEditPost(post)}
                   onDelete={() => onDeletePost(post.id)}
                 />
               );
             })}
           </div>
         );
       })}
     </div>
   </div>
 </DndProvider>
);
};

export default CalendarView;