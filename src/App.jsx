import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useEffect, useRef, useState } from 'react';
import Column from './components/Column';
import TaskCard from './components/TaskCard';

// Sample team members data
const team = [
  { id: 1, name: 'Team Member 1' },
  { id: 2, name: 'Team Member 2' },
  { id: 3, name: 'Team Member 3' },
];

// Mock API function to simulate saving data to a database
const updateTaskInDatabase = (taskData) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      console.log(`API Call: Database updated with new state`, taskData);
      console.log('Database updated successfully');
      resolve({ success: true });
    }, 500);
  });
};

// This structure has columns as keys, and arrays of task objects as values
const sampleData = {
  // Qualification stage - first step in the sales pipeline
  QUALIFICATION: [
    {
      id: 'task1',
      title: 'Tazkia Foundation Onboard...',
      status: 'COLD',
      daysAgo: 20,
      // client: 'Nasir Uddin',
      clientAvatar: null,
      dueDate: '2025-02',
      industry: ['webdesign', 'Design'],
      design: true,
      priority: 'High',
      team: team,
    },
  ],
  // Need Analysis stage - understanding client requirements
  'NEED ANALYSIS': [
    {
      id: 'task2',
      title: 'Tazkia Foundation Onboard...',
      status: 'COLD',
      daysAgo: 20,
      client: 'Nasir Uddin',
      clientAvatar: null,
      projectedValue: 50000,
      probability: 50,
      priority: 'High',
      team: team,
    },
    {
      id: 'task3',
      title: 'Tazkia Foundation Onboard...',
      status: 'WARM',
      daysAgo: 20,
      client: 'Nasir Uddin',
      clientAvatar: null,
      projectedValue: 50000,
      probability: 65,
      industry: ['Telehealth'],
      priority: 'High',
      team: team,
    },
  ],
  // Proposal stage
  PROPOSAL: [
    {
      id: 'task4',
      title: 'Tazkia Foundation Onboard...',
      status: 'WARM',
      daysAgo: 20,
      client: 'Nasir Uddin',
      clientAvatar: null,
      projectedValue: 50000,
      probability: 25,
      priority: 'High',
      team: team,
    },
    {
      id: 'task5',
      title: 'Tazkia Foundation Onboard...',
      status: 'HOT',
      daysAgo: 20,
      client: 'Nasir Uddin',
      clientAvatar: null,
      projectedValue: 50000,
      probability: 25,
      industry: ['Telehealth'],
      priority: 'High',
      team: team,
    },
    {
      id: 'task8',
      title: 'Tazkia Foundation Onboard...',
      status: 'HOT',
      daysAgo: 20,
      client: 'Nasir Uddin',
      clientAvatar: null,
      projectedValue: 50000,
      probability: 25,
      industry: ['Telehealth'],
      priority: 'High',
      team: team,
    },
  ],
  // Closed Won stage - successful deals
  'CLOSED WON': [
    {
      id: 'task6',
      title: 'Tazkia Foundation Onboard...',
      status: 'WARM',
      daysAgo: 20,
      client: 'Nasir Uddin',
      clientAvatar: null,
      projectedValue: 50000,
      probability: 25,
      priority: 'High',
      team: team,
    },
  ],
  // Closed Lost stage - unsuccessful deals
  'CLOSED LOST': [
    {
      id: 'task7',
      title: 'Tazkia Foundation Onboard...',
      status: 'COLD',
      daysAgo: 10,
      client: 'Nasir Uddin',
      clientAvatar: null,
      projectedValue: 50000,
      probability: 25,
      priority: 'High',
      team: team,
    },
  ],
};

export default function App() {
  const [columns, setColumns] = useState(sampleData); // State to track current column data
  const [activeId, setActiveId] = useState(null); // State to track which task is currently being dragged
  const [isUpdating, setIsUpdating] = useState(false);

  // Track if the columns were actually changed by a user action
  const columnsChanged = useRef(false);
  const lastChangedTask = useRef(null);

  // Effect to call API when columns state changes and it was triggered by a user action
  useEffect(() => {
    // Only proceed if columns were changed by a user action and we're not already updating
    if (columnsChanged.current && !isUpdating) {
      setIsUpdating(true);

      // Log the specific changes if we have the information
      if (lastChangedTask.current) {
        const { taskId, fromColumn, toColumn, position } =
          lastChangedTask.current;
        console.log(
          `Successfully moved task ${taskId} from ${fromColumn} to ${toColumn} at position ${position}`
        );
      } else {
        console.log('Columns state updated');
      }

      // Call the API
      updateTaskInDatabase(columns)
        .then(() => {
          setIsUpdating(false);
          // Reset the flag after successful update
          columnsChanged.current = false;
        })
        .catch((error) => {
          console.error('Error updating database:', error);
          setIsUpdating(false);
          // Reset the flag even on error
          columnsChanged.current = false;
        });
    }
  }, [columns, isUpdating]);

  // Helper function to find which column contains a specific task ID
  // Returns the column key (e.g., "QUALIFICATION", "PROPOSAL", etc.)
  const findContainer = (id) => {
    // If the ID is a column name, return it directly
    if (id in columns) return id;

    // Otherwise, search through all columns to find which one contains the task
    const container = Object.keys(columns).find((key) =>
      columns[key].find((item) => item.id === id)
    );

    return container;
  };

  // Helper function to find a task object by its ID
  const findTask = (id) => {
    const container = findContainer(id);
    if (!container) return null;

    return columns[container].find((item) => item.id === id);
  };

  // Event handler for when a drag operation starts
  const handleDragStart = (event) => {
    const { active } = event;
    // Store the ID of the task being dragged
    setActiveId(active.id);
  };

  // Event handler for when a dragged item is moved over a droppable area
  // This handles moving tasks between different columns
  const handleDragOver = (event) => {
    const { active, over } = event;

    // If not over a droppable area, do nothing
    if (!over) return;

    // Get the source and destination columns
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    // If either container is not found or they're the same, do nothing
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    // Update the columns state to move the task from one column to another
    setColumns((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the index of the dragged item in its original column
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );

      // Find the index of the item being hovered over in the destination column
      const overIndex = overItems.findIndex((item) => item.id === over.id);

      let newIndex;
      if (over.id in prev) {
        // If hovering over the column itself (not a specific task)
        // Add the task to the end of the column
        newIndex = overItems.length;
      } else {
        // If hovering over a specific task, insert at that position
        newIndex = overIndex >= 0 ? overIndex : overItems.length;
      }

      // Store the task movement information for logging
      lastChangedTask.current = {
        taskId: active.id,
        fromColumn: activeContainer,
        toColumn: overContainer,
        position: newIndex,
      };

      // Set the flag to indicate columns were changed by user action
      columnsChanged.current = true;

      // Create and return the new state with the task moved to the new column
      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          prev[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  // Event handler for when a drag operation ends
  // This handles reordering tasks within the same column
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // If not dropped on a valid target, reset active ID and do nothing
    if (!over) {
      setActiveId(null);
      return;
    }

    // Get the source and destination columns
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    // If either container is not found, reset active ID and do nothing
    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // If moving between different columns
    if (activeContainer !== overContainer) {
      // Find the indices
      const activeIndex = columns[activeContainer].findIndex(
        (item) => item.id === active.id
      );

      const overIndex =
        over.id in columns
          ? columns[overContainer].length // If dropping on a column
          : columns[overContainer].findIndex((item) => item.id === over.id); // If dropping on an item

      const newPosition =
        overIndex >= 0 ? overIndex : columns[overContainer].length;

      // Create the new state
      const newItems = { ...columns };
      // Remove from the source column
      newItems[activeContainer] = newItems[activeContainer].filter(
        (item) => item.id !== active.id
      );
      // Add to the destination column
      const itemToMove = columns[activeContainer][activeIndex];
      newItems[overContainer] = [
        ...newItems[overContainer].slice(0, newPosition),
        itemToMove,
        ...newItems[overContainer].slice(newPosition),
      ];

      // Store the task movement information for logging
      lastChangedTask.current = {
        taskId: active.id,
        fromColumn: activeContainer,
        toColumn: overContainer,
        position: newPosition,
      };

      // Set the flag to indicate columns were changed by user action
      columnsChanged.current = true;

      // Update the state
      setColumns(newItems);
    }
    // If reordering within the same column
    else {
      const activeIndex = columns[activeContainer].findIndex(
        (item) => item.id === active.id
      );

      const overIndex = columns[overContainer].findIndex(
        (item) => item.id === over.id
      );

      // If the position changed, update the order within the column
      if (activeIndex !== overIndex) {
        // Store the task movement information for logging
        lastChangedTask.current = {
          taskId: active.id,
          fromColumn: activeContainer,
          toColumn: overContainer,
          position: overIndex,
        };

        // Set the flag to indicate columns were changed by user action
        columnsChanged.current = true;

        // Create the new state
        const newItems = { ...columns };
        newItems[overContainer] = arrayMove(
          [...columns[overContainer]],
          activeIndex,
          overIndex
        );

        // Update the state
        setColumns(newItems);
      }
    }
    // Reset the active ID
    setActiveId(null);
  };

  return (
    <main className="min-h-screen p-4 max-w-7xl mx-auto">
      {isUpdating && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow z-50">
          Updating database...
        </div>
      )}

      {/* DndContext provides the drag-and-drop functionality */}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Grid layout for the columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {/* Map over each column and create a sortable context for its tasks */}
          {Object.keys(columns).map((key) => (
            <SortableContext
              key={key}
              items={columns[key].map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <Column title={key} tasks={columns[key]} />
            </SortableContext>
          ))}
        </div>

        {/* DragOverlay shows a preview of the task being dragged */}
        <DragOverlay>
          {activeId ? <TaskCard task={findTask(activeId)} /> : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}
