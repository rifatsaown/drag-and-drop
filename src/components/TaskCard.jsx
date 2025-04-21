import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

// Status colors
const statusColors = {
  COLD: 'bg-blue-100 text-blue-700',
  WARM: 'bg-orange-100 text-orange-700',
  HOT: 'bg-red-100 text-red-700',
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

  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-grab"
    >
      {/* Status Badge and Days Ago */}
      <div className="flex justify-between items-start mb-2">
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status}
        </span>
        <span className="text-xs text-gray-500">{task.daysAgo} Days Ago</span>
      </div>

      {/* Title */}
      <h3
        className="font-medium text-sm mb-2 text-gray-800 truncate"
        title={task.title}
      >
        {task.title}
      </h3>

      {/* Client Info */}
      <div className="flex items-center mb-2">
        <div className="mr-1">
          <span className="text-xs text-gray-500">Client:</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-gray-300 mr-1 flex-shrink-0 overflow-hidden">
            {task.clientAvatar && (
              <img
                src={task.clientAvatar}
                alt={task.client}
                className="w-full h-full rounded-full"
              />
            )}
            {!task.clientAvatar && (
              <span className="w-full h-full flex items-center justify-center text-xs text-white">
                {task.client.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-xs">{task.client}</span>
        </div>
      </div>

      {/* Industry & Design Tags */}
      {task.industry && (
        <div className="mb-3 flex flex-wrap gap-1">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
            {task.industry}
          </span>
          {task.design && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
              {task.design}
            </span>
          )}
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className="mb-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Due Date:</span>
            <span className="text-xs">{task.dueDate}</span>
          </div>
        </div>
      )}

      {/* Projected Value */}
      {task.projectedValue && (
        <div className="mb-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Projected Value:</span>
            <span className="text-xs font-medium">
              {formatCurrency(task.projectedValue)}
            </span>
          </div>
        </div>
      )}

      {/* Probability with progress bar */}
      {task.probability !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Probability:</span>
            <span className="text-xs font-medium">{task.probability}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full"
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
            className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${
              task.priority === 'High'
                ? 'bg-blue-100 text-blue-700'
                : task.priority === 'Medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className="w-1.5 h-1.5 mr-1 rounded-full bg-current"></span>
            {task.priority}
          </span>
        </div>

        {/* Team Avatars */}
        <div className="flex -space-x-2">
          {task.team &&
            task.team.slice(0, 3).map((member, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white overflow-hidden"
                title={member.name || `Team member ${index + 1}`}
              >
                {member.avatar && (
                  <img
                    src={member.avatar}
                    alt={member.name || `Team member ${index + 1}`}
                    className="w-full h-full rounded-full"
                  />
                )}
                {!member.avatar && (
                  <span className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">
                    {(member.name || `T${index + 1}`).charAt(0)}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
