import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import React from 'react';

// Status colors
const statusColors = {
  COLD: 'bg-[#EFF8FF]0 text-[#175CD3] border-[#B2DDFF]',
  WARM: 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]',
  HOT: 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]',
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
      className="bg-white p-3 rounded-xl border border-gray-100 cursor-grab"
    >
      {/* Status Badge and Days Ago */}
      <div className="flex justify-between items-start mb-2">
        <span
          className={`px-2 py-0.5 text-xs rounded-lg font-sm border ${
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
      {task.client && (
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
      )}
      {/* Due Date */}
      {task.dueDate && (
        <div className="mb-2">
          <div className="flex space-x-1">
            <span className="text-xs text-gray-500">Due Date:</span>
            <span className="text-xs">{task.dueDate}</span>
          </div>
        </div>
      )}

      {/* Projected Value */}
      {task.projectedValue && (
        <div className="mb-2">
          <div className="flex gap-1">
            <span className="text-xs text-gray-500">Projected Value:</span>
            <span className="text-xs font-medium">
              {formatCurrency(task.projectedValue)}
            </span>
          </div>
        </div>
      )}

      {/* Industry & Design Tags */}
      {task.industry && (
        <div className="mb-3 flex flex-wrap gap-1">
          {!task.design && (
            <span className="text-xs text-gray-500">Industry:</span>
          )}
          <span className=" flex">
            {task.industry.map((industry, index) => (
              <span
                key={index}
                className={`text-xs ${
                  task.design
                    ? 'text-gray-700 px-2 py-0.5 mr-1 rounded bg-gray-100'
                    : ''
                } `}
              >
                {industry}
                {index < task.industry.length - 1}
                <span className="text-gray-500">
                  {task.design && <X className="inline-block w-3 h-3 ml-1" />}
                </span>
              </span>
            ))}
          </span>
        </div>
      )}

      {/* Probability with progress bar */}
      {task.probability !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between mb-1 items-center gap-1">
            <span className="text-xs text-gray-500">Probability:</span>
            <span className="text-xs font-medium">{task.probability}%</span>
            <div className="w-full bg-[#E4E7EC] rounded-full h-2">
              <div
                className="bg-[#9E77ED] h-2 rounded-full"
                style={{ width: `${task.probability}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Footer with Priority and Team */}
      <div className="flex justify-between items-center mt-2">
        {/* Priority */}
        <div className="flex items-center">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.93335 14.6667C3.66002 14.6667 3.43335 14.4401 3.43335 14.1667V1.8334C3.43335 1.56007 3.66002 1.3334 3.93335 1.3334C4.20668 1.3334 4.43335 1.56007 4.43335 1.8334V14.1667C4.43335 14.4401 4.20668 14.6667 3.93335 14.6667Z"
              fill="#55BBF5"
            />
            <path
              opacity="0.4"
              d="M12.5133 8.22007L11.7 7.40674C11.5067 7.24007 11.3933 6.99341 11.3867 6.72007C11.3733 6.42007 11.4933 6.12007 11.7133 5.90007L12.5133 5.10007C13.2067 4.40674 13.4667 3.74007 13.2467 3.21341C13.0333 2.69341 12.3733 2.40674 11.4 2.40674H3.93333C3.79333 2.4134 3.67999 2.52674 3.67999 2.66674V10.6667C3.67999 10.8067 3.79333 10.9201 3.93333 10.9201H11.4C12.36 10.9201 13.0067 10.6267 13.2267 10.1001C13.4467 9.56674 13.1933 8.90674 12.5133 8.22007Z"
              fill="#55BBF5"
            />
          </svg>
          <span className="text-xs text-gray-500 ">{task.priority}</span>
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
