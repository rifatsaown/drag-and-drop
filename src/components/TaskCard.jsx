import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

// Status colors
const statusColors = {
  COLD: 'bg-blue-100 text-blue-800',
  WARM: 'bg-orange-100 text-orange-800',
  HOT: 'bg-red-100 text-red-800',
};

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Handler for clicking the link to open task details
  // This prevents drag-and-drop from being triggered when just clicking the link
  const handleLinkClick = (e) => {
    e.stopPropagation();
    console.log(`Opening task details page for task ${task.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200 cursor-grab"
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-2">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status}
        </span>
        <span className="text-xs text-gray-500">{task.daysAgo} Days Ago</span>
      </div>

      {/* Title with Link */}
      <div className="mb-2 flex items-center">
        <h3
          className="font-medium text-sm text-gray-800 truncate flex-grow"
          title={task.title}
        >
          {task.title}
        </h3>
        <button
          type="button"
          onClick={handleLinkClick}
          className="ml-2 text-blue-500 hover:text-blue-700 text-xs font-medium cursor-grab"
          title="View task details"
          style={{ touchAction: 'none' }}
        >
          View
        </button>
      </div>

      {/* Client Info */}
      <div className="flex items-center mb-3">
        <div className="mr-2">
          <span className="text-xs text-gray-600">Client:</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex-shrink-0">
            {task.clientAvatar && (
              <img
                src={task.clientAvatar}
                alt={task.client}
                className="w-full h-full rounded-full"
              />
            )}
          </div>
          <span className="text-xs">{task.client}</span>
        </div>
      </div>

      {/* Projected Value */}
      {task.projectedValue && (
        <div className="mb-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Projected Value:</span>
            <span className="text-xs font-medium">
              {formatCurrency(task.projectedValue)}
            </span>
          </div>
        </div>
      )}

      {/* Industry */}
      {task.industry && (
        <div className="mb-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Industry:</span>
            <span className="text-xs">{task.industry}</span>
          </div>
        </div>
      )}

      {/* Probability with progress bar */}
      {task.probability !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600">Probability:</span>
            <span className="text-xs font-medium">{task.probability}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${task.probability}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer with Priority and Team */}
      <div className="flex justify-between items-center mt-2">
        {/* Priority */}
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
              task.priority === 'High'
                ? 'bg-blue-100 text-blue-800'
                : task.priority === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <span className="w-1.5 h-1.5 mr-1 rounded-full bg-current"></span>
            {task.priority}
          </span>
        </div>

        {/* Team Avatars */}
        <div className="flex -space-x-2">
          {task.team &&
            task.team.map((member, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"
                title={member.name || `Team member ${index + 1}`}
              >
                {member.avatar && (
                  <img
                    src={member.avatar}
                    alt={member.name || `Team member ${index + 1}`}
                    className="w-full h-full rounded-full"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
