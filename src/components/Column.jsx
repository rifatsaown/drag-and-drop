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
        return 'bg-purple-50 border-purple-200';
      case 'Need Analysis':
        return 'bg-blue-50 border-blue-200';
      case 'Proposal':
        return 'bg-yellow-50 border-yellow-200';
      case 'Closed Won':
        return 'bg-green-50 border-green-200';
      case 'Closed Lost':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow p-3 h-full flex flex-col">
      {/* Column Header */}
      <div className={`p-3 mb-3 rounded-md ${getColumnHeaderStyle()} border`}>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold">{title}</h2>
          <span className="bg-white text-xs font-medium px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div ref={setNodeRef} className="flex-grow overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
