import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import TaskCard from './TaskCard';

export default function Column({ title, tasks = [] }) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  // Get background color based on column title
  const getColumnHeaderStyle = () => {
    switch (title) {
      case 'Qualification':
        return 'bg-[#F2F4F7]';
      case 'Need Analysis':
        return 'bg-[#F2F4F7]';
      case 'Proposal':
        return 'bg-[#F2F4F7]';
      case 'Closed Won':
        return 'bg-[#F2F4F7]';
      case 'Closed Lost':
        return 'bg-[#F2F4F7]';
      default:
        return 'bg-[#F2F4F7]';
    }
  };

  return (
    <div className={`${getColumnHeaderStyle()} rounded-2xl shadow-sm p-4 h-full flex flex-col`}>
      {/* Column Header */}
      <div className={`py-3 mb-4`}>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase text-gray-800">{title}</h2>
          <span className="bg-gray-100 text-xs font-medium px-2 py-0.5 rounded-full text-gray-800">
            {tasks.length || 0}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div ref={setNodeRef} className="flex-grow overflow-y-auto space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
